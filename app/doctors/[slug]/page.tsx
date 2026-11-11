import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteNav } from "@/components/landing/SiteNav";
import { Footer } from "@/components/landing/Footer";
import { EpisodeCard } from "@/components/landing/EpisodesSection";
import { ArrowIcon, FlagIcon } from "@/components/landing/Icons";
import { Mark } from "@/components/landing/Logo";
import { getHomeContent } from "@/lib/content";
import { doctorEpisodes, doctorFlags, doctorPhoto, doctors } from "@/lib/doctors";
import { cleanJoin, filled } from "@/lib/placeholders";
import { watchUrl } from "@/lib/episodes";

type Props = { params: Promise<{ slug: string }> };

async function findDoctor(slug: string) {
  const content = await getHomeContent();
  const guest = doctors(content).find((g) => g.path === decodeURIComponent(slug));
  return guest ? { content, guest } : null;
}

export async function generateStaticParams() {
  const content = await getHomeContent();
  return doctors(content).map((g) => ({ slug: g.path }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const found = await findDoctor((await params).slug);
  if (!found) return {};
  const { guest } = found;
  const description = guest.bio ?? cleanJoin(guest.field, guest.affiliation);
  return {
    title: `${guest.name} — Rounds`,
    description,
    openGraph: { title: guest.name, description, locale: "th_TH", siteName: "Rounds" },
  };
}

export default async function DoctorPage({ params }: Props) {
  const found = await findDoctor((await params).slug);
  if (!found) notFound();
  const { content, guest } = found;
  const photo = doctorPhoto(content, guest);
  const episodes = doctorEpisodes(content, guest);
  const flags = doctorFlags(content, guest);
  const latest = episodes.find((ep) => ep.status === "published" && watchUrl(ep));
  const profileUrl = filled(guest.profileUrl);

  return (
    <>
      <SiteNav base="/" />
      <main id="main">
        <section className="dark doctor-hero" aria-labelledby="doctor-name">
          <div className="wrap doctor-hero-inner">
            <div className="doctor-hero-text">
              <Link href="/#doctors" className="text-link small">
                ← อาจารย์แพทย์ทั้งหมด
              </Link>
              <span className="small muted">{cleanJoin(guest.field, episodes.length > 0 ? `${episodes.length} ตอนกับ Rounds` : null)}</span>
              <h1 className="doctor-h1" id="doctor-name" lang={guest.nameLang}>
                {guest.name}
              </h1>
              {guest.nameAlt && <p className="body-lg muted">{guest.nameAlt}</p>}
              {guest.affiliation && <p className="body-lg">{guest.affiliation}</p>}
              {guest.bio && <p className="body-lg doctor-bio">{guest.bio}</p>}
              <div className="doctor-actions">
                {latest && (
                  <a href={watchUrl(latest)!} className="btn btn-light" target="_blank" rel="noopener">
                    ดูตอนของอาจารย์
                    <span className="btn-arrow">
                      <ArrowIcon />
                    </span>
                  </a>
                )}
                {profileUrl && (
                  <a href={profileUrl} className="btn btn-outline" target="_blank" rel="noopener">
                    ดูโปรไฟล์ที่โรงพยาบาล ↗
                  </a>
                )}
              </div>
            </div>
            <div className="doctor-hero-photo" data-thumbnail={!guest.photoUrl && !!photo}>
              {photo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={photo} alt={guest.name} />
              ) : (
                <span className="doctor-photo-empty" aria-hidden="true">
                  <Mark height={28} reverse />
                </span>
              )}
            </div>
          </div>
        </section>

        {episodes.length > 0 && (
          <section className="wrap section" aria-labelledby="doctor-episodes">
            <div className="section-head">
              <div>
                <h2 className="h2" lang="en" id="doctor-episodes">
                  Episodes
                </h2>
                <p className="h2-th muted">ตอนที่อาจารย์มาคุยกับเรา</p>
              </div>
            </div>
            <div className="ep-grid">
              {episodes.map((ep) => (
                <EpisodeCard key={ep.key} ep={ep} />
              ))}
            </div>
          </section>
        )}

        {flags.length > 0 && (
          <section className="navy" aria-labelledby="doctor-flags">
            <div className="wrap section">
              <div className="section-head">
                <div>
                  <h2 className="h2" lang="en" id="doctor-flags">
                    Red flags &amp; green flags
                  </h2>
                  <p className="h2-th muted">ความเชื่อที่อาจารย์ตอบให้</p>
                </div>
                <Link href="/#flags" className="text-link">
                  ลองทายเองก่อน <ArrowIcon />
                </Link>
              </div>
              <ul className="verdict-list">
                {flags.map((m) => (
                  <li key={m.key} data-verdict={m.verdict}>
                    <span className="verdict-tag">
                      <FlagIcon solid size={18} />
                      <span lang="en">{m.verdict === "red" ? "Red flag" : "Green flag"}</span>
                    </span>
                    <p className="title">“{m.claim}”</p>
                    <p className="body">{m.answer}</p>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}
      </main>
      <Footer settings={content.settings} />
    </>
  );
}
