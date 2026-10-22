"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { ResourceManager } from "@/components/admin/ResourceManager";

export default function MythsPage() {
  const episodes = useQuery(api.admin.episodes.list) ?? [];
  return (
    <ResourceManager
      title="Myth-busters"
      description="Published myths appear in the myth-buster section of the home page."
      singular="myth"
      functions={api.admin.myths}
      defaults={{ published: true }}
      fields={[
        { name: "claim", label: "Myth", type: "textarea" },
        { name: "answer", label: "Answer", type: "textarea" },
        {
          name: "episodeId",
          label: "Episode",
          type: "select",
          optional: true,
          options: episodes.map((e) => ({ value: e._id, label: e.title })),
          help: "The episode where the specialist answers it.",
        },
        { name: "published", label: "Published", type: "checkbox" },
      ]}
      summary={(row) => (
        <>
          <strong>{String(row.claim)}</strong>
          <span className="admin-muted">{row.published ? "Published" : "Hidden"}</span>
        </>
      )}
    />
  );
}
