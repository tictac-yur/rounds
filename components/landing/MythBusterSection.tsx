import type { HomeContent } from "@/convex/contentTypes";

export function MythBusterSection({ myths }: { myths: HomeContent["myths"] }) {
  const sourceSpecialty = myths.find((m) => m.episodeSpecialty)?.episodeSpecialty;
  return (
    <section style={{ background: "#1b3a5f", color: "#ffffff" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "88px 24px", display: "flex", flexWrap: "wrap", gap: 56 }}>
        <div style={{ flex: "1 1 340px", minWidth: 0, display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, fontWeight: 500, letterSpacing: "0.26em", textTransform: "uppercase", color: "#a8bacd" }}>
            Myth-buster
          </div>
          <h2 style={{ margin: 0, fontSize: 40, lineHeight: "44px", fontWeight: 600, letterSpacing: "-0.02em" }}>
            Every episode ends with rapid-fire myths, answered by the specialist.
          </h2>
        </div>

        <div style={{ flex: "2 1 520px", minWidth: 0, display: "flex", flexDirection: "column" }}>
          {myths.map((myth, i) => (
            <div
              key={myth.key}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 24,
                padding: "24px 0",
                borderTop: "1px solid #4a7099",
                borderBottom: i === myths.length - 1 ? "1px solid #4a7099" : undefined,
              }}
            >
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <div style={{ fontSize: 20, lineHeight: "28px", fontWeight: 500 }}>{myth.claim}</div>
                <div style={{ fontSize: 15, lineHeight: "23px", color: "#a8bacd" }}>{myth.answer}</div>
              </div>
              <div
                style={{
                  flexShrink: 0,
                  fontFamily: "var(--font-mono)",
                  fontSize: 12,
                  fontWeight: 500,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  background: "#ffffff",
                  color: "#0a0f14",
                  padding: "7px 11px",
                }}
              >
                Busted
              </div>
            </div>
          ))}
          {sourceSpecialty && (
            <a href="#episodes" style={{ color: "#ffffff", fontWeight: 600, fontSize: 15, paddingTop: 20 }}>
              Hear why in the {sourceSpecialty.toLowerCase()} episode →
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
