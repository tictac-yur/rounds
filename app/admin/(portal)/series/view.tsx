"use client";

import { api } from "@/convex/_generated/api";
import { ResourceManager } from "@/components/admin/ResourceManager";

export default function SeriesPage() {
  return (
    <ResourceManager
      title="Series"
      description="Labels episodes by show (e.g. The Consult). The series section is off the home page for now; the descriptions here are kept for when it comes back."
      singular="series"
      functions={api.admin.series}
      defaults={{}}
      fields={[
        { name: "name", label: "Name", type: "text" },
        { name: "kicker", label: "Kicker", type: "text", help: "Small label above the name, e.g. Interview · 30–50 min." },
        { name: "description", label: "Description", type: "textarea" },
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
