"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { mainNav, business } from "@/lib/site";

const ROLEX_CLOCK_KEY = process.env.NEXT_PUBLIC_ROLEX_CLOCK_API_KEY;

function sectionOf(path: string) {
  if (path.startsWith("/rolex")) return "rolex";
  const first = path.split("/")[1];
  return first || "forside";
}

export default function Header() {
  const path = usePathname() || "/";
  const [open, setOpen] = useState(false);
  useEffect(() => setOpen(false), [path]);
  const active = sectionOf(path);

  return (
    <>
      <div className="topbar">
        <div className="wrap">
          <span>Besøg os på {business.street}, Aarhus</span>
          <a href={`tel:${business.phoneE164}`}>Tlf. {business.phone}</a>
        </div>
      </div>
      <header className="site">
        <div className="wrap">
          <nav className={`main${open ? " open" : ""}`} id="hovedmenu" aria-label="Hovedmenu">
            {mainNav.map((n, i) => (
              <Link key={n.key} href={n.href} className={i < 3 ? "nav-left" : "nav-right"} aria-current={active === n.key ? "page" : undefined}>
                {n.label}
              </Link>
            ))}
          </nav>
          <Link className="logo" href="/" aria-label="Knud Pedersen, til forsiden">
            <b>KNUD PEDERSEN</b>
            <span>Ure &amp; smykker · Aarhus</span>
          </Link>
          <div className="head-actions">
            {/* Rolex-uret leveres af Rolex og linker til Rolex-sektionen (krav i Rolex' guide) */}
            {ROLEX_CLOCK_KEY ? (
              <Link href="/rolex" aria-label="Rolex hos Knud Pedersen" style={{ position: "relative", display: "block" }}>
                <iframe
                  className="rolex-clock"
                  title="Rolex-ur"
                  src={`https://static.rolex.com/retailers/clock/?colour=gold&apiKey=${ROLEX_CLOCK_KEY}&lang=da`}
                  scrolling="no"
                  style={{ pointerEvents: "none" }}
                />
              </Link>
            ) : (
              <Link className="rolex-clock-slot" href="/rolex">Rolex-ur<br />(fra Rolex)</Link>
            )}
            <Link className="head-book" href="/kontakt">Book tid</Link>
            <button className="menu-btn" type="button" aria-expanded={open} aria-controls="hovedmenu" onClick={() => setOpen(!open)}>
              Menu
            </button>
          </div>
        </div>
      </header>
    </>
  );
}
