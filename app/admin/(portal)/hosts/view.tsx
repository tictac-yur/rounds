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
        {
          name: "photoId",
          label: "Portrait",
          type: "image",
          optional: true,
          help: "A photo of just this host. Once every host has one, “Meet the hosts” shows them side by side with names; until then it uses the intro episode's photo. Portrait (tall) photos fit best.",
        },
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
