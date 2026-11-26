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
    <section className="section tight-top">
      <div className="wrap stack-lg">
        <Breadcrumbs items={[{ name: "Smykker", href: "/smykker" }, { name: b.name, href: `/smykker/${b.slug}` }]} />
        <div className="section-head">
          <p className="eyebrow">Smykker</p>
          <h1>{b.name}</h1>
          <p className="measure muted">{b.intro}</p>
        </div>
        {pieceTypes.map((t) => {
          const group = list.filter((p) => p.type === t);
          if (!group.length) return null;
          return (
            <div key={t} className="stack">
              <h2 className="collection-head">{t}</h2>
              <div className="models">{group.map((p) => <PieceCard key={p.slug} piece={p} />)}</div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
