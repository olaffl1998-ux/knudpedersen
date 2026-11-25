import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getBrand, getModelsForBrand, nonRolexBrands, type Model } from "@/data/catalog";

/** Grupperer urene efter kollektion (i den rækkefølge de står i data) */
function groups(ms: Model[]): [string, Model[]][] {
  const map = new Map<string, Model[]>();
  for (const m of ms) {
    const k = m.collection || "Øvrige modeller";
    map.set(k, [...(map.get(k) ?? []), m]);
  }
  return [...map.entries()];
}
import ModelCard from "@/components/ModelCard";
import { Breadcrumbs } from "@/components/Seo";

type P = { params: Promise<{ brand: string }> };

export const dynamicParams = false;
export function generateStaticParams() {
  return nonRolexBrands.map((b) => ({ brand: b.slug }));
}

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const b = getBrand((await params).brand);
  if (!b) return {};
  return {
    title: `${b.name} i Aarhus – autoriseret forhandler`,
    description: `Se ${b.name} hos Knud Pedersen på Skt. Clemens Torv i Aarhus. Vejledende priser, rådgivning og service fra autoriseret forhandler.`,
    alternates: { canonical: `/ure/${b.slug}` },
  };
}

export default async function BrandPage({ params }: P) {
  const b = getBrand((await params).brand);
  if (!b || b.rolex) notFound();
  const ms = getModelsForBrand(b.slug);
  return (
    <section className="section tight-top">
      <div className="wrap stack-lg">
        <Breadcrumbs items={[{ name: "Ure", href: "/ure" }, { name: b.name, href: `/ure/${b.slug}` }]} />
        <div className="split">
          <div className="stack"><p className="eyebrow">Autoriseret forhandler</p><h1>{b.name} i Aarhus</h1></div>
          <div className="stack">
            <p className="measure">{b.intro}</p>
          </div>
        </div>
        {ms.length ? (
          groups(ms).map(([name, list]) => (
            <div key={name} className="stack">
              <h2 className="collection-head">{name} <small className="muted">({list.length})</small></h2>
              <div className="models">{list.map((m) => <ModelCard key={m.slug} model={m} />)}</div>
            </div>
          ))
        ) : (
          <div className="placeholder">
            Vi har {b.name} i butikken. Ring på 86 12 17 99 eller book et møde, så viser vi dig de aktuelle modeller.
          </div>
        )}
        <div className="cta-row"><Link className="btn" href={`/kontakt?emne=${encodeURIComponent(b.name)}`}>Book et møde om {b.name}</Link></div>
      </div>
    </section>
  );
}
