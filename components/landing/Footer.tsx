import type { HomeContent } from "@/convex/contentTypes";
import { filled, isPlaceholder } from "@/lib/placeholders";
import { Lockup } from "./Logo";

function footerColumns(settings: HomeContent["settings"]) {
  const email = filled(settings.contactEmail);
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
        { label: "สปอนเซอร์", href: "/partners" },
        { label: "มาเป็นแขกรับเชิญ", href: email ? `mailto:${email}` : "" },
        { label: "Media kit", href: settings.mediaKitUrl },
      ],
    },
  ]
    .map((col) => ({ ...col, links: col.links.filter((link) => !isPlaceholder(link.href)) }))
    .filter((col) => col.links.length > 0);
}

export function Footer({ settings }: { settings: HomeContent["settings"] }) {
  return (
    <footer className="footer dark">
      <div className="wrap">
        <div className="footer-top">
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)", maxWidth: 360 }}>
            <Lockup height={28} />
            <p className="small muted" style={{ fontFamily: "var(--font-thai)" }}>
              ชีวิตนักศึกษาแพทย์แบบเรียลไทม์ กับอาจารย์แพทย์ตัวจริง
            </p>
          </div>
          <div className="footer-cols">
            {footerColumns(settings).map((col) => (
              <div key={col.heading}>
                <h2>{col.heading}</h2>
                <ul>
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <a href={link.href} className="text-link">
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="footer-close">
          <p lang="en">
            See you
            <br />
            a Round(s).
          </p>
          <a href="#top" className="btn btn-outline btn-sm">
            กลับขึ้นด้านบน ↑
          </a>
        </div>

        <div className="footer-legal muted">
          <p>
            Rounds จัดทำโดยนักศึกษาแพทย์ ไม่ใช่แพทย์ที่มีใบอนุญาต เนื้อหาในที่นี่ไม่ใช่คำแนะนำทางการแพทย์
            กรุณาปรึกษาแพทย์ของท่านเกี่ยวกับสุขภาพของท่าน
          </p>
          <p lang="en">
            Rounds is made by medical students, not licensed physicians. Nothing here is medical advice. Talk to your
            own doctor about your health.
          </p>
          <p>ขอบคุณคณะแพทยศาสตร์ มหาวิทยาลัยธรรมศาสตร์ · เนื้อหาเป็นอิสระ · © 2026 Rounds™ · ไอคอนแพลตฟอร์มจาก Simple Icons · <a href="/privacy">นโยบายความเป็นส่วนตัว</a></p>
        </div>
      </div>
      {/* The logo's three discs, set big and sinking off the bottom of the page. */}
      <svg className="footer-discs" viewBox="0 0 1440 260" aria-hidden="true">
        <circle cx={420} cy={380} r={330} fill="#16283d" />
        <circle cx={720} cy={380} r={330} fill="#1b3a5f" />
        <circle cx={1020} cy={380} r={330} fill="#2b5c91" />
      </svg>
    </footer>
  );
}
