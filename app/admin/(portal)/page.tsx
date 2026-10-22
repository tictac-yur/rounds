"use client";

import { useMutation, useQuery } from "convex/react";
import { ConvexError } from "convex/values";
import Link from "next/link";
import { useState } from "react";
import { api } from "@/convex/_generated/api";

const SECTIONS = [
  { href: "/admin/episodes", title: "Episodes", body: "Titles, guests, release dates, links and which episode is featured." },
  { href: "/admin/series", title: "Series", body: "The shows on the channel: The Consult, the vlog, A Day With a Doctor." },
  { href: "/admin/guests", title: "Guests", body: "Specialists who appear on the show." },
  { href: "/admin/myths", title: "Myth-busters", body: "The rapid-fire myths shown on the home page." },
  { href: "/admin/hosts", title: "Hosts", body: "Host bios and photos." },
  { href: "/admin/audience", title: "Audience", body: "Audience segments and stats for sponsors." },
  { href: "/admin/packages", title: "Sponsor packages", body: "What partners can buy." },
  { href: "/admin/settings", title: "Site settings", body: "Hero copy, stats, social links and contact details." },
  { href: "/admin/subscribers", title: "Subscribers", body: "Newsletter sign-ups." },
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
