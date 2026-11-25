import type { Metadata } from "next";
import Link from "next/link";
import { brands, brandHref, models } from "@/data/catalog";
import ModelCard from "@/components/ModelCard";
import { Breadcrumbs } from "@/components/Seo";

export const metadata: Metadata = {
  title: "Ure i Aarhus – Rolex, Tudor, Omega, Grand Seiko og flere",
  description: "Se ure fra 15 anerkendte mærker hos Knud Pedersen i Aarhus. Vejledende priser online, rådgivning og prøvning i butikken på Skt. Clemens Torv.",
  alternates: { canonical: "/ure" },
};

/** Første ur fra hvert mærke */
const featured = brands.flatMap((b) => models.find((m) => m.brand === b.slug) ?? []);

export default function Ure() {
  return (
    <section className="section tight-top">
      <div className="wrap stack-lg">
        <Breadcrumbs items={[{ name: "Ure", href: "/ure" }]} />
        <div className="stack">
          <p className="eyebrow">Alle mærker</p>
          <h1>Ure hos Knud Pedersen</h1>
          <p className="measure muted">Se modellerne her, og kom forbi og prøv dem. Alle ure viser vejledende udsalgspris. Ure kan ikke købes online.</p>
        </div>
        <div className="brand-grid">
          {brands.map((b) => <Link key={b.slug} href={brandHref(b)}>{b.name}<small>{b.kind}</small></Link>)}
        </div>
        <h2>Udvalgte modeller</h2>
        <div className="models">{featured.map((m) => <ModelCard key={`${m.brand}-${m.slug}`} model={m} />)}</div>
      </div>
    </section>
  );
}
