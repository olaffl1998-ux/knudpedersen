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
    <>
      <div className="container"><Breadcrumbs items={[{ name: "Smykker", href: "/smykker" }]} /></div>
      <section className="container page-head">
        <span className="label">Smykker</span>
        <h1>Smykker i ædle metaller</h1>
        <p className="lead">Ringe, armbånd, øreringe og halskæder med certificerede diamanter. Smykkerne kan ikke købes online. Book et møde, så finder vi dem frem til dig.</p>
      </section>
      <section className="container" aria-label="Smykkemærker">
        <ul className="features" style={{ listStyle: "none", margin: 0, padding: 0, gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))" }}>
          {jewelleryBrandList.map((b) => {
            const first = piecesFor(b.slug).find((p) => p.image);
            return (
              <li key={b.slug}>
                <Link href={`/smykker/${b.slug}`} className="feature">
                  <span className="feature__media" style={{ background: "var(--white)" }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    {first && <img src={first.image} alt={`${b.name} smykke`} loading="lazy" style={{ objectFit: "contain", padding: "10%" }} />}
                  </span>
                  <h2 className="h3" style={{ marginTop: 24 }}>{b.name}</h2>
                  <p>{b.intro}</p>
                  <span className="link-arrow">Se {piecesFor(b.slug).length} smykker</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>
      <section className="section">
        <div className="container split">
          <div className="split__media"><div className="ph" aria-hidden="true">[Foto: smykker i vinduet på Skt. Clemens Torv]</div></div>
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
