import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Catalog from "@/components/Catalog";
import { models, priceBands } from "@/data/catalog";
import { getWatchCategory, watchCategories } from "@/data/categories";
import { toItems } from "@/lib/watchItems";
import { Breadcrumbs } from "@/components/Seo";

type P = { params: Promise<{ kategori: string }> };
export const dynamicParams = false;
export function generateStaticParams() {
  return watchCategories.map((c) => ({ kategori: c.slug }));
}
export async function generateMetadata({ params }: P): Promise<Metadata> {
  const c = getWatchCategory((await params).kategori);
  if (!c) return {};
  return { title: `${c.title} i Aarhus`, description: `${c.intro} Se dem hos Knud Pedersen på Skt. Clemens Torv i Aarhus.`, alternates: { canonical: `/ure/${c.slug}` } };
}

export default async function WatchCategoryPage({ params }: P) {
  const c = getWatchCategory((await params).kategori);
  if (!c) notFound();
  const list = models.filter(c.filter);
  return (
    <>
      <div className="container"><Breadcrumbs items={[{ name: "Ure", href: "/ure" }, { name: c.label, href: `/ure/${c.slug}` }]} /></div>
      <section className="container page-head">
        <span className="label">Ure</span>
        <h1>{c.title}</h1>
        <p className="lead">{c.intro} {list.length} ure. Vejledende priser.</p>
        <nav className="subcats" aria-label="Kategorier"><ul>
          <li><Link href="/ure">Alle ure</Link></li>
          {watchCategories.map((x) => <li key={x.slug}><Link href={`/ure/${x.slug}`} aria-current={x.slug === c.slug ? "page" : undefined}>{x.label}</Link></li>)}
        </ul></nav>
      </section>
      <section className="container" style={{ paddingBottom: 120 }}>
        <Catalog key={c.slug} items={toItems(list)} bandOrder={priceBands.map((b) => b.label)} />
      </section>
    </>
  );
}
