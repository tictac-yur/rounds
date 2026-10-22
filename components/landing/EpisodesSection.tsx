const FILTERS = ["All", "Emergency", "Ophthalmology", "ENT", "OB-GYN", "AI in Medicine"];

function EpisodeThumb({
  circles,
  label,
  badge,
}: {
  circles: { cx: number; cy: number; r: number; fill: string }[];
  label: React.ReactNode;
  badge?: string;
}) {
  return (
    <div style={{ position: "relative", aspectRatio: "16 / 9", background: "#0a0f14", overflow: "hidden" }}>
      <svg
        viewBox="0 0 320 180"
        preserveAspectRatio="xMidYMid slice"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
        aria-hidden="true"
      >
        {circles.map((c, i) => (
          <circle key={i} cx={c.cx} cy={c.cy} r={c.r} fill={c.fill} />
        ))}
      </svg>
      <div
        style={{
          position: "absolute",
          left: 18,
          top: 16,
          fontFamily: "var(--font-mono)",
          fontSize: 10,
          letterSpacing: "0.26em",
          textTransform: "uppercase",
          color: "#a8bacd",
        }}
      >
        The Consult
      </div>
      <div style={{ position: "absolute", left: 18, bottom: 16, color: "#ffffff", fontSize: 24, lineHeight: 1, fontWeight: 600 }}>
        {label}
      </div>
      {badge && (
        <div
          style={{
            position: "absolute",
            right: 14,
            top: 14,
            background: "#ffffff",
            color: "#0a0f14",
            fontFamily: "var(--font-mono)",
            fontSize: 10,
            fontWeight: 500,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            padding: "5px 8px",
          }}
        >
          {badge}
        </div>
      )}
    </div>
  );
}

const EPISODES = [
  {
    href: "#latest",
    circles: [
      { cx: 200, cy: 160, r: 80, fill: "#16283d" },
      { cx: 270, cy: 160, r: 80, fill: "#1b3a5f" },
      { cx: 340, cy: 160, r: 80, fill: "#2b5c91" },
    ],
    thumbLabel: (
      <>
        Emergency
        <br />
        Medicine
      </>
    ),
    meta: "[DATE] · [RUNTIME]",
    title: "The ER isn't first come, first served",
    sub: "[Emergency Medicine physician — name pending]",
  },
  {
    href: "#episodes",
    circles: [
      { cx: 190, cy: 90, r: 52, fill: "#16283d" },
      { cx: 240, cy: 90, r: 52, fill: "#1b3a5f" },
      { cx: 290, cy: 90, r: 52, fill: "#2b5c91" },
    ],
    thumbLabel: (
      <>
        Ophthal-
        <br />
        mology
      </>
    ),
    meta: "[DATE] · [RUNTIME]",
    title: "Screens, exams and your eyes",
    sub: "Dr. Pakornkit Phrueksaudomchai",
  },
  {
    href: "#episodes",
    circles: [
      { cx: 250, cy: 110, r: 72, fill: "#16283d" },
      { cx: 318, cy: 110, r: 72, fill: "#1b3a5f" },
      { cx: 386, cy: 110, r: 72, fill: "#2b5c91" },
    ],
    thumbLabel: "ENT",
    badge: "Coming soon",
    meta: "Two-part episode",
    title: "What an ENT doctor actually does",
    sub: "Asst. Prof. Dr. Dhave Setabutr",
  },
  {
    href: "#episodes",
    circles: [
      { cx: 200, cy: 30, r: 62, fill: "#16283d" },
      { cx: 250, cy: 90, r: 62, fill: "#1b3a5f" },
      { cx: 300, cy: 150, r: 62, fill: "#2b5c91" },
    ],
    thumbLabel: "OB-GYN",
    badge: "Coming soon",
    meta: "With an IVF deep-dive",
    title: "[EPISODE TITLE]",
    sub: "อ.พญ.นิพัทธา",
    subThai: true,
  },
];

export function EpisodesSection() {
  return (
    <section id="episodes" style={{ maxWidth: 1280, margin: "0 auto", padding: "24px 24px 96px", display: "flex", flexDirection: "column", gap: 28 }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 20 }}>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 13, fontWeight: 500, letterSpacing: "0.2em", color: "#5d666f" }}>
          02
        </span>
        <h2 style={{ margin: 0, fontSize: 40, lineHeight: "44px", fontWeight: 600, letterSpacing: "-0.02em" }}>
          The Consult
        </h2>
      </div>

      <div role="group" aria-label="Filter by specialty" style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {FILTERS.map((filter, i) => (
          <button
            key={filter}
            type="button"
            aria-pressed={i === 0}
            style={{
              height: 44,
              padding: "0 18px",
              border: i === 0 ? "1px solid #0a0f14" : "1px solid #b6bec6",
              background: i === 0 ? "#0a0f14" : "#ffffff",
              color: i === 0 ? "#ffffff" : "#0a0f14",
              font: "inherit",
              fontSize: 14,
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            {filter}
          </button>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 24 }}>
        {EPISODES.map((ep) => (
          <a
            key={ep.title}
            href={ep.href}
            style={{ display: "flex", flexDirection: "column", gap: 16, color: "#0a0f14", textDecoration: "none" }}
          >
            <EpisodeThumb circles={ep.circles} label={ep.thumbLabel} badge={ep.badge} />
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase", color: "#5d666f" }}>
                {ep.meta}
              </div>
              <div style={{ fontSize: 20, lineHeight: "26px", fontWeight: 600 }}>{ep.title}</div>
              <div
                lang={ep.subThai ? "th" : undefined}
                style={{
                  fontFamily: ep.subThai ? "var(--font-thai)" : undefined,
                  fontSize: 14,
                  lineHeight: "22px",
                  color: "#5d666f",
                }}
              >
                {ep.sub}
              </div>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
