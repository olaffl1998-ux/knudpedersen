import { OpenNow } from "@/components/OpeningToday";
import { daAlternates } from "@/data/en";
import Link from "@/lib/next/link";
import ContactForm from "@/components/ContactForm";
import Hours from "@/components/Hours";
import { MapEmbed } from "@/components/Consent";
import { Breadcrumbs } from "@/components/Seo";
import { business } from "@/lib/site";
export const metadata = {
    title: "Kontakt Knud Pedersen – Skt. Clemens Torv 6, Aarhus",
    description: "Kontakt Knud Pedersen, Skt. Clemens Torv 6, 8000 Aarhus C. Tlf. 86 12 17 99. Åbningstider, kort og kontaktformular.",
    alternates: daAlternates("/kontakt"),
};
export default function Kontakt() {
    return (<>
      <div className="container"><Breadcrumbs items={[{ name: "Kontakt", href: "/kontakt" }]}/></div>
      <section className="container page-head">
        <span className="label">Kontakt</span>
        <h1>Kontakt os</h1>
        <p className="lead">Skriv, ring eller kig forbi butikken på Skt. Clemens Torv. Vil du se et bestemt ur, så <Link href="/book-tid">book en tid</Link>, så har vi det klar.</p>
      </section>
      <section className="container" style={{ paddingBottom: 120 }}>
        <div className="grid-12 contact-grid">
          <div className="contact-grid__form">
            <h2>Send en besked</h2>
            <ContactForm />
          </div>
          <aside className="contact-grid__info" aria-label="Kontaktoplysninger">
            <h2>Butikken</h2>
            <OpenNow />
            <p>{business.legalName}<br />{business.street}<br />{business.postalCode} {business.city}</p>
            <p><a href={`tel:${business.phoneE164}`}>Tlf. {business.phone}</a><br /><a href={`mailto:${business.email}`}>{business.email}</a></p>
            <h3 className="label">Åbningstider</h3>
            <Hours />
            <p className="muted">Butikken ligger ved Aarhus Domkirke midt i gågadenettet. Der er parkeringshuse i gåafstand, og busserne holder tæt ved.</p>
          </aside>
        </div>
      </section>
      <section className="full-bleed"><MapEmbed query="Knud Pedersen, Skt. Clemens Torv 6, 8000 Aarhus" label="Kort over Skt. Clemens Torv 6, Aarhus"/></section>
    </>);
}
