import type { HomeContent } from "@/convex/contentTypes";
import { NewsletterForm } from "./NewsletterForm";

export function AboutNewsletterSection({ hosts }: { hosts: HomeContent["hosts"] }) {
  return (
    <section id="about" style={{ maxWidth: 1280, margin: "0 auto", padding: "96px 24px", display: "flex", flexWrap: "wrap", gap: 64 }}>
      <div style={{ flex: "1 1 520px", minWidth: 0, display: "flex", flexDirection: "column", gap: 28 }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 20 }}>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 13, fontWeight: 500, letterSpacing: "0.2em", color: "#5d666f" }}>
            06
          </span>
          <h2 style={{ margin: 0, fontSize: 40, lineHeight: "44px", fontWeight: 600, letterSpacing: "-0.02em" }}>
            The hosts
          </h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 24 }}>
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
                  fontFamily: "var(--font-mono)",
                  fontSize: 12,
                  letterSpacing: "0.12em",
                  color: "#5d666f",
                }}
              >
                [PHOTO — {host.name.toUpperCase()}]
              </div>
              )}
              <div style={{ fontSize: 22, lineHeight: "28px", fontWeight: 600 }}>{host.name}</div>
              <div style={{ fontSize: 15, lineHeight: "22px", color: "#5d666f" }}>{host.role}</div>
            </div>
          ))}
        </div>
      </div>

      <div
        id="newsletter"
        style={{
          flex: "1 1 380px",
          minWidth: 0,
          alignSelf: "flex-start",
          background: "#ffffff",
          border: "1px solid #b6bec6",
          padding: 36,
          display: "flex",
          flexDirection: "column",
          gap: 18,
        }}
      >
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, fontWeight: 500, letterSpacing: "0.26em", textTransform: "uppercase", color: "#5d666f" }}>
          Newsletter
        </div>
        <h2 style={{ margin: 0, fontSize: 28, lineHeight: "32px", fontWeight: 600, letterSpacing: "-0.01em" }}>
          One email per episode
        </h2>
        <ul style={{ margin: 0, paddingLeft: 20, fontSize: 16, lineHeight: "28px" }}>
          <li>Myth-buster answers, with sources</li>
          <li>What we learned in med school this fortnight</li>
          <li>A vote on which specialty we interview next</li>
        </ul>
        <NewsletterForm />
      </div>
    </section>
  );
}
