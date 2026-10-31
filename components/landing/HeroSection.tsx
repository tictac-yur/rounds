import type { HomeContent } from "@/convex/contentTypes";
import { LogoMark, Wordmark } from "./Logo";
import { DecorCircles, PlayIcon } from "./DecorCircles";

function Nav() {
  return (
    <header style={{ position: "relative" }}>
      <nav
        aria-label="เมนูหลัก"
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "0 24px",
          height: 80,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 24,
        }}
      >
        <a
          href="#top"
          aria-label="Rounds หน้าแรก"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            textDecoration: "none",
            color: "#ffffff",
          }}
        >
          <LogoMark />
          <Wordmark />
        </a>
        <div
          className="nav-links"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 32,
            fontSize: 15,
            fontWeight: 500,
          }}
        >
          <a href="#episodes" style={{ color: "#ffffff", textDecoration: "none" }}>
            ทุกตอน
          </a>
          <a href="#flags" style={{ color: "#ffffff", textDecoration: "none" }}>
            Red / Green flag
          </a>
          <a href="#partner" style={{ color: "#ffffff", textDecoration: "none" }}>
            ร่วมงานกับเรา
          </a>
          <a href="#about" style={{ color: "#ffffff", textDecoration: "none" }}>
            พิธีกร
          </a>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <a
            href="#partner"
            className="nav-cta"
            style={{
              display: "inline-flex",
              alignItems: "center",
              height: 44,
              padding: "0 20px",
              background: "#ffffff",
              color: "#0a0f14",
              textDecoration: "none",
              fontWeight: 600,
              fontSize: 15,
            }}
          >
            ติดต่อสปอนเซอร์
          </a>
        </div>
      </nav>
    </header>
  );
}

function StatsStrip({ stats }: { stats: HomeContent["settings"]["stats"] }) {
  return (
    <div style={{ position: "relative", borderTop: "1px solid #26313d" }}>
      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "0 24px",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        }}
      >
        {stats.map((stat, i) => (
          <div
            key={stat.label}
            style={{
              padding: i === 0 ? "28px 24px 28px 0" : "28px 24px",
              borderLeft: i === 0 ? undefined : "1px solid #26313d",
              display: "flex",
              flexDirection: "column",
              gap: 6,
            }}
          >
            <div style={{ fontSize: 36, lineHeight: "40px", fontWeight: 600, letterSpacing: "-0.02em" }}>
              {stat.value}
            </div>
            <div style={{ fontSize: 14, lineHeight: "20px", color: "#a8bacd" }}>{stat.label}</div>
          </div>
        ))}
        <div style={{ padding: "28px 24px", borderLeft: "1px solid #26313d", display: "flex", flexDirection: "column", gap: 6 }}>
          <div style={{ fontSize: 18, lineHeight: 1.4, fontWeight: 600, paddingTop: 8 }}>
            คณะแพทยศาสตร์ มหาวิทยาลัยธรรมศาสตร์
          </div>
          <div style={{ fontSize: 14, lineHeight: "20px", color: "#a8bacd" }}>อาจารย์แพทย์ที่มาร่วมรายการ</div>
        </div>
      </div>
    </div>
  );
}

export function HeroSection({ settings }: { settings: HomeContent["settings"] }) {
  return (
    <section id="top" style={{ position: "relative", overflow: "hidden", background: "#0a0f14", color: "#ffffff" }}>
      <DecorCircles corner="top-right" />

      <Nav />

      <div
        style={{
          position: "relative",
          maxWidth: 1280,
          margin: "0 auto",
          padding: "48px 24px 72px",
          display: "flex",
          flexWrap: "wrap",
          alignItems: "flex-end",
          gap: 56,
        }}
      >
        <div style={{ flex: "1 1 520px", minWidth: 0, display: "flex", flexDirection: "column", gap: 28, paddingBottom: 8 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              fontSize: 15,
              fontWeight: 500,
              color: "#a8bacd",
            }}
          >
            <span style={{ display: "inline-block", width: 8, height: 8, borderRadius: "50%", background: "#ffffff" }} />
            {settings.heroKicker}
          </div>

          <h1
            style={{
              margin: 0,
              fontSize: "clamp(44px, 6.4vw, 88px)",
              lineHeight: 1.15,
              fontWeight: 600,
              letterSpacing: "-0.01em",
              whiteSpace: "pre-line",
            }}
          >
            {settings.heroHeadline}
          </h1>

          <p style={{ margin: 0, fontSize: 20, lineHeight: 1.7, color: "#e6ebf0", maxWidth: 580 }}>
            {settings.heroIntroTh}
          </p>

          <p lang="en" style={{ margin: 0, fontSize: 15, lineHeight: "24px", color: "#a8bacd", maxWidth: 560 }}>
            {settings.heroIntro}
          </p>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, paddingTop: 4 }}>
            <a
              href="#latest"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 12,
                height: 56,
                padding: "0 28px",
                background: "#ffffff",
                color: "#0a0f14",
                textDecoration: "none",
                fontWeight: 600,
                fontSize: 16,
              }}
            >
              <PlayIcon />
              ดูตอนล่าสุด
            </a>
            <a
              href="#partner"
              style={{
                display: "inline-flex",
                alignItems: "center",
                height: 56,
                padding: "0 28px",
                border: "1px solid #ffffff",
                color: "#ffffff",
                textDecoration: "none",
                fontWeight: 600,
                fontSize: 16,
              }}
            >
              ร่วมงานกับ Rounds
            </a>
          </div>
        </div>

        <figure style={{ flex: "1 1 440px", minWidth: 0, maxWidth: 560, margin: "0 20px 0 0", position: "relative" }}>
          <div
            aria-hidden="true"
            style={{ position: "absolute", top: 20, left: 20, right: -20, bottom: -20, background: "#2b5c91" }}
          />
          {settings.heroImageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={settings.heroImageUrl}
              alt={settings.heroImageCaption}
              style={{ position: "relative", display: "block", width: "100%", aspectRatio: "1 / 1", objectFit: "cover" }}
            />
          ) : (
          <div
            style={{
              position: "relative",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              aspectRatio: "1 / 1",
              background: "#16283d",
              color: "#a8bacd",
              fontFamily: "var(--font-mono)",
              fontSize: 12,
              letterSpacing: "0.12em",
              textAlign: "center",
              padding: 24,
            }}
          >
            [PHOTO — TITI &amp; PUP ON SET]
          </div>
          )}
          <figcaption
            style={{
              position: "absolute",
              left: 0,
              bottom: 0,
              transform: "translateY(50%)",
              background: "#ffffff",
              color: "#0a0f14",
              padding: "14px 18px",
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                fontWeight: 500,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: "#5d666f",
              }}
            >
              On set · The Consult
            </span>
            <span style={{ fontSize: 17, fontWeight: 600 }}>{settings.heroImageCaption}</span>
          </figcaption>
        </figure>
      </div>

      <StatsStrip stats={settings.stats} />
    </section>
  );
}
