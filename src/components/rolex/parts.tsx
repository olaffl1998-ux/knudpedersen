import Link from "next/link";
import type { Block, Img } from "@/data/rolex";
import { keepExploring, rolexAssets } from "@/data/rolex";
import { JsonLd } from "@/components/Seo";
import { SITE_URL } from "@/lib/site";

/** Rolex-billede: portræt på mobil, liggende fra 768 px. Filerne bruges uændret. */
export function RImg({ img, alt, className, eager, sizes }: { img: Img; alt: string; className?: string; eager?: boolean; sizes?: string }) {
  const l = img.l || img.p || "";
  const p = img.p || img.l || "";
  if (!l) return null;
  return (
    <picture className={className}>
      {p !== l && <source media="(max-width: 767px)" srcSet={p} />}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={l} alt={alt} loading="eager" fetchPriority={eager ? "high" : "auto"} decoding="async" sizes={sizes} />
    </picture>
  );
}

const isExternal = (h?: string) => !!h && /^https?:/.test(h);

/** Viser Rolex' redaktionelle blokke i den rækkefølge, Rolex har leveret dem */
export function Blocks({ blocks, skipH1 = true }: { blocks: Block[]; skipH1?: boolean }) {
  return (
    <div className="rx-blocks">
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
            if (!b.href || b.href.startsWith("#")) return null;
            return <p key={i}><Link className="rx-btn rx-btn-ghost" href={b.href}>{b.text}</Link></p>;
          case "image": {
            const pic = <RImg img={{ l: b.landscape, p: b.portrait }} alt={b.alt?.trim() || ""} className="rx-media" />;
            return b.href && !b.href.startsWith("#") ? <Link key={i} href={b.href} className="rx-media-link">{pic}</Link> : <div key={i}>{pic}</div>;
          }
          case "img":
            // eslint-disable-next-line @next/next/no-img-element
            // Rolex-skiltene findes kun i lille størrelse (300 x 150). De vises i deres egen størrelse, så de står skarpt
            return /plaque/i.test(b.src) ? (
              <img key={i} className="rx-plaque-img" src={b.src} alt={b.alt?.trim() || ""} loading="eager" width={300} height={150} />
            ) : <img key={i} className="rx-media" src={b.src} alt={b.alt?.trim() || ""} loading="eager" />;
          case "iframe":
            return b.src && /youtube/.test(b.src) ? (
              <div key={i} className="rx-video">
                <iframe src={ytAuto(b.src)} title="Rolex-video" loading="eager" allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen />
              </div>
            ) : null;
          default:
            return null;
        }
      })}
    </div>
  );
}

/** Rolex' egne film starter af sig selv (uden lyd, som browserne kræver) og kører i ring. Filmen selv er uændret */
function ytAuto(src: string) {
  const u = new URL(src.replace("youtube.com", "youtube-nocookie.com"), "https://www.youtube-nocookie.com");
  const id = u.pathname.split("/").pop() ?? "";
  for (const [k, v] of Object.entries({ autoplay: "1", mute: "1", playsinline: "1", loop: "1", playlist: id, rel: "0", modestbranding: "1" })) u.searchParams.set(k, v);
  return u.toString();
}

export type RCrumb = { name: string; href: string };

/** Brødkrummer starter altid ved "Udforsk Rolex". På mobil vises kun et link til niveauet over. */
export function RolexCrumbs({ items }: { items: RCrumb[] }) {
  const all = [{ name: "Udforsk Rolex", href: "/rolex/discover" }, ...items];
  const parent = all[all.length - 2];
  return (
    <nav className="rx-crumbs" aria-label="Brødkrummer">
      <ol>
        {all.map((c, i) => (
          <li key={c.href}>{i === all.length - 1 ? <span aria-current="page">{c.name}</span> : <Link href={c.href}>{c.name}</Link>}</li>
        ))}
      </ol>
      {parent && <Link className="rx-crumbs-back" href={parent.href}>‹ {parent.name}</Link>}
      <JsonLd data={{
        "@context": "https://schema.org", "@type": "BreadcrumbList",
        itemListElement: [{ name: "Forside", href: "/" }, ...all].map((c, i) => ({ "@type": "ListItem", position: i + 1, name: c.name, item: `${SITE_URL}${c.href}` })),
      }} />
    </nav>
  );
}

export function KeepExploring({ current }: { current: string }) {
  const links = keepExploring.filter((k) => k.href !== current).slice(0, 6);
  return (
    <section className="rx-keep" aria-labelledby="rx-keep">
      <h2 id="rx-keep">Fortsæt med at udforske</h2>
      <ul>
        {links.map((n) => (
          <li key={n.href}>
            <Link href={n.href}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={n.img} alt="" loading="eager" />
              <span>{n.label}</span>
            </Link>
          </li>
        ))}
      </ul>
      <a className="rx-top" href="#indhold">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={rolexAssets.crown} alt="" width={22} height={24} />
        <span>Tilbage til toppen</span>
      </a>
    </section>
  );
}

/** Rolex-side: titel, brødkrummer, indhold og "Fortsæt med at udforske" */
export function RolexPage({ crumbs, current, children }: { crumbs: RCrumb[]; current: string; children: React.ReactNode }) {
  return (
    <>
      <RolexCrumbs items={crumbs} />
      {children}
      <KeepExploring current={current} />
    </>
  );
}

export const ext = isExternal;
