import type { HomeContent } from "@/convex/contentTypes";
import { isPlaceholder } from "@/lib/placeholders";
import { DecorCircles } from "./DecorCircles";

export function PartnerSection({
  settings,
  guests,
  packages,
}: {
  settings: HomeContent["settings"];
  guests: HomeContent["guests"];
  packages: HomeContent["sponsorPackages"];
}) {
  return (
    <section id="partner" className="on-dark" style={{ position: "relative", overflow: "hidden" }}>
      <DecorCircles corner="bottom-left" />

      <div className="container section" style={{ position: "relative", display: "flex", flexWrap: "wrap", gap: "var(--space-12)" }}>
        <div style={{ flex: "1 1 400px", minWidth: 0, display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
          <span className="ds-label muted">07 · Partner with Rounds</span>
          <h2 className="ds-display" lang="en" style={{ fontSize: "clamp(32px, 4.2vw, 52px)", lineHeight: 1.15, letterSpacing: "-0.02em" }}>
            Reach the next generation of Thai doctors.
          </h2>
          <p className="ds-body-lg" style={{ fontSize: 22, lineHeight: "34px", fontWeight: 500 }}>
            เข้าถึงว่าที่แพทย์รุ่นใหม่ของไทย
          </p>
          <p className="ds-body-lg" style={{ color: "#e6ebf0", maxWidth: 520 }}>
            สปอนเซอร์อยู่รอบๆ เนื้อหาของเรา แต่ไม่เคยอยู่ในเนื้อหาทางการแพทย์ การเลือกแขกรับเชิญและเนื้อหายังเป็นของเราเสมอ
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-3)", paddingTop: "var(--space-2)" }}>
            <a href={`mailto:${settings.contactEmail}`} className="btn btn-light">
              ติดต่อเรา
            </a>
            {!isPlaceholder(settings.mediaKitUrl) && (
              <a href={settings.mediaKitUrl} className="btn btn-outline-light">
                Media kit
              </a>
            )}
          </div>
        </div>

        <div style={{ flex: "1 1 460px", minWidth: 0, display: "flex", flexDirection: "column", gap: "var(--space-8)" }}>
          <div>
            {packages.map((pkg, i) => (
              <div
                key={pkg.key}
                style={{
                  display: "flex",
                  gap: "var(--space-6)",
                  padding: "var(--space-6) 0",
                  borderTop: "1px solid var(--line-dark)",
                  borderBottom: i === packages.length - 1 ? "1px solid var(--line-dark)" : undefined,
                }}
              >
                <div className="ds-label muted" style={{ paddingTop: 6 }}>
                  {pkg.letter}
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-1)" }}>
                  <h3 className="ds-title">{pkg.title}</h3>
                  <p className="ds-small muted">{pkg.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
            <h3 className="ds-small muted" style={{ fontWeight: 600 }}>
              แขกรับเชิญซีซันนี้
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "var(--space-4) var(--space-6)" }}>
              {guests.map((g) => (
                <div key={g.key} style={{ display: "flex", flexDirection: "column" }}>
                  <span lang={g.nameLang} style={{ fontSize: 15, lineHeight: "24px", fontWeight: 500 }}>
                    {g.name}
                  </span>
                  <span className="ds-small muted">{g.field}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
