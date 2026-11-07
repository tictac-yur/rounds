import type { HomeContent } from "@/convex/contentTypes";
import { filled } from "@/lib/placeholders";
import { SectionHeader } from "./SectionHeader";

export function SeriesSection({ series }: { series: HomeContent["series"] }) {
  return (
    <section className="wrap section" aria-labelledby="series-title">
      <SectionHeader id="series-title" label="04 · Series" en="One channel, three series" th="หนึ่งช่อง สามแบบให้เลือกดู" />
      <div className="series-grid">
        {series.map((s, i) => {
          // A series without a name yet goes by its format ("วล็อก").
          const name = filled(s.name);
          return (
            <article key={s.key} className="series-card">
              {/* The logo's three discs, with this series' disc lit. */}
              <div className="discs" aria-hidden="true">
                {[0, 1, 2].map((d) => (
                  <i key={d} data-on={d === i % 3} />
                ))}
              </div>
              {name && <span className="small muted">{s.kicker}</span>}
              <h3 className="series-name">{name ?? s.kicker}</h3>
              <p className="body muted" style={{ fontFamily: "var(--font-thai)" }}>
                {s.description}
              </p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
