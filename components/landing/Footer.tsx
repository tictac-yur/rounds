import type { HomeContent } from "@/convex/contentTypes";
import { isPlaceholder } from "@/lib/placeholders";
import { Lockup } from "./Logo";

function footerColumns(settings: HomeContent["settings"]) {
  return [
    {
      heading: "ดูและฟัง",
      links: [
        { label: "YouTube · @roundsmed", href: settings.youtubeUrl },
        { label: "Spotify", href: settings.spotifyUrl },
        { label: "Apple Podcasts", href: settings.appleUrl },
      ],
    },
    {
      heading: "ติดตาม",
      links: [
        { label: "Instagram · @rounds.md", href: settings.instagramUrl },
        { label: "TikTok · @rounds.med", href: settings.tiktokUrl },
        { label: "ลิงก์ทั้งหมด", href: settings.linktreeUrl },
      ],
    },
    {
      heading: "ร่วมงานกับเรา",
      links: [
        { label: "สปอนเซอร์", href: "#partner" },
        { label: "มาเป็นแขกรับเชิญ", href: `mailto:${settings.contactEmail}` },
        { label: "Media kit", href: settings.mediaKitUrl },
      ],
    },
  ].map((col) => ({ ...col, links: col.links.filter((link) => !isPlaceholder(link.href)) }));
}

export function Footer({ settings }: { settings: HomeContent["settings"] }) {
  return (
    <footer className="on-dark">
      <div className="container" style={{ paddingTop: "var(--space-16)", paddingBottom: "var(--space-12)", display: "flex", flexDirection: "column", gap: "var(--space-12)" }}>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: "var(--space-12)" }}>
          <Lockup height={30} />

          <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-8) var(--space-16)" }}>
            {footerColumns(settings).map((col) => (
              <div key={col.heading} style={{ display: "flex", flexDirection: "column" }}>
                <h2 className="ds-small muted" style={{ fontWeight: 600, marginBottom: "var(--space-1)" }}>
                  {col.heading}
                </h2>
                {col.links.map((link) => (
                  <a key={link.label} href={link.href} className="text-link" style={{ fontWeight: 400 }}>
                    {link.label}
                  </a>
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className="ds-small muted" style={{ borderTop: "1px solid var(--line-dark)", paddingTop: "var(--space-6)", display: "flex", flexDirection: "column", gap: "var(--space-2)", fontSize: 13, lineHeight: "20px" }}>
          <p style={{ margin: 0 }}>
            Rounds จัดทำโดยนักศึกษาแพทย์ ไม่ใช่แพทย์ที่มีใบอนุญาต เนื้อหาในที่นี่ไม่ใช่คำแนะนำทางการแพทย์
            กรุณาปรึกษาแพทย์ของท่านเกี่ยวกับสุขภาพของท่าน
          </p>
          <p lang="en" style={{ margin: 0 }}>
            Rounds is made by medical students, not licensed physicians. Nothing here is medical
            advice. Talk to your own doctor about your health.
          </p>
          <p style={{ margin: 0 }}>ขอบคุณคณะแพทยศาสตร์ มหาวิทยาลัยธรรมศาสตร์ · เนื้อหาเป็นอิสระ · © 2026 Rounds™</p>
        </div>
      </div>
    </footer>
  );
}
