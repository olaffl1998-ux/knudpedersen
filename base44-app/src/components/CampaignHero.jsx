"use client";
import Link from "@/lib/next/link";
import { useEffect, useState } from "react";
const DURATION = 7000;
/** Forsidens hero i fuld bredde: mærkernes officielle kampagnebilleder, der skifter roligt.
    Teksten står under billedet, så mærkernes egne logoer og billeder forbliver uberørte. */
export default function CampaignHero({ slides }) {
    const [i, setI] = useState(0);
    // Det forrige billede bliver liggende fuldt synligt under det nye, så overgangen aldrig "dykker" gennem baggrunden
    const [prev, setPrev] = useState(-1);
    const go = (k) => setI((cur) => { if (k !== cur)
        setPrev(cur); return k; });
    // Pause kun, når man bruger tastaturet inde i slideshowet. Musen over billedet stopper det ikke
    // (heroen fylder hele skærmen, så den ellers aldrig ville skifte), og "reducér bevægelse" i
    // Windows/macOS giver bare et roligt skift uden fade i stedet for at stoppe slideshowet.
    const [paused, setPaused] = useState(false);
    const n = slides.length;
    useEffect(() => {
        if (paused || n < 2)
            return;
        const t = setTimeout(() => go((i + 1) % n), DURATION);
        return () => clearTimeout(t);
    }, [i, paused, n]);
    const s = slides[i];
    const Cta = ({ c, children, className, tabIndex }) => c.external
        ? <a href={c.href} className={className} target="_blank" rel="noopener" tabIndex={tabIndex}>{children}</a>
        : <Link href={c.href} className={className} tabIndex={tabIndex}>{children}</Link>;
    return (<section className={`cx${paused ? " is-paused" : ""}`} aria-roledescription="karrusel" aria-label="Kampagner fra vores mærker" onFocus={(e) => { if (e.target.matches(":focus-visible"))
        setPaused(true); }} onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget))
        setPaused(false); }}>
      <div className="cx__stage">
        {slides.map((c, k) => (<Cta key={c.desktop} c={c} className={`cx__slide${k === i ? " is-on" : k === prev ? " is-prev" : ""}`} tabIndex={k === i ? 0 : -1}>
            <picture>
              <source media="(max-width: 767px)" srcSet={c.mobile}/>
                            <img src={c.desktop} alt={`${c.brand}: ${c.title}`} loading="eager" fetchPriority={k === 0 ? "high" : "low"}/>
            </picture>
          </Cta>))}
      </div>
      <div className="cx__cap" aria-live="polite">
        <small key={`b${i}`}>{s.brand}</small>
        <h2 key={`t${i}`}>{s.title}</h2>
        <Cta c={s} className="cx__link">Opdag</Cta>
      </div>
      {n > 1 && (<div className="cx__dots">
          {slides.map((c, k) => (<button key={c.desktop} type="button" className={k === i ? "is-on" : ""} onClick={() => go(k)} aria-label={`Vis ${c.brand}`} aria-current={k === i || undefined}>
              <span style={k === i ? { animationDuration: `${DURATION}ms` } : undefined}/>
            </button>))}
        </div>)}
    </section>);
}
