import { PlayIcon } from "./DecorCircles";

export function LatestEpisodeSection() {
  return (
    <section id="latest" style={{ maxWidth: 1280, margin: "0 auto", padding: "96px 24px 72px", display: "flex", flexDirection: "column", gap: 32 }}>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 20 }}>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 13, fontWeight: 500, letterSpacing: "0.2em", color: "#5d666f" }}>
            01
          </span>
          <h2 style={{ margin: 0, fontSize: 40, lineHeight: "44px", fontWeight: 600, letterSpacing: "-0.02em" }}>
            Latest episode
          </h2>
        </div>
        <a href="#episodes" style={{ fontSize: 15, fontWeight: 600 }}>
          All episodes →
        </a>
      </div>

      <article style={{ background: "#0a0f14", color: "#ffffff", display: "flex", flexWrap: "wrap" }}>
        <div style={{ flex: "1 1 520px", minWidth: 0, position: "relative", aspectRatio: "16 / 9", background: "#0a0f14", overflow: "hidden" }}>
          <svg
            viewBox="0 0 640 360"
            preserveAspectRatio="xMidYMid slice"
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
            aria-hidden="true"
          >
            <circle cx={300} cy={40} r={170} fill="#16283d" />
            <circle cx={520} cy={40} r={170} fill="#1b3a5f" />
            <circle cx={740} cy={40} r={170} fill="#2b5c91" />
          </svg>
          <div style={{ position: "absolute", left: 32, bottom: 32, right: 32, display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.26em", textTransform: "uppercase", color: "#a8bacd" }}>
              Rounds · Emergency Medicine
            </div>
            <div style={{ height: 1, background: "#a8bacd", width: 64 }} />
            <div style={{ fontSize: "clamp(36px, 4.4vw, 60px)", lineHeight: 0.95, fontWeight: 600, letterSpacing: "-0.01em" }}>
              The Consult
            </div>
          </div>
          <a
            href="https://www.youtube.com/@roundsmed"
            aria-label="Play episode"
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 88,
              height: 88,
              borderRadius: "50%",
              background: "#ffffff",
              color: "#0a0f14",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <PlayIcon size={26} />
          </a>
        </div>

        <div style={{ flex: "1 1 380px", minWidth: 0, padding: 40, display: "flex", flexDirection: "column", gap: 18, justifyContent: "center" }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, fontWeight: 500, letterSpacing: "0.2em", textTransform: "uppercase", color: "#a8bacd" }}>
            The Consult · [DATE] · [RUNTIME]
          </div>
          <h3 style={{ margin: 0, fontSize: 32, lineHeight: "36px", fontWeight: 600, letterSpacing: "-0.01em" }}>
            The ER isn&apos;t first come, first served
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <div style={{ fontSize: 17, lineHeight: "26px", fontWeight: 500 }}>
              [Emergency Medicine physician — name pending]
            </div>
            <div style={{ fontSize: 15, lineHeight: "22px", color: "#a8bacd" }}>
              Emergency Medicine, Thammasat University
            </div>
          </div>
          <p style={{ margin: 0, fontSize: 16, lineHeight: "25px", color: "#e6ebf0" }}>
            Who gets seen first when you walk into an ER, what really happens in the minutes
            after a heart stops, why motorbikes and alcohol fill the night shift, and where AI
            will change emergency care first.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, paddingTop: 4 }}>
            <a
              href="https://www.youtube.com/@roundsmed"
              style={{ display: "inline-flex", alignItems: "center", height: 46, padding: "0 20px", background: "#ffffff", color: "#0a0f14", textDecoration: "none", fontWeight: 600, fontSize: 15 }}
            >
              YouTube
            </a>
            <a
              href="[SPOTIFY LINK]"
              style={{ display: "inline-flex", alignItems: "center", height: 46, padding: "0 20px", border: "1px solid #5d666f", color: "#ffffff", textDecoration: "none", fontWeight: 600, fontSize: 15 }}
            >
              Spotify
            </a>
            <a
              href="[APPLE PODCASTS LINK]"
              style={{ display: "inline-flex", alignItems: "center", height: 46, padding: "0 20px", border: "1px solid #5d666f", color: "#ffffff", textDecoration: "none", fontWeight: 600, fontSize: 15 }}
            >
              Apple Podcasts
            </a>
          </div>
        </div>
      </article>
    </section>
  );
}
