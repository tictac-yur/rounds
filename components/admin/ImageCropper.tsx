"use client";

import { useEffect, useRef, useState, type PointerEvent } from "react";

export type CropSpec = {
  // Width ÷ height of the result, e.g. 3 / 4 for a portrait.
  aspect: number;
  // Width in pixels of the saved image.
  width: number;
  // "face": guides for one person's head, so every portrait is framed alike.
  // "center": a centre line and thirds, for group photos.
  guides: "face" | "center";
};

// Lines drawn over the photo, as fractions of the frame's height.
const HEAD_TOP = 0.16;
const EYES = 0.38;

// Drag to move, slide to zoom; the frame shows exactly what will be saved.
export function ImageCropper({
  src,
  spec,
  onDone,
  onCancel,
}: {
  src: string;
  spec: CropSpec;
  onDone: (blob: Blob) => void;
  onCancel: () => void;
}) {
  const frameRef = useRef<HTMLDivElement>(null);
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [failed, setFailed] = useState(false);
  const [frameWidth, setFrameWidth] = useState(0);
  const [zoom, setZoom] = useState(1);
  // The point of the photo at the frame's centre, as fractions of its size.
  const [center, setCenter] = useState({ x: 0.5, y: 0.5 });
  const drag = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const img = new Image();
    img.onload = () => setImage(img);
    img.onerror = () => setFailed(true);
    img.src = src;
  }, [src]);

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;
    const observer = new ResizeObserver(() => setFrameWidth(frame.clientWidth));
    observer.observe(frame);
    return () => observer.disconnect();
  }, []);

  const fw = frameWidth;
  const fh = fw / spec.aspect;
  const iw = image?.naturalWidth ?? 1;
  const ih = image?.naturalHeight ?? 1;
  const scale = Math.max(fw / iw, fh / ih) * zoom;
  // Half the visible part of the photo, as fractions of its size.
  const half = { x: fw / (2 * scale * iw), y: fh / (2 * scale * ih) };
  const clamp = (c: { x: number; y: number }) => ({
    x: Math.min(1 - half.x, Math.max(half.x, c.x)),
    y: Math.min(1 - half.y, Math.max(half.y, c.y)),
  });
  const shown = clamp(center);

  function onPointerDown(e: PointerEvent<HTMLDivElement>) {
    e.currentTarget.setPointerCapture(e.pointerId);
    drag.current = { x: e.clientX, y: e.clientY };
  }
  function onPointerMove(e: PointerEvent<HTMLDivElement>) {
    if (!drag.current) return;
    const dx = e.clientX - drag.current.x;
    const dy = e.clientY - drag.current.y;
    drag.current = { x: e.clientX, y: e.clientY };
    setCenter(clamp({ x: shown.x - dx / (scale * iw), y: shown.y - dy / (scale * ih) }));
  }

  function save() {
    if (!image) return;
    const canvas = document.createElement("canvas");
    canvas.width = spec.width;
    canvas.height = Math.round(spec.width / spec.aspect);
    const context = canvas.getContext("2d");
    if (!context) return;
    context.imageSmoothingQuality = "high";
    context.drawImage(
      image,
      (shown.x - half.x) * iw,
      (shown.y - half.y) * ih,
      2 * half.x * iw,
      2 * half.y * ih,
      0,
      0,
      canvas.width,
      canvas.height,
    );
    canvas.toBlob((blob) => blob && onDone(blob), "image/jpeg", 0.88);
  }

  return (
    <div className="admin-cropper">
      <div
        ref={frameRef}
        className="admin-cropper-frame"
        style={{ aspectRatio: String(spec.aspect) }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={() => (drag.current = null)}
        onPointerCancel={() => (drag.current = null)}
      >
        {image && fw > 0 && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={src}
            alt=""
            draggable={false}
            style={{
              width: iw * scale,
              height: ih * scale,
              left: fw / 2 - shown.x * iw * scale,
              top: fh / 2 - shown.y * ih * scale,
            }}
          />
        )}
        <svg className="admin-cropper-guides" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          <line x1="50" y1="0" x2="50" y2="100" />
          {spec.guides === "face" ? (
            <>
              <line x1="0" y1={HEAD_TOP * 100} x2="100" y2={HEAD_TOP * 100} />
              <line x1="0" y1={EYES * 100} x2="100" y2={EYES * 100} />
              <ellipse cx="50" cy={EYES * 100} rx="18" ry={(EYES - HEAD_TOP) * 100} />
            </>
          ) : (
            <>
              <line x1="33.3" y1="0" x2="33.3" y2="100" className="faint" />
              <line x1="66.7" y1="0" x2="66.7" y2="100" className="faint" />
              <line x1="0" y1="33.3" x2="100" y2="33.3" className="faint" />
            </>
          )}
        </svg>
      </div>
      {failed ? (
        <p className="admin-error">This photo can&apos;t be opened here. Save it as JPG or PNG and try again.</p>
      ) : (
        <p className="admin-muted">
          {spec.guides === "face"
            ? "Drag to move, slide to zoom. Put the top of the head on the first line, the eyes on the second, and the nose on the centre line, so both hosts are framed the same."
            : "Drag to move, slide to zoom. Keep everyone between the outer lines, with the group centred on the middle line."}
        </p>
      )}
      <label className="admin-cropper-zoom">
        Zoom
        <input type="range" min={1} max={3} step={0.01} value={zoom} onChange={(e) => setZoom(Number(e.target.value))} />
      </label>
      <div className="admin-actions-row">
        <button type="button" className="admin-button" disabled={!image} onClick={save}>
          Use this crop
        </button>
        <button type="button" className="admin-button admin-button-secondary" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </div>
  );
}
