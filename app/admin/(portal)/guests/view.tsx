"use client";

import { api } from "@/convex/_generated/api";
import { ResourceManager } from "@/components/admin/ResourceManager";

export default function GuestsPage() {
  return (
    <ResourceManager
      title="Guests"
      description="Guest doctors. Each one gets a profile page on the site, linked from their episodes and Red/Green flags."
      singular="guest"
      functions={api.admin.guests}
      imageField="photoId"
      defaults={{ nameLang: "en" }}
      fields={[
        { name: "name", label: "Name", type: "text", help: "With their title, e.g. ผศ.นพ.กานต์ วิฑูรชาติ. Get the doctor's OK (even a LINE message) before publishing their name, bio and photo." },
        { name: "nameAlt", label: "Name in the other language", type: "text", optional: true, help: "e.g. Asst. Prof. Dr. Kan Withoonchart" },
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
        {
          name: "bio",
          label: "Short bio",
          type: "textarea",
          optional: true,
          help: "2–3 sentences for their profile page. Only facts they've confirmed.",
        },
        {
          name: "profileUrl",
          label: "External profile link",
          type: "url",
          optional: true,
          help: "Their hospital or university profile. Shown as a button on their page.",
        },
        {
          name: "slug",
          label: "Profile address",
          type: "text",
          optional: true,
          help: "English, lowercase, with dashes: kan-withoonchart → /doctors/kan-withoonchart. Leave blank for an automatic one.",
        },
        { name: "photoId", label: "Photo", type: "image", optional: true, help: "Without one, their profile uses their episode's thumbnail." },
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
