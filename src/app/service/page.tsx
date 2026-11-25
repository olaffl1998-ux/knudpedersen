import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Seo";

export const metadata: Metadata = {
  title: "Urmager og service i Aarhus – reparation af ure og smykker",
  description: "Certificerede urmagere i Aarhus. Service og reparation af ure fra Rolex, Omega, Tudor, Breitling og flere, smykkeservice og omtrækning af perlekæder.",
  alternates: { canonical: "/service" },
};

export default function Service() {
  return (
    <section className="section tight-top">
      <div className="wrap stack-lg">
        <Breadcrumbs items={[{ name: "Service", href: "/service" }]} />
        <div className="split">
          <div className="stack"><p className="eyebrow">Værkstedet</p><h1>Professionel service til dit ur</h1></div>
          <p className="measure muted">
            Alle vores urmagere er faguddannede og følger producenternes træning og efteruddannelse, så vi er godkendt til at servicere de mærker, vi fører. Vi er også officielt Rolex-servicecenter.
          </p>
        </div>
        <div className="cards">
          <div className="card"><p className="eyebrow">Urmager</p><h2 style={{ fontSize: "1.25rem" }}>Service og reparation</h2><p>Fuld service, vandtæthedstest, nyt glas, batteriskift og justering af lænke.</p></div>
          <div className="card"><p className="eyebrow">Guldsmed</p><h2 style={{ fontSize: "1.25rem" }}>Smykkeservice</h2><p>Rensning, rhodinering, størrelsesændring af ringe og reparation af egne smykker.</p></div>
          <div className="card"><p className="eyebrow">Perler</p><h2 style={{ fontSize: "1.25rem" }}>Omtrækning af perlekæder</h2><p>Vi trækker din perlekæde om med ny tråd og knude mellem hver perle.</p></div>
        </div>
        <div className="ok"><strong>Priseksempler</strong> på fx batteriskift og fuld service pr. mærke indsættes her, når Knud Pedersen har leveret dem.</div>
        <p>Har du en Rolex? Læs om <Link href="/rolex/servicing">serviceeftersyn af Rolex</Link>.</p>
        <div className="cta-row"><Link className="btn" href="/kontakt?emne=Service">Book tid til service</Link></div>
      </div>
    </section>
  );
}
