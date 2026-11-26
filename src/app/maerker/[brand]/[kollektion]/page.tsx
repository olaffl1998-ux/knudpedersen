import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { collectionSlug, getBrand, getModelsForBrand, nonRolexBrands } from "@/data/catalog";
import ModelCard from "@/components/ModelCard";
import { Breadcrumbs } from "@/components/Seo";

type P = { params: Promise<{ brand: string; kollektion: string }> };
export const dynamicParams = false;
export function generateStaticParams() {
  return nonRolexBrands.flatMap((b) =>
    Array.from(new Set(getModelsForBrand(b.slug).map((m) => m.collection).filter(Boolean) as string[])).map((c) => ({ brand: b.slug, kollektion: collectionSlug(c) })),
  );
}
const find = (brand: string, k: string) => {
  const b = getBrand(brand);
  if (!b || b.rolex) return null;
  const list = getModelsForBrand(b.slug).filter((m) => m.collection && collectionSlug(m.collection) === k);
  return list.length ? { b, list, name: list[0].collection! } : null;
};
export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { brand, kollektion } = await params;
  const f = find(brand, kollektion);
  if (!f) return {};
  return { title: `${f.b.name} ${f.name} i Aarhus`, description: `Se ${f.b.name} ${f.name} hos Knud Pedersen på Skt. Clemens Torv i Aarhus. ${f.list.length} modeller med vejledende priser.`, alternates: { canonical: `/maerker/${f.b.slug}/${kollektion}` } };
}

export default async function CollectionPage({ params }: P) {
  const { brand, kollektion } = await params;
  const f = find(brand, kollektion);
  if (!f) notFound();
  const { b, list, name } = f;
  const others = Array.from(new Set(getModelsForBrand(b.slug).map((m) => m.collection).filter(Boolean) as string[]));
  return (
    <>
      <div className="container"><Breadcrumbs items={[{ name: b.name, href: `/maerker/${b.slug}` }, { name, href: `/maerker/${b.slug}/${kollektion}` }]} /></div>
      <section className="container page-head">
        <span className="label">{b.name}</span>
        <h1>{name}</h1>
        <p className="lead">{list.length} {list.length === 1 ? "model" : "modeller"} fra {b.name} {name}. Vejledende priser. Book et møde, så har vi urene klar til dig.</p>
        <nav className="subcats" aria-label="Kollektioner"><ul>
          <li><Link href={`/maerker/${b.slug}`}>Alle {b.name}</Link></li>
          {others.map((c) => <li key={c}><Link href={`/maerker/${b.slug}/${collectionSlug(c)}`} aria-current={collectionSlug(c) === kollektion ? "page" : undefined}>{c}</Link></li>)}
        </ul></nav>
      </section>
      <section className="container" style={{ paddingBottom: 120 }}>
        <ul className="cards">{list.map((m) => <li key={m.slug}><ModelCard model={m} /></li>)}</ul>
      </section>
    </>
  );
}
