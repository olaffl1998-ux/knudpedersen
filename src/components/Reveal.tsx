"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

const SELECTOR = [
  ".section-head", ".ed-head", ".ed-statement", ".ed-facts li", ".ed-tile", ".cards > li", ".feature",
  ".ed-brands li", ".services li", ".split__media", ".split__text", ".fx__media", ".fx__text", ".visit > *", ".page-head", ".timeline li",
].join(",");

/** Elementer glider blødt ind, når de kommer til syne. Uden JavaScript eller med reduceret bevægelse vises alt med det samme. */
export default function Reveal() {
  const path = usePathname();
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); }
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    const els = Array.from(document.querySelectorAll<HTMLElement>(SELECTOR)).filter((el) => !el.closest(".rx") && !el.classList.contains("is-in"));
    const groups = new Map<Element | null, number>();
    for (const el of els) {
      const parent = el.parentElement;
      const k = groups.get(parent) ?? 0;
      groups.set(parent, k + 1);
      el.style.setProperty("--rv-delay", `${Math.min(k, 6) * 70}ms`);
      el.classList.add("rv");
      io.observe(el);
    }
    return () => io.disconnect();
  }, [path]);
  return null;
}
