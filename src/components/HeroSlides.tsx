"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export type Slide = { href: string; image: string; brand: string; name: string; ref: string; price: string; kicker: string };

const DURATION = 6500;

/** Forsidens hero: ét ur ad gangen i stor størrelse, der skifter blødt. Stopper ved hover, fokus og reduceret bevægelse. */
export default function HeroSlides({ slides }: { slides: Slide[] }) {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const n = slides.length;

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
  }, []);
  useEffect(() => {
    if (paused || reduced || n < 2) return;
    timer.current = setTimeout(() => setI((x) => (x + 1) % n), DURATION);
    return () => { if (timer.current) clearTimeout(timer.current); };
  }, [i, paused, reduced, n]);

  const s = slides[i];
  return (
    <section className={`hx${paused || reduced ? " is-paused" : ""}`} aria-roledescription="karrusel" aria-label="Udvalgte ure"
      onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onFocus={() => setPaused(true)} onBlur={() => setPaused(false)}>
      <div className="hx__word" aria-hidden="true">
        {slides.map((x, k) => <span key={x.href} className={k === i ? "is-on" : ""}>{x.brand}</span>)}
      </div>
      <div className="hx__text">
        <span className="label label--brass">Skt. Clemens Torv · Aarhus · Siden 1887</span>
        <h1 id="hero-h">Ure og smykker,<br /><em>valgt med omhu</em></h1>
        <p className="lead">Officiel Rolex- og Tudor-forhandler med eget urmagerværksted midt i Aarhus.</p>
        <div className="btn-row">
          <Link className="btn" href="/book-tid">Book et møde</Link>
          <Link className="link-arrow" href="/ure">Se alle ure</Link>
        </div>
      </div>
      <div className="hx__stage" onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        e.currentTarget.style.setProperty("--mx", String((e.clientX - r.left) / r.width - 0.5));
        e.currentTarget.style.setProperty("--my", String((e.clientY - r.top) / r.height - 0.5));
      }} onMouseLeave={(e) => { e.currentTarget.style.setProperty("--mx", "0"); e.currentTarget.style.setProperty("--my", "0"); }}>
        {slides.map((x, k) => (
          <Link key={x.href} href={x.href} className={`hx__watch${k === i ? " is-on" : ""}`} aria-hidden={k !== i} tabIndex={k === i ? 0 : -1}
            aria-label={`${x.brand} ${x.name}, reference ${x.ref}`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={x.image} alt="" fetchPriority={k === 0 ? "high" : "low"} loading={k === 0 ? "eager" : "lazy"} />
          </Link>
        ))}
        <div className="hx__cap" aria-live="polite">
          <small>{s.kicker}</small>
          <strong>{s.brand} {s.name}</strong>
          <span>Ref. {s.ref} · Vejl. pris {s.price}</span>
        </div>
      </div>
      {n > 1 && (
        <div className="hx__pager">
          <span className="hx__count"><b>{String(i + 1).padStart(2, "0")}</b> / {String(n).padStart(2, "0")}</span>
          <div className="hx__bars">
            {slides.map((x, k) => (
              <button key={x.href} type="button" className={k === i ? "is-on" : k < i ? "is-done" : ""} onClick={() => setI(k)} aria-label={`Vis ${x.brand} ${x.name}`} aria-current={k === i || undefined}>
                <span style={k === i ? { animationDuration: `${DURATION}ms` } : undefined} />
              </button>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
