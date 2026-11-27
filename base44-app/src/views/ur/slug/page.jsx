import Link from "@/lib/next/link";
import { notFound } from "@/lib/next/navigation";
import { getBrand, getModelByKey, getModelsForBrand, modelHref, modelKey, models } from "@/data/catalog";
import WatchDetail from "@/components/WatchDetail";
import ModelCard from "@/components/ModelCard";
import { Breadcrumbs, JsonLd } from "@/components/Seo";
import { SITE_URL, business, formatPrice } from "@/lib/site";
/** Rem/lænke ud fra mærkets referencekode og "Leveres på" */
function strapLabel(m) {
    const r = m.ref.toUpperCase();
    if (m.brand === "tag-heuer") {
        const c = r.split(".")[1] ?? "";
        if (/^B[A-Z]/.test(c))
            return "Lænke i stål";
        if (/^FC/.test(c))
            return "Læderrem";
        if (/^F[TS]/.test(c))
            return "Gummirem";
    }
    const on = m.specs["Leveres på"];
    return on === "Lænke" ? "Lænke" : on === "Rem" ? "Rem" : on || "Udførelse";
}
const toVariant = (m) => ({
    key: modelKey(m), href: modelHref(m), ref: m.ref, image: m.image, price: formatPrice(m.price), size: m.size,
    strap: strapLabel(m),
    specs: [...Object.entries(m.specs), ...(m.size ? [["Størrelse", m.size]] : [])],
});
export const dynamicParams = false;
export const generateStaticParams = () => models.map((m) => ({ slug: modelKey(m) }));
export function generateMetadata({ params }) {
    const m = getModelByKey(params.slug);
    const b = m && getBrand(m.brand);
    if (!m || !b)
        return {};
    return {
        title: `${b.name} ${m.name} ${m.ref}`,
        description: `${b.name} ${m.name}${m.size ? ` ${m.size}` : ""}, ref. ${m.ref}. Vejledende pris ${formatPrice(m.price)}. Se uret og book tid hos Knud Pedersen i Aarhus.`,
        openGraph: m.image ? { images: [m.image] } : undefined,
        alternates: { canonical: modelHref(m) },
    };
}
export default function WatchPage({ params }) {
    const m = getModelByKey(params.slug);
    const b = m && getBrand(m.brand);
    if (!m || !b)
        notFound();
    // Samme ur (mærke, model og størrelse) i andre udførelser, som butikken fører
    const siblings = models.filter((x) => x.brand === m.brand && x.name === m.name && x.size === m.size && x.image);
    const group = siblings.some((x) => x === m) ? siblings : [m, ...siblings];
    // Navngiv udførelser med samme rem, så de kan skelnes
    const variants = group.map(toVariant);
    const count = {};
    for (const v of variants)
        count[v.strap] = (count[v.strap] ?? 0) + 1;
    for (const v of variants)
        if (count[v.strap] > 1)
            v.strap = `${v.strap} · ${v.ref.split(/[.\s-]/).slice(-2).join(".")}`;
    const related = getModelsForBrand(b.slug).filter((x) => !group.includes(x) && (x.collection === m.collection || !m.collection)).slice(0, 4);
    return (<>
      <div className="container"><Breadcrumbs items={[{ name: "Ure", href: "/ure" }, { name: b.name, href: `/maerker/${b.slug}` }, { name: `${m.name} ${m.ref}`, href: modelHref(m) }]}/></div>
      {b.slug === "tudor" ? (
        // Tudor: samme opbygning som tudorwatch.com (stort produktbillede, navn med versaler, varianter og garanti)
        <div className="td td-pdp">
          <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@75..100,600..900&display=swap" precedence="default"/>
          <WatchDetail brand={b.name} brandSlug={b.slug} name={m.name} variants={variants} initial={group.indexOf(m)} phone={business.phone} phoneE164={business.phoneE164} street={business.street}/>
          <ul className="container td-pdp__checks">
            <li><span aria-hidden="true">✓</span>Tudors femårige garanti, som kan overdrages</li>
            <li><span aria-hidden="true">✓</span>Officiel Tudor-forhandler i Aarhus</li>
            <li><span aria-hidden="true">✓</span>Se og prøv uret i butikken på {business.street}</li>
          </ul>
        </div>) : (<WatchDetail brand={b.name} brandSlug={b.slug} name={m.name} variants={variants} initial={group.indexOf(m)} phone={business.phone} phoneE164={business.phoneE164} street={business.street}/>)}
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
