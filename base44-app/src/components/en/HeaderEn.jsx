"use client";
import Link from "@/lib/next/link";
import { usePathname } from "@/lib/next/navigation";
import { useState } from "react";
import { enNav, enToDa } from "@/data/en";
import { business } from "@/lib/site";
/** Menuen på de engelske sider */
export default function HeaderEn() {
    const path = usePathname() || "/en";
    const [menu, setMenu] = useState(false);
    const da = enToDa[path] ?? "/";
    return (<>
      <div className="topbar">
        <div className="container">
          <span className="topbar__open">Watches &amp; jewellery in Aarhus since 1887</span>
          <span className="topbar__info">
            <a className="topbar__addr" href="/en/visit">{business.street}, {business.postalCode} {business.city}</a>
            <a href={`tel:${business.phoneE164}`}>+45 {business.phone}</a>
          </span>
        </div>
      </div>
      <header className="site-header">
      <div className="container site-header__in">
        <button className="burger" type="button" aria-label="Open menu" aria-expanded={menu} onClick={() => setMenu(true)}><span /><span /><span /></button>
        <nav className="nav nav--desktop" aria-label="Main menu">
          {enNav.map((n) => (<Link key={n.href} className="nav__link" href={n.href} aria-current={path === n.href ? "page" : undefined}>{n.label}</Link>))}
        </nav>
        <Link className="logo" href="/en" aria-label="Knud Pedersen, home"><b>KNUD PEDERSEN</b><span>Watches &amp; jewellery · Aarhus</span></Link>
        <div className="head-actions">
          <Link className="lang-switch" href={da} hrefLang="da" lang="da" aria-label="Dansk version">DA</Link>
          <Link className="btn btn--sm hide-m" href="/en/visit#book">Book an appointment</Link>
        </div>
      </div>
      </header>
      {menu && (<div className="mobile-menu" role="dialog" aria-modal="true" aria-label="Menu" onKeyDown={(e) => e.key === "Escape" && setMenu(false)}>
          <div className="mobile-menu__top">
            <Link className="logo" href="/en" onClick={() => setMenu(false)}><b>KNUD PEDERSEN</b></Link>
            <button className="icon-btn" type="button" aria-label="Close menu" onClick={() => setMenu(false)} autoFocus>✕</button>
          </div>
          <nav aria-label="Mobile menu">
            {enNav.map((n) => <Link key={n.href} href={n.href} onClick={() => setMenu(false)}>{n.label}</Link>)}
            <Link href={da} hrefLang="da" onClick={() => setMenu(false)}>Dansk</Link>
          </nav>
          <Link className="btn" href="/en/visit#book" onClick={() => setMenu(false)}>Book an appointment</Link>
        </div>)}
    </>);
}
