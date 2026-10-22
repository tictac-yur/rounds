import { LogoMark, Wordmark } from "./Logo";
import { DecorCircles, PlayIcon } from "./DecorCircles";

function Nav() {
  return (
    <header style={{ position: "relative" }}>
      <nav
        aria-label="Main"
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
          aria-label="Rounds home"
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
            Episodes
          </a>
          <a href="#audience" style={{ color: "#ffffff", textDecoration: "none" }}>
            Audience
          </a>
          <a href="#partner" style={{ color: "#ffffff", textDecoration: "none" }}>
            Partner
          </a>
          <a href="#about" style={{ color: "#ffffff", textDecoration: "none" }}>
            About
          </a>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            role="group"
            aria-label="Language"
            style={{
              display: "flex",
              border: "1px solid #5d666f",
              fontFamily: "var(--font-mono)",
              fontSize: 12,
              letterSpacing: "0.1em",
            }}
          >
            <button
              type="button"
              aria-pressed="true"
              style={{
                border: 0,
                background: "#ffffff",
                color: "#0a0f14",
                padding: "0 12px",
                height: 44,
                font: "inherit",
                cursor: "pointer",
              }}
            >
              EN
            </button>
            <button
              type="button"
              aria-pressed="false"
              style={{
                border: 0,
                background: "transparent",
                color: "#ffffff",
                padding: "0 12px",
                height: 44,
                font: "inherit",
                cursor: "pointer",
              }}
            >
              TH
            </button>
          </div>
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
            Partner with us
          </a>
        </div>
      </nav>
    </header>
  );
}

const STATS = [
  { value: "[XX]K", label: "Followers, all platforms" },
  { value: "[XX]K", label: "Monthly views" },
  { value: "TH / EN", label: "Bilingual, every episode" },
];

function StatsStrip() {
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
        {STATS.map((stat, i) => (
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
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "#a8bacd",
              }}
            >
              {stat.label}
            </div>
          </div>
        ))}
        <div style={{ padding: "28px 24px", borderLeft: "1px solid #26313d", display: "flex", flexDirection: "column", gap: 6 }}>
          <div style={{ fontSize: 18, lineHeight: "24px", fontWeight: 600, paddingTop: 8 }}>
            Faculty of Medicine, Thammasat University
          </div>
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "#a8bacd",
            }}
          >
            Where our guests teach
          </div>
        </div>
      </div>
    </div>
  );
}

export function HeroSection() {
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
              fontFamily: "var(--font-mono)",
              fontSize: 12,
              fontWeight: 500,
              letterSpacing: "0.26em",
              textTransform: "uppercase",
              color: "#a8bacd",
            }}
          >
            <span style={{ display: "inline-block", width: 8, height: 8, borderRadius: "50%", background: "#ffffff" }} />
            New episode every other week
          </div>

          <h1
            style={{
              margin: 0,
              fontSize: "clamp(48px, 7vw, 96px)",
              lineHeight: 0.95,
              fontWeight: 600,
              letterSpacing: "-0.03em",
            }}
          >
            Medical school,
            <br />
            as it happens.
          </h1>

          <p style={{ margin: 0, fontSize: 20, lineHeight: "31px", color: "#e6ebf0", maxWidth: 560 }}>
            Titi and Pup are first-year medical students at Thammasat. They document med
            school in real time, and sit down with the specialists who teach it.
          </p>

          <p
            lang="th"
            style={{
              margin: 0,
              fontFamily: "var(--font-thai)",
              fontSize: 16,
              lineHeight: "26px",
              color: "#a8bacd",
              maxWidth: 560,
            }}
          >
            ติติและปั๊บเป็นนักศึกษาแพทย์ปีที่ 1 ที่ธรรมศาสตร์ พวกเขาบันทึกชีวิตช่วงเรียนแพทย์แบบเรียลไทม์
            และพูดคุยกับอาจารย์แพทย์เฉพาะทางที่สอนพวกเขา
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
              Watch the latest episode
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
              Partner with Rounds
            </a>
          </div>
        </div>

        <figure style={{ flex: "1 1 440px", minWidth: 0, maxWidth: 560, margin: "0 20px 0 0", position: "relative" }}>
          <div
            aria-hidden="true"
            style={{ position: "absolute", top: 20, left: 20, right: -20, bottom: -20, background: "#2b5c91" }}
          />
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
            <span style={{ fontSize: 17, fontWeight: 600 }}>Titi &amp; Pup, with a guest</span>
          </figcaption>
        </figure>
      </div>

      <StatsStrip />
    </section>
  );
}
