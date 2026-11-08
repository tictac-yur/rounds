"use client";

import { useMutation, useQuery } from "convex/react";
import { ConvexError } from "convex/values";
import Link from "next/link";
import { useState } from "react";
import { api } from "@/convex/_generated/api";
import { Discs } from "@/components/admin/AdminShell";
import { PlatformIcon } from "@/components/landing/Icons";

const SECTIONS = [
  { href: "/admin/episodes", title: "Episodes", body: "Titles, guests, photos, links, and which episode is the latest." },
  { href: "/admin/myths", title: "Red / Green flags", body: "The beliefs in the home-page quiz and the doctor's verdict." },
  { href: "/admin/series", title: "Series", body: "The Consult, the vlog, A Day With a Doctor." },
  { href: "/admin/guests", title: "Guests", body: "Specialists who appear on the show." },
  { href: "/admin/hosts", title: "Hosts", body: "Titi and Pup: bios and photos." },
  { href: "/admin/audience", title: "Audience", body: "Who watches, for the sponsor section." },
  { href: "/admin/packages", title: "Sponsor packages", body: "What partners can buy." },
  { href: "/admin/settings", title: "Site settings", body: "Hero copy, stats, links and contact details." },
];

function timeAgo(ms: number) {
  const minutes = Math.round((Date.now() - ms) / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.round(minutes / 60);
  return hours < 48 ? `${hours} h ago` : `${Math.round(hours / 24)} days ago`;
}

function Overview() {
  const summary = useQuery(api.admin.dashboard.summary);
  return (
    <section className="admin-hero">
      <Discs className="admin-hero-discs" />
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <span className="admin-eyebrow">
          <span className="admin-eyebrow-dots" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
          Rounds admin
        </span>
        <h1>Dashboard</h1>
        <p>
          Everything on the public site comes from here. Changes go live within about a minute.
          {summary?.latestTitle && (
            <>
              {" "}
              Latest episode on the home page: <strong>{summary.latestTitle}</strong>
            </>
          )}
        </p>
      </div>
      <div className="admin-stats">
        <div className="admin-stat">
          <b>{summary?.published ?? "–"}</b>
          <span>Published episodes</span>
        </div>
        <div className="admin-stat">
          <b>{summary?.drafts ?? "–"}</b>
          <span>Drafts (hidden)</span>
        </div>
        <div className="admin-stat">
          <b>{summary?.comingSoon ?? "–"}</b>
          <span>Coming soon</span>
        </div>
        <div className="admin-stat">
          <b>{summary?.flags ?? "–"}</b>
          <span>Red / Green flags</span>
        </div>
      </div>
      <div className="admin-actions-row">
        <a href="/" target="_blank" rel="noreferrer" className="admin-button admin-button-light">
          View site ↗
        </a>
        <Link href="/admin/episodes" className="admin-button admin-button-secondary">
          Manage episodes
        </Link>
      </div>
    </section>
  );
}

// New YouTube uploads are published every hour; this shows the last check.
function YouTubeSync() {
  const status = useQuery(api.admin.youtube.status);
  const syncNow = useMutation(api.admin.youtube.syncNow);
  const [requested, setRequested] = useState(false);

  let line = "Not checked yet. It checks every hour, or press the button.";
  if (status?.lastError) {
    line = `Last check failed: ${status.lastError}`;
  } else if (status?.lastCheckedAt) {
    line = `Checked ${timeAgo(status.lastCheckedAt)} · ${
      status.lastAddedCount === 0
        ? "no new videos"
        : `${status.lastAddedCount} new video${status.lastAddedCount === 1 ? "" : "s"} added`
    }`;
  }

  return (
    <section className="admin-card admin-yt">
      <span className="admin-yt-logo" aria-hidden="true">
        <PlatformIcon name="youtube" size={26} />
      </span>
      <div>
        <h2>YouTube sync</h2>
        <p className="admin-muted">
          Every hour the site checks the channel set in Site settings. Each new full-length video
          (not Shorts) is <strong>published automatically</strong> with its title, summary, date and
          thumbnail, and becomes the latest episode on the home page. Add the guest and specialty in
          Episodes whenever you like.
        </p>
        <span className="admin-status-line" data-error={Boolean(status?.lastError)} role="status">
          <span className="admin-status-dot" aria-hidden="true" />
          {line}
        </span>
        <div className="admin-actions-row">
          <button
            className="admin-button"
            disabled={requested}
            onClick={async () => {
              setRequested(true);
              await syncNow();
              setTimeout(() => setRequested(false), 6000);
            }}
          >
            {requested ? "Checking…" : "Check YouTube now"}
          </button>
          <Link href="/admin/episodes" className="admin-button admin-button-secondary">
            See episodes
          </Link>
        </div>
      </div>
    </section>
  );
}

function StarterContent() {
  const status = useQuery(api.admin.seed.status);
  const load = useMutation(api.admin.seed.loadStarterContent);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!status?.isEmpty) return null;
  return (
    <section className="admin-card admin-callout">
      <h2>Your site has no content yet</h2>
      <p className="admin-muted">
        Load the starter content (EP.0, EP.1, hosts, series, flags) to start editing it here. The
        YouTube sync also does this on its next run.
      </p>
      {error && <p className="admin-error">{error}</p>}
      <button
        className="admin-button"
        disabled={loading}
        onClick={async () => {
          setLoading(true);
          setError(null);
          try {
            await load();
          } catch (err) {
            setError(err instanceof ConvexError ? String(err.data) : "Couldn't load starter content.");
          } finally {
            setLoading(false);
          }
        }}
      >
        {loading ? "Loading…" : "Load starter content"}
      </button>
    </section>
  );
}

export function Dashboard() {
  return (
    <div className="admin-page">
      <Overview />
      <StarterContent />
      <YouTubeSync />
      <div className="admin-grid">
        {SECTIONS.map((section) => (
          <Link key={section.href} href={section.href} className="admin-card admin-tile">
            <h2>{section.title}</h2>
            <p className="admin-muted">{section.body}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
