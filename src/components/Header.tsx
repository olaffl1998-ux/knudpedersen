"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { mainNav, business, ROLEX_CLOCK_KEY, rolexClockSrc } from "@/lib/site";
import { watchCategories, jewelleryCategories } from "@/data/categories";
import { jewelleryBrandList } from "@/data/jewellery";
import { nonRolexBrands } from "@/data/catalog";
import { rolexAssets } from "@/data/rolexAssets";
import { todayText } from "./OpeningToday";
import { SearchIcon, HeartIcon } from "./Icons";
import { WishlistCount } from "./Wishlist";


const otherBrands = nonRolexBrands.filter((b) => b.slug !== "tudor");

/** Rolex-uret leveres af Rolex (iframe med API-nøgle) og linker til Udforsk Rolex. Indtil nøglen er sat vises en pladsholder. */
function RolexClock() {
  return ROLEX_CLOCK_KEY ? (
    <Link href="/rolex/discover" aria-label="Rolex hos Knud Pedersen" style={{ position: "relative", display: "block" }}>
      <iframe className="rolex-clock" title="Rolex-ur" src={rolexClockSrc()} scrolling="no" style={{ pointerEvents: "none" }} />
    </Link>
  ) : (
    <Link className="rolex-clock-slot" href="/rolex/discover" aria-label="Officiel Rolex-forhandler, Udforsk Rolex">
      {/* [Rolex-ur fra Rolex vises her, når API-nøglen er leveret] */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={rolexAssets.plaque} alt="Officiel Rolex-forhandler" width={120} height={60} />
    </Link>
  );
}

/** Smykke-menuen: faste links i den rækkefølge, Knud Pedersen ønsker */
const SMYKKE_RINGE = [
  { href: "/vielsesringe", label: "Vielsesringe" },
  { href: "/vielsesringe", label: "Forlovelsesringe" },
  { href: "/smykker/ringe", label: "Ringe med sten" },
];
const SMYKKE_SERVICE = [
  { href: "/service", label: "Smykkeservice" },
  { href: "/service", label: "Omtrækning af perlekæder" },
];
const SMYKKE_BRANDS = ["georg-jensen", "chopard", "gucci", "marselis"].map((s) => jewelleryBrandList.find((b) => b.slug === s)!).filter(Boolean);
const BRIDAL_IMG = "/billeder/shop/R-ASO4-S-GG-Aisling-Ring-Oval-Center-Round-Sides-GG-standing-1200.webp";

/** Fremhævet kort med vielsesringe (bruges i mega-menuen og nederst i mobilmenuen) */
function BridalCard() {
  return (
    <div className="bridal-card">
      <Link href="/vielsesringe" className="bridal-card__media" tabIndex={-1} aria-hidden="true">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={BRIDAL_IMG} alt="" loading="eager" />
      </Link>
      <div className="bridal-card__text">
        <strong>Vielsesringe</strong>
        <p>Find jeres ringe sammen med os i butikken på Skt. Clemens Torv.</p>
        <Link className="btn" href="/book-tid?formaal=vielsesringe">Book tid til vielsesringe</Link>
      </div>
    </div>
  );
}

const col = (title: string, links: { href: string; label: string }[], cls?: string) => (
  <div className={cls}><h2>{title}</h2><ul>{links.map((l) => <li key={l.href + l.label}><Link href={l.href}>{l.label}</Link></li>)}</ul></div>
);

function Mega({ id, onClose }: { id: string; onClose: () => void }) {
  const popular = ["tudor", "omega", "breitling", "grand-seiko", "tag-heuer", "longines"].map((s) => nonRolexBrands.find((x) => x.slug === s)).filter(Boolean).map((b) => ({ href: `/maerker/${b!.slug}`, label: b!.name }));
  let body: React.ReactNode = null;
  if (id === "ure") body = (
    <>
      {col("Kategorier", [{ href: "/ure", label: "Alle ure" }, ...watchCategories.slice(0, 4).map((c) => ({ href: `/ure/${c.slug}`, label: c.label }))])}
      {col("Populære mærker", [...popular, { href: "/maerker", label: "Alle mærker" }])}
      {col("Rolex", [{ href: "/rolex/discover", label: "Udforsk Rolex" }, { href: "/rolex/watches", label: "Rolex-ure" }, { href: "/rolex/new-watches", label: "Nye Rolex-ure" }])}
    </>
  );
  else if (id === "smykker") return (
    <div className="mega mega--smykker" id={`mega-${id}`} onKeyDown={(e) => e.key === "Escape" && onClose()}>
      <div className="container mega__in">
        <div className="mega__cols">
          <div>
            <h2>Smykker</h2>
            <ul>
              {jewelleryCategories.map((c) => <li key={c.slug}><Link href={`/smykker/${c.slug}`}>{c.label}</Link></li>)}
              <li className="mega__all"><Link href="/smykker">Se alle smykker <span aria-hidden="true">→</span></Link></li>
            </ul>
          </div>
          <div>
            <h2>Ringe</h2>
            <ul>{SMYKKE_RINGE.map((l) => <li key={l.label}><Link href={l.href}>{l.label}</Link></li>)}</ul>
            <h2 className="mega__sub">Service</h2>
            <ul>{SMYKKE_SERVICE.map((l) => <li key={l.label}><Link href={l.href}>{l.label}</Link></li>)}</ul>
          </div>
          <div>
            <h2>Udvalgte mærker</h2>
            <ul className="mega__brandlist">
              {SMYKKE_BRANDS.map((b) => <li key={b.slug}><Link href={`/smykker/${b.slug}`}>{b.name}</Link></li>)}
              <li className="mega__all"><Link href="/maerker">Alle mærker <span aria-hidden="true">→</span></Link></li>
            </ul>
          </div>
        </div>
        <BridalCard />
      </div>
    </div>
  );
  else if (id === "maerker") body = (
    <>
      <div className="mega__top"><h2>Officiel forhandler</h2><ul><li><Link href="/rolex/discover">Rolex</Link></li><li><Link href="/maerker/tudor">Tudor</Link></li></ul></div>
      <div className="mega__brands"><h2>Alle mærker</h2><ul>{otherBrands.map((b) => <li key={b.slug}><Link href={`/maerker/${b.slug}`}>{b.name}</Link></li>)}<li><Link href="/maerker">Se alle mærker</Link></li></ul></div>
    </>
  );
  else if (id === "service") body = (
    <>
      {col("Service", [{ href: "/service", label: "Service og reparation" }, { href: "/service#proces", label: "Sådan foregår det" }, { href: "/book-tid?formaal=service", label: "Book tid til service" }])}
      {col("Rolex", [{ href: "/rolex/servicing", label: "Rolex-serviceeftersyn" }, { href: "/rolex/knud-pedersen", label: "Rolex hos Knud Pedersen" }])}
      {col("Smykker", [{ href: "/service", label: "Smykkeservice" }, { href: "/service", label: "Omtrækning af perlekæder" }])}
      {col("Kontakt", [{ href: "/kontakt", label: "Kontakt os" }, { href: `tel:${business.phoneE164}`, label: `Ring ${business.phone}` }])}
    </>
  );
  else if (id === "om-os") body = (
    <>
      {col("Om Knud Pedersen", [{ href: "/om-os", label: "Vores historie" }, { href: "/om-os#vaerksted", label: "Værkstedet" }, { href: "/om-os#job", label: "Job hos os" }])}
      {col("Besøg os", [{ href: "/kontakt", label: "Kontakt og åbningstider" }, { href: "/book-tid", label: "Book et møde" }])}
      {col("Rolex", [{ href: "/rolex/knud-pedersen", label: "Rolex hos Knud Pedersen" }])}
      {col("Mere", [{ href: "/oenskeliste", label: "Ønskeliste" }, { href: "/handelsbetingelser", label: "Handelsbetingelser" }])}
    </>
  );
  return (
    <div className="mega" id={`mega-${id}`} onKeyDown={(e) => e.key === "Escape" && onClose()}>
      <div className="container mega__in">{body}</div>
    </div>
  );
}

export default function Header() {
  const path = usePathname() || "/";
  const [mega, setMega] = useState<string | null>(null);
  const [menu, setMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [today, setToday] = useState("");
  const ref = useRef<HTMLElement>(null);
  // Menuen lukker først efter et øjeblik, så man kan nå at føre musen ned i den
  const timer = useRef<number | undefined>(undefined);
  const openMega = (id: string) => { window.clearTimeout(timer.current); setMega(id); };
  const closeSoon = () => { window.clearTimeout(timer.current); timer.current = window.setTimeout(() => setMega(null), 150); };

  useEffect(() => { setMega(null); setMenu(false); }, [path]);
  useEffect(() => {
    setToday(todayText());
    let last = window.scrollY;
    // Headeren glider væk, når man scroller ned, og kommer igen, så snart man scroller op
    const on = () => {
      const y = window.scrollY;
      setScrolled(y > 24);
      if (Math.abs(y - last) > 6) { setHidden(y > 520 && y > last); last = y; }
    };
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
  useEffect(() => {
    if (!mega) return;
    const k = (e: KeyboardEvent) => { if (e.key === "Escape") { (document.querySelector(`[aria-controls="mega-${mega}"]`) as HTMLElement | null)?.focus(); setMega(null); } };
    document.addEventListener("keydown", k);
    return () => document.removeEventListener("keydown", k);
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
      <div className={`mega-scrim${mega ? " is-on" : ""}`} aria-hidden="true" onMouseEnter={() => setMega(null)} />
      <header ref={ref} className={`site-header${scrolled ? " is-scrolled" : ""}${hidden && !mega && !menu ? " is-hidden" : ""}`}>
        <div className="container site-header__in">
          <button className="burger" type="button" aria-label="Åbn menu" aria-expanded={menu} onClick={() => setMenu(true)}><span /><span /><span /></button>
          <nav className="nav nav--desktop" aria-label="Hovedmenu">
            {mainNav.map((n) => !n.mega ? (
              <div key={n.key} className="nav__item">
                <Link className="nav__link" href={n.href} aria-current={active(n.href) || (n.key === "rolex" && path.startsWith("/rolex")) ? "page" : undefined} onMouseEnter={() => setMega(null)} onFocus={() => setMega(null)}>{n.label}</Link>
              </div>
            ) : (
              <div key={n.key} className={`nav__item${mega === n.mega ? " is-open" : ""}`} onMouseEnter={() => openMega(n.mega!)} onMouseLeave={closeSoon}>
                <Link className="nav__link" href={n.href} aria-haspopup="true" aria-expanded={mega === n.mega} aria-controls={`mega-${n.mega}`} aria-current={active(n.href) ? "page" : undefined} onFocus={() => openMega(n.mega!)}>{n.label}</Link>
                {mega === n.mega && <Mega id={n.mega!} onClose={() => { setMega(null); (document.querySelector(`[aria-controls="mega-${n.mega}"]`) as HTMLElement | null)?.focus(); }} />}
              </div>
            ))}
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
            <Link href="/rolex/discover">Rolex</Link>
            <details><summary>Ure</summary><ul><li><Link href="/ure">Alle ure</Link></li>{watchCategories.map((c) => <li key={c.slug}><Link href={`/ure/${c.slug}`}>{c.label}</Link></li>)}<li><Link href="/brugte-ure">Brugte ure</Link></li></ul></details>
            <details className="mm-smykker"><summary>Smykker</summary>
              <div className="mm-group"><h3>Smykker</h3><ul>{jewelleryCategories.map((c) => <li key={c.slug}><Link href={`/smykker/${c.slug}`}>{c.label}</Link></li>)}<li><Link href="/smykker"><b>Se alle smykker →</b></Link></li></ul></div>
              <div className="mm-group"><h3>Ringe</h3><ul>{SMYKKE_RINGE.map((l) => <li key={l.label}><Link href={l.href}>{l.label}</Link></li>)}</ul></div>
              <div className="mm-group"><h3>Service</h3><ul>{SMYKKE_SERVICE.map((l) => <li key={l.label}><Link href={l.href}>{l.label}</Link></li>)}</ul></div>
              <div className="mm-group"><h3>Udvalgte mærker</h3><ul>{SMYKKE_BRANDS.map((b) => <li key={b.slug}><Link href={`/smykker/${b.slug}`}>{b.name}</Link></li>)}<li><Link href="/maerker"><b>Alle mærker →</b></Link></li></ul></div>
              <BridalCard />
            </details>
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
