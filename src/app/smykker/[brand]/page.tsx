import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getJewelleryBrand, jewelleryBrandList, pieceTypes, piecesFor } from "@/data/jewellery";
import PieceCard from "@/components/PieceCard";
import { Breadcrumbs } from "@/components/Seo";

type P = { params: Promise<{ brand: string }> };
export const dynamicParams = false;
export function generateStaticParams() {
  return jewelleryBrandList.map((b) => ({ brand: b.slug }));
}
export async function generateMetadata({ params }: P): Promise<Metadata> {
  const b = getJewelleryBrand((await params).brand);
  if (!b) return {};
  return {
    title: `${b.name} smykker i Aarhus`,
    description: `Se ${b.name} smykker hos Knud Pedersen på Skt. Clemens Torv i Aarhus. ${b.intro}`,
    alternates: { canonical: `/smykker/${b.slug}` },
  };
}

export default async function BrandPage({ params }: P) {
  const b = getJewelleryBrand((await params).brand);
  if (!b) notFound();
  const list = piecesFor(b.slug);
  return (
    <>
      <div className="container"><Breadcrumbs items={[{ name: "Smykker", href: "/smykker" }, { name: b.name, href: `/smykker/${b.slug}` }]} /></div>
      <section className="container page-head">
        <span className="label">Smykker</span>
        <h1>{b.name}</h1>
        <p className="lead">{b.intro}</p>
      </section>
      <div className="container" style={{ paddingBottom: 120 }}>
        {pieceTypes.map((t) => {
          const group = list.filter((p) => p.type === t);
          if (!group.length) return null;
          return (
            <section key={t} style={{ marginBottom: 72 }} aria-labelledby={`t-${t}`}>
              <h2 id={`t-${t}`}>{t}</h2>
              <ul className="cards">{group.map((p) => <li key={p.slug}><PieceCard piece={p} /></li>)}</ul>
            </section>
          );
        })}
      </div>
    </>
  );
}
