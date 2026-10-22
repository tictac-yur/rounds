"use client";

import { api } from "@/convex/_generated/api";
import { ResourceManager } from "@/components/admin/ResourceManager";

export default function GuestsPage() {
  return (
    <ResourceManager
      title="Guests"
      description="Specialists shown under “This season's guests” and linked from episodes."
      singular="guest"
      functions={api.admin.guests}
      imageField="photoId"
      defaults={{ nameLang: "en" }}
      fields={[
        { name: "name", label: "Name", type: "text" },
        {
          name: "nameLang",
          label: "Name language",
          type: "select",
          options: [
            { value: "en", label: "English" },
            { value: "th", label: "Thai" },
          ],
          help: "Thai names use the Thai font.",
        },
        { name: "field", label: "Field", type: "text", help: "e.g. Pediatric ENT" },
        { name: "affiliation", label: "Affiliation", type: "text", optional: true },
        { name: "photoId", label: "Photo", type: "image", optional: true },
      ]}
      summary={(row) => (
        <>
          <strong lang={row.nameLang === "th" ? "th" : undefined}>{String(row.name)}</strong>
          <span className="admin-muted">{String(row.field)}</span>
        </>
      )}
    />
  );
}
