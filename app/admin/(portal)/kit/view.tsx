"use client";

import { useMutation, useQuery } from "convex/react";
import { ConvexError } from "convex/values";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import type { EpisodeKit, KitResult } from "@/convex/lib/episodeKit";
import { AdminPageHeader } from "@/components/admin/AdminShell";

// Reads what Claude sends: the JSON alone, or inside a ```json block.
function parseKit(text: string): { kit: EpisodeKit } | { error: string } | null {
  const raw = text.trim().replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/, "").trim();
  if (!raw) return null;
  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch {
    return { error: "This isn't a complete kit. Copy the whole block Claude sent, from { to }." };
  }
  const d = data as Partial<EpisodeKit>;
  const g = d?.guest;
  if (!g || typeof g.name !== "string" || !g.name.trim()) return { error: "The kit has no guest name." };
  if (typeof g.field !== "string") return { error: "The kit's guest has no field (specialty)." };
  const flags = Array.isArray(d.flags) ? d.flags : [];
  for (const [i, f] of flags.entries()) {
    if (typeof f?.claim !== "string" || typeof f?.answer !== "string" || (f.verdict !== "red" && f.verdict !== "green")) {
      return { error: `Flag ${i + 1} needs a claim, an answer and a verdict of "red" or "green".` };
    }
  }
  const text_ = (s: unknown) => (typeof s === "string" && s.trim() ? s.trim() : undefined);
  return {
    kit: {
      guest: {
        name: g.name.trim(),
        nameAlt: text_(g.nameAlt),
        nameLang: g.nameLang === "en" ? "en" : "th",
        slug: text_(g.slug),
        field: g.field.trim(),
        affiliation: text_(g.affiliation),
        bio: text_(g.bio),
      },
      specialty: text_(d.specialty),
      flags: flags.map((f) => ({ claim: f.claim.trim(), answer: f.answer.trim(), verdict: f.verdict })),
    },
  };
}

function describe(result: KitResult) {
  const guest = { created: "added the guest", updated: "filled in the guest's missing details", unchanged: "kept the guest as is" }[
    result.guest
  ];
  const flags =
    result.flagsAdded > 0
      ? `added ${result.flagsAdded} Red / Green flag${result.flagsAdded === 1 ? "" : "s"}`
      : "added no flags";
  const skipped = result.flagsSkipped > 0 ? ` (${result.flagsSkipped} already there)` : "";
  return `Done: ${guest}, ${result.linked ? "linked them to the episode" : "the episode keeps its guest"}, ${flags}${skipped}. It's on the site within a minute.`;
}

export default function KitPage() {
  const params = useSearchParams();
  const episodes = useQuery(api.admin.episodeKit.checklist);
  const apply = useMutation(api.admin.episodeKit.apply);
  const [chosen, setChosen] = useState<string>(params.get("episode") ?? "");
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const parsed = parseKit(text);
  // Default: the newest episode that has a guest-shaped gap.
  const episodeId = chosen || episodes?.find((e) => !e.guest || e.flags === 0)?.id || episodes?.[0]?.id || "";

  return (
    <section className="admin-page">
      <AdminPageHeader
        label="Content"
        title="Episode kit"
        description="Adds an episode's guest doctor, bio, specialty and Red / Green flags in one go. Send Claude the episode's transcript (.srt) and paste the kit it gives you here."
      />

      <div className="admin-card admin-kit">
        <div className="admin-field">
          <label htmlFor="kit-episode">Episode</label>
          <select
            id="kit-episode"
            value={episodeId}
            onChange={(e) => {
              setChosen(e.target.value);
              setResult(null);
            }}
          >
            {(episodes ?? []).map((e) => (
              <option key={e.id} value={e.id}>
                {e.title}
                {e.guest ? ` · ${e.guest}` : ""}
                {` · ${e.flags} flag${e.flags === 1 ? "" : "s"}`}
              </option>
            ))}
          </select>
          <small>New uploads appear here after the YouTube sync (within the hour, or press Check YouTube now on the dashboard).</small>
        </div>

        <div className="admin-field admin-field-textarea">
          <label htmlFor="kit-text">Kit from Claude</label>
          <textarea
            id="kit-text"
            rows={10}
            spellCheck={false}
            placeholder='{ "guest": { "name": "…", … }, "specialty": "…", "flags": [ … ] }'
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              setResult(null);
              setError(null);
            }}
          />
        </div>

        {parsed && "error" in parsed && <p className="admin-error">{parsed.error}</p>}

        {parsed && "kit" in parsed && (
          <div className="admin-kit-preview">
            <h2>Check before adding</h2>
            <dl>
              <dt>Guest</dt>
              <dd>
                <strong>{parsed.kit.guest.name}</strong>
                {parsed.kit.guest.nameAlt && <span className="admin-muted"> · {parsed.kit.guest.nameAlt}</span>}
                <br />
                <span className="admin-muted">{[parsed.kit.guest.field, parsed.kit.guest.affiliation].filter(Boolean).join(" · ")}</span>
              </dd>
              {parsed.kit.guest.bio && (
                <>
                  <dt>Bio</dt>
                  <dd>{parsed.kit.guest.bio}</dd>
                </>
              )}
              {parsed.kit.specialty && (
                <>
                  <dt>Specialty</dt>
                  <dd>{parsed.kit.specialty}</dd>
                </>
              )}
              <dt>Flags</dt>
              <dd>
                <ol className="admin-kit-flags">
                  {parsed.kit.flags.map((f, i) => (
                    <li key={i}>
                      <span className="admin-badge" data-verdict={f.verdict}>
                        {f.verdict === "red" ? "Red flag" : "Green flag"}
                      </span>{" "}
                      <strong>{f.claim}</strong>
                      <br />
                      <span className="admin-muted">{f.answer}</span>
                    </li>
                  ))}
                </ol>
              </dd>
            </dl>
            <p className="admin-muted">
              Only fills what&apos;s empty: if the guest is already on the site, their existing details stay, and flags already
              there aren&apos;t added twice. You can edit anything afterwards in Guests and Red / Green flags.
            </p>
          </div>
        )}

        {error && <p className="admin-error">{error}</p>}
        {result && (
          <p className="admin-status-line" role="status">
            <span className="admin-status-dot" aria-hidden="true" />
            {result}
          </p>
        )}

        <div className="admin-actions-row">
          <button
            className="admin-button"
            disabled={busy || !episodeId || !parsed || !("kit" in parsed)}
            onClick={async () => {
              if (!parsed || !("kit" in parsed)) return;
              setBusy(true);
              setError(null);
              try {
                const r = await apply({ episodeId: episodeId as Id<"episodes">, kit: parsed.kit });
                setResult(describe(r));
                setText("");
              } catch (err) {
                setError(err instanceof ConvexError ? String(err.data) : "Couldn't add the kit. Try again.");
              } finally {
                setBusy(false);
              }
            }}
          >
            {busy ? "Adding…" : "Add to episode"}
          </button>
        </div>
      </div>
    </section>
  );
}
