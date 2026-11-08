"use client";

import { useEffect, useState } from "react";
import { Lockup } from "./Logo";
import { ArrowIcon } from "./Icons";

const LINKS = [
  { id: "episodes", label: "Episodes", th: "ทุกตอน" },
  { id: "flags", label: "Red / Green flag", th: "ทายก่อนฟัง" },
  { id: "hosts", label: "Hosts", th: "พิธีกร" },
  { id: "partner", label: "Partner", th: "สำหรับแบรนด์" },
];

export function SiteNav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string | null>(null);

  // Solid bar once the page leaves the top of the hero.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Highlight the section in view.
  useEffect(() => {
    const sections = LINKS.map((l) => document.getElementById(l.id)).filter((el): el is HTMLElement => !!el);
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  // Full-screen menu on phones: Escape closes it, the page doesn't scroll behind it.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="nav" data-scrolled={scrolled || open}>
      <nav aria-label="เมนูหลัก" className="wrap nav-inner">
        <a href="#top" className="nav-brand" aria-label="Rounds หน้าแรก" onClick={() => setOpen(false)}>
          <Lockup height={22} />
        </a>
        <div className="nav-links">
          {LINKS.map((link) => (
            <a key={link.id} href={`#${link.id}`} aria-current={active === link.id ? "true" : undefined}>
              {link.label}
            </a>
          ))}
        </div>
        <a href="#latest" className="btn btn-light btn-sm nav-cta">
          ดูตอนล่าสุด
        </a>
        <button
          type="button"
          className="nav-toggle"
          aria-expanded={open}
          aria-controls="nav-sheet"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? "ปิด" : "เมนู"}
          <span className="nav-toggle-lines" aria-hidden="true">
            <i />
            <i />
          </span>
        </button>
      </nav>
      <div id="nav-sheet" className="nav-sheet" hidden={!open}>
        {LINKS.map((link) => (
          <a key={link.id} href={`#${link.id}`} className="nav-sheet-link" onClick={() => setOpen(false)}>
            {link.label}
            <span>{link.th}</span>
          </a>
        ))}
        <a href="#latest" className="btn btn-light" onClick={() => setOpen(false)}>
          ดูตอนล่าสุด <ArrowIcon />
        </a>
      </div>
    </header>
  );
}
