import type { HomeContent } from "@/convex/contentTypes";

// The design system has no accent colour and no emoji, so the two verdicts
// differ by fill (solid vs outline) and by their words, not by red/green.
const VERDICTS = {
  red: { label: "Red flag", meaning: "อย่าเชื่อ", solid: true },
  green: { label: "Green flag", meaning: "เรื่องจริง", solid: false },
};

function VerdictBadge({ verdict }: { verdict: keyof typeof VERDICTS }) {
  const v = VERDICTS[verdict];
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "baseline",
        gap: "var(--space-2)",
        padding: "var(--space-1) var(--space-3)",
        border: "1px solid var(--white)",
        background: v.solid ? "var(--white)" : "transparent",
        color: v.solid ? "var(--ink)" : "var(--on-navy)",
      }}
    >
      <span className="ds-label">{v.label}</span>
      <span className="ds-small" style={{ fontWeight: 600 }}>
        {v.meaning}
      </span>
    </span>
  );
}

// Red flag / Green flag: the guest doctor's verdict on beliefs people have.
export function MythBusterSection({ myths }: { myths: HomeContent["myths"] }) {
  const sourceSpecialty = myths.find((m) => m.episodeSpecialty)?.episodeSpecialty;
  return (
    <section id="flags" className="on-navy">
      <div className="container section" style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-12)" }}>
        <div style={{ flex: "1 1 340px", minWidth: 0, display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
          <div className="section-head">
            <div>
              <span className="ds-label">03</span>
              <span className="ds-label">Red flag / Green flag</span>
            </div>
          </div>
          <h2 className="ds-headline">เชื่อแบบนี้ Red flag หรือ Green flag? คุณหมอตอบให้ท้ายทุกตอน</h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-3)", paddingTop: "var(--space-2)" }}>
            <VerdictBadge verdict="red" />
            <VerdictBadge verdict="green" />
          </div>
        </div>

        <div style={{ flex: "2 1 520px", minWidth: 0, display: "flex", flexDirection: "column" }}>
          {myths.map((myth, i) => (
            <div
              key={myth.key}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                gap: "var(--space-2)",
                padding: "var(--space-6) 0",
                borderTop: "1px solid var(--steel)",
                borderBottom: i === myths.length - 1 ? "1px solid var(--steel)" : undefined,
              }}
            >
              <VerdictBadge verdict={myth.verdict} />
              <div style={{ fontSize: 20, lineHeight: "32px", fontWeight: 500 }}>“{myth.claim}”</div>
              <p className="ds-body" style={{ color: "#e6ebf0", lineHeight: "28px" }}>
                {myth.answer}
              </p>
              {myth.answeredBy && <div className="ds-small muted">ตอบโดย {myth.answeredBy}</div>}
            </div>
          ))}
          {sourceSpecialty && (
            <a href="#episodes" className="text-link" style={{ paddingTop: "var(--space-3)" }}>
              ฟังคำอธิบายเต็มๆ ในตอน{sourceSpecialty} →
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
