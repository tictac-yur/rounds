import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteNav } from "@/components/landing/SiteNav";
import { Footer } from "@/components/landing/Footer";
import { EpisodeCard } from "@/components/landing/EpisodesSection";
import { ArrowIcon } from "@/components/landing/Icons";
import { Mark } from "@/components/landing/Logo";
import { getHomeContent } from "@/lib/content";
import { watchUrl } from "@/lib/episodes";

type Props = { params: Promise<{ slug: string }> };

async function findHost(slug: string) {
  const content = await getHomeContent();
  const host = content.hosts.find((h) => h.path === decodeURIComponent(slug));
  return host ? { content, host } : null;
}

export async function generateStaticParams() {
  const content = await getHomeContent();
  return content.hosts.map((h) => ({ slug: h.path }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const found = await findHost((await params).slug);
  if (!found) return {};
  const { host } = found;
  const description = host.bio ?? host.role;
  return {
    title: `${host.name}${host.fullName ? ` (${host.fullName})` : ""} — Rounds`,
    description,
    openGraph: { title: host.name, description, locale: "th_TH", siteName: "Rounds" },
  };
}

export default async function HostPage({ params }: Props) {
  const found = await findHost((await params).slug);
  if (!found) notFound();
  const { content, host } = found;
  const others = content.hosts.filter((h) => h.key !== host.key);
  const episodes = content.episodes.filter((ep) => ep.status === "published").slice(0, 3);
  const latest = content.latest && watchUrl(content.latest) ? content.latest : null;

  return (
    <>
      <SiteNav base="/" />
      <main id="main">
        <section className="dark doctor-hero" aria-labelledby="host-name">
          <div className="wrap doctor-hero-inner">
            <div className="doctor-hero-text">
              <Link href="/#hosts" className="text-link small">
                ← Meet the hosts
              </Link>
              <span className="small muted">{host.role}</span>
              <h1 className="doctor-h1" id="host-name">
                {host.name}
              </h1>
              {host.fullName && <p className="body-lg">{host.fullName}</p>}
              {host.fullNameAlt && (
                <p className="body-lg muted" lang="en">
                  {host.fullNameAlt}
                </p>
              )}
              {host.bio && <p className="body-lg doctor-bio">{host.bio}</p>}
              <div className="doctor-actions">
                {latest && (
                  <a href={watchUrl(latest)!} className="btn btn-light" target="_blank" rel="noopener">
                    ดูตอนล่าสุด
                    <span className="btn-arrow">
                      <ArrowIcon />
                    </span>
                  </a>
                )}
                {others.map((other) => (
                  <Link key={other.key} href={`/hosts/${other.path}`} className="btn btn-outline">
                    รู้จัก{other.name}
                  </Link>
                ))}
              </div>
            </div>
            <div className="doctor-hero-photo" data-portrait="true">
              {host.photoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={host.photoUrl} alt={host.name} />
              ) : (
                <span className="doctor-photo-empty" aria-hidden="true">
                  <Mark height={28} reverse />
                </span>
              )}
            </div>
          </div>
        </section>

        {episodes.length > 0 && (
          <section className="wrap section" aria-labelledby="host-episodes">
            <div className="section-head">
              <div>
                <h2 className="h2" lang="en" id="host-episodes">
                  Latest episodes
                </h2>
                <p className="h2-th muted">ตอนล่าสุดของ Rounds</p>
              </div>
              <Link href="/#episodes" className="text-link">
                ดูทุกตอน <ArrowIcon />
              </Link>
            </div>
            <div className="ep-grid">
              {episodes.map((ep) => (
                <EpisodeCard key={ep.key} ep={ep} />
              ))}
            </div>
          </section>
        )}
      </main>
      <Footer settings={content.settings} />
    </>
  );
}
