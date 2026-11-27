import { daAlternates } from "@/data/en";
import type { Metadata } from "next";
import Link from "next/link";
import { jewelleryBrandList, piecesFor, pieces } from "@/data/jewellery";
import { Breadcrumbs } from "@/components/Seo";
import { jewelleryCategories, piecesOfType } from "@/data/categories";
import { thumb } from "@/lib/site";

const T = "/billeder/pics/_thumbs/";
/** Mærkernes egne kampagnebilleder (kvadratiske udgaver) */
const brandImg: Record<string, string> = {
  marselis: `${T}0641-0554-4-Marselis--banner_mobile.w640.h640.jpg`,
  "georg-jensen": `${T}GJ_AW26_JW_Seasonal-_WS-eCom-banner_640x640px.w640.h640.jpg`,
  chopard: "/brands/chopard/happy-poster.jpg",
  gucci: `${T}Gucci_GUCCI_INTERLOCKING_BANGLE_640x640.w640.h640.jpg`,
};

export const metadata: Metadata = {
  title: "Smykker i Aarhus – Marselis, Georg Jensen, Chopard og Gucci",
  description: "Smykker i ædle metaller med certificerede diamanter hos Knud Pedersen i Aarhus. Ringe, øreringe, armbånd og halskæder samt omtrækning af perlekæder.",
  alternates: daAlternates("/smykker"),
};

export default function Smykker() {
  return (
    <>
      <div className="container"><Breadcrumbs items={[{ name: "Smykker", href: "/smykker" }]} /></div>
      <section className="container page-head jw-head">
        <span className="label">Smykker</span>
        <h1>Smykker i ædle metaller</h1>
        <p className="lead">Ringe, armbånd, øreringe og halskæder med certificerede diamanter. Smykkerne kan ikke købes online. Book et møde, så finder vi dem frem til dig.</p>
      </section>

      {/* Smykkehusene i deres egne kampagnebilleder */}
      <section className="container" aria-label="Smykkemærker">
        <ul className="hp-jw__tiles">
          {jewelleryBrandList.map((b) => (
            <li key={b.slug}>
              <Link href={`/smykker/${b.slug}`} className="hp-jw__tile">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <span className="hp-jw__img">{brandImg[b.slug] && <img src={brandImg[b.slug]} alt={b.name} loading="eager" />}</span>
                <span className="hp-jw__name">{b.name}</span>
                <span className="hp-jw__line">{piecesFor(b.slug).length} smykker</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* Find dit smykke efter type */}
      <section className="section" aria-labelledby="jw-types-h">
        <div className="container">
          <div className="hp-jw__head"><span className="label">Find dit smykke</span><h2 id="jw-types-h">Efter type</h2></div>
          <ul className="jw-types">
            {[...jewelleryCategories.map((c) => ({ href: `/smykker/${c.slug}`, label: c.label, type: c.type })), { href: "/vielsesringe", label: "Vielsesringe", type: "" }].map((c) => {
              const top = c.type ? piecesOfType(c.type).filter((p) => p.image).sort((x, y) => y.price - x.price)[0] : pieces.find((p) => p.image && /Aisling/.test(p.image));
              const n = c.type ? piecesOfType(c.type).length : 0;
              return (
                <li key={c.href}>
                  <Link href={c.href} className="jw-type">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <span className="jw-type__img">{top?.image && <img src={thumb(top.image)} alt="" loading="eager" />}</span>
                    <strong>{c.label}</strong>
                    <span>{n ? `${n} ${n === 1 ? "smykke" : "smykker"}` : "Book en tid"}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
          <p className="ring-hint"><Link href="/ringstoerrelse">Kender du ikke ringstørrelsen? Se vores guide og print en ringmåler</Link></p>
        </div>
      </section>

      <section className="section">
        <div className="container split">
          <div className="split__media">{/* [Foto: smykker i vinduet på Skt. Clemens Torv] */}{(() => { const r = pieces.find((p) => p.image && /Aisling-Ring-Oval/.test(p.image)); return r ? /* eslint-disable-next-line @next/next/no-img-element */ <img src={r.image} alt={r.name} loading="eager" className="on-stage" /> : null; })()}</div>
          <div className="split__text">
            <span className="label">Værkstedet</span>
            <h2>Vielsesringe, omtrækning og tilpasning</h2>
            <p>Vi omtrækker perlekæder og tilpasser ringe i vores eget værksted. Kom forbi butikken med dit smykke, eller book et møde om vielsesringe.</p>
            <div className="btn-row"><Link className="btn" href="/vielsesringe">Vielsesringe</Link><Link className="btn btn--outline" href="/service">Service</Link></div>
          </div>
        </div>
      </section>
    </>
  );
}
