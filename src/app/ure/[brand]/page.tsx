import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getBrand, getModelsForBrand, nonRolexBrands } from "@/data/catalog";
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
            <p className="note">Teksten udbygges til ca. 300 ord, skrevet til Knud Pedersen og ikke kopieret fra mærket.</p>
          </div>
        </div>
        {ms.length ? (
          <div className="models">{ms.map((m) => <ModelCard key={m.slug} model={m} />)}</div>
        ) : (
          <div className="placeholder">
            Modellerne for {b.name} importeres fra mærkets forhandlerportal med billeder, specifikationer, vejledende priser og kompatible remme og lænker.
          </div>
        )}
        <div className="cta-row"><Link className="btn" href={`/kontakt?emne=${encodeURIComponent(b.name)}`}>Book et møde om {b.name}</Link></div>
      </div>
    </section>
  );
}
