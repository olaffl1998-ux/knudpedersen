import { notFound } from "@/lib/next/navigation";
import { getJewelleryBrand, jewelleryBrandList, pieceTypes, piecesFor } from "@/data/jewellery";
import PieceCard from "@/components/PieceCard";
import { Breadcrumbs } from "@/components/Seo";
import Link from "@/lib/next/link";
import BrandHero from "@/components/BrandHero";
import { jewelleryMedia } from "@/data/brandMedia";
import { getJewelleryCategory, jewelleryCategories, piecesOfType } from "@/data/categories";
export const dynamicParams = false;
export function generateStaticParams() {
    // Samme adresseniveau rummer både mærker (/smykker/marselis) og typer (/smykker/ringe)
    return [...jewelleryBrandList.map((b) => ({ brand: b.slug })), ...jewelleryCategories.map((c) => ({ brand: c.slug }))];
}
export function generateMetadata({ params }) {
    const slug = params.brand;
    const c = getJewelleryCategory(slug);
    if (c)
        return { title: `${c.label} i Aarhus`, description: `${c.intro} Se dem hos Knud Pedersen på Skt. Clemens Torv i Aarhus.`, alternates: { canonical: `/smykker/${c.slug}` } };
    const b = getJewelleryBrand(slug);
    if (!b)
        return {};
    return {
        title: `${b.name} smykker i Aarhus`,
        description: `Se ${b.name} smykker hos Knud Pedersen på Skt. Clemens Torv i Aarhus. ${b.intro}`,
        alternates: { canonical: `/smykker/${b.slug}` },
    };
}
function CategoryPage({ slug }) {
    const c = getJewelleryCategory(slug);
    const list = piecesOfType(c.type);
    return (<>
      <div className="container"><Breadcrumbs items={[{ name: "Smykker", href: "/smykker" }, { name: c.label, href: `/smykker/${c.slug}` }]}/></div>
      <section className="container page-head">
        <span className="label">Smykker</span>
        <h1>{c.label}</h1>
        <p className="lead">{c.intro} {list.length} smykker. Vejledende priser.</p>
        <nav className="subcats" aria-label="Smykketyper"><ul>
          <li><Link href="/smykker">Alle smykker</Link></li>
          {jewelleryCategories.map((x) => <li key={x.slug}><Link href={`/smykker/${x.slug}`} aria-current={x.slug === c.slug ? "page" : undefined}>{x.label}</Link></li>)}
          <li><Link href="/vielsesringe">Vielsesringe</Link></li>
        </ul></nav>
      </section>
      <div className="container" style={{ paddingBottom: 120 }}>
        {jewelleryBrandList.map((b) => {
            const group = list.filter((p) => p.brand === b.slug);
            if (!group.length)
                return null;
            return (<section key={b.slug} style={{ marginBottom: 72 }} aria-labelledby={`b-${b.slug}`}>
              <div className="section-head"><div><h2 id={`b-${b.slug}`}>{b.name}</h2></div><Link className="link-arrow" href={`/smykker/${b.slug}`}>Alle fra {b.name}</Link></div>
              <ul className="cards">{group.map((p) => <li key={p.slug}><PieceCard piece={p}/></li>)}</ul>
            </section>);
        })}
      </div>
    </>);
}
export default function BrandPage({ params }) {
    const slug = params.brand;
    if (getJewelleryCategory(slug))
        return <CategoryPage slug={slug}/>;
    const b = getJewelleryBrand(slug);
    if (!b)
        notFound();
    const list = piecesFor(b.slug);
    return (<>
      <BrandHero name={b.name} eyebrow="Smykker" intro={b.intro} hero={jewelleryMedia[b.slug]?.hero} heroMobile={jewelleryMedia[b.slug]?.heroMobile} packshot={list.find((p) => p.image)?.image}>
        <Link className="btn btn--light" href={`/book-tid?formaal=smykker`}>Book et møde</Link>
        {b.website && <a className="bh__play" href={b.website} target="_blank" rel="noopener">Besøg {b.name}s hjemmeside</a>}
      </BrandHero>
      <div className="container"><Breadcrumbs items={[{ name: "Smykker", href: "/smykker" }, { name: b.name, href: `/smykker/${b.slug}` }]}/></div>
      <div className="container" style={{ paddingBottom: 120 }}>
        {pieceTypes.map((t) => {
            const group = list.filter((p) => p.type === t);
            if (!group.length)
                return null;
            return (<section key={t} style={{ marginBottom: 72 }} aria-labelledby={`t-${t}`}>
              <h2 id={`t-${t}`}>{t}</h2>
              <ul className="cards">{group.map((p) => <li key={p.slug}><PieceCard piece={p}/></li>)}</ul>
            </section>);
        })}
      </div>
    </>);
}
