import { CSSProperties, ReactNode } from "react";
import type { EpisodeView } from "@/convex/contentTypes";

export function episodeCaption(ep: EpisodeView) {
  return ep.photoCaption ?? (ep.guestName ? `ติติ · ปั๊บ · ${ep.guestName}` : ep.title);
}

// A photo in a white instant-camera frame with a handwritten caption.
// `fallback` fills the photo area when no image has been uploaded yet.
export function Polaroid({
  imageUrl,
  alt,
  caption,
  tilt = -2,
  fallback,
  children,
  style,
}: {
  imageUrl: string | null;
  alt: string;
  caption: string | null;
  tilt?: number;
  fallback?: ReactNode;
  children?: ReactNode;
  style?: CSSProperties;
}) {
  return (
    <figure className="polaroid" style={{ "--tilt": `${tilt}deg`, ...style } as CSSProperties}>
      <div style={{ position: "relative", aspectRatio: "1 / 1", overflow: "hidden", background: "#16283d" }}>
        {imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={imageUrl} alt={alt} style={{ display: "block", width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          fallback
        )}
        {children}
      </div>
      <figcaption
        lang="th"
        style={{
          fontFamily: "var(--font-hand)",
          fontSize: 19,
          lineHeight: "26px",
          color: "#0a0f14",
          textAlign: "center",
          minHeight: 26,
          padding: "12px 6px 16px",
        }}
      >
        {caption}
      </figcaption>
    </figure>
  );
}
