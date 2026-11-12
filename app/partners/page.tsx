import type { CSSProperties } from "react";
import type { Metadata } from "next";
import { SiteNav } from "@/components/landing/SiteNav";
import { Footer } from "@/components/landing/Footer";
import { ArrowIcon } from "@/components/landing/Icons";
import { getHomeContent } from "@/lib/content";
import { filled, isPlaceholder } from "@/lib/placeholders";
import { compactNumber, countryLabel, genderLabel, percent } from "@/lib/youtubeNumbers";

export const metadata: Metadata = {
  title: "Partner with Rounds",
  description: "ผู้ชม ตัวเลขช่อง และแพ็กเกจสปอนเซอร์ของ Rounds",
};

// For brands: the channel's live numbers, who watches, and what can be sponsored.
export default async function PartnersPage() {
  const content = await getHomeContent();
  const { settings, channel, audience } = content;
  const email = filled(settings.contactEmail);
  const mediaKit = filled(settings.mediaKitUrl);
  const numbers = [
    { value: channel?.subscribers, label: "ผู้ติดตาม" },
    { value: channel?.views, label: "ยอดวิวทั้งหมด" },
    { value: channel?.videos, label: "วิดีโอ" },
  ].filter((n): n is { value: number; label: string } => typeof n.value === "number" && n.value > 0);
  const ages = audience?.ageGroups.filter((a) => a.percent >= 1) ?? [];
  const extra = [
    audience && audience.genders.length > 0
      ? audience.genders.map((g) => `${genderLabel(g.gender)} ${percent(g.percent)}`).join(" · ")
      : null,
    audience && audience.countries.length > 0
      ? `ดูจาก ${audience.countries
          .slice(0, 3)
          .map((c) => `${countryLabel(c.country)} ${percent(c.percent)}`)
          .join(", ")}`
      : null,
  ].filter(Boolean);
  const segments = content.audienceSegments;

  return (
    <>
      <SiteNav base="/" />
      <main id="main">
        <section className="dark partners-hero" aria-labelledby="partners-title">
          <div className="wrap">
            <h1 className="partner-h" lang="en" id="partners-title">
              Partner with Rounds
            </h1>
            <p className="body-lg partners-lead">
              เข้าถึงว่าที่แพทย์รุ่นใหม่ของไทย สปอนเซอร์อยู่รอบๆ เนื้อหาของเรา แต่ไม่เคยอยู่ในเนื้อหาทางการแพทย์
            </p>
            <div className="partner-actions" style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-3)" }}>
              {email && (
                <a href={`mailto:${email}`} className="btn btn-light">
                  ติดต่อเรื่องสปอนเซอร์
                  <span className="btn-arrow">
                    <ArrowIcon />
                  </span>
                </a>
              )}
              {mediaKit && (
                <a href={mediaKit} className="btn btn-outline">
                  ดาวน์โหลด Media kit
                </a>
              )}
            </div>

            {numbers.length > 0 && (
              <dl className="partners-numbers">
                {numbers.map((n) => (
                  <div key={n.label}>
                    <dt className="small muted">{n.label}</dt>
                    <dd>{compactNumber(n.value)}</dd>
                  </div>
                ))}
              </dl>
            )}
          </div>
        </section>

        <section className="wrap section partners-grid" aria-label="ผู้ชมและแพ็กเกจ">
          <div>
            <h2 className="title">ใครดู Rounds</h2>
            <p className="small muted">{settings.audienceIntro}</p>
            {ages.length > 0 && (
              <div className="partners-ages">
                <span className="small muted">อายุผู้ชมบน YouTube · {audience!.days} วันล่าสุด</span>
                <ul className="age-bars">
                  {ages.map((a) => (
                    <li key={a.group}>
                      <span>{a.group}</span>
                      <span className="age-bar" style={{ "--w": `${a.percent}%` } as CSSProperties} />
                      <b>{percent(a.percent)}</b>
                    </li>
                  ))}
                </ul>
                {extra.length > 0 && <p className="small muted">{extra.join(" — ")}</p>}
              </div>
            )}
            <ul className="row-list">
              {segments.map((seg) => (
                <li key={seg.key}>
                  {!isPlaceholder(seg.stat) && <span className="row-stat">{seg.stat}</span>}
                  <span className="row-title">{seg.title}</span>
                  <span className="small muted">{seg.description}</span>
                </li>
              ))}
            </ul>
          </div>

        </section>

        {content.sponsorPackages.length > 0 && (
          <section className="wrap section packages" aria-labelledby="packages-title" style={{ paddingTop: 0 }}>
            <h2 className="h2" lang="en" id="packages-title">
              Packages
            </h2>
            <p className="h2-th muted">ทุกแพ็กเกจอยู่นอกเนื้อหาทางการแพทย์ การเลือกแขกรับเชิญและเนื้อหาเป็นของเราเสมอ</p>
            <ul className="package-grid">
              {content.sponsorPackages.map((pkg) => (
                <li key={pkg.key} className="package-card">
                  <h3 className="row-title">{pkg.title}</h3>
                  <p className="small muted">{pkg.description}</p>
                  {pkg.includes.length > 0 && (
                    <ul className="package-includes">
                      {pkg.includes.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
            <div className="package-terms">
              <p>
                <b>สิ่งที่เราไม่รับ</b> ยา อาหารเสริม ผลิตภัณฑ์หรือบริการทางการแพทย์และความงาม
                และสินค้าที่อ้างสรรพคุณด้านสุขภาพ เพื่อให้ความรู้ในรายการเป็นกลางเสมอ
              </p>
              <p>ทุกชิ้นงานที่ได้รับการสนับสนุน เราบอกผู้ชมอย่างชัดเจน</p>
              {email && (
                <a
                  href={`mailto:${email}?subject=${encodeURIComponent("ขอราคาแพ็กเกจสปอนเซอร์ Rounds")}`}
                  className="btn"
                >
                  ขอราคาและ media kit
                  <span className="btn-arrow">
                    <ArrowIcon />
                  </span>
                </a>
              )}
            </div>
          </section>
        )}
      </main>
      <Footer settings={settings} />
    </>
  );
}
