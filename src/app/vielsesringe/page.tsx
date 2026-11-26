import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Seo";
import { pieces } from "@/data/jewellery";
import PieceCard from "@/components/PieceCard";

export const metadata: Metadata = {
  title: "Vielsesringe og forlovelsesringe i Aarhus",
  description: "Find jeres vielsesringe hos Knud Pedersen på Skt. Clemens Torv i Aarhus. Book en tid til personlig rådgivning.",
  alternates: { canonical: "/vielsesringe" },
};

const VR_TEXT: Record<string, string> = {
  "Klassiske ringe": "Glatte ringe i guld og platin i forskellige bredder og profiler.",
  "Ringe med sten": "Ringe med diamanter, hvor stenene sidder i eller på ringen.",
  "Forlovelsesringe": "Solitaireringe og ringe med flere sten til det store spørgsmål.",
};

export default function Vielsesringe() {
  const rings = pieces.filter((p) => p.image && p.type === "Ringe");
  const hero = rings.find((p) => /Aisling-Ring-Oval/.test(p.image!)) ?? rings[0];
  return (
    <>
      <div className="container"><Breadcrumbs items={[{ name: "Smykker", href: "/smykker" }, { name: "Vielsesringe", href: "/vielsesringe" }]} /></div>
      <section className="container split" style={{ paddingBottom: 96 }}>
        <div className="split__media">{hero ? /* eslint-disable-next-line @next/next/no-img-element */ <img src={hero.image} alt={hero.name} className="on-stage" /> : null}</div>
        <div className="split__text">
          <span className="label">Vielsesringe</span>
          <h1>Ringe til det store ja</h1>
          <p className="lead">Kom forbi og prøv ringe i ro og mag. Book en tid, så sætter vi tid af til jer.</p>
          <p className="btn-row"><Link className="btn" href="/book-tid?formaal=vielsesringe">Book tid til vielsesringe</Link></p>
        </div>
      </section>
      <section className="section section--sand">
        <div className="container">
          <div className="section-head"><div><span className="label">Udvalg</span><h2>Vores vielsesringe</h2></div></div>
          <ul className="services services--3">
            {["Klassiske ringe", "Ringe med sten", "Forlovelsesringe"].map((t) => (
              <li key={t}><h3>{t}</h3><p>{VR_TEXT[t]}</p></li>
            ))}
          </ul>
        </div>
      </section>
      {rings.length > 0 && (
        <section className="section">
          <div className="container">
            <div className="section-head"><div><span className="label">I butikken</span><h2>Ringe med diamanter og ædelsten</h2></div><Link className="link-arrow" href="/smykker">Alle smykker</Link></div>
            <ul className="cards">{rings.slice(0, 8).map((p) => <li key={p.image}><PieceCard piece={p} /></li>)}</ul>
          </div>
        </section>
      )}
      <section className="section section--white">
        <div className="container container--narrow center">
          <span className="label">Rådgivning</span>
          <h2>Gode råd om vielsesringe</h2>
          <p className="muted">Vi hjælper med valg af metal og profil, måler ringstørrelsen og fortæller om gravering og leveringstid, når I besøger os.</p>
          <p><Link className="link-arrow" href="/smykker">Se alle smykker</Link></p>
        </div>
      </section>
    </>
  );
}
