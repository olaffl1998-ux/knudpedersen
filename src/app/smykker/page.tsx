import type { Metadata } from "next";
import Link from "next/link";
import { jewelleryBrandList, piecesFor } from "@/data/jewellery";
import { Breadcrumbs } from "@/components/Seo";

export const metadata: Metadata = {
  title: "Smykker i Aarhus – Marselis, Georg Jensen, Chopard og Gucci",
  description: "Smykker i ædle metaller med certificerede diamanter hos Knud Pedersen i Aarhus. Ringe, øreringe, armbånd og halskæder samt omtrækning af perlekæder.",
  alternates: { canonical: "/smykker" },
};

export default function Smykker() {
  return (
    <section className="section tight-top">
      <div className="wrap stack-lg">
        <Breadcrumbs items={[{ name: "Smykker", href: "/smykker" }]} />
        <div className="section-head">
          <p className="eyebrow">Smykker</p>
          <h1>Smykker i ædle metaller</h1>
          <p className="measure muted">Ringe, armbånd, øreringe og halskæder med certificerede diamanter. Smykkerne kan ikke købes online. Book et møde, så finder vi dem frem til dig.</p>
        </div>
        <div className="tiles">
          {jewelleryBrandList.map((b) => {
            const first = piecesFor(b.slug).find((p) => p.image);
            return (
              <Link key={b.slug} href={`/smykker/${b.slug}`} className="tile">
                <span className="tile-img">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  {first && <img src={first.image} alt="" loading="lazy" />}
                </span>
                <span className="tile-name">{b.name}</span>
                <span className="tile-link">Se {piecesFor(b.slug).length} smykker</span>
              </Link>
            );
          })}
        </div>
        <div className="atelier-cards">
          <div className="mini">
            <p className="eyebrow">Værkstedet</p>
            <h3>Omtrækning af perlekæder og tilpasning af smykker</h3>
            <p className="muted">Vi omtrækker perlekæder og tilpasser ringe i vores eget værksted. Kom forbi butikken med dit smykke.</p>
            <Link className="tile-link" href="/service">Læs om service</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
