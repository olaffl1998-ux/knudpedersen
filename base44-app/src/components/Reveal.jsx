"use client";
import { usePathname } from "@/lib/next/navigation";
import { useEffect } from "react";
const SELECTOR = [
    ".section-head", ".ed-head", ".ed-statement", ".ed-facts li", ".ed-tile", ".cards > li", ".feature",
    ".ed-brands li", ".services li", ".ed-cine", ".split__media", ".split__text", ".fx__media", ".fx__text", ".visit > *", ".page-head", ".timeline li", ".footer-brand > *", ".col-tiles li",
].join(",");
/** Elementer glider blødt ind, når de kommer til syne. Uden JavaScript eller med reduceret bevægelse vises alt med det samme. */
export default function Reveal() {
    const path = usePathname();
    useEffect(() => {
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window))
            return;
        let io = null;
        // Vent til siden er hydreret, så klasserne ikke kolliderer med den server-renderede HTML
        const start = () => {
            io = new IntersectionObserver((entries) => {
                for (const e of entries)
                    if (e.isIntersecting) {
                        e.target.classList.add("is-in");
                        io?.unobserve(e.target);
                    }
            }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
            const vh = window.innerHeight;
            const els = Array.from(document.querySelectorAll(SELECTOR))
                .filter((el) => !el.closest(".rx") && !el.classList.contains("rv") && el.getBoundingClientRect().top > vh * 0.9);
            const groups = new Map();
            for (const el of els) {
                const k = groups.get(el.parentElement) ?? 0;
                groups.set(el.parentElement, k + 1);
                el.style.setProperty("--rv-delay", `${Math.min(k, 6) * 70}ms`);
                el.classList.add("rv");
                io.observe(el);
            }
        };
        const w = window;
        const t = window.setTimeout(() => { if (w.requestIdleCallback)
            w.requestIdleCallback(start, { timeout: 1200 });
        else
            start(); }, 400);
        return () => { window.clearTimeout(t); io?.disconnect(); };
    }, [path]);
    return null;
}
