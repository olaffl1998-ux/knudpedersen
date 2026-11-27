"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export type Campaign = { href: string; desktop: string; mobile: string; brand: string; title: string; external?: boolean };

const DURATION = 7000;

/** Forsidens hero i fuld bredde: mærkernes officielle kampagnebilleder, der skifter roligt.
    Teksten står under billedet, så mærkernes egne logoer og billeder forbliver uberørte. */
export default function CampaignHero({ slides }: { slides: Campaign[] }) {
  const [i, setI] = useState(0);
  // Det forrige billede bliver liggende fuldt synligt under det nye, så overgangen aldrig "dykker" gennem baggrunden
  const [prev, setPrev] = useState(-1);
  const go = (k: number) => setI((cur) => { if (k !== cur) setPrev(cur); return k; });
  // Pause kun, når man bruger tastaturet inde i slideshowet. Musen over billedet stopper det ikke
  // (heroen fylder hele skærmen, så den ellers aldrig ville skifte), og "reducér bevægelse" i
  // Windows/macOS giver bare et roligt skift uden fade i stedet for at stoppe slideshowet.
  const [paused, setPaused] = useState(false);
  const n = slides.length;
  const root = useRef<HTMLElement>(null);

  // Overgang fra billedet ovenover: vi aflæser farven i bunden af billedet over heroen og lader toppen af
  // kampagnebillederne glide ud fra netop den farve. Billedet ovenover (Rolex) bliver ikke ændret.
  useEffect(() => {
    const el = root.current;
    let prevEl = el?.previousElementSibling ?? null;
    while (prevEl && !prevEl.querySelector("img")) prevEl = prevEl.previousElementSibling;
    const above = prevEl?.querySelector("img") as HTMLImageElement | null | undefined;
    if (!el || !above) return;
    const sample = () => {
      try {
        const w = 48, h = 6;
        const c = document.createElement("canvas"); c.width = w; c.height = h;
        const ctx = c.getContext("2d", { willReadFrequently: true });
        if (!ctx || !above.naturalWidth) return;
        const sh = Math.max(1, Math.round(above.naturalHeight * 0.03));
        ctx.drawImage(above, 0, above.naturalHeight - sh, above.naturalWidth, sh, 0, 0, w, h);
        const d = ctx.getImageData(0, 0, w, h).data;
        let r = 0, g = 0, b = 0;
        for (let k = 0; k < d.length; k += 4) { r += d[k]; g += d[k + 1]; b += d[k + 2]; }
        const px = d.length / 4;
        el.style.setProperty("--cx-blend", `rgb(${Math.round(r / px)} ${Math.round(g / px)} ${Math.round(b / px)})`);
      } catch { /* billedet kan ikke aflæses: ingen overgang */ }
    };
    if (above.complete) sample(); else above.addEventListener("load", sample, { once: true });
    const mq = window.matchMedia("(max-width: 767px)");
    const again = () => (above.complete ? sample() : above.addEventListener("load", sample, { once: true }));
    mq.addEventListener("change", again);
    return () => { above.removeEventListener("load", sample); mq.removeEventListener("change", again); };
  }, []);

  useEffect(() => {
    if (paused || n < 2) return;
    const t = setTimeout(() => go((i + 1) % n), DURATION);
    return () => clearTimeout(t);
  }, [i, paused, n]);
  const s = slides[i];
  const Cta = ({ c, children, className, tabIndex }: { c: Campaign; children: React.ReactNode; className?: string; tabIndex?: number }) =>
    c.external
      ? <a href={c.href} className={className} target="_blank" rel="noopener" tabIndex={tabIndex}>{children}</a>
      : <Link href={c.href} className={className} tabIndex={tabIndex}>{children}</Link>;

  return (
    <section ref={root} className={`cx${paused ? " is-paused" : ""}`} aria-roledescription="karrusel" aria-label="Kampagner fra vores mærker"
      onFocus={(e) => { if (e.target.matches(":focus-visible")) setPaused(true); }}
      onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setPaused(false); }}>
      <div className="cx__stage">
        {slides.map((c, k) => (
          <Cta key={c.desktop} c={c} className={`cx__slide${k === i ? " is-on" : k === prev ? " is-prev" : ""}`} tabIndex={k === i ? 0 : -1}>
            <picture>
              <source media="(max-width: 767px)" srcSet={c.mobile} />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={c.desktop} alt={`${c.brand}: ${c.title}`} loading="eager" fetchPriority={k === 0 ? "high" : "low"} />
            </picture>
          </Cta>
        ))}
      </div>
      <div className="cx__cap" aria-live="polite">
        <small key={`b${i}`}>{s.brand}</small>
        <h2 key={`t${i}`}>{s.title}</h2>
        <Cta c={s} className="cx__link">Opdag</Cta>
      </div>
      {n > 1 && (
        <div className="cx__dots">
          {slides.map((c, k) => (
            <button key={c.desktop} type="button" className={k === i ? "is-on" : ""} onClick={() => go(k)} aria-label={`Vis ${c.brand}`} aria-current={k === i || undefined}>
              <span style={k === i ? { animationDuration: `${DURATION}ms` } : undefined} />
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
