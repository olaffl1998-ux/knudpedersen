"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

/** Tynd messinglinje øverst, der viser hvor langt man er på siden, og en blød overgang mellem sider (ikke på Rolex-siderne). */
export default function ScrollFX() {
  const path = usePathname() || "/";
  const first = useRef(true);
  const bar = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let raf = 0;
    const on = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const h = document.documentElement.scrollHeight - window.innerHeight;
        bar.current?.style.setProperty("--sp", String(h > 0 ? Math.min(1, window.scrollY / h) : 0));
      });
    };
    on();
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on);
    return () => { window.removeEventListener("scroll", on); window.removeEventListener("resize", on); cancelAnimationFrame(raf); };
  }, []);

  useEffect(() => {
    if (first.current) { first.current = false; return; }
    if (path.startsWith("/rolex") || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const main = document.getElementById("indhold");
    if (!main) return;
    main.classList.remove("pg-in");
    void main.offsetWidth;
    main.classList.add("pg-in");
    const t = window.setTimeout(() => main.classList.remove("pg-in"), 900);
    return () => window.clearTimeout(t);
  }, [path]);

  return <div ref={bar} className="scroll-bar" aria-hidden="true" />;
}
