"use client";

import { api } from "@/convex/_generated/api";
import { ResourceManager } from "@/components/admin/ResourceManager";

export default function HostsPage() {
  return (
    <ResourceManager
      title="Hosts"
      description="Listed in “Meet the hosts”; each host has their own page."
      singular="host"
      functions={api.admin.hosts}
      imageField="photoId"
      defaults={{}}
      fields={[
        { name: "name", label: "Name", type: "text" },
        { name: "fullName", label: "Full name", type: "text", optional: true, help: "Real name on their page, e.g. นายจักริน เศรณีอริยาภรณ์." },
        { name: "fullNameAlt", label: "Full name in English", type: "text", optional: true, help: "e.g. Mr. Jakkrin Seraneeariyaporn" },
        { name: "role", label: "Role", type: "text" },
        {
          name: "slug",
          label: "Page address",
          type: "text",
          optional: true,
          help: "English, lowercase: titi → /hosts/titi.",
        },
        { name: "bio", label: "About", type: "textarea", optional: true, help: "A few lines about this host, shown on their page." },
        {
          name: "photoId",
          label: "Portrait",
          type: "image",
          optional: true,
          crop: { aspect: 3 / 4, width: 900, guides: "face" },
          help: "A photo of just this host, shown on their own page. After choosing it you crop it with guide lines, so both hosts are framed the same.",
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
