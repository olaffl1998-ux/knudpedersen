import Link from "@/lib/next/link";
import { notFound } from "@/lib/next/navigation";
import { getBrand, getModelsForBrand, nonRolexBrands, collectionSlug } from "@/data/catalog";
import ModelCard from "@/components/ModelCard";
import { Breadcrumbs } from "@/components/Seo";
import { business } from "@/lib/site";
import BrandHero from "@/components/BrandHero";
import Carousel from "@/components/Carousel";
import Catalog from "@/components/Catalog";
import { priceBands } from "@/data/catalog";
import { toItems } from "@/lib/watchItems";
import { brandMedia } from "@/data/brandMedia";
import TudorPage from "@/components/tudor/TudorPage";
import BrandStylePage from "@/components/brand/BrandStylePage";
import { brandStyles } from "@/data/brandStyles";
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
    if (b.slug === "tudor")
        return <TudorPage />;
    if (brandStyles[b.slug])
        return <BrandStylePage b={b} s={brandStyles[b.slug]}/>;
    const list = getModelsForBrand(b.slug);
    const tudor = b.slug === "tudor";
    const collections = Array.from(new Set(list.map((m) => m.collection).filter(Boolean)));
    const media = brandMedia[b.slug] ?? {};
    const withImg = list.filter((m) => m.image);
    // Populære modeller: én pr. kollektion først, så resten
    const seen = new Set();
    const popular = [...withImg.filter((m) => { const k = m.collection ?? m.name; if (seen.has(k))
            return false; seen.add(k); return true; }), ...withImg].filter((m, i, a) => a.indexOf(m) === i).slice(0, 10);
    return (<>
      {/* Mærkesider godkendes mod mærkets retailer guidelines før lancering */}
      <div hidden dangerouslySetInnerHTML={{ __html: `<!-- Godkendes mod ${b.name} Retailer Guidelines før lancering -->` }}/>
      <BrandHero name={b.name} eyebrow={tudor ? "Officiel Tudor-forhandler" : "Autoriseret forhandler"} intro={b.intro} hero={media.hero} heroMobile={media.heroMobile} packshot={withImg[0]?.image} video={media.video}>
        <Link className="btn btn--light" href={`/book-tid?maerke=${b.slug}`}>Book et møde om {b.name}</Link>
      </BrandHero>
      <div className="container"><Breadcrumbs items={[{ name: b.name, href: `/maerker/${b.slug}` }]}/></div>

      {popular.length > 1 && (<section className="section ed-featured">
          <div className="container">
            <Carousel title={`Populære ${b.name}-modeller`} action={<a className="link-arrow" href="#alle-ure">Alle {list.length} ure</a>}>
              {popular.map((m) => <li key={m.slug}><ModelCard model={m}/></li>)}
            </Carousel>
          </div>
        </section>)}

      {collections.length > 1 && (<section className="section section--white">
          <div className="container">
            <div className="section-head"><div><span className="label">Kollektioner</span><h2>{b.name}s kollektioner</h2></div></div>
            <ul className="col-tiles">
              {collections.map((c) => {
                const g = list.filter((m) => m.collection === c);
                const img = g.find((m) => m.image)?.image;
                return (<li key={c}><Link href={`/maerker/${b.slug}/${collectionSlug(c)}`} className="col-tile">
                                        <span className="col-tile__media">{img && <img src={img} alt="" loading="eager"/>}</span>
                    <strong>{c}</strong><span>{g.length} {g.length === 1 ? "ur" : "ure"}</span>
                  </Link></li>);
            })}
            </ul>
          </div>
        </section>)}

      <section className="section" id="alle-ure">
        <div className="container">
          <div className="section-head"><div><span className="label">Udvalget</span><h2>Alle {b.name}-ure</h2></div><a className="btn btn--outline" href={`tel:${business.phoneE164}`}>Ring {business.phone}</a></div>
          {list.length === 0
            ? <div className="empty"><p>Kontakt os for at se udvalget fra {b.name} i butikken.</p><p className="btn-row" style={{ justifyContent: "center" }}><Link className="btn" href={`/book-tid?maerke=${b.slug}`}>Book et møde</Link></p></div>
            : <Catalog items={toItems(list)} bandOrder={priceBands.map((x) => x.label)}/>}
        </div>
      </section>
    </>);
}
