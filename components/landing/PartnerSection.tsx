import Link from "next/link";
import type { HomeContent } from "@/convex/contentTypes";
import { filled } from "@/lib/placeholders";
import { ArrowIcon, PlatformIcon } from "./Icons";

// The home page's short pitch to brands; the numbers live on /partners.
export function PartnerSection({ settings }: { settings: HomeContent["settings"] }) {
  const email = filled(settings.contactEmail);
  const instagram = filled(settings.instagramUrl);

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
              <Link href="/partners" className="btn btn-outline">
                ดูผู้ชมและแพ็กเกจ
              </Link>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
