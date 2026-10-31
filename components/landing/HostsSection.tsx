import type { HomeContent } from "@/convex/contentTypes";
import { Mark } from "./Logo";

export function HostsSection({ hosts }: { hosts: HomeContent["hosts"] }) {
  return (
    <section id="about" className="container section" style={{ display: "flex", flexDirection: "column", gap: "var(--space-8)" }}>
      <div className="section-head">
        <div>
          <span className="ds-label">05</span>
          <h2 className="ds-headline">พิธีกร</h2>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "var(--space-6)" }}>
        {hosts.map((host) => (
          <div
            key={host.key}
            style={{
              display: "flex",
              gap: "var(--space-6)",
              alignItems: "center",
              background: "var(--surface-raised)",
              border: "1px solid var(--line)",
              padding: "var(--space-4)",
            }}
          >
            {host.photoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={host.photoUrl} alt={host.name} style={{ width: "40%", maxWidth: 200, aspectRatio: "4 / 5", objectFit: "cover", flexShrink: 0 }} />
            ) : (
              <div
                aria-hidden="true"
                style={{
                  width: "40%",
                  maxWidth: 200,
                  aspectRatio: "4 / 5",
                  flexShrink: 0,
                  background: "var(--navy)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Mark height={20} reverse />
              </div>
            )}
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)", minWidth: 0 }}>
              <h3 className="ds-headline" style={{ fontSize: 26, lineHeight: "36px" }}>
                {host.name}
              </h3>
              <p className="ds-body muted">{host.role}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
