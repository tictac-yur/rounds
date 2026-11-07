import type { HomeContent } from "@/convex/contentTypes";
import { filled, isPlaceholder } from "@/lib/placeholders";
import { ArrowIcon, PlatformIcon } from "./Icons";

export function PartnerSection({
  settings,
  guests,
  packages,
  segments,
}: {
  settings: HomeContent["settings"];
  guests: HomeContent["guests"];
  packages: HomeContent["sponsorPackages"];
  segments: HomeContent["audienceSegments"];
}) {
  const email = filled(settings.contactEmail);
  const instagram = filled(settings.instagramUrl);
  const mediaKit = filled(settings.mediaKitUrl);
  const realGuests = guests.filter((g) => !isPlaceholder(g.name));

  return (
    <section id="partner" className="dark" aria-labelledby="partner-title">
      <div className="wrap section">
        <div className="partner-top">
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
            <span className="eyebrow">
              <span className="eyebrow-dots" aria-hidden="true">
                <i />
                <i />
                <i />
              </span>
              06 · For brands
            </span>
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

        <div className="partner-grid">
          <div className="panel panel-audience">
            <h3 className="title">ใครดู Rounds</h3>
            <p className="small muted" style={{ fontFamily: "var(--font-thai)", maxWidth: 720 }}>
              {settings.audienceIntro}
            </p>
            <div className="segments">
              {segments.map((seg) => (
                <div key={seg.key} className="segment">
                  {/* Percentages show once real numbers are entered in the admin. */}
                  {!isPlaceholder(seg.stat) && <div className="segment-stat">{seg.stat}</div>}
                  <h4 className="title" style={{ fontSize: 18, fontFamily: "var(--font-thai)" }}>
                    {seg.title}
                  </h4>
                  <p className="small muted" style={{ fontFamily: "var(--font-thai)" }}>
                    {seg.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {packages.length > 0 && (
            <div className="panel panel-packages">
              <h3 className="title">แพ็กเกจ</h3>
              <div>
                {packages.map((pkg) => (
                  <div key={pkg.key} className="pkg">
                    <span className="pkg-letter" aria-hidden="true">
                      {pkg.letter}
                    </span>
                    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-1)" }}>
                      <h4 className="title" style={{ fontSize: 18, fontFamily: "var(--font-thai)" }}>
                        {pkg.title}
                      </h4>
                      <p className="small muted" style={{ fontFamily: "var(--font-thai)" }}>
                        {pkg.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {realGuests.length > 0 && (
            <div className="panel panel-guests">
              <h3 className="title">แขกรับเชิญซีซันนี้</h3>
              <ul className="guest-list">
                {realGuests.map((g) => (
                  <li key={g.key}>
                    <span lang={g.nameLang} style={{ fontWeight: 500 }}>
                      {g.name}
                    </span>
                    <span className="small muted">{g.field}</span>
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
