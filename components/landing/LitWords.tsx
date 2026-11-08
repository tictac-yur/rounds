"use client";

import { useEffect, useRef, useState } from "react";

// Words light up as the paragraph rises through the screen. With reduced
// motion, or before JavaScript runs, every word is lit.
export function LitWords({ words }: { words: { t: string; em: boolean }[] }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const [lit, setLit] = useState(words.length);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      // 0 when the text's top reaches 85% of the screen, 1 when its bottom reaches 45%.
      const start = vh * 0.85;
      const end = vh * 0.45;
      const progress = (start - rect.top) / (start - end + rect.height);
      setLit(Math.round(Math.min(1, Math.max(0, progress)) * words.length));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(frame);
    };
  }, [words.length]);

  return (
    <p ref={ref} className="statement-text">
      {words.map((w, i) => (
        <span key={i} className={w.em ? "w em" : "w"} data-lit={i < lit}>
          {w.t}
        </span>
      ))}
    </p>
  );
}
