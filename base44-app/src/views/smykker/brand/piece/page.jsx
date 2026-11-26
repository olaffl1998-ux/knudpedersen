import Link from "@/lib/next/link";
import { notFound } from "@/lib/next/navigation";
import { getJewelleryBrand, getPiece, pieces, piecesFor } from "@/data/jewellery";
import PieceCard from "@/components/PieceCard";
import { Breadcrumbs, JsonLd } from "@/components/Seo";
import { SITE_URL, business, formatPrice } from "@/lib/site";
export const dynamicParams = false;
export function generateStaticParams() {
    return pieces.map((p) => ({ brand: p.brand, piece: p.slug }));
}
export function generateMetadata({ params }) {
    const { brand, piece } = params;
    const p = getPiece(brand, piece);
    const b = getJewelleryBrand(brand);
    if (!p || !b)
        return {};
    return {
        title: `${b.name} ${p.name}${p.ref ? ` ${p.ref}` : ""}`,
        description: `Se ${p.name} fra ${b.name} hos Knud Pedersen i Aarhus.${p.price ? ` Vejledende pris ${formatPrice(p.price)}.` : ""} Book tid og se smykket i butikken.`,
        openGraph: p.image ? { images: [p.image] } : undefined,
        alternates: { canonical: `/smykker/${b.slug}/${p.slug}` },
    };
}
export default function PiecePage({ params }) {
    const { brand, piece } = params;
    const p = getPiece(brand, piece);
    const b = getJewelleryBrand(brand);
    if (!p || !b)
        notFound();
    const related = piecesFor(b.slug).filter((x) => x.type === p.type && x.slug !== p.slug).slice(0, 4);
    const subject = `${b.name} ${p.name}${p.ref ? ` ${p.ref}` : ""}`;
    return (<>
      <div className="container"><Breadcrumbs items={[{ name: "Smykker", href: "/smykker" }, { name: b.name, href: `/smykker/${b.slug}` }, { name: p.name, href: `/smykker/${b.slug}/${p.slug}` }]}/></div>
      <section className="container pdp">
        <div className="pdp__media">
                    {p.image ? <img src={p.image} alt={subject} fetchPriority="high"/> : <div className="ph" aria-hidden="true">[Produktbillede]</div>}
        </div>
        <div>
          <span className="label">{b.name}</span>
          <h1>{p.name}</h1>
          {p.ref && <p className="muted">Varenr. {p.ref}</p>}
          <p className="pdp__price">{p.price ? <><small>Vejledende udsalgspris</small>{formatPrice(p.price)}</> : "Pris på forespørgsel"}</p>
          <div className="btn-row">
            <Link className="btn" href={`/book-tid?emne=${encodeURIComponent(subject)}&formaal=smykker`}>Book tid og se smykket</Link>
            <a className="btn btn--outline" href={`tel:${business.phoneE164}`}>Ring {business.phone}</a>
          </div>
          <p className="notice" style={{ marginTop: 24 }}>Smykket kan ikke købes online. Book en tid, så har vi det klar til dig i butikken på {business.street}.</p>
          <dl className="specs" style={{ marginTop: 24 }}>
            <div><dt>Type</dt><dd>{p.type}</dd></div>
            {p.metal && <div><dt>Metal</dt><dd>{p.metal}</dd></div>}
            {p.ref && <div><dt>Varenummer</dt><dd>{p.ref}</dd></div>}
            <div><dt>Mærke</dt><dd>{b.name}</dd></div>
          </dl>
        </div>
      </section>
      {related.length > 0 && (<section className="section container">
          <h2>Flere {p.type.toLowerCase()} fra {b.name}</h2>
          <ul className="cards">{related.map((r) => <li key={r.slug}><PieceCard piece={r}/></li>)}</ul>
        </section>)}
      <JsonLd data={{
            "@context": "https://schema.org", "@type": "Product", name: subject, sku: p.ref || undefined,
            image: p.image ? `${SITE_URL}${p.image}` : undefined, brand: { "@type": "Brand", name: b.name },
            url: `${SITE_URL}/smykker/${b.slug}/${p.slug}`,
            ...(p.price ? { offers: { "@type": "Offer", priceCurrency: "DKK", price: p.price, availability: "https://schema.org/InStoreOnly", seller: { "@type": "JewelryStore", name: business.name } } } : {}),
        }}/>
    </>);
}
