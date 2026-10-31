import type { HomeContent } from "@/convex/contentTypes";
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
    <section id="partner" style={{ position: "relative", overflow: "hidden", background: "#0a0f14", color: "#ffffff" }}>
      <DecorCircles corner="bottom-left" />

      <div style={{ position: "relative", maxWidth: 1280, margin: "0 auto", padding: "96px 24px", display: "flex", flexWrap: "wrap", gap: 56 }}>
        <div style={{ flex: "1 1 400px", minWidth: 0, display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, fontWeight: 500, letterSpacing: "0.26em", textTransform: "uppercase", color: "#a8bacd" }}>
            05 · Partner with Rounds
          </div>
          <h2 style={{ margin: 0, fontSize: "clamp(34px, 4.2vw, 52px)", lineHeight: 1.25, fontWeight: 600 }}>
            เข้าถึงว่าที่แพทย์รุ่นใหม่ของไทย
          </h2>
          <p style={{ margin: 0, fontSize: 17, lineHeight: 1.7, color: "#e6ebf0", maxWidth: 520 }}>
            สปอนเซอร์อยู่รอบๆ เนื้อหาของเรา แต่ไม่เคยอยู่ในเนื้อหาทางการแพทย์ การเลือกแขกรับเชิญและเนื้อหายังเป็นของเราเสมอ
          </p>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, paddingTop: 8 }}>
            <a
              href={`mailto:${settings.contactEmail}`}
              style={{ display: "inline-flex", alignItems: "center", height: 56, padding: "0 28px", background: "#ffffff", color: "#0a0f14", textDecoration: "none", fontWeight: 600, fontSize: 16 }}
            >
              ติดต่อเรา
            </a>
            <a
              href={settings.mediaKitUrl}
              style={{ display: "inline-flex", alignItems: "center", height: 56, padding: "0 28px", border: "1px solid #ffffff", color: "#ffffff", textDecoration: "none", fontWeight: 600, fontSize: 16 }}
            >
              Media kit
            </a>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 14, paddingTop: 24 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: "#a8bacd" }}>
              แขกรับเชิญซีซันนี้
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px 24px" }}>
              {guests.map((g) => (
                <div key={g.key} style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <span lang={g.nameLang === "th" ? "th" : undefined} style={{ fontFamily: g.nameLang === "th" ? "var(--font-thai)" : undefined, fontSize: 15, fontWeight: 500 }}>
                    {g.name}
                  </span>
                  <span style={{ fontSize: 13, color: "#a8bacd" }}>{g.field}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ flex: "1 1 460px", minWidth: 0, display: "flex", flexDirection: "column" }}>
          {packages.map((pkg, i) => (
            <div
              key={pkg.key}
              style={{
                display: "flex",
                gap: 24,
                padding: "26px 0",
                borderTop: "1px solid #26313d",
                borderBottom: i === packages.length - 1 ? "1px solid #26313d" : undefined,
              }}
            >
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "#a8bacd", paddingTop: 3 }}>{pkg.letter}</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <div style={{ fontSize: 20, lineHeight: 1.4, fontWeight: 600 }}>{pkg.title}</div>
                <div style={{ fontSize: 15, lineHeight: 1.6, color: "#a8bacd" }}>{pkg.description}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
