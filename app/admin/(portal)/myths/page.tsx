"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { ResourceManager } from "@/components/admin/ResourceManager";

export default function MythsPage() {
  const episodes = useQuery(api.admin.episodes.list) ?? [];
  return (
    <ResourceManager
      title="Red / Green flags"
      description="Beliefs the guest doctor rates at the end of each episode. Published ones appear on the home page."
      singular="flag"
      functions={api.admin.myths}
      defaults={{ published: true, verdict: "red" }}
      fields={[
        { name: "claim", label: "Belief (what people say)", type: "textarea" },
        {
          name: "verdict",
          label: "Doctor's verdict",
          type: "select",
          options: [
            { value: "red", label: "🚩 Red flag — don't believe it" },
            { value: "green", label: "✅ Green flag — true / keep doing it" },
          ],
        },
        { name: "answer", label: "Doctor's answer", type: "textarea" },
        {
          name: "episodeId",
          label: "Episode",
          type: "select",
          optional: true,
          options: episodes.map((e) => ({ value: e._id, label: e.title })),
          help: "The episode where the doctor answers it. Their name is shown as “ตอบโดย …”.",
        },
        { name: "published", label: "Published", type: "checkbox" },
      ]}
      summary={(row) => (
        <>
          <strong>{String(row.claim)}</strong>
          <span className="admin-muted">
            {row.verdict === "green" ? "✅ Green flag" : "🚩 Red flag"} · {row.published ? "Published" : "Hidden"}
          </span>
        </>
      )}
    />
  );
}
