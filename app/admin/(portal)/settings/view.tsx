"use client";

import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Field, toFormValues } from "@/components/admin/fields";
import { RecordForm } from "@/components/admin/RecordForm";
import { AdminPageHeader } from "@/components/admin/AdminShell";

const FIELDS: Field[] = [
  { name: "heroKicker", label: "Hero kicker", type: "text" },
  { name: "heroHeadline", label: "Hero headline (English)", type: "textarea", help: "Use a new line to break the headline." },
  { name: "heroHeadlineTh", label: "Hero headline (Thai line under it)", type: "text", optional: true },
  { name: "heroIntroTh", label: "Hero intro (Thai, main)", type: "textarea" },
  { name: "stats", label: "Hero stats", type: "pairs", placeholder: "120K | Followers, all platforms", help: "One per line: value | label" },
  { name: "audienceIntro", label: "Audience intro", type: "textarea" },
  { name: "contactEmail", label: "Contact email", type: "text" },
  { name: "mediaKitUrl", label: "Media kit link", type: "url" },
  { name: "youtubeUrl", label: "YouTube channel", type: "url" },
  { name: "spotifyUrl", label: "Spotify show", type: "url" },
  { name: "appleUrl", label: "Apple Podcasts show", type: "url" },
  { name: "instagramUrl", label: "Instagram", type: "url" },
  { name: "tiktokUrl", label: "TikTok", type: "url" },
  { name: "linktreeUrl", label: "All-links page", type: "url" },
];

export default function SettingsPage() {
  const settings = useQuery(api.admin.settings.get);
  const save = useMutation(api.admin.settings.save);

  return (
    <section className="admin-page">
      <AdminPageHeader
        label="Site"
        title="Site settings"
        description="Hero copy, stats, links and contact details used across the site. The YouTube channel link is also where new episodes are synced from."
      />
      {settings === undefined ? (
        <p className="admin-muted">Loading…</p>
      ) : (
        <div className="admin-card">
          <RecordForm
            key={settings._id ?? "new"}
            fields={FIELDS}
            initialValues={toFormValues(FIELDS, settings)}
            initialPreviews={{ heroImageId: settings.imageUrl }}
            submitLabel="Save settings"
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            onSubmit={(args) => save(args as any)}
          />
        </div>
      )}
    </section>
  );
}
