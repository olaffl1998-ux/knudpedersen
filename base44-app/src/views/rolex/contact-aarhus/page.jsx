import { RolexAppointment, RolexMessage } from "@/components/rolex/RolexForms";
import { OpeningToday } from "@/components/OpeningToday";
import { RImg, RolexPage } from "@/components/rolex/parts";
import { RETAILER, rolexPageBlocks } from "@/data/rolex";
import { business } from "@/lib/site";
export const metadata = {
    title: { absolute: `Kontakt ${RETAILER.name} i ${RETAILER.city}, officiel Rolex-forhandler` },
    description: `Kontakt ${RETAILER.name}, officiel Rolex-forhandler på ${business.street} i ${RETAILER.city}. Send en besked, book en tid eller ring på ${business.phone}.`,
    alternates: { canonical: "/rolex/contact-aarhus" },
};
const MAP = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${business.legalName}, ${business.street}, ${business.postalCode} Aarhus`)}`;
export default function RolexContactPage() {
    const b = rolexPageBlocks.contact;
    const cover = b.find((x) => x.type === "image");
    const intro = b.find((x) => x.type === "p");
    return (<RolexPage crumbs={[{ name: "Kontakt os", href: "/rolex/contact-aarhus" }]} current="/rolex/contact-aarhus">
      <RImg img={{ l: cover?.landscape, p: cover?.portrait }} alt="Rolex - Kontakt os" className="rx-cover" eager/>
      <section className="rx-intro">
        <h1>Kontakt {RETAILER.name} i {RETAILER.city}, din officielle Rolex-forhandler</h1>
        <p>{intro?.text}</p>
      </section>
      <section className="rx-store">
        <div>
          <h2>{RETAILER.city}</h2>
          <p>{business.legalName}<br />{business.street}<br />{business.postalCode} {business.city}<br />Danmark</p>
          <p><OpeningToday /></p>
          <p><a href={`tel:${business.phoneE164}`}>+45 {business.phone}</a><br /><a href={`mailto:${business.email}`}>{business.email}</a></p>
          <p><a className="rx-btn rx-btn-ghost" href={MAP} rel="noopener">Vis rutevejledning</a></p>
        </div>
        <table className="rx-hours">
          <caption>Åbningstider</caption>
          <tbody>
            {business.openingHours.map((o) => <tr key={o.label}><th scope="row">{o.label}</th><td>{o.opens.replace(":", ".")}–{o.closes.replace(":", ".")}</td></tr>)}
            <tr><th scope="row">Søndag</th><td>Lukket</td></tr>
          </tbody>
        </table>
      </section>
      <section id="besked" className="rx-form-section" aria-labelledby="besked-h">
        <h2 id="besked-h">Send os en besked</h2>
        <RolexMessage />
      </section>
      <section id="book" className="rx-form-section" aria-labelledby="book-h">
        <h2 id="book-h">Book en tid</h2>
        <RolexAppointment />
      </section>
    </RolexPage>);
}
