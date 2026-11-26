import Link from "@/lib/next/link";
import { Breadcrumbs } from "@/components/Seo";
export const metadata = {
    title: "Vielsesringe og forlovelsesringe i Aarhus",
    description: "Find jeres vielsesringe hos Knud Pedersen på Skt. Clemens Torv i Aarhus. Book en tid til personlig rådgivning.",
    alternates: { canonical: "/vielsesringe" },
};
const VR_TEXT = {
    "Klassiske ringe": "Glatte ringe i guld og platin i forskellige bredder og profiler.",
    "Ringe med sten": "Ringe med diamanter, hvor stenene sidder i eller på ringen.",
    "Forlovelsesringe": "Solitaireringe og ringe med flere sten til det store spørgsmål.",
};
export default function Vielsesringe() {
    return (<>
      <div className="container"><Breadcrumbs items={[{ name: "Smykker", href: "/smykker" }, { name: "Vielsesringe", href: "/vielsesringe" }]}/></div>
      <section className="container split" style={{ paddingBottom: 96 }}>
        <div className="split__media"><div className="ph" aria-hidden="true">[Foto: vielsesringe]</div></div>
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
            {["Klassiske ringe", "Ringe med sten", "Forlovelsesringe"].map((t) => (<li key={t}><div className="ph" aria-hidden="true">[Foto]</div><h3>{t}</h3><p>{VR_TEXT[t]}</p></li>))}
          </ul>
        </div>
      </section>
      <section className="section">
        <div className="container container--narrow center">
          <span className="label">Rådgivning</span>
          <h2>Gode råd om vielsesringe</h2>
          <p className="muted">Vi hjælper med valg af metal og profil, måler ringstørrelsen og fortæller om gravering og leveringstid, når I besøger os.</p>
          <p><Link className="link-arrow" href="/smykker">Se alle smykker</Link></p>
        </div>
      </section>
    </>);
}
