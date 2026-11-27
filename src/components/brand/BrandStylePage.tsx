import Link from "next/link";
import Catalog from "@/components/Catalog";
import { Breadcrumbs } from "@/components/Seo";
import { collectionSlug, getModelsForBrand, modelHref, priceBands, type Brand } from "@/data/catalog";
import type { BrandMediaBlock, BrandStyle } from "@/data/brandStyles";
import { business, formatPrice } from "@/lib/site";
import { toItems } from "@/lib/watchItems";
import { TudorRail, TudorVideoEl } from "@/components/tudor/TudorClient";

/** Billede eller film fra mærket. Toppen hentes med det samme, resten når man nærmer sig */
function Media({ m, top }: { m: BrandMediaBlock; top?: boolean }) {
  if (m.video) return <TudorVideoEl v={m.video} lazy={!top} />;
  if (!m.image) return null;
  return (
    <picture>
      {m.imageMobile && <source media="(max-width: 700px)" srcSet={m.imageMobile} />}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={m.image} alt="" loading="eager" fetchPriority={top ? "high" : undefined} />
    </picture>
  );
}

function Cta({ c, cls = "bs-btn" }: { c?: { label: string; href: string }; cls?: string }) {
  if (!c) return null;
  return c.href.startsWith("#") ? <a className={cls} href={c.href}>{c.label}</a> : <Link className={cls} href={c.href}>{c.label}</Link>;
}

