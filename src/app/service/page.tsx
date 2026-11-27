import { daAlternates } from "@/data/en";
import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs, JsonLd } from "@/components/Seo";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Urmager og service i Aarhus – reparation af ure og smykker",
  description: "Faguddannede urmagere og guldsmede i Aarhus. Service og reparation af ure, smykkeservice og omtrækning af perlekæder. Autoriseret Rolex-servicecenter.",
  alternates: daAlternates("/service"),
};

const services = [
  { label: "Urmager", title: "Service og reparation af ure", text: "Fuld service, vandtæthedstest, nyt glas, batteriskift og justering af lænke på alle de mærker, vi fører." },
  { label: "Guldsmed", title: "Smykkeservice", text: "Rensning, rhodinering, størrelsesændring af ringe og reparation af dine egne smykker." },
  { label: "Perler", title: "Omtrækning af perlekæder", text: "Vi trækker din perlekæde om med ny tråd og en knude mellem hver perle." },
];
const steps = [
  { t: "Aflevering", d: "Du afleverer uret eller smykket i butikken. Book gerne en tid, så sidder en fagperson klar." },
  { t: "Vurdering", d: "Vi undersøger det og giver dig et prisoverslag, før vi går i gang." },
  { t: "Arbejdet", d: "Vores urmagere og guldsmede udfører arbejdet efter producentens retningslinjer." },
  { t: "Afhentning", d: "Vi giver besked, når det er klar til afhentning. Vi fortæller dig den forventede tid, når du afleverer." },
];

export default function Service() {
  return (
    <>
      <JsonLd data={{ "@context": "https://schema.org", "@type": "Service", serviceType: "Urmager og guldsmed", provider: { "@id": `${SITE_URL}/#store` }, areaServed: "Aarhus" }} />
      <div className="container"><Breadcrumbs items={[{ name: "Service & reparation", href: "/service" }]} /></div>
      <section className="container page-head">
        <span className="label">Værkstedet</span>
        <h1>Service og reparation</h1>
        <p className="lead">Alle vores urmagere er faguddannede og følger producenternes træning og efteruddannelse, så vi er godkendt til at servicere de mærker, vi fører. Vi er også autoriseret Rolex-servicecenter.</p>
        <p className="btn-row"><Link className="btn" href="/book-tid?formaal=service">Book tid til service</Link><a className="btn btn--outline" href="#proces">Sådan foregår det</a></p>
      </section>

      <section className="section section--sand">
        <div className="container">
          <div className="section-head"><div><span className="label">Ydelser</span><h2>Det hjælper vi med</h2></div></div>
          <ul className="services services--3">
            {services.map((s) => (
              <li key={s.title}>{/* [Foto fra værkstedet: {s.label}] */}<span className="label">{s.label}</span><h3>{s.title}</h3><p>{s.text}</p></li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section" id="proces">
        <div className="container">
          <div className="section-head"><div><span className="label">Proces</span><h2>Sådan foregår det</h2></div></div>
          <ol className="steps steps--list">
            {steps.map((s, i) => <li key={s.t}><span className="label">Trin {i + 1}</span><h3>{s.t}</h3><p>{s.d}</p></li>)}
          </ol>
        </div>
      </section>

      <section className="section section--white">
        <div className="container split">
          <div className="split__media">{/* [Foto: urmager ved arbejdsbordet] */}<div className="type-panel" aria-hidden="true"><small>Værkstedet</small><span>Altid et prisoverslag, før vi går i gang</span></div></div>
          <div className="split__text">
            <span className="label">Priser</span>
            <h2>Priseksempler</h2>
            <p className="muted">Prisen afhænger af ur, mærke og opgave. Du får altid et prisoverslag, før vi går i gang, og mindre opgaver som batteriskift og lænkejustering klarer vi ofte, mens du venter.</p><p><Link className="link-arrow" href="/book-tid?formaal=service">Book tid til service</Link></p>
          </div>
        </div>
      </section>

      <section className="section section--dark">
        <div className="container split split--rev">
          <div className="split__media"><div className="ph ph--dark" aria-hidden="true">[Rolex-servicebillede fra Rolex]</div></div>
          <div className="split__text">
            <span className="label label--brass">Rolex</span>
            <h2>Autoriseret Rolex-servicecenter</h2>
            <p>Har du en Rolex, kan du læse om Rolex’ serviceeftersyn og priser i Rolex-sektionen.</p>
            <p><Link className="btn btn--light" href="/rolex/servicing">Serviceeftersyn af Rolex</Link></p>
          </div>
        </div>
      </section>
    </>
  );
}
