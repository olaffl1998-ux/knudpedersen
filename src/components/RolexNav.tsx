"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { rolexAssets, rolexNav } from "@/data/rolex";

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
  const links = rolexNav.filter((n) => n.href !== path && rolexAssets.keepExploring[n.href]);
  return (
    <section className="keep-exploring" aria-labelledby="keep-exploring">
      <h2 id="keep-exploring" style={{ fontSize: "1.2rem" }}>Fortsæt med at udforske</h2>
      <ul>
        {links.map((n) => (
          <li key={n.href}>
            <Link href={n.href}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={rolexAssets.keepExploring[n.href]} alt="" loading="lazy" />
              <span>{n.label}</span>
            </Link>
          </li>
        ))}
      </ul>
      <a className="back-top" href="#indhold">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={rolexAssets.crown} alt="" width={28} height={30} />
        <span>Tilbage til toppen</span>
      </a>
    </section>
  );
}
