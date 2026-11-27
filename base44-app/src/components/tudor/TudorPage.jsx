import Link from "@/lib/next/link";
import Catalog from "@/components/Catalog";
import { Breadcrumbs } from "@/components/Seo";
import { collectionSlug, getModelsForBrand, modelHref, priceBands } from "@/data/catalog";
import { tudorCentury, tudorFamilyText, tudorFamilyTone, tudorSlides, tudorStyles } from "@/data/tudor";
import { business, formatPrice } from "@/lib/site";
import { toItems } from "@/lib/watchItems";
import { TudorHero, TudorRail, TudorVideoEl } from "./TudorClient";
/** Tudors overskrifter: en kraftig, smal grotesk (Archivo) som erstatning for Tudors egen skrift */
const FONT = "https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@75..100,600..900&display=swap";
const Arrow = () => <svg className="td-arrow" viewBox="0 0 22 10" width="22" height="10" aria-hidden="true"><path d="M0 5h8M14 5h8M11 1.5L14.5 5 11 8.5 7.5 5z" fill="none" stroke="currentColor" strokeWidth="1.2"/></svg>;
export default function TudorPage() {
    const list = getModelsForBrand("tudor");
    const withImg = list.filter((m) => m.image);
    const families = Array.from(new Set(withImg.map((m) => m.collection).filter(Boolean)));
    // Udvalgte: det dyreste ur fra hver kollektion først, derefter de næste
    const byPrice = [...withImg].sort((a, b) => b.price - a.price);
    const featured = [...families.map((f) => byPrice.find((m) => m.collection === f)), ...byPrice].filter((m, i, a) => a.indexOf(m) === i).slice(0, 8);
    return (<div className="td">
      <link rel="stylesheet" href={FONT} precedence="default"/>
      <TudorHero slides={tudorSlides}/>
      <div className="container"><Breadcrumbs items={[{ name: "Mærker", href: "/maerker" }, { name: "Tudor", href: "/maerker/tudor" }]}/></div>

      <section className="td-new" id="udvalgte">
        <div className="td-new__head">
          <p className="td-eyebrow td-eyebrow--dark">Officiel Tudor-forhandler i Aarhus</p>
          <h2 className="td-h2">Udvalgte Tudor-ure 2026</h2>
          <a className="td-link" href="#alle-ure"><Arrow />Se alle {list.length} Tudor-ure</a>
        </div>
        <TudorRail label="Udvalgte Tudor-ure">
          {featured.map((m) => (<li key={m.slug}>
              <Link className="td-feat" href={modelHref(m)} style={{ background: tudorFamilyTone[m.collection ?? ""] ?? tudorFamilyTone["Black Bay"] }}>
                                <img src={m.image} alt={`Tudor ${m.name}, ${m.ref}`} loading="eager"/>
                <span className="td-feat__text">
                  <strong>Tudor {m.name}</strong>
                  <span>{m.size}{m.size && " · "}{formatPrice(m.price)}</span>
                  <em><Arrow />Se uret</em>
                </span>
              </Link>
            </li>))}
        </TudorRail>
      </section>

      <section className="td-fam">
        <div className="container">
          <h2 className="td-h2">Tudor-ure</h2>
          <a className="td-link" href="#alle-ure"><Arrow />Udforsk hele kollektionen</a>
        </div>
        <TudorRail label="Tudors kollektioner">
          {families.map((f) => {
            const g = byPrice.filter((m) => m.collection === f);
            return (<li key={f}>
                <Link className="td-famcard" href={`/maerker/tudor/${collectionSlug(f)}`}>
                  <span className={`td-famcard__top${f === "1926" ? " is-light" : ""}`} style={{ background: tudorFamilyTone[f] }}>
                    <strong>Tudor {f}</strong>
                    <span><Arrow />{tudorFamilyText[f] ?? "Oplev kollektionen"}</span>
                  </span>
                                    <img src={g[0].image} alt={`Tudor ${f}`} loading="eager"/>
                  <em>Se urene ({g.length})</em>
                </Link>
              </li>);
        })}
        </TudorRail>
      </section>

      <section className="td-banner">
        <TudorVideoEl v={tudorCentury.video}/>
        <div className="td-banner__shade"/>
        <div className="td-banner__text">
          <p className="td-eyebrow">{tudorCentury.eyebrow}</p>
          <h2 className="td-h1">{tudorCentury.title}</h2>
          <a className="td-link td-link--light" href={tudorCentury.cta.href} target="_blank" rel="noopener"><Arrow />{tudorCentury.cta.label}</a>
        </div>
      </section>

      <section className="td-styles">
        {tudorStyles.map((s) => (<Link key={s.key} className="td-style" href={s.href}>
            {"video" in s
                ? <TudorVideoEl v={s.video}/>
                : <img src={s.image} alt="" loading="eager"/>}
            <span className="td-style__text">
              <span className="td-eyebrow">{s.eyebrow}</span>
              <strong className="td-h3">{s.title}</strong>
              <em><Arrow />Se urene</em>
            </span>
          </Link>))}
      </section>

      <section className="section" id="alle-ure">
        <div className="container">
          <div className="section-head">
            <div><p className="td-eyebrow td-eyebrow--dark">Udvalget i butikken</p><h2 className="td-h2">Alle Tudor-ure</h2></div>
            <Link className="td-pill td-pill--red" href="/book-tid?maerke=tudor">Book en tid</Link>
          </div>
          <Catalog items={toItems(list)} bandOrder={priceBands.map((x) => x.label)}/>
        </div>
      </section>

      <section className="td-retailer">
        <div className="container">
          <p className="td-eyebrow td-eyebrow--dark">Officiel Tudor-forhandler</p>
          <h2 className="td-h2">Tudor hos Knud Pedersen</h2>
          <p>Se og prøv Tudor-urene i butikken på {business.street} i Aarhus. Alle Tudor-ure leveres med Tudors femårige garanti, som kan overdrages.</p>
          <p className="td-retailer__btns">
            <Link className="td-pill td-pill--red" href="/book-tid?maerke=tudor">Book en tid</Link>
            <a className="td-pill td-pill--line" href={`tel:${business.phoneE164}`}>Ring {business.phone}</a>
          </p>
        </div>
      </section>
    </div>);
}
