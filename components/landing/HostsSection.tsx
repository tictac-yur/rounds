import type { HomeContent } from "@/convex/contentTypes";
import { SectionHeader } from "./SectionHeader";

const DISC_SETS = [
  ["#16283d", "#1b3a5f", "#2b5c91"],
  ["#2b5c91", "#1b3a5f", "#16283d"],
];

export function HostsSection({ hosts }: { hosts: HomeContent["hosts"] }) {
  return (
    <section id="hosts" className="wrap section" style={{ paddingTop: 0 }} aria-labelledby="hosts-title">
      <SectionHeader id="hosts-title" label="05 · Hosts" en="Meet the hosts" th="นักศึกษาแพทย์สองคนที่ถามแทนคุณ" />
      <div className="hosts-grid">
        {hosts.map((host, i) => {
          const [a, b, c] = DISC_SETS[i % DISC_SETS.length];
          return (
            <article key={host.key} className="host-card">
              <div className="host-photo">
                {host.photoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={host.photoUrl} alt={host.name} />
                ) : (
                  // Until a photo is uploaded: the host's initial over the logo's discs.
                  <>
                    <svg className="host-initial-discs" viewBox="0 0 400 500" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
                      <circle cx={i % 2 ? 40 : 360} cy={70} r={170} fill={a} />
                      <circle cx={i % 2 ? 120 : 280} cy={430} r={160} fill={b} />
                      <circle cx={i % 2 ? 400 : 0} cy={480} r={110} fill={c} />
                    </svg>
                    <span className="host-initial" aria-hidden="true">
                      {host.name.charAt(0)}
                    </span>
                  </>
                )}
              </div>
              <div className="host-body">
                <h3 className="host-name">{host.name}</h3>
                <p className="body muted" style={{ fontFamily: "var(--font-thai)" }}>
                  {host.role}
                </p>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
