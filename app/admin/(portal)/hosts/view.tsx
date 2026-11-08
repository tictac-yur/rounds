"use client";

import { api } from "@/convex/_generated/api";
import { ResourceManager } from "@/components/admin/ResourceManager";

export default function HostsPage() {
  return (
    <ResourceManager
      title="Hosts"
      description="Shown in “The hosts” section."
      singular="host"
      functions={api.admin.hosts}
      imageField="photoId"
      defaults={{}}
      fields={[
        { name: "name", label: "Name", type: "text" },
        { name: "role", label: "Role", type: "text" },
        { name: "photoId", label: "Photo", type: "image", optional: true },
      ]}
      summary={(row) => (
        <>
          <strong>{String(row.name)}</strong>
          <span className="admin-muted">{String(row.role)}</span>
        </>
      )}
    />
  );
}
