import { CSSProperties, ReactNode } from "react";

// A photo in a white instant-camera frame. Flat, per the design system: no
// shadow, square corners. `fallback` fills the photo area until a photo is
// uploaded; the caption strip stays blank unless a caption is set.
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
      <div style={{ position: "relative", aspectRatio: "1 / 1", overflow: "hidden", background: "var(--navy-deep)" }}>
        {imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={imageUrl} alt={alt} style={{ display: "block", width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          fallback
        )}
        {children}
      </div>
      <figcaption
        className="ds-body"
        style={{ color: "var(--ink)", textAlign: "center", minHeight: 26, padding: "var(--space-3) var(--space-2) var(--space-4)" }}
      >
        {caption}
      </figcaption>
    </figure>
  );
}
