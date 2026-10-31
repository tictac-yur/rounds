import type { HomeContent } from "@/convex/contentTypes";
import { LogoMark, Wordmark } from "./Logo";

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
  ];
}

export function Footer({ settings }: { settings: HomeContent["settings"] }) {
  return (
    <footer style={{ background: "#0a0f14", color: "#ffffff" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "64px 24px 40px", display: "flex", flexDirection: "column", gap: 48 }}>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: 40 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <LogoMark width={70} height={30} />
            <Wordmark size={24} />
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 56 }}>
            {footerColumns(settings).map((col) => (
              <div key={col.heading} style={{ display: "flex", flexDirection: "column", gap: 10, fontSize: 15 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: "#a8bacd" }}>
                  {col.heading}
                </div>
                {col.links.map((link) => (
                  <a key={link.label} href={link.href} style={{ color: "#ffffff", textDecoration: "none" }}>
                    {link.label}
                  </a>
                ))}
              </div>
            ))}
          </div>
        </div>

        <div style={{ borderTop: "1px solid #26313d", paddingTop: 24, display: "flex", flexDirection: "column", gap: 10, fontSize: 13, lineHeight: "20px", color: "#a8bacd" }}>
          <p style={{ margin: 0 }}>
            Rounds จัดทำโดยนักศึกษาแพทย์ ไม่ใช่แพทย์ที่มีใบอนุญาต เนื้อหาในที่นี่ไม่ใช่คำแนะนำทางการแพทย์
            กรุณาปรึกษาแพทย์ของท่านเกี่ยวกับสุขภาพของท่าน
          </p>
          <p lang="en" style={{ margin: 0 }}>
            Rounds is made by medical students, not licensed physicians. Nothing here is medical
            advice. Talk to your own doctor about your health.
          </p>
          <p style={{ margin: 0 }}>
            ขอบคุณคณะแพทยศาสตร์ มหาวิทยาลัยธรรมศาสตร์ · เนื้อหาเป็นอิสระ · © 2026 Rounds™
          </p>
        </div>
      </div>
    </footer>
  );
}
