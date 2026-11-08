"use client";

import { useMutation, useQuery } from "convex/react";
import { ConvexError } from "convex/values";
import Link from "next/link";
import { useState } from "react";
import { api } from "@/convex/_generated/api";

const SECTIONS = [
  { href: "/admin/episodes", title: "Episodes", body: "Titles, guests, photos, release dates, links and which episode is featured. New YouTube uploads arrive here as drafts." },
  { href: "/admin/series", title: "Series", body: "The shows on the channel: The Consult, the vlog, A Day With a Doctor." },
  { href: "/admin/guests", title: "Guests", body: "Specialists who appear on the show." },
  { href: "/admin/myths", title: "Red / Green flags", body: "Beliefs the guest doctor rates as a red flag or a green flag." },
  { href: "/admin/hosts", title: "Hosts", body: "Host bios and photos." },
  { href: "/admin/audience", title: "Audience", body: "Audience segments and stats for sponsors." },
  { href: "/admin/packages", title: "Sponsor packages", body: "What partners can buy." },
  { href: "/admin/settings", title: "Site settings", body: "Hero copy, stats, social links and contact details." },
];

function StarterContent() {
  const status = useQuery(api.admin.seed.status);
  const load = useMutation(api.admin.seed.loadStarterContent);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!status?.isEmpty) return null;
  return (
    <div className="admin-card admin-callout">
      <h2>Your site has no content yet</h2>
      <p className="admin-muted">
        Until you add content, the public site shows the starter copy. Load it into the database to
        start editing it here.
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
    </div>
  );
}

function timeAgo(ms: number) {
  const minutes = Math.round((Date.now() - ms) / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.round(minutes / 60);
  return hours < 48 ? `${hours} h ago` : `${Math.round(hours / 24)} days ago`;
}

// New YouTube uploads become draft episodes every hour; this shows the last check.
function YouTubeSync() {
  const status = useQuery(api.admin.youtube.status);
  const syncNow = useMutation(api.admin.youtube.syncNow);
  const [requested, setRequested] = useState(false);

  let line = "Not checked yet. The first check runs within the hour, or press the button.";
  if (status?.lastError) {
    line = `Last check failed: ${status.lastError}`;
  } else if (status?.lastCheckedAt) {
    line = `Checked ${timeAgo(status.lastCheckedAt)}. ${
      status.lastAddedCount === 0
        ? "No new videos."
        : `${status.lastAddedCount} new video${status.lastAddedCount === 1 ? "" : "s"} added as drafts.`
    }`;
  }

  return (
    <div className="admin-card admin-callout">
      <h2>YouTube</h2>
      <p className="admin-muted">
        Every hour the site checks the channel in Site settings → YouTube link. Each new full-length
        video (not Shorts) is added to Episodes as a <strong>draft</strong> with its title, summary,
        date and thumbnail. Add the guest and specialty, then set it to Published.
      </p>
      <p className={status?.lastError ? "admin-error" : "admin-muted"}>{line}</p>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        <button
          className="admin-button"
          disabled={requested}
          onClick={async () => {
            setRequested(true);
            await syncNow();
            setTimeout(() => setRequested(false), 5000);
          }}
        >
          {requested ? "Checking…" : "Check YouTube now"}
        </button>
        <Link href="/admin/episodes" className="admin-button admin-button-secondary">
          Review drafts
        </Link>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <section className="admin-page">
      <header className="admin-page-header">
        <div>
          <h1>Dashboard</h1>
          <p className="admin-muted">
            Changes go live on the public site within about a minute.
          </p>
        </div>
      </header>
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
    </section>
  );
}
