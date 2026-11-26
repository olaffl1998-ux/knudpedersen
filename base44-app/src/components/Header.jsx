"use client";
import Link from "@/lib/next/link";
import { usePathname } from "@/lib/next/navigation";
import { useEffect, useRef, useState } from "react";
import { mainNav, business, ROLEX_CLOCK_KEY, rolexClockSrc } from "@/lib/site";
import { watchCategories, jewelleryCategories } from "@/data/categories";
import { jewelleryBrandList } from "@/data/jewellery";
import { nonRolexBrands } from "@/data/catalog";
import { rolexAssets } from "@/data/rolex";
import { todayText } from "./OpeningToday";
import { SearchIcon, HeartIcon } from "./Icons";
import { WishlistCount } from "./Wishlist";
const otherBrands = nonRolexBrands.filter((b) => b.slug !== "tudor");
/** Rolex-uret leveres af Rolex (iframe med API-nøgle) og linker til Udforsk Rolex. Indtil nøglen er sat vises en pladsholder. */
function RolexClock() {
    return ROLEX_CLOCK_KEY ? (<Link href="/rolex/discover" aria-label="Rolex hos Knud Pedersen" style={{ position: "relative", display: "block" }}>
      <iframe className="rolex-clock" title="Rolex-ur" src={rolexClockSrc()} scrolling="no" style={{ pointerEvents: "none" }}/>
    </Link>) : (<Link className="rolex-clock-slot" href="/rolex/discover" aria-label="Officiel Rolex-forhandler, Udforsk Rolex">
      {/* [Rolex-ur fra Rolex vises her, når API-nøglen er leveret] */}
            <img src={rolexAssets.plaque} alt="Officiel Rolex-forhandler" width={120} height={60}/>
    </Link>);
}
const col = (title, links, cls) => (<div className={cls}><h2>{title}</h2><ul>{links.map((l) => <li key={l.href + l.label}><Link href={l.href}>{l.label}</Link></li>)}</ul></div>);
function Mega({ id, onClose }) {
    const popular = ["tudor", "omega", "breitling", "grand-seiko", "tag-heuer", "longines"].map((s) => nonRolexBrands.find((x) => x.slug === s)).filter(Boolean).map((b) => ({ href: `/maerker/${b.slug}`, label: b.name }));
    let body = null;
    if (id === "ure")
        body = (<>
      {col("Kategorier", [{ href: "/ure", label: "Alle ure" }, ...watchCategories.slice(0, 4).map((c) => ({ href: `/ure/${c.slug}`, label: c.label }))])}
      {col("Materiale og pris", [...watchCategories.slice(4).map((c) => ({ href: `/ure/${c.slug}`, label: c.label })), { href: "/brugte-ure", label: "Brugte ure" }])}
      {col("Populære mærker", [...popular, { href: "/maerker", label: "Alle mærker" }])}
      {col("Rolex", [{ href: "/rolex/discover", label: "Udforsk Rolex" }, { href: "/rolex/watches", label: "Rolex-ure" }, { href: "/rolex/new-watches", label: "Nye Rolex-ure" }])}
    </>);
    else if (id === "smykker")
        body = (<>
      {col("Smykker", [{ href: "/smykker", label: "Alle smykker" }, ...jewelleryCategories.map((c) => ({ href: `/smykker/${c.slug}`, label: c.label }))])}
      {col("Ringe", [{ href: "/vielsesringe", label: "Vielsesringe" }, { href: "/smykker/ringe", label: "Forlovelsesringe og ringe med sten" }, { href: "/book-tid?formaal=vielsesringe", label: "Book tid til vielsesringe" }])}
      {col("Mærker", jewelleryBrandList.map((b) => ({ href: `/smykker/${b.slug}`, label: b.name })))}
      {col("Service", [{ href: "/service", label: "Smykkeservice" }, { href: "/service", label: "Omtrækning af perlekæder" }])}
    </>);
    else if (id === "maerker")
        body = (<>
      <div className="mega__top"><h2>Officiel forhandler</h2><ul><li><Link href="/rolex/discover">Rolex</Link></li><li><Link href="/maerker/tudor">Tudor</Link></li></ul></div>
      <div className="mega__brands"><h2>Alle mærker</h2><ul>{otherBrands.map((b) => <li key={b.slug}><Link href={`/maerker/${b.slug}`}>{b.name}</Link></li>)}<li><Link href="/maerker">Se alle mærker</Link></li></ul></div>
    </>);
    else if (id === "service")
        body = (<>
      {col("Service", [{ href: "/service", label: "Service og reparation" }, { href: "/service#proces", label: "Sådan foregår det" }, { href: "/book-tid?formaal=service", label: "Book tid til service" }])}
      {col("Rolex", [{ href: "/rolex/servicing", label: "Rolex-serviceeftersyn" }, { href: "/rolex/knud-pedersen", label: "Rolex hos Knud Pedersen" }])}
      {col("Smykker", [{ href: "/service", label: "Smykkeservice" }, { href: "/service", label: "Omtrækning af perlekæder" }])}
      {col("Kontakt", [{ href: "/kontakt", label: "Kontakt os" }, { href: `tel:${business.phoneE164}`, label: `Ring ${business.phone}` }])}
    </>);
    else if (id === "om-os")
        body = (<>
      {col("Om Knud Pedersen", [{ href: "/om-os", label: "Vores historie" }, { href: "/om-os#vaerksted", label: "Værkstedet" }, { href: "/om-os#job", label: "Job hos os" }])}
      {col("Besøg os", [{ href: "/kontakt", label: "Kontakt og åbningstider" }, { href: "/book-tid", label: "Book et møde" }])}
      {col("Rolex", [{ href: "/rolex/knud-pedersen", label: "Rolex hos Knud Pedersen" }])}
      {col("Mere", [{ href: "/oenskeliste", label: "Ønskeliste" }, { href: "/handelsbetingelser", label: "Handelsbetingelser" }])}
    </>);
    return (<div className="mega" id={`mega-${id}`} onKeyDown={(e) => e.key === "Escape" && onClose()}>
      <div className="container mega__in">{body}</div>
    </div>);
}
export default function Header() {
    const path = usePathname() || "/";
    const [mega, setMega] = useState(null);
    const [menu, setMenu] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [hidden, setHidden] = useState(false);
    const [today, setToday] = useState("");
    const ref = useRef(null);
    // Menuen lukker først efter et øjeblik, så man kan nå at føre musen ned i den
    const timer = useRef(undefined);
    const openMega = (id) => { window.clearTimeout(timer.current); setMega(id); };
    const closeSoon = () => { window.clearTimeout(timer.current); timer.current = window.setTimeout(() => setMega(null), 350); };
    useEffect(() => { setMega(null); setMenu(false); }, [path]);
    useEffect(() => {
        setToday(todayText());
        let last = window.scrollY;
        // Headeren glider væk, når man scroller ned, og kommer igen, så snart man scroller op
        const on = () => {
            const y = window.scrollY;
            setScrolled(y > 24);
            if (Math.abs(y - last) > 6) {
                setHidden(y > 520 && y > last);
                last = y;
            }
        };
        on();
        window.addEventListener("scroll", on, { passive: true });
        return () => window.removeEventListener("scroll", on);
    }, []);
    useEffect(() => {
        if (!mega)
            return;
        const close = (e) => { if (ref.current && !ref.current.contains(e.target))
            setMega(null); };
        document.addEventListener("mousedown", close);
        return () => document.removeEventListener("mousedown", close);
    }, [mega]);
    useEffect(() => { document.body.style.overflow = menu ? "hidden" : ""; }, [menu]);
    const active = (href) => (href === "/" ? path === "/" : path.startsWith(href));
    return (<>
      <div className="topbar">
        <div className="container">
          <span className={`topbar__open${today.startsWith("Åbent") ? "" : " is-closed"}`} suppressHydrationWarning>{today || "Åbningstider"}</span>
          <span className="topbar__info">
            <a className="topbar__addr" href="/kontakt">{business.street}, {business.postalCode} {business.city}</a>
            <a href={`tel:${business.phoneE164}`}>Tlf. {business.phone}</a>
          </span>
        </div>
      </div>
      <header ref={ref} className={`site-header${scrolled ? " is-scrolled" : ""}${hidden && !mega && !menu ? " is-hidden" : ""}`}>
        <div className="container site-header__in">
          <button className="burger" type="button" aria-label="Åbn menu" aria-expanded={menu} onClick={() => setMenu(true)}><span /><span /><span /></button>
          <nav className="nav nav--desktop" aria-label="Hovedmenu">
            {mainNav.map((n) => (<div key={n.key} className={`nav__item${mega === n.mega ? " is-open" : ""}`} onMouseEnter={() => openMega(n.mega)} onMouseLeave={closeSoon}>
                <Link className="nav__link" href={n.href} aria-haspopup="true" aria-expanded={mega === n.mega} aria-controls={`mega-${n.mega}`} aria-current={active(n.href) ? "page" : undefined} onFocus={() => openMega(n.mega)}>{n.label}</Link>
                {mega === n.mega && <Mega id={n.mega} onClose={() => setMega(null)}/>}
              </div>))}
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
      {menu && (<div className="mobile-menu" role="dialog" aria-modal="true" aria-label="Menu" onKeyDown={(e) => e.key === "Escape" && setMenu(false)}>
          <div className="mobile-menu__top">
            <Link className="logo" href="/"><b>KNUD PEDERSEN</b></Link>
            <button className="icon-btn" type="button" aria-label="Luk menu" onClick={() => setMenu(false)} autoFocus>✕</button>
          </div>
          <nav aria-label="Mobilmenu">
            <details><summary>Ure</summary><ul><li><Link href="/ure">Alle ure</Link></li>{watchCategories.map((c) => <li key={c.slug}><Link href={`/ure/${c.slug}`}>{c.label}</Link></li>)}<li><Link href="/brugte-ure">Brugte ure</Link></li></ul></details>
            <details><summary>Smykker</summary><ul><li><Link href="/smykker">Alle smykker</Link></li>{jewelleryCategories.map((c) => <li key={c.slug}><Link href={`/smykker/${c.slug}`}>{c.label}</Link></li>)}<li><Link href="/vielsesringe">Vielsesringe</Link></li></ul></details>
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
        </div>)}
    </>);
}
