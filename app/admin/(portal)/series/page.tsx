"use client";

import { api } from "@/convex/_generated/api";
import { ResourceManager } from "@/components/admin/ResourceManager";

export default function SeriesPage() {
  return (
    <ResourceManager
      title="Series"
      description="The shows listed in “One channel, three series”."
      singular="series"
      functions={api.admin.series}
      defaults={{ accentColor: "#1b3a5f" }}
      fields={[
        { name: "name", label: "Name", type: "text" },
        { name: "kicker", label: "Kicker", type: "text", help: "Small label above the name, e.g. Interview · 30–50 min." },
        { name: "description", label: "Description", type: "textarea" },
        { name: "accentColor", label: "Accent color", type: "color" },
      ]}
      summary={(row) => (
        <>
          <strong>{String(row.name)}</strong>
          <span className="admin-muted">{String(row.kicker)}</span>
        </>
      )}
    />
  );
}
