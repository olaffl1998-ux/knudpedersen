import Link from "@/lib/next/link";
import { Breadcrumbs } from "@/components/Seo";
export const metadata = {
    title: "Vielsesringe og forlovelsesringe i Aarhus",
    description: "Find jeres vielsesringe hos Knud Pedersen på Skt. Clemens Torv i Aarhus. Book en tid til personlig rådgivning.",
    alternates: { canonical: "/vielsesringe" },
};
export default function Vielsesringe() {
    return (<>
      <div className="container"><Breadcrumbs items={[{ name: "Smykker", href: "/smykker" }, { name: "Vielsesringe", href: "/vielsesringe" }]}/></div>
      <section className="container split" style={{ paddingBottom: 96 }}>
        <div className="split__media"><div className="ph" role="img" aria-label="Pladsholder">[Foto: vielsesringe]</div></div>
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
            {["Klassiske ringe", "Ringe med sten", "Forlovelsesringe"].map((t) => (<li key={t}><div className="ph" role="img" aria-label="Pladsholder">[Foto]</div><h3>{t}</h3><p>[Tekst om udvalg, materialer, mærker og prisniveau leveres af Knud Pedersen]</p></li>))}
          </ul>
        </div>
      </section>
      <section className="section">
        <div className="container container--narrow center">
          <span className="label">Rådgivning</span>
          <h2>Gode råd om vielsesringe</h2>
          <p className="muted">[Indhold om materialer, ringstørrelse, gravering og leveringstid leveres af Knud Pedersen]</p>
          <p><Link className="link-arrow" href="/smykker">Se alle smykker</Link></p>
        </div>
      </section>
    </>);
}
