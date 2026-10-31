import type { HomeContent } from "@/convex/contentTypes";

const VERDICTS = {
  red: { label: "Red flag", icon: "🚩", color: "var(--flag-red)" },
  green: { label: "Green flag", icon: "✅", color: "var(--flag-green)" },
};

// Red flag / Green flag: the guest doctor's verdict on beliefs people have.
export function MythBusterSection({ myths }: { myths: HomeContent["myths"] }) {
  const sourceSpecialty = myths.find((m) => m.episodeSpecialty)?.episodeSpecialty;
  return (
    <section id="flags" style={{ background: "#1b3a5f", color: "#ffffff" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "88px 24px", display: "flex", flexWrap: "wrap", gap: 56 }}>
        <div style={{ flex: "1 1 340px", minWidth: 0, display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, fontWeight: 500, letterSpacing: "0.26em", textTransform: "uppercase", color: "#a8bacd" }}>
            Red flag / Green flag
          </div>
          <h2 style={{ margin: 0, fontSize: 40, lineHeight: 1.3, fontWeight: 600 }}>
            เชื่อแบบนี้ Red flag หรือ Green flag? คุณหมอตอบให้ท้ายทุกตอน
          </h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 16, paddingTop: 8, fontSize: 15, color: "#e6ebf0" }}>
            <span>🚩 Red flag = อย่าเชื่อ</span>
            <span>✅ Green flag = เรื่องจริง ทำต่อได้</span>
          </div>
        </div>

        <div style={{ flex: "2 1 520px", minWidth: 0, display: "flex", flexDirection: "column" }}>
          {myths.map((myth, i) => {
            const verdict = VERDICTS[myth.verdict];
            return (
              <div
                key={myth.key}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  gap: 8,
                  padding: "24px 0",
                  borderTop: "1px solid #4a7099",
                  borderBottom: i === myths.length - 1 ? "1px solid #4a7099" : undefined,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    fontSize: 14,
                    fontWeight: 600,
                    background: verdict.color,
                    color: "#ffffff",
                    padding: "6px 12px",
                  }}
                >
                  <span aria-hidden="true">{verdict.icon}</span>
                  {verdict.label}
                </div>
                <div style={{ fontSize: 20, lineHeight: 1.5, fontWeight: 500 }}>“{myth.claim}”</div>
                <div style={{ fontSize: 16, lineHeight: 1.7, color: "#e6ebf0" }}>{myth.answer}</div>
                {myth.answeredBy && (
                  <div style={{ fontSize: 14, lineHeight: "22px", color: "#a8bacd" }}>ตอบโดย {myth.answeredBy}</div>
                )}
              </div>
            );
          })}
          {sourceSpecialty && (
            <a href="#episodes" style={{ color: "#ffffff", fontWeight: 600, fontSize: 15, paddingTop: 20 }}>
              ฟังคำอธิบายเต็มๆ ในตอน{sourceSpecialty} →
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
