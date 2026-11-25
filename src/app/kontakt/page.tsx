import type { Metadata } from "next";
import BookingForm from "@/components/BookingForm";
import { MapEmbed } from "@/components/Consent";
import { Breadcrumbs } from "@/components/Seo";
import { business } from "@/lib/site";

export const metadata: Metadata = {
  title: "Kontakt og book et møde – Knud Pedersen, Aarhus",
  description: "Book et møde med en salgs- eller servicemedarbejder hos Knud Pedersen, Skt. Clemens Torv 6, 8000 Aarhus C. Tlf. 86 12 17 99.",
  alternates: { canonical: "/kontakt" },
};

type P = { searchParams: Promise<{ emne?: string }> };

export default async function Kontakt({ searchParams }: P) {
  const emne = (await searchParams).emne?.slice(0, 120);
  const purpose = emne === "Service" ? "Service eller reparation" : "";
  return (
    <section className="section tight-top">
      <div className="wrap">
        <Breadcrumbs items={[{ name: "Kontakt", href: "/kontakt" }]} />
        <div className="split">
          <div className="stack-lg">
            <div className="stack">
              <p className="eyebrow">Kontakt</p>
              <h1>Book et møde eller send en besked</h1>
              <p className="muted">Vælg om du vil tale med en salgs- eller servicemedarbejder. Vi bekræfter tiden på e-mail.</p>
            </div>
            <BookingForm defaultPurpose={purpose} subject={emne && emne !== "Service" ? emne : undefined} />
          </div>
          <div className="stack">
            <MapEmbed query="Knud Pedersen, Skt. Clemens Torv 6, 8000 Aarhus" label="Kort over Skt. Clemens Torv 6, Aarhus" />
            <dl className="specs">
              <dt>Adresse</dt><dd>{business.street}, {business.postalCode} {business.city}</dd>
              <dt>Telefon</dt><dd><a href={`tel:${business.phoneE164}`}>{business.phone}</a></dd>
              <dt>E-mail</dt><dd><a href={`mailto:${business.email}`}>{business.email}</a></dd>
              {business.openingHours.map((o) => (
                <div key={o.label} style={{ display: "contents" }}><dt>{o.label}</dt><dd>{o.opens.replace(":", ".")}–{o.closes.replace(":", ".")}</dd></div>
              ))}
              <dt>Søndag</dt><dd>Lukket</dd>
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}
