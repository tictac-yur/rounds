import type { HomeContent } from "@/convex/contentTypes";

export function AudienceSection({
  settings,
  segments,
}: {
  settings: HomeContent["settings"];
  segments: HomeContent["audienceSegments"];
}) {
  return (
    <section id="audience" style={{ maxWidth: 1280, margin: "0 auto", padding: "96px 24px", display: "flex", flexDirection: "column", gap: 40 }}>
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "flex-end", gap: 24 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 14, maxWidth: 640 }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 20 }}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 13, fontWeight: 500, letterSpacing: "0.2em", color: "#5d666f" }}>
              03
            </span>
            <h2 style={{ margin: 0, fontSize: 40, lineHeight: "44px", fontWeight: 600, letterSpacing: "-0.02em" }}>
              Who&apos;s watching
            </h2>
          </div>
          <p style={{ margin: 0, fontSize: 18, lineHeight: "28px" }}>
            {settings.audienceIntro}
          </p>
        </div>
        <a href={settings.mediaKitUrl} style={{ fontSize: 15, fontWeight: 600 }}>
          Download the media kit →
        </a>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 0, borderTop: "2px solid #0a0f14" }}>
        {segments.map((seg, i) => (
          <div
            key={seg.key}
            style={{
              padding: i === 0 ? "28px 28px 28px 0" : "28px",
              borderLeft: i === 0 ? undefined : "1px solid #b6bec6",
              display: "flex",
              flexDirection: "column",
              gap: 12,
            }}
          >
            <div style={{ fontSize: 56, lineHeight: "56px", fontWeight: 600, letterSpacing: "-0.03em" }}>{seg.stat}</div>
            <div style={{ fontSize: 20, lineHeight: "26px", fontWeight: 600 }}>{seg.title}</div>
            <p style={{ margin: 0, fontSize: 15, lineHeight: "23px", color: "#5d666f" }}>{seg.description}</p>
          </div>
        ))}
      </div>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 32,
          fontFamily: "var(--font-mono)",
          fontSize: 12,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: "#5d666f",
        }}
      >
        {settings.platformHandles.map((handle) => (
          <span key={handle}>{handle}</span>
        ))}
      </div>
    </section>
  );
}
