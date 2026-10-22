const SERIES = [
  {
    borderColor: "#0a0f14",
    kicker: "Interview · 30–50 min",
    title: "The Consult",
    desc: "Specialists on what they actually do, the hard truths, advice for students, and a myth-buster to close.",
  },
  {
    borderColor: "#1b3a5f",
    kicker: "Vlog",
    title: "[SERIES NAME]",
    desc: "Daily life, training and milestones, following Titi and Pup through medical school as it happens.",
  },
  {
    borderColor: "#9ba6b2",
    kicker: "Shadow",
    title: "A Day With a Doctor",
    desc: "A full day beside a specialist, to see what the job looks like on an ordinary shift.",
  },
];

export function SeriesSection() {
  return (
    <section style={{ background: "#ffffff", borderTop: "1px solid #b6bec6", borderBottom: "1px solid #b6bec6" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "88px 24px", display: "flex", flexDirection: "column", gap: 32 }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 20 }}>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 13, fontWeight: 500, letterSpacing: "0.2em", color: "#5d666f" }}>
            04
          </span>
          <h2 style={{ margin: 0, fontSize: 40, lineHeight: "44px", fontWeight: 600, letterSpacing: "-0.02em" }}>
            One channel, three series
          </h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}>
          {SERIES.map((s) => (
            <div
              key={s.title}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 14,
                paddingTop: 20,
                borderTop: `2px solid ${s.borderColor}`,
              }}
            >
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 500, letterSpacing: "0.26em", textTransform: "uppercase", color: "#5d666f" }}>
                {s.kicker}
              </div>
              <h3 style={{ margin: 0, fontSize: 26, lineHeight: "30px", fontWeight: 600 }}>{s.title}</h3>
              <p style={{ margin: 0, fontSize: 16, lineHeight: "25px" }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
