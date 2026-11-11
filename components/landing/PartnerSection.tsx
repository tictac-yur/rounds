import type { HomeContent } from "@/convex/contentTypes";
import { filled, isPlaceholder } from "@/lib/placeholders";
import { ArrowIcon, PlatformIcon } from "./Icons";

export function PartnerSection({
  settings,
  packages,
  segments,
}: {
  settings: HomeContent["settings"];
  packages: HomeContent["sponsorPackages"];
  segments: HomeContent["audienceSegments"];
}) {
  const email = filled(settings.contactEmail);
  const instagram = filled(settings.instagramUrl);
  const mediaKit = filled(settings.mediaKitUrl);

  return (
    <section id="partner" className="dark" aria-labelledby="partner-title">
      <div className="wrap section">
        <div className="partner-top">
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
            <h2 className="partner-h" lang="en" id="partner-title">
              Reach the next generation of Thai doctors.
            </h2>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
            <p className="body-lg" style={{ color: "#d6dee7", fontFamily: "var(--font-thai)" }}>
              เข้าถึงว่าที่แพทย์รุ่นใหม่ของไทย สปอนเซอร์อยู่รอบๆ เนื้อหาของเรา แต่ไม่เคยอยู่ในเนื้อหาทางการแพทย์
              การเลือกแขกรับเชิญและเนื้อหายังเป็นของเราเสมอ
            </p>
            <div className="partner-actions" style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-3)" }}>
              {email ? (
                <a href={`mailto:${email}`} className="btn btn-light">
                  ติดต่อเรื่องสปอนเซอร์
                  <span className="btn-arrow">
                    <ArrowIcon />
                  </span>
                </a>
              ) : (
                instagram && (
                  // No contact email yet: send brands to an Instagram DM.
                  <a href={instagram} className="btn btn-light">
                    <PlatformIcon name="instagram" size={18} />
                    ทักทาง Instagram
                  </a>
                )
              )}
              {mediaKit && (
                <a href={mediaKit} className="btn btn-outline">
                  ดาวน์โหลด Media kit
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="partner-rows">
          <div>
            <h3 className="title">ใครดู Rounds</h3>
            <p className="small muted">{settings.audienceIntro}</p>
            <ul className="row-list">
              {segments.map((seg) => (
                <li key={seg.key}>
                  {/* Percentages show once real numbers are entered in the admin. */}
                  {!isPlaceholder(seg.stat) && <span className="row-stat">{seg.stat}</span>}
                  <span className="row-title">{seg.title}</span>
                  <span className="small muted">{seg.description}</span>
                </li>
              ))}
            </ul>
          </div>

          {packages.length > 0 && (
            <div>
              <h3 className="title">แพ็กเกจ</h3>
              <p className="small muted">ทุกแพ็กเกจอยู่นอกเนื้อหาทางการแพทย์</p>
              <ul className="row-list">
                {packages.map((pkg) => (
                  <li key={pkg.key}>
                    <span className="row-title">{pkg.title}</span>
                    <span className="small muted">{pkg.description}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
