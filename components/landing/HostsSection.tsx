import type { HomeContent } from "@/convex/contentTypes";

export function HostsSection({ hosts }: { hosts: HomeContent["hosts"] }) {
  return (
    <section id="about" style={{ maxWidth: 1280, margin: "0 auto", padding: "96px 24px", display: "flex", flexDirection: "column", gap: 28 }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 20 }}>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 13, fontWeight: 500, letterSpacing: "0.2em", color: "#5d666f" }}>
          06
        </span>
        <h2 style={{ margin: 0, fontSize: 40, lineHeight: 1.3, fontWeight: 600 }}>พิธีกร</h2>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 300px))", gap: 32 }}>
        {hosts.map((host) => (
          <div key={host.key} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {host.photoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={host.photoUrl} alt={host.name} style={{ aspectRatio: "4 / 5", width: "100%", objectFit: "cover" }} />
            ) : (
              <div
                style={{
                  aspectRatio: "4 / 5",
                  background: "#e9ecef",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 13,
                  color: "#5d666f",
                }}
              >
                [รูป {host.name}]
              </div>
            )}
            <div style={{ fontSize: 22, lineHeight: 1.4, fontWeight: 600 }}>{host.name}</div>
            <div style={{ fontSize: 15, lineHeight: 1.6, color: "#5d666f" }}>{host.role}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
