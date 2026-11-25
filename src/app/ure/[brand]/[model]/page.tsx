import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getBrand, getModel, models, straps } from "@/data/catalog";
import StrapPicker from "@/components/StrapPicker";
import { Breadcrumbs, JsonLd } from "@/components/Seo";
import { SITE_URL, business, formatPrice } from "@/lib/site";

type P = { params: Promise<{ brand: string; model: string }> };

export const dynamicParams = false;
export function generateStaticParams() {
  return models.map((m) => ({ brand: m.brand, model: m.slug }));
}

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { brand, model } = await params;
  const m = getModel(brand, model);
  const b = getBrand(brand);
  if (!m || !b) return {};
  return {
    title: `${b.name} ${m.name} ${m.ref}`,
    description: `Se ${b.name} ${m.name}${m.size ? ` ${m.size}` : ""} (ref. ${m.ref}) hos Knud Pedersen i Aarhus. Vejledende pris ${formatPrice(m.price)}. Se remme og lænker, og book tid til at prøve uret.`,
    openGraph: m.image ? { images: [m.image] } : undefined,
    alternates: { canonical: `/ure/${b.slug}/${m.slug}` },
  };
}

export default async function ModelPage({ params }: P) {
  const { brand, model } = await params;
  const m = getModel(brand, model);
  const b = getBrand(brand);
  if (!m || !b) notFound();
  const strapList = m.straps.map((k) => straps[k]);
  const url = `${SITE_URL}/ure/${b.slug}/${m.slug}`;

  return (
    <section className="section tight-top">
      <div className="wrap">
        <Breadcrumbs items={[{ name: "Ure", href: "/ure" }, { name: b.name, href: `/ure/${b.slug}` }, { name: `${m.name} ${m.ref}`, href: `/ure/${b.slug}/${m.slug}` }]} />
        <StrapPicker model={m} straps={strapList} brandName={b.name} />
        <div className="split" style={{ marginTop: "3rem" }}>
          <div className="stack">
            <p className="eyebrow">{b.name}</p>
            <h1>{m.name}</h1>
            <p className="muted">Ref. {m.ref}{m.size && ` · ${m.size}`}</p>
            <p className="price" style={{ fontSize: "1.2rem" }}>
              <small>Vejl. udsalgspris</small>{formatPrice(m.price)} {m.example && <span className="tag">Eksempel</span>}
            </p>
            <p className="note">Prisen gælder uret, som det er vist på billedet. Andre remme og lænker fås også. Uret kan ikke købes online. Kontakt os, så finder vi det frem til dig.</p>
            <div className="cta-row">
              <Link className="btn" href={`/kontakt?emne=${encodeURIComponent(`${b.name} ${m.name} ${m.ref}`)}`}>Book tid og prøv uret</Link>
              <a className="btn ghost" href={`tel:${business.phoneE164}`}>Ring {business.phone}</a>
            </div>
          </div>
          <div>
            <h2 style={{ fontSize: "1.25rem", marginBottom: "1rem" }}>Specifikationer</h2>
            <dl className="specs">
              {Object.entries(m.specs).map(([k, v]) => (<div key={k} style={{ display: "contents" }}><dt>{k}</dt><dd>{v}</dd></div>))}
              {m.size && <><dt>Størrelse</dt><dd>{m.size}</dd></>}
              <dt>Garanti</dt><dd>International fabriksgaranti</dd>
            </dl>
          </div>
        </div>
      </div>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Product",
          name: `${b.name} ${m.name}`,
          sku: m.ref,
          mpn: m.ref,
          image: m.image,
          brand: { "@type": "Brand", name: b.name },
          url,
          offers: {
            "@type": "Offer",
            priceCurrency: "DKK",
            price: m.price,
            availability: "https://schema.org/InStoreOnly",
            seller: { "@id": `${SITE_URL}/#butik` },
          },
        }}
      />
    </section>
  );
}
