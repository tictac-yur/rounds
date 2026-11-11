import type { EpisodeView, HomeContent } from "@/convex/contentTypes";
import { watchUrl } from "@/lib/episodes";
import { ArrowIcon } from "./Icons";

// The hosts with a real photo of them: their own portraits once uploaded,
// until then the thumbnail of the episode that introduces them.
export function HostsSection({ hosts, intro }: { hosts: HomeContent["hosts"]; intro: EpisodeView | null }) {
  const portraits = hosts.filter((h) => h.photoUrl);
  const introUrl = intro ? watchUrl(intro) : null;
  return (
    <section id="hosts" className="wrap section" aria-labelledby="hosts-title">
      <div className="hosts-layout">
        <div className="hosts-photo" data-split={portraits.length === hosts.length && hosts.length > 1}>
          {portraits.length === hosts.length && hosts.length > 0
            ? hosts.map((h) => (
                <figure key={h.key} className="host-portrait">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={h.photoUrl!} alt={h.name} loading="lazy" />
                  <figcaption>{h.name}</figcaption>
                </figure>
              ))
            : intro?.thumbnailUrl && (
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
                <span className="host-name">{h.name}</span>
                <span className="small muted">{h.role}</span>
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
