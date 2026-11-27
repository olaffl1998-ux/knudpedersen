import Link from "@/lib/next/link";
import { Breadcrumbs } from "@/components/Seo";
import PieceCard from "@/components/PieceCard";
import { pieceHref, pieceTypes, piecesFor } from "@/data/jewellery";
import { business, formatPrice, thumb } from "@/lib/site";
import { TudorRail } from "@/components/tudor/TudorClient";
import { Cta, Media } from "./BrandStylePage";
const anchor = (t) => `t-${t.toLowerCase().replace(/æ/g, "ae").replace(/ø/g, "oe").replace(/å/g, "aa")}`;
/** Smykkemærkernes sider i mærkets egen stil (samme byggesten som ursiderne) */
export default function JewelleryStylePage({ b, s }) {
    const list = piecesFor(b.slug);
    const withImg = list.filter((p) => p.image);
    const types = pieceTypes.filter((t) => list.some((p) => p.type === t));
    const byPrice = [...withImg].sort((a, c) => c.price - a.price);
    // Udvalgte: det dyreste smykke af hver type først, derefter de næste
    const featured = [...types.map((t) => byPrice.find((p) => p.type === t)).filter(Boolean), ...byPrice].filter((p, i, a) => a.indexOf(p) === i).slice(0, 10);
    return (<div className={`bs bs--${b.slug} bs--smykker`}>
      <link rel="stylesheet" href={s.font} precedence="default"/>

      <section className={`bs-hero bs-hero--${s.heroLayout}`}>
        <div className="bs-hero__media"><Media m={s.hero} top/></div>
        <div className="bs-hero__text">
          <p className="bs-eyebrow">{s.hero.eyebrow}</p>
          <h1 className="bs-h1">{s.hero.title}</h1>
          {s.hero.text && <p className="bs-lead">{s.hero.text}</p>}
          <Cta c={s.hero.cta}/>
        </div>
      </section>
      <div className="container"><Breadcrumbs items={[{ name: "Smykker", href: "/smykker" }, { name: b.name, href: `/smykker/${b.slug}` }]}/></div>

      <section className="bs-intro">
        <p className="bs-eyebrow bs-eyebrow--dark">{b.name} hos Knud Pedersen i Aarhus</p>
        <p className="bs-intro__text">{b.intro}</p>
        {b.website && <a className="bs-link" href={b.website} target="_blank" rel="noopener">Besøg {b.name}s hjemmeside</a>}
      </section>

      {featured.length > 1 && (<section className="bs-feat">
          <div className="bs-head">
            <h2 className="bs-h2">{s.featuredTitle}</h2>
            <a className="bs-link" href="#alle-smykker">Se alle {list.length} smykker</a>
          </div>
          <TudorRail label={s.featuredTitle}>
            {featured.map((p) => (<li key={p.slug}>
                <Link className="bs-card" href={pieceHref(p)}>
                                    <span className="bs-card__img"><img src={thumb(p.image)} alt={`${b.name} ${p.name}`} loading="eager"/></span>
                  <span className="bs-card__text">
                    <small>{p.type}</small>
                    <strong>{p.name}</strong>
                    <span>{p.price ? formatPrice(p.price) : "Pris på forespørgsel"}</span>
                  </span>
                </Link>
              </li>))}
          </TudorRail>
        </section>)}

      {types.length > 1 && (<section className="bs-cols bs-cols--tiles">
          <div className="bs-head"><h2 className="bs-h2">Find dit smykke</h2></div>
          <ul className="bs-tiles">
            {types.map((t) => {
                const g = byPrice.filter((p) => p.type === t);
                return (<li key={t}><a className="bs-tile" href={`#${anchor(t)}`}>
                                    <span className="bs-tile__img">{g[0] && <img src={thumb(g[0].image)} alt="" loading="eager"/>}</span>
                  <span className="bs-tile__text">
                    <strong>{t}</strong>
                    <span>{(() => { const n = list.filter((p) => p.type === t).length; return `${n} ${n === 1 ? "smykke" : "smykker"}`; })()}</span>
                    <em className="bs-link">Se dem</em>
                  </span>
                </a></li>);
            })}
          </ul>
        </section>)}

      {s.stories && (<section className="bs-stories">
          {s.stories.map((x) => (<article key={x.title} className="bs-story">
                            <img src={x.image} alt="" loading="eager"/>
              <div><h3 className="bs-h3">{x.title}</h3><p>{x.text}</p></div>
            </article>))}
        </section>)}

      {s.banner && (<section className={`bs-banner bs-banner--${s.banner.align ?? "l"}`}>
          <div className="bs-banner__media"><Media m={s.banner}/></div>
          <div className="bs-banner__text">
            <p className="bs-eyebrow">{s.banner.eyebrow}</p>
            <h2 className="bs-h2">{s.banner.title}</h2>
            {s.banner.text && <p className="bs-lead">{s.banner.text}</p>}
            <Cta c={s.banner.cta} cls="bs-btn bs-btn--light"/>
          </div>
        </section>)}

      {s.quote && <section className="bs-quote"><p>{s.quote}</p></section>}

      <section className="section bs-all" id="alle-smykker">
        <div className="container">
          <div className="section-head">
            <div><p className="bs-eyebrow bs-eyebrow--dark">Udvalget i butikken</p><h2 className="bs-h2">Alle {b.name}-smykker</h2></div>
            <Link className="bs-btn" href="/book-tid?formaal=smykker">Book en tid</Link>
          </div>
          {types.map((t) => (<section key={t} className="bs-type" id={anchor(t)} aria-labelledby={`${anchor(t)}-h`}>
              <h3 className="bs-h3" id={`${anchor(t)}-h`}>{t}</h3>
              <ul className="cards">{list.filter((p) => p.type === t).map((p) => <li key={p.slug}><PieceCard piece={p}/></li>)}</ul>
            </section>))}
        </div>
      </section>

      <section className="bs-retailer">
        <div className="container">
          <p className="bs-eyebrow bs-eyebrow--dark">Forhandler i Aarhus</p>
          <h2 className="bs-h2">{b.name} hos Knud Pedersen</h2>
          <p>Se og prøv smykkerne i butikken på {business.street} i Aarhus. Man kan også bare komme forbi til en uforpligtende snak.</p>
          <p className="bs-retailer__btns">
            <Link className="bs-btn" href="/book-tid?formaal=smykker">Book en tid</Link>
            <a className="bs-btn bs-btn--line" href={`tel:${business.phoneE164}`}>Ring {business.phone}</a>
          </p>
        </div>
      </section>
    </div>);
}
