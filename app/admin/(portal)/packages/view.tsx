"use client";

import { api } from "@/convex/_generated/api";
import { ResourceManager } from "@/components/admin/ResourceManager";

export default function PackagesPage() {
  return (
    <ResourceManager
      label="For brands"
      title="Sponsor packages"
      description="The package cards on the brands page (/partners). Prices aren't shown; brands ask by email."
      singular="package"
      functions={api.admin.sponsorPackages}
      defaults={{}}
      fields={[
        { name: "title", label: "Title", type: "text" },
        { name: "description", label: "Description", type: "textarea", help: "One line under the title." },
        { name: "includes", label: "What's included", type: "lines", optional: true, help: "One item per line, shown as a list." },
      ]}
      summary={(row) => (
        <>
          <strong>
            {String(row.title)}
          </strong>
          <span className="admin-muted">{String(row.description)}</span>
        </>
      )}
    />
  );
}
