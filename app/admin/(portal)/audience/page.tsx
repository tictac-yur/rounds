"use client";

import { api } from "@/convex/_generated/api";
import { ResourceManager } from "@/components/admin/ResourceManager";

export default function AudiencePage() {
  return (
    <ResourceManager
      title="Audience"
      description="Segments shown in “Who's watching”. The intro text and platform handles live in Site settings."
      singular="segment"
      functions={api.admin.audienceSegments}
      defaults={{}}
      fields={[
        { name: "stat", label: "Stat", type: "text", help: "e.g. 42%" },
        { name: "title", label: "Title", type: "text" },
        { name: "description", label: "Description", type: "textarea" },
      ]}
      summary={(row) => (
        <>
          <strong>
            {String(row.stat)} · {String(row.title)}
          </strong>
          <span className="admin-muted">{String(row.description)}</span>
        </>
      )}
    />
  );
}
