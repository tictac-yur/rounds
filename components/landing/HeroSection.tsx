import type { HomeContent } from "@/convex/contentTypes";
import { isPlaceholder } from "@/lib/placeholders";
import { Lockup } from "./Logo";
import { DecorCircles, PlayIcon } from "./DecorCircles";

const NAV_LINKS = [
  { href: "#episodes", label: "Episodes" },
  { href: "#flags", label: "Red / Green flag" },
  { href: "#about", label: "Hosts" },
  { href: "#partner", label: "Partner" },
];

function Nav() {
  return (
    <header style={{ position: "relative", zIndex: 10 }}>
      <nav aria-label="เมนูหลัก" className="container site-nav">
        <a href="#top" aria-label="Rounds หน้าแรก" style={{ display: "flex", alignItems: "center", minHeight: 44 }}>
          <Lockup height={22} />
        </a>
        <div className="nav-links">
          {NAV_LINKS.map((link) => (
            <a key={link.href} href={link.href}>
              {link.label}
            </a>
          ))}
        </div>
        <a href="#partner" className="btn btn-light nav-cta" style={{ minHeight: 44, fontSize: 15 }}>
          Partner with us
        </a>
        {/* Phones: a disclosure menu, no JavaScript needed. */}
        <details className="nav-menu">
          <summary>
            Menu <span aria-hidden="true">☰</span>
          </summary>
          <div className="nav-menu-panel">
            {NAV_LINKS.map((link) => (
              <a key={link.href} href={link.href}>
                {link.label}
              </a>
            ))}
            <a href="#partner" className="nav-menu-cta">
              Partner with us
            </a>
          </div>
        </details>
      </nav>
    </header>
  );
}

function StatsStrip({ stats }: { stats: HomeContent["settings"]["stats"] }) {
  return (
    <div style={{ position: "relative", borderTop: "1px solid var(--line-dark)" }}>
      <div className="container stat-strip">
        {stats.map((stat) => (
          <div key={stat.label} style={{ display: "flex", flexDirection: "column", gap: "var(--space-1)" }}>
            <div style={{ fontSize: 36, lineHeight: "44px", fontWeight: 600, letterSpacing: "-0.02em" }}>{stat.value}</div>
            <div className="ds-small muted">{stat.label}</div>
          </div>
        ))}
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-1)", justifyContent: "center" }}>
          <div style={{ fontSize: 18, lineHeight: "28px", fontWeight: 600 }}>คณะแพทยศาสตร์ มหาวิทยาลัยธรรมศาสตร์</div>
          <div className="ds-small muted">อาจารย์แพทย์ที่มาร่วมรายการ</div>
        </div>
      </div>
    </div>
  );
}

export function HeroSection({ settings }: { settings: HomeContent["settings"] }) {
  // Hide placeholder numbers ("[XX]K") until real ones are entered in the admin.
  const stats = settings.stats.filter((stat) => !isPlaceholder(stat.value));
  return (
    <section id="top" className="on-dark" style={{ position: "relative", overflow: "hidden" }}>
      <DecorCircles corner="top-right" />

      <Nav />

      <div
        className="container"
        style={{
          position: "relative",
          paddingTop: "var(--space-12)",
          paddingBottom: "var(--space-16)",
          display: "flex",
          flexWrap: "wrap",
          alignItems: "flex-end",
          gap: "var(--space-12)",
        }}
      >
        <div style={{ flex: "1 1 520px", minWidth: 0, display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
          <div className="ds-small muted" style={{ display: "flex", alignItems: "center", gap: "var(--space-3)", fontSize: 15 }}>
            <span aria-hidden="true" style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--white)" }} />
            {settings.heroKicker}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
            <h1 className="ds-display" lang="en" style={{ lineHeight: 1.05, letterSpacing: "-0.03em" }}>
              {settings.heroHeadline.split("\n").map((line) => (
                <span key={line}>{line}</span>
              ))}
            </h1>
            {settings.heroHeadlineTh && (
              <p style={{ margin: 0, fontSize: "clamp(22px, 2.6vw, 32px)", lineHeight: 1.4, fontWeight: 600 }}>
                {settings.heroHeadlineTh}
              </p>
            )}
          </div>

          <p className="ds-body-lg" style={{ fontSize: 20, lineHeight: "34px", color: "#e6ebf0", maxWidth: 580 }}>
            {settings.heroIntroTh}
          </p>

          <p lang="en" className="ds-small muted" style={{ fontSize: 15, lineHeight: "24px", maxWidth: 560 }}>
            {settings.heroIntro}
          </p>

          <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-3)", paddingTop: "var(--space-2)" }}>
            <a href="#latest" className="btn btn-light">
              <PlayIcon />
              ดูตอนล่าสุด
            </a>
            <a href="#partner" className="btn btn-outline-light">
              ร่วมงานกับ Rounds
            </a>
          </div>
        </div>

        {settings.heroImageUrl && (
          <figure style={{ flex: "1 1 400px", minWidth: 0, maxWidth: 560, margin: 0, position: "relative" }}>
            <div aria-hidden="true" style={{ position: "absolute", top: 20, left: 20, right: -20, bottom: -20, background: "var(--navy-light)" }} />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={settings.heroImageUrl}
              alt={settings.heroImageCaption}
              style={{ position: "relative", display: "block", width: "100%", aspectRatio: "1 / 1", objectFit: "cover" }}
            />
            <figcaption
              style={{
                position: "absolute",
                left: 0,
                bottom: 0,
                transform: "translateY(50%)",
                background: "var(--white)",
                color: "var(--ink)",
                padding: "var(--space-3) var(--space-4)",
                display: "flex",
                flexDirection: "column",
                gap: 2,
              }}
            >
              <span className="ds-label muted">On set · The Consult</span>
              <span style={{ fontSize: 17, fontWeight: 600 }}>{settings.heroImageCaption}</span>
            </figcaption>
          </figure>
        )}
      </div>

      {stats.length > 0 && <StatsStrip stats={stats} />}
    </section>
  );
}
