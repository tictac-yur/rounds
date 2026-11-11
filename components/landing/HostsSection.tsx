import Link from "next/link";
import type { EpisodeView, HomeContent } from "@/convex/contentTypes";
import { watchUrl } from "@/lib/episodes";
import { ArrowIcon } from "./Icons";

// The intro episode's photo of both hosts, with each host linking to their
// own page (and portrait).
export function HostsSection({ hosts, intro }: { hosts: HomeContent["hosts"]; intro: EpisodeView | null }) {
  const introUrl = intro ? watchUrl(intro) : null;
  return (
    <section id="hosts" className="wrap section" aria-labelledby="hosts-title">
      <div className="hosts-layout">
        <div className="hosts-photo">
          {intro?.thumbnailUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={intro.thumbnailUrl} alt={hosts.map((h) => h.name).join(" และ ")} loading="lazy" />
          )}
        </div>

        <div className="hosts-text">
          <h2 className="h2" lang="en" id="hosts-title">
            Meet the hosts
          </h2>
          <p className="h2-th muted">นักศึกษาแพทย์สองคน ที่ถามคำถามแทนคุณ</p>
          <ul className="host-list">
            {hosts.map((h) => (
              <li key={h.key}>
                <Link href={`/hosts/${h.path}`}>
                  <span>
                    <span className="host-name">{h.name}</span>
                    <span className="small muted">{h.role}</span>
                  </span>
                  <span className="btn-arrow" aria-hidden="true">
                    <ArrowIcon />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          {introUrl && (
            <a href={introUrl} className="text-link" target="_blank" rel="noopener">
              ดูตอนที่เราแนะนำตัว <ArrowIcon />
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
