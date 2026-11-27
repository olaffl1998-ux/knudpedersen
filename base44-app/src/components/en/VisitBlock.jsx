import { OpenNow } from "@/components/OpeningToday";
import { business } from "@/lib/site";
import { enHours } from "@/data/en";
import { MapEmbed } from "@/components/Consent";
/** Adresse, åbningstider, kort og booking på engelsk */
export default function VisitBlock() {
    const mail = `mailto:${business.email}?subject=${encodeURIComponent("Appointment request")}&body=${encodeURIComponent("Hello Knud Pedersen,\n\nI would like to book an appointment.\n\nPreferred date and time:\nWhat I would like to see (watch, jewellery or service):\nName:\nPhone:\n")}`;
    return (<section className="section section--sand" id="book" aria-labelledby="visit-h">
      <div className="container split">
        <div className="split__text">
          <span className="label">Visit us</span>
          <h2 id="visit-h">In the heart of Aarhus</h2>
          <p>You will find us on Skt. Clemens Torv, right next to Aarhus Cathedral. Drop in, or book an appointment so we can set time aside and have your pieces ready when you arrive.</p>
          <OpenNow en/>
          <address style={{ fontStyle: "normal" }}>
            <strong>{business.name}</strong><br />{business.street}<br />{business.postalCode} {business.city}, Denmark<br />
            <a href={`tel:${business.phoneE164}`}>+45 {business.phone}</a> · <a href={`mailto:${business.email}`}>{business.email}</a>
          </address>
          <table className="en-hours">
            <tbody>{enHours.map((h) => <tr key={h.label}><th scope="row">{h.label}</th><td>{h.time}</td></tr>)}</tbody>
          </table>
          <div className="btn-row">
            <a className="btn" href={mail}>Book an appointment</a>
            <a className="btn btn--outline" href={`tel:${business.phoneE164}`}>Call +45 {business.phone}</a>
          </div>
        </div>
        <div className="split__media en-map">
          <MapEmbed query={`${business.name}, ${business.street}, ${business.postalCode} ${business.city}`} label="Map: Knud Pedersen in Aarhus"/>
        </div>
      </div>
    </section>);
}
