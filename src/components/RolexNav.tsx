"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { rolexNav } from "@/data/rolex";

export function RolexMenu() {
  const path = usePathname() || "";
  return (
    <nav className="rolex-menu" aria-label="Rolex-menu">
      {rolexNav.map((n) => {
        const active = n.href === "/rolex" ? path === "/rolex" : path.startsWith(n.href);
        return <Link key={n.href} href={n.href} aria-current={active ? "page" : undefined}>{n.label}</Link>;
      })}
    </nav>
  );
}

export function KeepExploring() {
  const path = usePathname() || "";
  const links = rolexNav.filter((n) => n.href !== path).slice(0, 6);
  return (
    <section className="keep-exploring" aria-labelledby="keep-exploring">
      <h2 id="keep-exploring" style={{ fontSize: "1.2rem" }}>Fortsæt med at udforske</h2>
      <ul>{links.map((n) => <li key={n.href}><Link href={n.href}>{n.label}</Link></li>)}</ul>
      <a className="back-top" href="#indhold">Tilbage til toppen</a>
    </section>
  );
}
