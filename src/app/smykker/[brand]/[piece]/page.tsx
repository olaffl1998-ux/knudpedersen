import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getJewelleryBrand, getPiece, pieces, piecesFor } from "@/data/jewellery";
import PieceCard from "@/components/PieceCard";
import { Breadcrumbs, JsonLd } from "@/components/Seo";
import { SITE_URL, business, formatPrice } from "@/lib/site";

type P = { params: Promise<{ brand: string; piece: string }> };
export const dynamicParams = false;
export function generateStaticParams() {
  return pieces.map((p) => ({ brand: p.brand, piece: p.slug }));
}
export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { brand, piece } = await params;
  const p = getPiece(brand, piece); const b = getJewelleryBrand(brand);
  if (!p || !b) return {};
  return {
    title: `${b.name} ${p.name}${p.ref ? ` ${p.ref}` : ""}`,
    description: `Se ${p.name} fra ${b.name} hos Knud Pedersen i Aarhus.${p.price ? ` Vejledende pris ${formatPrice(p.price)}.` : ""} Book tid og se smykket i butikken.`,
    openGraph: p.image ? { images: [p.image] } : undefined,
    alternates: { canonical: `/smykker/${b.slug}/${p.slug}` },
  };
}

export default async function PiecePage({ params }: P) {
  const { brand, piece } = await params;
  const p = getPiece(brand, piece); const b = getJewelleryBrand(brand);
  if (!p || !b) notFound();
  const related = piecesFor(b.slug).filter((x) => x.type === p.type && x.slug !== p.slug).slice(0, 4);
  const subject = `${b.name} ${p.name}${p.ref ? ` ${p.ref}` : ""}`;
  return (
    <section className="section tight-top">
      <div className="wrap stack-lg">
        <Breadcrumbs items={[{ name: "Smykker", href: "/smykker" }, { name: b.name, href: `/smykker/${b.slug}` }, { name: p.name, href: `/smykker/${b.slug}/${p.slug}` }]} />
        <div className="piece">
          <div className="piece-img">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            {p.image && <img src={p.image} alt={subject} fetchPriority="high" />}
          </div>
          <div className="stack">
            <p className="eyebrow">{b.name}</p>
            <h1>{p.name}</h1>
            {p.ref && <p className="muted">Varenr. {p.ref}</p>}
            <p className="price" style={{ fontSize: "1.2rem" }}>
              {p.price ? <><small>Vejl. udsalgspris</small>{formatPrice(p.price)}</> : <small>Pris på forespørgsel</small>}
            </p>
            <dl className="specs">
              <dt>Type</dt><dd>{p.type}</dd>
              {p.metal && <><dt>Metal</dt><dd>{p.metal}</dd></>}
            </dl>
            <p className="note">Smykket kan ikke købes online. Book en tid, så har vi det klar til dig i butikken på {business.street}.</p>
            <div className="cta-row">
              <Link className="btn" href={`/kontakt?emne=${encodeURIComponent(subject)}`}>Book tid og se smykket</Link>
              <a className="btn ghost" href={`tel:${business.phoneE164}`}>Ring {business.phone}</a>
            </div>
          </div>
        </div>
        {related.length > 0 && (
          <div className="stack">
            <h2 className="collection-head">Flere {p.type.toLowerCase()} fra {b.name}</h2>
            <div className="models">{related.map((r) => <PieceCard key={r.slug} piece={r} />)}</div>
          </div>
        )}
      </div>
      <JsonLd data={{
        "@context": "https://schema.org", "@type": "Product", name: subject, sku: p.ref || undefined,
        image: p.image ? `${SITE_URL}${p.image}` : undefined, brand: { "@type": "Brand", name: b.name },
        url: `${SITE_URL}/smykker/${b.slug}/${p.slug}`,
        ...(p.price ? { offers: { "@type": "Offer", priceCurrency: "DKK", price: p.price, availability: "https://schema.org/InStoreOnly", seller: { "@type": "JewelryStore", name: business.name } } } : {}),
      }} />
    </section>
  );
}
