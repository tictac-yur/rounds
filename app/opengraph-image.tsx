import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

// The picture shown when a Rounds link is shared on LINE, Instagram,
// Facebook or X. Applies to every page that doesn't make its own.
export const alt = "Rounds — ชีวิตนักศึกษาแพทย์แบบเรียลไทม์ กับอาจารย์แพทย์ตัวจริง";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  // Literal paths, so the build bundles just these three files.
  const [thai, latin, lockup] = await Promise.all([
    readFile(join(process.cwd(), "assets/fonts/NotoSansThai-600.ttf")),
    readFile(join(process.cwd(), "assets/fonts/SpaceGrotesk-600.ttf")),
    readFile(join(process.cwd(), "public/brand/rounds-lockup-reverse.svg")),
  ]);
  const lockupSrc = `data:image/svg+xml;base64,${lockup.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          background: "#0a0f14",
          color: "#ffffff",
          fontFamily: "Space Grotesk, Noto Sans Thai",
          overflow: "hidden",
        }}
      >
        {/* The logo's three discs, big and sinking off the bottom edge. */}
        {[
          { left: 520, fill: "#16283d" },
          { left: 760, fill: "#1b3a5f" },
          { left: 1000, fill: "#2b5c91" },
        ].map((d) => (
          <div
            key={d.left}
            style={{
              position: "absolute",
              left: d.left - 260,
              top: 330,
              width: 520,
              height: 520,
              borderRadius: 9999,
              background: d.fill,
            }}
          />
        ))}

        <div style={{ display: "flex", flexDirection: "column", padding: "72px 80px", gap: 28, position: "relative" }}>
          <img src={lockupSrc} alt="" height={56} width={Math.round((56 * 388.7) / 74)} />
          <div style={{ display: "flex", flexDirection: "column", fontSize: 64, lineHeight: 1.3, marginTop: 24 }}>
            <span>ชีวิตนักศึกษาแพทย์แบบเรียลไทม์</span>
            <span style={{ color: "#a8bacd" }}>กับอาจารย์แพทย์ตัวจริง</span>
          </div>
          {/* The design system's mono label: uppercase, wide tracking, on-navy-muted. */}
          <span style={{ marginTop: 8, fontSize: 22, letterSpacing: "0.26em", textTransform: "uppercase", color: "#a8bacd" }}>
            Red flag or Green flag?
          </span>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Space Grotesk", data: latin, weight: 600, style: "normal" },
        { name: "Noto Sans Thai", data: thai, weight: 600, style: "normal" },
      ],
    },
  );
}
