import type { HomeContent } from "@/convex/contentTypes";
import { doctorEpisodes, doctorPhoto, doctors } from "@/lib/doctors";
import { cleanJoin } from "@/lib/placeholders";
import { ArrowIcon } from "./Icons";
import { Mark } from "./Logo";

export function DoctorsSection({ content }: { content: HomeContent }) {
  const list = doctors(content);
  if (list.length === 0) return null;
  return (
    <section id="doctors" className="wrap section" aria-labelledby="doctors-title">
      <div className="section-head">
        <div>
          <h2 className="h2" lang="en" id="doctors-title">
            The doctors
          </h2>
          <p className="h2-th muted">อาจารย์แพทย์ที่มานั่งตอบคำถามกับเรา</p>
        </div>
      </div>

      <div className="doctor-grid" data-count={Math.min(list.length, 3)}>
        {list.map((g) => {
          const photo = doctorPhoto(content, g);
          const episodes = doctorEpisodes(content, g);
          return (
            <a key={g.key} href={`/doctors/${g.path}`} className="doctor-card">
              <div className="doctor-photo">
                {photo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={photo} alt={g.name} loading="lazy" />
                ) : (
                  <span className="doctor-photo-empty" aria-hidden="true">
                    <Mark height={22} reverse />
                  </span>
                )}
              </div>
              <div className="doctor-text">
                <span className="small muted">{cleanJoin(g.field, episodes.length > 0 ? `${episodes.length} ตอน` : null)}</span>
                <h3 className="doctor-name" lang={g.nameLang}>
                  {g.name}
                </h3>
                {g.affiliation && <p className="small muted">{g.affiliation}</p>}
                <span className="text-link doctor-more">
                  ดูโปรไฟล์ <ArrowIcon />
                </span>
              </div>
            </a>
          );
        })}
      </div>
    </section>
  );
}
