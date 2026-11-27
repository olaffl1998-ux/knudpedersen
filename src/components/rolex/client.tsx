"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { rolexNav, rolexAssets } from "@/data/rolex";
import { formatPrice } from "@/lib/site";

/** Rolex-plakette øverst til venstre + Rolex' menu */
export function RolexBar() {
  const path = usePathname() || "";
  const [open, setOpen] = useState(false);
  useEffect(() => setOpen(false), [path]);
  return (
    <div className="rx-bar">
      <div className="rx-wrap rx-bar-in">
        <Link className="rx-plaque" href="/rolex/discover" aria-label="Officiel Rolex-forhandler, Udforsk Rolex">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={rolexAssets.plaque} alt="Officiel Rolex-forhandler" width={120} height={60} />
        </Link>
        <button className="rx-menu-btn" type="button" aria-expanded={open} aria-controls="rx-menu" onClick={() => setOpen(!open)}>
          Rolex-menu
        </button>
        <nav id="rx-menu" className={`rx-menu${open ? " open" : ""}`} aria-label="Rolex-menu">
          {rolexNav.map((n) => {
            const on = path === n.href || (n.href === "/rolex/watches" && /^\/rolex\/(?!discover|new-watches|watchmaking|servicing|world-of-rolex|knud-pedersen|contact-aarhus|accessories)[^/]+$/.test(path)) || (n.href === "/rolex/servicing" && path.startsWith("/rolex/servicing"));
            return <Link key={n.href} href={n.href} aria-current={on ? "page" : undefined}>{n.label}</Link>;
          })}
        </nav>
      </div>
    </div>
  );
}

/**
 * Rolex-pris (Rolex' vejledende udsalgspris). Må kun vises for besøgende i Danmark.
 * Prisen hentes fra /api/rolex-price, som tjekker landet på serveren. I forhåndsvisningen
 * (uden server) sendes prisen med, så Lars kan se den.
 */
export function RolexPrice({ rmc, preview }: { rmc: string; preview?: number | null }) {
  const [price, setPrice] = useState<number | null>(preview ?? null);
  useEffect(() => {
    if (preview !== undefined) return;
    let live = true;
    fetch(`/api/rolex-price?rmc=${encodeURIComponent(rmc)}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => live && d?.price && setPrice(d.price))
      .catch(() => {});
    return () => { live = false; };
  }, [rmc, preview]);
  if (!price) return null;
  return <p className="rx-price">Vejledende udsalgspris {formatPrice(price)}</p>;
}

/** Galleri med fire billeder og lysboks (Esc lukker, pile skifter) */
export function RolexGallery({ images, alt }: { images: string[]; alt: string }) {
  const [i, setI] = useState<number | null>(null);
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (i === null) { if (d.open) d.close(); } else if (!d.open) d.showModal();
  }, [i]);
  const n = images.length;
  return (
    <>
      <ul className="rx-gallery">
        {images.map((src, k) => (
          <li key={src}>
            <button type="button" onClick={() => setI(k)} aria-label={`Vis billede ${k + 1} af ${n} i fuld størrelse`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt={`${alt}, billede ${k + 1}`} loading="eager" />
            </button>
          </li>
        ))}
      </ul>
      <dialog ref={ref} className="rx-lightbox" onClose={() => setI(null)} onKeyDown={(e) => {
        if (i === null) return;
        if (e.key === "ArrowRight") setI((i + 1) % n);
        if (e.key === "ArrowLeft") setI((i - 1 + n) % n);
      }} aria-label="Billedgalleri">
        {i !== null && (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={images[i]} alt={`${alt}, billede ${i + 1}`} />
            <div className="rx-lb-ctrl">
              <button type="button" onClick={() => setI((i - 1 + n) % n)} aria-label="Forrige billede">‹</button>
              <span>{i + 1} / {n}</span>
              <button type="button" onClick={() => setI((i + 1) % n)} aria-label="Næste billede">›</button>
              <button type="button" onClick={() => setI(null)} aria-label="Luk galleri">Luk</button>
            </div>
          </>
        )}
      </dialog>
    </>
  );
}

/** Karrusel med tre Rolex-bannere. Kan sættes på pause og respekterer reduceret bevægelse. */
export function RolexCarousel({ slides }: { slides: { title: string; eyebrow: string; href: string; alt: string; desktop: string; mobile: string }[] }) {
  const [k, setK] = useState(0);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (paused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => setK((x) => (x + 1) % slides.length), 6000);
    return () => clearInterval(t);
  }, [paused, slides.length]);
  return (
    <section className="rx-carousel" aria-roledescription="karrusel" aria-label="Udvalgt fra Rolex">
      {slides.map((s, i) => (
        <Link key={s.href} href={s.href} className={`rx-slide${i === k ? " on" : ""}`} aria-hidden={i !== k} tabIndex={i === k ? 0 : -1}>
          <picture>
            <source media="(max-width: 767px)" srcSet={s.mobile} />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={s.desktop} alt={s.alt} loading="eager" />
          </picture>
          <span className="rx-slide-cap"><small>{s.eyebrow}</small><strong>{s.title}</strong><em>Opdag</em></span>
        </Link>
      ))}
      <div className="rx-dots">
        {slides.map((s, i) => (
          <button key={s.href} type="button" aria-label={`Vis ${s.title}`} aria-current={i === k} onClick={() => setK(i)} />
        ))}
        <button type="button" className="rx-pause" onClick={() => setPaused(!paused)} aria-label={paused ? "Afspil karrusel" : "Sæt karrusel på pause"}>
          {paused ? "▶" : "❚❚"}
        </button>
      </div>
    </section>
  );
}

/** Viser 6 ure ad gangen med "Indlæs flere" */
export function LoadMore({ total, step = 6, children }: { total: number; step?: number; children: React.ReactNode[] }) {
  const [n, setN] = useState(step);
  return (
    <>
      <ul className="rx-grid">{children.slice(0, n)}</ul>
      {n < total && (
        <p className="rx-center">
          <button type="button" className="rx-btn rx-btn-ghost" onClick={() => setN(n + step)}>Indlæs flere</button>
          <span className="rx-count">Viser {Math.min(n, total)} af {total}</span>
        </p>
      )}
    </>
  );
}
