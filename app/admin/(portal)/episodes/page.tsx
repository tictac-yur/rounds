"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { ResourceManager } from "@/components/admin/ResourceManager";

const STATUS_LABELS: Record<string, string> = {
  draft: "Draft (hidden)",
  coming_soon: "Coming soon",
  published: "Published",
};

export default function EpisodesPage() {
  const series = useQuery(api.admin.series.list) ?? [];
  const guests = useQuery(api.admin.guests.list) ?? [];
  const seriesNames = new Map(series.map((s) => [s._id as string, s.name]));
  const guestNames = new Map(guests.map((g) => [g._id as string, g.name]));

  return (
    <ResourceManager
      title="Episodes"
      description="Published and coming-soon episodes appear on the home page. The featured episode is shown as the latest episode."
      singular="episode"
      functions={api.admin.episodes}
      imageField="thumbnailId"
      defaults={{ status: "draft", featured: false, thumbVariant: 0 }}
      fields={[
        { name: "title", label: "Title", type: "text" },
        { name: "slug", label: "URL slug", type: "text", help: "Lowercase words joined by dashes, e.g. emergency-medicine." },
        {
          name: "status",
          label: "Status",
          type: "select",
          options: Object.entries(STATUS_LABELS).map(([value, label]) => ({ value, label })),
        },
        { name: "featured", label: "Feature as latest episode", type: "checkbox" },
        {
          name: "seriesId",
          label: "Series",
          type: "select",
          optional: true,
          options: series.map((s) => ({ value: s._id, label: s.name })),
        },
        {
          name: "guestId",
          label: "Guest",
          type: "select",
          optional: true,
          options: guests.map((g) => ({ value: g._id, label: g.name })),
        },
        { name: "specialty", label: "Specialty", type: "text", help: "Used for the filter buttons, e.g. ENT." },
        { name: "summary", label: "Summary", type: "textarea", optional: true },
        { name: "releaseDate", label: "Release date", type: "text", optional: true },
        { name: "runtime", label: "Runtime", type: "text", optional: true, help: "e.g. 42 min" },
        { name: "metaNote", label: "Note", type: "text", optional: true, help: "Shown when there's no date or runtime, e.g. Two-part episode." },
        { name: "youtubeUrl", label: "YouTube link", type: "url", optional: true },
        { name: "spotifyUrl", label: "Spotify link", type: "url", optional: true },
        { name: "appleUrl", label: "Apple Podcasts link", type: "url", optional: true },
        {
          name: "thumbnailId",
          label: "Polaroid photo",
          type: "image",
          optional: true,
          help: "Photo of Titi, Pup and the doctor. Shown in a polaroid frame; square photos fit best.",
        },
        {
          name: "photoCaption",
          label: "Polaroid caption",
          type: "text",
          optional: true,
          help: "Handwritten line under the photo. Defaults to “ติติ · ปั๊บ · {guest name}”.",
        },
        {
          name: "thumbLabel",
          label: "Placeholder label",
          type: "textarea",
          help: "Large text on the artwork shown in the polaroid until a photo is uploaded. Use a new line to break it.",
        },
        { name: "thumbVariant", label: "Placeholder circle layout (0–3)", type: "number" },
      ]}
      summary={(row) => (
        <>
          <strong>{String(row.title)}</strong>
          <span className="admin-muted">
            {STATUS_LABELS[String(row.status)]}
            {row.featured ? " · Featured" : ""}
            {row.seriesId ? ` · ${seriesNames.get(String(row.seriesId)) ?? ""}` : ""}
            {row.guestId ? ` · ${guestNames.get(String(row.guestId)) ?? ""}` : ""}
          </span>
        </>
      )}
    />
  );
}
