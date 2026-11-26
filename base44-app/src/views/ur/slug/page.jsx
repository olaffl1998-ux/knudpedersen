import Link from "@/lib/next/link";
import { notFound } from "@/lib/next/navigation";
import { getBrand, getModelByKey, getModelsForBrand, modelHref, modelKey, models, straps } from "@/data/catalog";
import StrapPicker from "@/components/StrapPicker";
import ModelCard from "@/components/ModelCard";
import { HeartButton } from "@/components/Wishlist";
import { Breadcrumbs, JsonLd } from "@/components/Seo";
import { SITE_URL, business, formatPrice } from "@/lib/site";
export const dynamicParams = false;
export const generateStaticParams = () => models.map((m) => ({ slug: modelKey(m) }));
export function generateMetadata({ params }) {
    const m = getModelByKey(params.slug);
    const b = m && getBrand(m.brand);
    if (!m || !b)
        return {};
    return {
        title: `${b.name} ${m.name} ${m.ref}`,
        description: `${b.name} ${m.name}${m.size ? ` ${m.size}` : ""}, ref. ${m.ref}. Vejledende pris ${formatPrice(m.price)}. Se uret på forskellige remme og lænker, og book tid hos Knud Pedersen i Aarhus.`,
        openGraph: m.image ? { images: [m.image] } : undefined,
        alternates: { canonical: modelHref(m) },
    };
}
export default function WatchPage({ params }) {
    const m = getModelByKey(params.slug);
    const b = m && getBrand(m.brand);
    if (!m || !b)
        notFound();
    const strapList = m.straps.map((k) => straps[k]);
    const subject = `${b.name} ${m.name} ${m.ref}`;
    const related = getModelsForBrand(b.slug).filter((x) => x.slug !== m.slug && (x.collection === m.collection || !m.collection)).slice(0, 4);
    return (<>
      <div className="container"><Breadcrumbs items={[{ name: "Ure", href: "/ure" }, { name: b.name, href: `/maerker/${b.slug}` }, { name: `${m.name} ${m.ref}`, href: modelHref(m) }]}/></div>
      <section className="container pdp">
        <div>
          <StrapPicker model={m} straps={strapList} brandName={b.name}/>
        </div>
        <div>
          <span className="label">{b.name}</span>
          <h1>{m.name}</h1>
          <p className="muted">Ref. {m.ref}{m.size && ` · ${m.size}`}</p>
          <p className="pdp__price"><small>Vejledende udsalgspris</small>{formatPrice(m.price)}</p>
          <div className="btn-row">
            <Link className="btn" href={`/book-tid?emne=${encodeURIComponent(subject)}&maerke=${b.slug}`}>Book tid og prøv uret</Link>
            <a className="btn btn--outline" href={`tel:${business.phoneE164}`}>Ring {business.phone}</a>
            <span className="pdp__save"><HeartButton id={`ur:${modelKey(m)}`} label={subject}/></span>
          </div>
          <p className="notice">Uret kan ikke købes online. Prisen gælder uret som vist. Book en tid, så har vi det klar til dig i butikken på {business.street}.</p>
          <div className="accordion" style={{ marginTop: 24 }}>
            <details open>
              <summary>Specifikationer</summary>
              <div>
                <dl className="specs">
                  {Object.entries(m.specs).map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}
                  {m.size && <div><dt>Størrelse</dt><dd>{m.size}</dd></div>}
                </dl>
              </div>
            </details>
            <details><summary>Garanti og service</summary><div><p>Alle nye ure leveres med producentens internationale garanti. Vores eget værksted servicerer uret efter producentens krav. Garantiperioden afhænger af mærket, og vi fortæller gerne mere i butikken.</p></div></details>
            <details><summary>Remme og lænker</summary><div><p>Uret vises på den rem eller lænke, det leveres på. De øvrige typer er dem, {b.name} tilbyder til kollektionen. Vi bekræfter pasformen, når du besøger os.</p></div></details>
          </div>
        </div>
      </section>
      {related.length > 0 && (<section className="section container">
          <div className="section-head"><h2>Flere fra {b.name}</h2><Link className="link-arrow" href={`/maerker/${b.slug}`}>Se alle</Link></div>
          <ul className="cards">{related.map((x) => <li key={x.slug}><ModelCard model={x}/></li>)}</ul>
        </section>)}
      <JsonLd data={{
            "@context": "https://schema.org", "@type": "Product", name: `${b.name} ${m.name}`, sku: m.ref, mpn: m.ref,
            image: m.image ? `${SITE_URL}${m.image}` : undefined, brand: { "@type": "Brand", name: b.name }, url: `${SITE_URL}${modelHref(m)}`,
            offers: { "@type": "Offer", priceCurrency: "DKK", price: m.price, availability: "https://schema.org/InStoreOnly", seller: { "@id": `${SITE_URL}/#butik` } },
        }}/>
    </>);
}
