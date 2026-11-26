import type { Metadata } from "next";
import Link from "next/link";
import { RImg, RolexPage } from "@/components/rolex/parts";
import { NEW_YEAR, RETAILER, catalogueNotice, getCollection, rolexGroups, rolexPageBlocks, type Block } from "@/data/rolex";

export const metadata: Metadata = {
  title: { absolute: `Rolex-ure i ${RETAILER.city} | ${RETAILER.name}` },
  description: `Se alle Rolex-kollektioner hos ${RETAILER.name}, officiel Rolex-forhandler i ${RETAILER.city}: Classic, Professional og Perpetual.`,
  alternates: { canonical: "/rolex/watches" },
};

export default function RolexWatches() {
  const cover = rolexPageBlocks.watches.find((b) => b.type === "image") as Extract<Block, { type: "image" }>;
  const nw = rolexPageBlocks.watches.find((b) => b.type === "image" && b.href === "/rolex/new-watches") as Extract<Block, { type: "image" }> | undefined;
  return (
    <RolexPage crumbs={[{ name: "Rolex-ure", href: "/rolex/watches" }]} current="/rolex/watches">
      <RImg img={{ l: cover?.landscape, p: cover?.portrait }} alt="Rolex-kollektion" className="rx-cover" eager />
      <section className="rx-intro">
        <h1>Rolex-ure hos {RETAILER.name} i {RETAILER.city}</h1>
        {catalogueNotice.map((t) => <p key={t}>{t}</p>)}
      </section>
      {nw && (
        <Link href="/rolex/new-watches" className="rx-feature-link">
          <RImg img={{ l: nw.landscape, p: nw.portrait }} alt={`Rolex nye ure ${NEW_YEAR}`} />
          <span><small>Nye ure i {NEW_YEAR}</small><strong>Her begynder en ny verden</strong></span>
        </Link>
      )}
      {rolexGroups.map((g) => (
        <section key={g.name} className="rx-group" aria-labelledby={`g-${g.name}`}>
          <h2 id={`g-${g.name}`}>{g.title}</h2>
          <ul className="rx-grid rx-grid-cols">
            {g.items.map((slug) => {
              const c = getCollection(slug)!;
              return (
                <li key={slug}>
                  <Link href={`/rolex/${slug}`} className="rx-col-card">
                    <RImg img={c.card} alt={`Rolex ${c.name}`} />
                    <strong>{c.name}</strong>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      ))}
      <section className="rx-group">
        <h2>Rolex-accessories</h2>
        <p><Link className="rx-btn rx-btn-ghost" href="/rolex/accessories">Se Rolex-accessories</Link></p>
      </section>
    </RolexPage>
  );
}
