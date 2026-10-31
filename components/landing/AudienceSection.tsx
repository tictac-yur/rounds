import type { HomeContent } from "@/convex/contentTypes";
import { isPlaceholder } from "@/lib/placeholders";
import { SectionHeader } from "./SectionHeader";

export function AudienceSection({
  settings,
  segments,
}: {
  settings: HomeContent["settings"];
  segments: HomeContent["audienceSegments"];
}) {
  return (
    <section id="audience" className="container section" style={{ display: "flex", flexDirection: "column", gap: "var(--space-8)" }}>
      <SectionHeader
        number="06"
        en="Who's watching"
        th={settings.audienceIntro}
        action={
          !isPlaceholder(settings.mediaKitUrl) && (
            <a href={settings.mediaKitUrl} className="text-link">
              ดาวน์โหลด Media Kit →
            </a>
          )
        }
      />

      <div className="stat-strip stat-strip-light" style={{ borderTop: "2px solid var(--ink)" }}>
        {segments.map((seg) => (
          <div key={seg.key} style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
            {/* Percentages show once real numbers are entered in the admin. */}
            {!isPlaceholder(seg.stat) && (
              <div style={{ fontSize: 56, lineHeight: "64px", fontWeight: 600, letterSpacing: "-0.03em" }}>{seg.stat}</div>
            )}
            <h3 className="ds-title">{seg.title}</h3>
            <p className="ds-small muted">{seg.description}</p>
          </div>
        ))}
      </div>

      <div className="ds-caption muted" style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-2) var(--space-8)" }}>
        {settings.platformHandles.map((handle) => (
          <span key={handle}>{handle}</span>
        ))}
      </div>
    </section>
  );
}
