import type { Metadata } from "next";
import { RETAILER } from "@/data/rolex";
import BookingForm from "@/components/BookingForm";
import { business } from "@/lib/site";

export const metadata: Metadata = {
  title: { absolute: `Kontakt ${RETAILER.name} i ${RETAILER.city} – officiel Rolex-forhandler` },
  description: `Kontakt ${RETAILER.name}, officiel Rolex-forhandler på Skt. Clemens Torv i ${RETAILER.city}. Send en besked eller book en tid.`,
  alternates: { canonical: "/rolex/kontakt" },
};

export default function RolexContact() {
  return (
    <div className="stack-lg section">
      <div className="ph">Forsidebillede: foto af butikken, godkendt af Rolex Digital Officer</div>
      <div className="split">
        <div className="stack">
          <h1>Kontakt {RETAILER.name} i {RETAILER.city}, din officielle Rolex-forhandler</h1>
          {/* Statisk kort (Rolex' krav for forhandlere med én butik); intet tredjepartsindhold */}
          <div className="map" role="img" aria-label="Kort over Skt. Clemens Torv 6, Aarhus"><b>{business.street}, Aarhus</b></div>
          <dl className="specs">
            <dt>Adresse</dt><dd>{business.street}, {business.postalCode} {business.city}</dd>
            <dt>Telefon</dt><dd><a href={`tel:${business.phoneE164}`}>{business.phone}</a></dd>
            <dt>E-mail</dt><dd><a href={`mailto:${business.email}`}>{business.email}</a></dd>
          </dl>
        </div>
        <BookingForm variant="rolex" />
      </div>
      <div className="ph">Butiksfoto i fuld bredde (godkendt af Rolex)</div>
    </div>
  );
}
