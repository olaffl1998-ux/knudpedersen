import Link from "@/lib/next/link";
import { keepExploring, rolexAssets } from "@/data/rolex";
import { JsonLd } from "@/components/Seo";
import { SITE_URL } from "@/lib/site";
/** Rolex-billede: portræt på mobil, liggende fra 768 px. Filerne bruges uændret. */
export function RImg({ img, alt, className, eager, sizes }) {
    const l = img.l || img.p || "";
    const p = img.p || img.l || "";
    if (!l)
        return null;
    return (<picture className={className}>
      {p !== l && <source media="(max-width: 767px)" srcSet={p}/>}
      <img src={l} alt={alt} loading={eager ? "eager" : "lazy"} decoding="async" sizes={sizes}/>
    </picture>);
}
const isExternal = (h) => !!h && /^https?:/.test(h);
/** Viser Rolex' redaktionelle blokke i den rækkefølge, Rolex har leveret dem */
export function Blocks({ blocks, skipH1 = true }) {
    return (<div className="rx-blocks">
      {blocks.map((b, i) => {
            switch (b.type) {
                case "h1":
                    return skipH1 ? null : <h1 key={i}>{b.text}</h1>;
                case "h2":
                    return <h2 key={i}>{b.text}</h2>;
                case "h3":
                case "h4":
                    return <h3 key={i}>{b.text}</h3>;
                case "p":
                    return <p key={i}>{b.text}</p>;
                case "cta":
                    if (!b.href || b.href.startsWith("#"))
                        return null;
                    return <p key={i}><Link className="rx-btn rx-btn-ghost" href={b.href}>{b.text}</Link></p>;
                case "image": {
                    const pic = <RImg img={{ l: b.landscape, p: b.portrait }} alt={b.alt?.trim() || ""} className="rx-media"/>;
                    return b.href && !b.href.startsWith("#") ? <Link key={i} href={b.href} className="rx-media-link">{pic}</Link> : <div key={i}>{pic}</div>;
                }
                case "img":
                    return <img key={i} className="rx-media" src={b.src} alt={b.alt?.trim() || ""} loading="lazy"/>;
                case "iframe":
                    return b.src && /youtube/.test(b.src) ? (<div key={i} className="rx-video">
                <iframe src={b.src.replace("youtube.com", "youtube-nocookie.com")} title="Rolex-video" loading="lazy" allow="encrypted-media; picture-in-picture" allowFullScreen/>
              </div>) : null;
                default:
                    return null;
            }
        })}
    </div>);
}
/** Brødkrummer starter altid ved "Udforsk Rolex". På mobil vises kun et link til niveauet over. */
export function RolexCrumbs({ items }) {
    const all = [{ name: "Udforsk Rolex", href: "/rolex/discover" }, ...items];
    const parent = all[all.length - 2];
    return (<nav className="rx-crumbs" aria-label="Brødkrummer">
      <ol>
        {all.map((c, i) => (<li key={c.href}>{i === all.length - 1 ? <span aria-current="page">{c.name}</span> : <Link href={c.href}>{c.name}</Link>}</li>))}
      </ol>
      {parent && <Link className="rx-crumbs-back" href={parent.href}>‹ {parent.name}</Link>}
      <JsonLd data={{
            "@context": "https://schema.org", "@type": "BreadcrumbList",
            itemListElement: [{ name: "Forside", href: "/" }, ...all].map((c, i) => ({ "@type": "ListItem", position: i + 1, name: c.name, item: `${SITE_URL}${c.href}` })),
        }}/>
    </nav>);
}
export function KeepExploring({ current }) {
    const links = keepExploring.filter((k) => k.href !== current).slice(0, 6);
    return (<section className="rx-keep" aria-labelledby="rx-keep">
      <h2 id="rx-keep">Fortsæt med at udforske</h2>
      <ul>
        {links.map((n) => (<li key={n.href}>
            <Link href={n.href}>
              <img src={n.img} alt="" loading="lazy"/>
              <span>{n.label}</span>
            </Link>
          </li>))}
      </ul>
      <a className="rx-top" href="#indhold">
        <img src={rolexAssets.crown} alt="" width={22} height={24}/>
        <span>Tilbage til toppen</span>
      </a>
    </section>);
}
/** Rolex-side: titel, brødkrummer, indhold og "Fortsæt med at udforske" */
export function RolexPage({ crumbs, current, children }) {
    return (<>
      <RolexCrumbs items={crumbs}/>
      {children}
      <KeepExploring current={current}/>
    </>);
}
export const ext = isExternal;
