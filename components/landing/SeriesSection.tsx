import type { HomeContent } from "@/convex/contentTypes";

export function SeriesSection({ series }: { series: HomeContent["series"] }) {
  return (
    <section style={{ background: "var(--surface-raised)", borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)" }}>
      <div className="container section" style={{ display: "flex", flexDirection: "column", gap: "var(--space-8)" }}>
        <div className="section-head">
          <div>
            <span className="ds-label">04</span>
            <h2 className="ds-headline">หนึ่งช่อง สามซีรีส์</h2>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "var(--space-8) var(--space-6)" }}>
          {series.map((s) => (
            <div key={s.key} style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)", paddingTop: "var(--space-6)", borderTop: `2px solid ${s.accentColor}` }}>
              <div className="ds-small muted">{s.kicker}</div>
              <h3 className="ds-headline" style={{ fontSize: 26, lineHeight: "36px" }}>
                {s.name}
              </h3>
              <p className="ds-body">{s.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
