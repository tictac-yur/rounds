import type { CSSProperties } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Lockup } from "@/components/landing/Logo";
import { PrintButton } from "@/components/media-kit/PrintButton";
import { getHomeContent } from "@/lib/content";
import { doctors } from "@/lib/doctors";
import { episodeTitle } from "@/lib/episodes";
import { filled, isPlaceholder } from "@/lib/placeholders";
import { siteUrl } from "@/lib/site";
import { compactNumber, countryLabel, genderLabel, percent } from "@/lib/youtubeNumbers";

export const metadata: Metadata = {
  title: "Media kit — Rounds",
  description: "Rounds สำหรับแบรนด์: รายการ ผู้ชม ตัวเลขช่อง และแพ็กเกจสปอนเซอร์",
};

// Three A4 sheets for brands, read from the same live content as the site,
// so the numbers are never out of date. "บันทึกเป็น PDF" prints it to a file.
export default async function MediaKitPage() {
  const content = await getHomeContent();
  const { settings, channel, audience } = content;
  const email = filled(settings.contactEmail);
  const year = new Date().getFullYear();
  const site = siteUrl.replace(/^https?:\/\//, "");

  const numbers = [
    { value: channel?.subscribers, label: "ผู้ติดตาม YouTube" },
    { value: channel?.views, label: "ยอดวิวทั้งหมด" },
    { value: channel?.videos, label: "วิดีโอ" },
  ].filter((n): n is { value: number; label: string } => typeof n.value === "number" && n.value > 0);
  const ages = audience?.ageGroups.filter((a) => a.percent >= 1) ?? [];
  const platforms = [
    { name: "YouTube", handle: "@roundsmed", url: settings.youtubeUrl },
    { name: "Instagram", handle: "@rounds.md", url: settings.instagramUrl },
    { name: "TikTok", handle: "@rounds.med", url: settings.tiktokUrl },
    { name: "Spotify", handle: "Rounds", url: settings.spotifyUrl },
  ].filter((p) => filled(p.url));
  const episodes = content.episodes.filter((ep) => ep.status === "published" && ep.thumbnailUrl).slice(0, 4);
  const guests = doctors(content);
  const segments = content.audienceSegments.filter((s) => !isPlaceholder(s.title));

  return (
    <div className="kit">
      <div className="kit-toolbar">
        <Link href="/partners" className="text-link small">
          ← Partner with Rounds
        </Link>
        <PrintButton />
      </div>

      {/* 1. Who we are */}
      <section className="kit-page kit-cover" aria-label="Rounds">
        <Lockup height={36} />
        <div className="kit-cover-title">
          <p className="kit-eyebrow" lang="en">
            Media kit {year}
          </p>
          <h1>ชีวิตนักศึกษาแพทย์แบบเรียลไทม์ กับอาจารย์แพทย์ตัวจริง</h1>
          <p className="kit-lead">
            Rounds คือช่องของนักศึกษาแพทย์ปี 1 ธรรมศาสตร์สองคน ที่ชวนอาจารย์แพทย์เฉพาะทางมานั่งคุย
            ตอบคำถามที่คนสงสัยจริง และแยก Red flag กับ Green flag เรื่องสุขภาพ
          </p>
        </div>

        <div className="kit-cover-grid">
          <div>
            <h2 className="kit-h">ผู้จัดรายการ</h2>
            <ul className="kit-list">
              {content.hosts.map((h) => (
                <li key={h.key}>
                  <b>{h.name}</b>
                  {h.fullName && <span>{h.fullName}</span>}
                  <span className="kit-muted">{h.role}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="kit-h">รูปแบบรายการ</h2>
            <ul className="kit-list">
              <li>
                <b lang="en">The Consult</b>
                <span className="kit-muted">คุยกับอาจารย์แพทย์เฉพาะทาง ตอนละประมาณ 40 นาที บน YouTube และพอดแคสต์</span>
              </li>
              <li>
                <b lang="en">Red flag / Green flag</b>
                <span className="kit-muted">ความเชื่อเรื่องสุขภาพ ที่อาจารย์แพทย์ตอบว่าจริงหรือไม่</span>
              </li>
              <li>
                <b lang="en">Shorts</b>
                <span className="kit-muted">คลิปสั้นจากทุกตอน บน TikTok, Reels และ YouTube Shorts</span>
              </li>
            </ul>
          </div>
        </div>

        {guests.length > 0 && (
          <p className="kit-guests">
            <span className="kit-muted">อาจารย์แพทย์ที่มาร่วมรายการ</span> {guests.map((g) => g.name).join(" · ")}
          </p>
        )}
      </section>

      {/* 2. Reach and audience */}
      <section className="kit-page" aria-label="ผู้ชม">
        <p className="kit-eyebrow" lang="en">
          Reach &amp; audience
        </p>
        <h2 className="kit-title">ใครดู Rounds</h2>

        {numbers.length > 0 && (
          <dl className="kit-numbers">
            {numbers.map((n) => (
              <div key={n.label}>
                <dd>{compactNumber(n.value)}</dd>
                <dt>{n.label}</dt>
              </div>
            ))}
          </dl>
        )}

        <div className="kit-two">
          <div>
            <h3 className="kit-h">กลุ่มผู้ชม</h3>
            <ul className="kit-list">
              {segments.map((s) => (
                <li key={s.key}>
                  <b>
                    {!isPlaceholder(s.stat) && <span className="kit-stat">{s.stat} </span>}
                    {s.title}
                  </b>
                  <span className="kit-muted">{s.description}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            {ages.length > 0 ? (
              <>
                <h3 className="kit-h">อายุผู้ชมบน YouTube · {audience!.days} วันล่าสุด</h3>
                <ul className="age-bars kit-ages">
                  {ages.map((a) => (
                    <li key={a.group}>
                      <span>{a.group}</span>
                      <span className="age-bar" style={{ "--w": `${a.percent}%` } as CSSProperties} />
                      <b>{percent(a.percent)}</b>
                    </li>
                  ))}
                </ul>
                <p className="kit-muted kit-small">
                  {[
                    audience!.genders.map((g) => `${genderLabel(g.gender)} ${percent(g.percent)}`).join(" · "),
                    audience!.countries
                      .slice(0, 3)
                      .map((c) => `${countryLabel(c.country)} ${percent(c.percent)}`)
                      .join(", "),
                  ]
                    .filter(Boolean)
                    .join(" — ")}
                </p>
              </>
            ) : (
              <p className="kit-muted kit-small">{settings.audienceIntro}</p>
            )}
            <h3 className="kit-h">ช่องทาง</h3>
            <ul className="kit-platforms">
              {platforms.map((p) => (
                <li key={p.name}>
                  <b>{p.name}</b> <span className="kit-muted">{p.handle}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {episodes.length > 0 && (
          <>
            <h3 className="kit-h">ตอนที่ออกแล้ว</h3>
            <ul className="kit-episodes">
              {episodes.map((ep) => (
                <li key={ep.key}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={ep.thumbnailUrl!} alt="" />
                  <span>{episodeTitle(ep)}</span>
                </li>
              ))}
            </ul>
          </>
        )}
      </section>

      {/* 3. Packages and contact */}
      <section className="kit-page" aria-label="แพ็กเกจ">
        <p className="kit-eyebrow" lang="en">
          Packages
        </p>
        <h2 className="kit-title">ร่วมงานกับ Rounds</h2>
        <p className="kit-muted">ทุกแพ็กเกจอยู่นอกเนื้อหาทางการแพทย์ การเลือกแขกรับเชิญและเนื้อหาเป็นของเราเสมอ</p>

        <ul className="kit-packages">
          {content.sponsorPackages.map((pkg) => (
            <li key={pkg.key}>
              {/* "Episode Partner · สปอนเซอร์ประจำตอน": English name, Thai name under it. */}
              <b>{pkg.title.split(" · ")[0]}</b>
              {pkg.title.includes(" · ") && <span>{pkg.title.split(" · ").slice(1).join(" · ")}</span>}
              <span className="kit-muted">{pkg.description}</span>
              {pkg.includes.length > 0 && (
                <ul>
                  {pkg.includes.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>

        <div className="kit-two kit-terms">
          <div>
            <h3 className="kit-h">วิธีที่เราทำงาน</h3>
            <ul className="kit-bullets">
              <li>แบรนด์อยู่ในช่วงที่แยกชัดจากเนื้อหาทางการแพทย์ และไม่มีส่วนในการเลือกแขกหรือคำตอบ</li>
              <li>ทุกชิ้นงานที่ได้รับการสนับสนุน เราบอกผู้ชมอย่างชัดเจน</li>
              <li>ราคาตามแพ็กเกจและระยะเวลา ติดต่อเพื่อขอใบเสนอราคา</li>
            </ul>
          </div>
          <div>
            <h3 className="kit-h">สิ่งที่เราไม่รับ</h3>
            <p className="kit-muted">
              ยา อาหารเสริม ผลิตภัณฑ์หรือบริการทางการแพทย์และความงาม และสินค้าที่อ้างสรรพคุณด้านสุขภาพ
              เพื่อให้ความรู้ในรายการเป็นกลางเสมอ
            </p>
          </div>
        </div>

        <div className="kit-contact">
          <p className="kit-eyebrow" lang="en">
            Contact
          </p>
          {email && <p className="kit-contact-email">{email}</p>}
          <p className="kit-muted">
            {site} · {content.hosts.map((h) => h.fullName ?? h.name).join(" และ ")}
          </p>
        </div>
      </section>
    </div>
  );
}
