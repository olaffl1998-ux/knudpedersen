"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { TudorSlide, TudorVideo } from "@/data/tudor";

const AV1 = 'video/mp4; codecs="av01.0.08M.08"';

/** Én video uden lyd. AV1-originalen først, H.264 som reserve */
export function TudorVideoEl({ v, active = true, loop = true, onTime, onEnd, eager }: {
  v: TudorVideo; active?: boolean; loop?: boolean; eager?: boolean;
  onTime?: (p: number) => void; onEnd?: () => void;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (active) { el.currentTime = 0; el.play().catch(() => {}); } else el.pause();
  }, [active]);
  return (
    <video ref={ref} className="td-video" muted playsInline loop={loop} autoPlay={active} preload={eager || active ? "auto" : "metadata"} poster={v.poster} aria-hidden="true"
      onTimeUpdate={(e) => onTime?.(e.currentTarget.duration ? e.currentTarget.currentTime / e.currentTarget.duration : 0)}
      onEnded={onEnd}>
      <source src={v.av1} type={AV1} />
      <source src={v.h264} type="video/mp4" />
    </video>
  );
}

/** Videoslideren øverst: én video ad gangen, linjer i bunden viser hvor langt videoen er, pil og pause som på tudorwatch.com */
export function TudorHero({ slides }: { slides: TudorSlide[] }) {
  const [i, setI] = useState(0);
  const [p, setP] = useState(0);
  const [playing, setPlaying] = useState(true);
  const wrap = useRef<HTMLDivElement>(null);
  const go = (n: number) => { setI((n + slides.length) % slides.length); setP(0); };
  useEffect(() => {
    // Hold videoerne på pause, hvis brugeren har bedt om mindre bevægelse
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) setPlaying(false);
  }, []);
  useEffect(() => {
    const vids = wrap.current?.querySelectorAll("video");
    vids?.forEach((v, k) => { if (k === i && playing) v.play().catch(() => {}); else v.pause(); });
  }, [i, playing]);
  const s = slides[i];
  return (
    <section className="td-hero" aria-roledescription="karrusel" aria-label="Tudor-kampagner">
      <div className="td-hero__stage" ref={wrap}>
        {slides.map((x, k) => (
          <div key={x.key} className={`td-hero__slide${k === i ? " is-on" : ""}`} aria-hidden={k !== i}>
            <TudorVideoEl v={x.video} active={k === i} loop={false} eager={k === 0}
              onTime={k === i ? setP : undefined} onEnd={k === i ? () => go(i + 1) : undefined} />
          </div>
        ))}
        <div className="td-hero__shade" />
        <div className="td-hero__text" key={s.key}>
          <p className="td-eyebrow">{s.eyebrow}</p>
          <h1 className="td-h1">{s.title}</h1>
          <Link className="td-pill" href={s.cta.href}>{s.cta.label}</Link>
        </div>
        <button type="button" className="td-hero__play" onClick={() => setPlaying(!playing)} aria-label={playing ? "Sæt videoen på pause" : "Afspil videoen"}>
          {playing
            ? <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M7 5h3v14H7zM14 5h3v14h-3z" fill="currentColor" /></svg>
            : <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M8 5l11 7-11 7z" fill="currentColor" /></svg>}
        </button>
        <button type="button" className="td-hero__next" onClick={() => go(i + 1)} aria-label="Næste video">
          <svg viewBox="0 0 24 24" width="28" height="28" aria-hidden="true"><path d="M9 4l8 8-8 8" fill="none" stroke="currentColor" strokeWidth="1.6" /></svg>
        </button>
        <div className="td-hero__bars">
          {slides.map((x, k) => (
            <button key={x.key} type="button" onClick={() => go(k)} aria-label={`Vis ${x.title}`} aria-current={k === i}>
              <span style={{ transform: `scaleX(${k < i ? 1 : k === i ? p : 0})` }} />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

/** Vandret karrusel med en rund pil som på tudorwatch.com */
export function TudorRail({ children, label }: { children: React.ReactNode; label: string }) {
  const ref = useRef<HTMLUListElement>(null);
  const [end, setEnd] = useState({ start: true, end: false });
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const on = () => setEnd({ start: el.scrollLeft < 4, end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 4 });
    on();
    el.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on);
    return () => { el.removeEventListener("scroll", on); window.removeEventListener("resize", on); };
  }, []);
  const go = (d: number) => {
    const el = ref.current; if (!el) return;
    const card = el.querySelector("li")?.getBoundingClientRect().width ?? el.clientWidth * 0.8;
    el.scrollBy({ left: d * (card + 20), behavior: "smooth" });
  };
  return (
    <div className="td-rail">
      <ul ref={ref} className="td-rail__track" tabIndex={0} aria-label={label}>{children}</ul>
      {!end.start && <button type="button" className="td-rail__btn td-rail__btn--prev" onClick={() => go(-1)} aria-label="Forrige"><svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" strokeWidth="2" /></svg></button>}
      {!end.end && <button type="button" className="td-rail__btn" onClick={() => go(1)} aria-label="Næste"><svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M9 5l7 7-7 7" fill="none" stroke="currentColor" strokeWidth="2" /></svg></button>}
    </div>
  );
}