export default function BrandStylePage({ b, s }: { b: Brand; s: BrandStyle }) {
  const list = getModelsForBrand(b.slug);
  const withImg = list.filter((m) => m.image);
  const byPrice = [...withImg].sort((a, c) => c.price - a.price);
  const collections = Array.from(new Set(withImg.map((m) => m.collection).filter(Boolean))) as string[];
  // Udvalgte: det dyreste ur fra hver kollektion først, derefter de næste
  const featured = [...collections.map((f) => byPrice.find((m) => m.collection === f)!), ...byPrice].filter((m, i, a) => a.indexOf(m) === i).slice(0, 10);
  // Dansk genitiv: "Oris' kollektioner", "Omegas kollektioner"
  const gen = /[sxz]$/i.test(b.name) ? `${b.name}'` : `${b.name}s`;
  const colCard = (c: string) => {
    const g = byPrice.filter((m) => m.collection === c);
    return { g, href: `/maerker/${b.slug}/${collectionSlug(c)}`, img: s.collectionImages?.[c] ?? g[0]?.image, own: !!s.collectionImages?.[c] };
  };
  return (
    <div className={`bs bs--${b.slug}`}>
      <link rel="stylesheet" href={s.font} precedence="default" />

      <section className={`bs-hero bs-hero--${s.heroLayout}`}>
        <div className={`bs-hero__media${!s.hero.image && !s.hero.video ? " is-pack" : ""}`}><Media m={!s.hero.image && !s.hero.video ? { ...s.hero, image: byPrice[0]?.image } : s.hero} top /></div>
        <div className="bs-hero__text">
          <p className="bs-eyebrow">{s.hero.eyebrow}</p>
          <h1 className="bs-h1">{s.hero.title}</h1>
          {s.hero.text && <p className="bs-lead">{s.hero.text}</p>}
          <Cta c={s.hero.cta} />
        </div>
      </section>
      <div className="container"><Breadcrumbs items={[{ name: "Mærker", href: "/maerker" }, { name: b.name, href: `/maerker/${b.slug}` }]} /></div>

      <section className="bs-intro">
        <p className="bs-eyebrow bs-eyebrow--dark">Autoriseret {b.name}-forhandler i Aarhus</p>
        <p className="bs-intro__text">{b.intro}</p>
      </section>

      {featured.length > 1 && (
        <section className="bs-feat" id="udvalgte">
          <div className="bs-head">
            <h2 className="bs-h2">{s.featuredTitle}</h2>
            <a className="bs-link" href="#alle-ure">Se alle {list.length} ure</a>
          </div>
          <TudorRail label={s.featuredTitle}>
            {featured.map((m) => (
              <li key={m.slug}>
                <Link className="bs-card" href={modelHref(m)}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <span className="bs-card__img"><img src={m.image} alt={`${b.name} ${m.name}, ${m.ref}`} loading="eager" /></span>
                  <span className="bs-card__text">
                    {m.collection && m.collection !== m.name && <small>{m.collection}</small>}
                    <strong>{m.name}{m.name === m.collection && ` ${m.ref}`}</strong>
                    <span>{m.size}{m.size && " · "}{formatPrice(m.price)}</span>
                  </span>
                </Link>
              </li>
            ))}
          </TudorRail>
        </section>
      )}

      {collections.length > 1 && (
        <section className={`bs-cols bs-cols--${s.collections}`}>
          <div className="bs-head"><h2 className="bs-h2">{gen} kollektioner</h2></div>
          {s.collections === "rail" ? (
            <TudorRail label={`${gen} kollektioner`}>
              {collections.map((c) => { const x = colCard(c); return (
                <li key={c}><Link className="bs-col" href={x.href}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <span className={`bs-col__img${x.own ? " is-photo" : ""}`}><img src={x.img} alt="" loading="eager" /></span>
                  <strong>{c}</strong>
                  <span>{s.collectionText?.[c] ?? `${x.g.length} ${x.g.length === 1 ? "ur" : "ure"}`}</span>
                </Link></li>
              ); })}
            </TudorRail>
          ) : s.collections === "rows" ? (
            <div className="bs-rows">
              {collections.map((c, i) => { const x = colCard(c); return (
                <Link key={c} className={`bs-row${i % 2 ? " is-rev" : ""}`} href={x.href}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <span className={`bs-row__img${x.own ? " is-photo" : ""}`}><img src={x.img} alt="" loading="eager" /></span>
                  <span className="bs-row__text">
                    <h3 className="bs-h3">{c}</h3>
                    {s.collectionText?.[c] && <p>{s.collectionText[c]}</p>}
                    <em className="bs-link">Se {x.g.length} {x.g.length === 1 ? "ur" : "ure"}</em>
                  </span>
                </Link>
              ); })}
            </div>
          ) : (
            <ul className="bs-tiles">
              {collections.map((c) => { const x = colCard(c); return (
                <li key={c}><Link className="bs-tile" href={x.href}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <span className={`bs-tile__img${x.own ? " is-photo" : ""}`}><img src={x.img} alt="" loading="eager" /></span>
                  <span className="bs-tile__text">
                    <strong>{c}</strong>
                    <span>{s.collectionText?.[c] ?? `${x.g.length} ${x.g.length === 1 ? "ur" : "ure"}`}</span>
                    <em className="bs-link">Udforsk</em>
                  </span>
                </Link></li>
              ); })}
            </ul>
          )}
        </section>
      )}

      {s.banner && (
        <section className={`bs-banner bs-banner--${s.banner.align ?? "l"}`}>
          <div className="bs-banner__media"><Media m={s.banner} /></div>
          <div className="bs-banner__text">
            <p className="bs-eyebrow">{s.banner.eyebrow}</p>
            <h2 className="bs-h2">{s.banner.title}</h2>
            {s.banner.text && <p className="bs-lead">{s.banner.text}</p>}
            <Cta c={s.banner.cta} cls="bs-btn bs-btn--light" />
          </div>
        </section>
      )}

      {s.quote && <section className="bs-quote"><p>{s.quote}</p></section>}

      <section className="section bs-all" id="alle-ure">
        <div className="container">
          <div className="section-head">
            <div><p className="bs-eyebrow bs-eyebrow--dark">Udvalget i butikken</p><h2 className="bs-h2">Alle {b.name}-ure</h2></div>
            <Link className="bs-btn" href={`/book-tid?maerke=${b.slug}`}>Book en tid</Link>
          </div>
          <Catalog items={toItems(list)} bandOrder={priceBands.map((x) => x.label)} />
        </div>
      </section>

      <section className="bs-retailer">
        <div className="container">
          <p className="bs-eyebrow bs-eyebrow--dark">Autoriseret forhandler</p>
          <h2 className="bs-h2">{b.name} hos Knud Pedersen</h2>
          <p>Se og prøv {b.name}-urene i butikken på {business.street} i Aarhus. Alle ure leveres med {gen} internationale garanti.</p>
          <p className="bs-retailer__btns">
            <Link className="bs-btn" href={`/book-tid?maerke=${b.slug}`}>Book en tid</Link>
            <a className="bs-btn bs-btn--line" href={`tel:${business.phoneE164}`}>Ring {business.phone}</a>
          </p>
        </div>
      </section>
    </div>
  );
}
