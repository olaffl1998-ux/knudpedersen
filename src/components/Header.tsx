"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { mainNav, business } from "@/lib/site";
import { nonRolexBrands } from "@/data/catalog";
import { rolexAssets } from "@/data/rolex";
import { todayText } from "./OpeningToday";
import { SearchIcon, HeartIcon } from "./Icons";
import { WishlistCount } from "./Wishlist";

const ROLEX_CLOCK_KEY = process.env.NEXT_PUBLIC_ROLEX_CLOCK_API_KEY;

const watchLinks = [
  { href: "/ure?koen=herre", label: "Herreure" },
  { href: "/ure?koen=dame", label: "Dameure" },
  { href: "/ure?sortering=nyeste", label: "Nyheder" },
  { href: "/maerker", label: "Kollektioner og mærker" },
  { href: "/brugte-ure", label: "Brugte ure" },
];
const otherBrands = nonRolexBrands.filter((b) => b.slug !== "tudor");

/** Rolex-uret leveres af Rolex (iframe med API-nøgle) og linker til Udforsk Rolex. Indtil nøglen er sat vises en pladsholder. */
function RolexClock() {
  return ROLEX_CLOCK_KEY ? (
    <Link href="/rolex/discover" aria-label="Rolex hos Knud Pedersen" style={{ position: "relative", display: "block" }}>
      <iframe className="rolex-clock" title="Rolex-ur" src={`https://static.rolex.com/retailers/clock/?colour=gold&apiKey=${ROLEX_CLOCK_KEY}&lang=da`} scrolling="no" style={{ pointerEvents: "none" }} />
    </Link>
  ) : (
    <Link className="rolex-clock-slot" href="/rolex/discover" aria-label="Officiel Rolex-forhandler, Udforsk Rolex">
      {/* [Rolex-ur fra Rolex vises her, når API-nøglen er leveret] */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={rolexAssets.plaque} alt="Officiel Rolex-forhandler" width={120} height={60} />
    </Link>
  );
}

function Mega({ id, onClose }: { id: string; onClose: () => void }) {
  return (
    <div className="mega" id={`mega-${id}`} onKeyDown={(e) => e.key === "Escape" && onClose()}>
      <div className="container mega__in">
        {id === "ure" ? (
          <>
            <div><h2>Ure</h2><ul>{watchLinks.map((l) => <li key={l.href}><Link href={l.href}>{l.label}</Link></li>)}<li><Link href="/ure">Alle ure</Link></li></ul></div>
            <div><h2>Populære mærker</h2><ul>{["tudor", "omega", "breitling", "grand-seiko", "tag-heuer", "longines"].map((s) => { const b = nonRolexBrands.find((x) => x.slug === s); return b ? <li key={s}><Link href={`/maerker/${s}`}>{b.name}</Link></li> : null; })}</ul></div>
            <div><h2>Rolex</h2><ul><li><Link href="/rolex/discover">Udforsk Rolex</Link></li><li><Link href="/rolex/watches">Rolex-ure</Link></li><li><Link href="/rolex/new-watches">Nye Rolex-ure</Link></li></ul></div>
            <div><h2>Rådgivning</h2><ul><li><Link href="/book-tid">Book et møde</Link></li><li><Link href="/service">Service og reparation</Link></li><li><Link href="/kontakt">Kontakt os</Link></li></ul></div>
          </>
        ) : (
          <>
            <div className="mega__top"><h2>Officiel forhandler</h2><ul><li><Link href="/rolex/discover">Rolex</Link></li><li><Link href="/maerker/tudor">Tudor</Link></li></ul></div>
            <div className="mega__brands"><h2>Alle mærker</h2><ul>{otherBrands.map((b) => <li key={b.slug}><Link href={`/maerker/${b.slug}`}>{b.name}</Link></li>)}<li><Link href="/maerker">Se alle mærker</Link></li></ul></div>
          </>
        )}
      </div>
    </div>
  );
}

export default function Header() {
  const path = usePathname() || "/";
  const [mega, setMega] = useState<string | null>(null);
  const [menu, setMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [today, setToday] = useState("");
  const ref = useRef<HTMLElement>(null);

  useEffect(() => { setMega(null); setMenu(false); }, [path]);
  useEffect(() => {
    setToday(todayText());
    const on = () => setScrolled(window.scrollY > 24);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  useEffect(() => {
    if (!mega) return;
    const close = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setMega(null); };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [mega]);
  useEffect(() => { document.body.style.overflow = menu ? "hidden" : ""; }, [menu]);

  const active = (href: string) => (href === "/" ? path === "/" : path.startsWith(href));

  return (
    <>
      <div className="topbar">
        <div className="container">
          <span className={`topbar__open${today.startsWith("Åbent") ? "" : " is-closed"}`} suppressHydrationWarning>{today || "Åbningstider"}</span>
          <span className="topbar__info">
            <a className="topbar__addr" href="/kontakt">{business.street}, {business.postalCode} {business.city}</a>
            <a href={`tel:${business.phoneE164}`}>Tlf. {business.phone}</a>
          </span>
        </div>
      </div>
      <header ref={ref} className={`site-header${scrolled ? " is-scrolled" : ""}`}>
        <div className="container site-header__in">
          <button className="burger" type="button" aria-label="Åbn menu" aria-expanded={menu} onClick={() => setMenu(true)}><span /><span /><span /></button>
          <nav className="nav nav--desktop" aria-label="Hovedmenu">
            {mainNav.map((n) =>
              "mega" in n ? (
                <div key={n.key} className="nav__item" onMouseEnter={() => setMega(n.mega)} onMouseLeave={() => setMega(null)}>
                  <button className="nav__link" type="button" aria-expanded={mega === n.mega} aria-controls={`mega-${n.mega}`} onClick={() => setMega(mega === n.mega ? null : n.mega)} aria-current={active(n.href) ? "page" : undefined}>{n.label}</button>
                  {mega === n.mega && <Mega id={n.mega} onClose={() => setMega(null)} />}
                </div>
              ) : (
                <Link key={n.key} className="nav__link" href={n.href} aria-current={active(n.href) ? "page" : undefined}>{n.label}</Link>
              ),
            )}
          </nav>
          <Link className="logo" href="/" aria-label="Knud Pedersen, til forsiden"><b>KNUD PEDERSEN</b><span>Ure &amp; smykker · Aarhus</span></Link>
          <div className="head-actions">
            <span className="hide-m"><RolexClock /></span>
            <Link className="icon-btn" href="/soeg" aria-label="Søg"><SearchIcon /></Link>
            <Link className="icon-btn hide-m" href="/oenskeliste" aria-label="Ønskeliste"><HeartIcon /><WishlistCount /></Link>
            <Link className="btn btn--sm hide-m" href="/book-tid">Book tid</Link>
          </div>
        </div>
      </header>
      {menu && (
        <div className="mobile-menu" role="dialog" aria-modal="true" aria-label="Menu" onKeyDown={(e) => e.key === "Escape" && setMenu(false)}>
          <div className="mobile-menu__top">
            <Link className="logo" href="/"><b>KNUD PEDERSEN</b></Link>
            <button className="icon-btn" type="button" aria-label="Luk menu" onClick={() => setMenu(false)} autoFocus>✕</button>
          </div>
          <nav aria-label="Mobilmenu">
            <details><summary>Ure</summary><ul>{watchLinks.map((l) => <li key={l.href}><Link href={l.href}>{l.label}</Link></li>)}<li><Link href="/ure">Alle ure</Link></li></ul></details>
            <Link href="/smykker">Smykker</Link>
            <details><summary>Mærker</summary><ul><li><Link href="/rolex/discover">Rolex</Link></li><li><Link href="/maerker/tudor">Tudor</Link></li>{otherBrands.map((b) => <li key={b.slug}><Link href={`/maerker/${b.slug}`}>{b.name}</Link></li>)}</ul></details>
            <Link href="/service">Service &amp; reparation</Link>
            <Link href="/om-os">Om os</Link>
            <Link href="/kontakt">Kontakt</Link>
            <Link href="/oenskeliste">Ønskeliste</Link>
          </nav>
          <div className="mobile-menu__foot">
            <RolexClock />
            <Link className="btn" href="/book-tid">Book tid</Link>
            <a className="btn btn--outline" href={`tel:${business.phoneE164}`}>Ring {business.phone}</a>
            <p className="muted">{business.street}, {business.postalCode} {business.city}</p>
          </div>
        </div>
      )}
    </>
  );
}
