"use client";

import { api } from "@/convex/_generated/api";
import { ResourceManager } from "@/components/admin/ResourceManager";

export default function PackagesPage() {
  return (
    <ResourceManager
      title="Sponsor packages"
      description="Listed in the “Partner with Rounds” section."
      singular="package"
      functions={api.admin.sponsorPackages}
      defaults={{}}
      fields={[
        { name: "letter", label: "Label", type: "text", help: "Short marker, e.g. A" },
        { name: "title", label: "Title", type: "text" },
        { name: "description", label: "Description", type: "textarea" },
      ]}
      summary={(row) => (
        <>
          <strong>
            {String(row.letter)} · {String(row.title)}
          </strong>
          <span className="admin-muted">{String(row.description)}</span>
        </>
      )}
    />
  );
}
