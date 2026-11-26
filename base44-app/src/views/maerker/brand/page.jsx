import Link from "@/lib/next/link";
import { notFound } from "@/lib/next/navigation";
import { getBrand, getModelsForBrand, nonRolexBrands } from "@/data/catalog";
import ModelCard from "@/components/ModelCard";
import { Breadcrumbs } from "@/components/Seo";
import { business } from "@/lib/site";
export const dynamicParams = false;
export const generateStaticParams = () => nonRolexBrands.map((b) => ({ brand: b.slug }));
export function generateMetadata({ params }) {
    const b = getBrand(params.brand);
    if (!b || b.rolex)
        return {};
    const tudor = b.slug === "tudor";
    return {
        title: tudor ? "Officiel Tudor-forhandler i Aarhus" : `${b.name} i Aarhus – autoriseret forhandler`,
        description: `${tudor ? "Knud Pedersen er officiel Tudor-forhandler" : `Se ${b.name}`} på Skt. Clemens Torv i Aarhus. ${b.intro}`.slice(0, 158),
        alternates: { canonical: `/maerker/${b.slug}` },
    };
}
export default function BrandPage({ params }) {
    const b = getBrand(params.brand);
    if (!b || b.rolex)
        notFound();
    const list = getModelsForBrand(b.slug);
    const tudor = b.slug === "tudor";
    const collections = Array.from(new Set(list.map((m) => m.collection).filter(Boolean)));
    return (<>
      {/* Mærkesider godkendes mod mærkets retailer guidelines før lancering */}
      <div hidden dangerouslySetInnerHTML={{ __html: `<!-- Godkendes mod ${b.name} Retailer Guidelines før lancering -->` }}/>
      <div className="container"><Breadcrumbs items={[{ name: "Mærker", href: "/maerker" }, { name: b.name, href: `/maerker/${b.slug}` }]}/></div>
      <section className="container page-head">
        {tudor ? <span className="badge">Officiel Tudor-forhandler</span> : <span className="label">{b.kind}</span>}
        <h1 style={{ marginTop: 16 }}>{b.name}</h1>
        <p className="lead">{b.intro}</p>
        <div className="btn-row" style={{ marginTop: 24 }}>
          <Link className="btn" href={`/book-tid?maerke=${b.slug}`}>Book et møde om {b.name}</Link>
          <a className="btn btn--outline" href={`tel:${business.phoneE164}`}>Ring {business.phone}</a>
        </div>
      </section>
      {tudor && (<section className="container" style={{ paddingBottom: 72 }}>
          <div className="split">
            <div className="split__media"><div className="ph">[Tudor-billede fra Tudor Retailer Portal]</div></div>
            <div className="split__text">
              <span className="label">Tudor hos Knud Pedersen</span>
              <h2>Kollektionerne</h2>
              <ul className="cat-list">{collections.map((c) => <li key={c}><a href={`#k-${c.replace(/\W+/g, "-")}`}>{c}</a></li>)}</ul>
            </div>
          </div>
        </section>)}
      <div className="container" style={{ paddingBottom: 120 }}>
        {list.length === 0 && <div className="ph">[Ure fra {b.name} tilføjes. Kontakt os for at se udvalget i butikken.]</div>}
        {(collections.length > 1 ? collections : [null]).map((c) => {
            const g = c ? list.filter((m) => m.collection === c) : list;
            return (<section key={c ?? "alle"} id={c ? `k-${c.replace(/\W+/g, "-")}` : undefined} style={{ marginBottom: 72 }}>
              {c && <h2>{c}</h2>}
              <ul className="cards">{g.map((m) => <li key={m.slug}><ModelCard model={m}/></li>)}</ul>
            </section>);
        })}
        {collections.length > 1 && list.some((m) => !m.collection) && (<section><h2>Øvrige modeller</h2><ul className="cards">{list.filter((m) => !m.collection).map((m) => <li key={m.slug}><ModelCard model={m}/></li>)}</ul></section>)}
      </div>
    </>);
}
