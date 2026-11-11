import type { HomeContent } from "@/convex/contentTypes";
import { filled } from "@/lib/placeholders";

// Crops of the logo's three discs, one per cover (as on the podcast covers).
const COVERS = [
  [
    { cx: 300, cy: 330, r: 150, fill: "#16283d" },
    { cx: 420, cy: 270, r: 150, fill: "#1b3a5f" },
    { cx: 540, cy: 210, r: 150, fill: "#2b5c91" },
  ],
  [
    { cx: 140, cy: -10, r: 130, fill: "#16283d" },
    { cx: 260, cy: -10, r: 130, fill: "#1b3a5f" },
    { cx: 380, cy: -10, r: 130, fill: "#2b5c91" },
  ],
  [
    { cx: 420, cy: 120, r: 110, fill: "#2b5c91" },
    { cx: 420, cy: 240, r: 110, fill: "#1b3a5f" },
    { cx: 420, cy: 360, r: 110, fill: "#16283d" },
  ],
];

export function SeriesSection({ series }: { series: HomeContent["series"] }) {
  return (
    <section className="wrap section" aria-labelledby="series-title">
      <div className="section-head">
        <div>
          <h2 className="h2" lang="en" id="series-title">
            One channel, three shows
          </h2>
          <p className="h2-th muted">สัมภาษณ์หมอ ชีวิตนักศึกษาแพทย์ และตามติดหมอหนึ่งวัน</p>
        </div>
      </div>
      <div className="series-grid">
        {series.map((s, i) => {
          // A series without a name yet goes by its format ("วล็อก").
          const name = filled(s.name) ?? s.kicker;
          return (
            <article key={s.key} className="series-item">
              <div className="series-cover" aria-hidden="true">
                <svg viewBox="0 0 400 400" preserveAspectRatio="xMidYMid slice">
                  {COVERS[i % COVERS.length].map((c, j) => (
                    <circle key={j} {...c} />
                  ))}
                </svg>
                <span className="series-cover-label">
                  Rounds
                  <i />
                </span>
                <span className="series-cover-title">{name}</span>
              </div>
              <h3 className="title">
                {name}
                {filled(s.name) && <span className="small muted"> · {s.kicker}</span>}
              </h3>
              <p className="body muted">{s.description}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
