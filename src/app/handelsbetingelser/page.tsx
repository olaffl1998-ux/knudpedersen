import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Seo";
import { business } from "@/lib/site";

export const metadata: Metadata = { title: "Handelsbetingelser", alternates: { canonical: "/handelsbetingelser" } };

export default function Handelsbetingelser() {
  return (
    <section className="section">
      <div className="container container--narrow">
        <Breadcrumbs items={[{ name: "Handelsbetingelser", href: "/handelsbetingelser" }]} />
        <div className="prose">
          <p className="tag">Udkast – skal gennemgås af Knud Pedersen før lancering</p>
          <h1>Handelsbetingelser</h1>
          <p>Hjemmesiden er et showroom. Der kan ikke købes varer på hjemmesiden, og alle køb sker i butikken. Disse betingelser gælder for brug af hjemmesiden og for bookinger.</p>
          <h2>Virksomheden</h2>
          <p>{business.legalName}<br />{business.street}, {business.postalCode} {business.city}<br />CVR {business.cvr}<br />Tlf. {business.phone} · <a href={`mailto:${business.email}`}>{business.email}</a></p>
          <h2>Priser</h2>
          <p>Priser på hjemmesiden er vejledende udsalgspriser i danske kroner inklusive moms. Vi tager forbehold for trykfejl, prisændringer og udsolgte varer. Visningen af et produkt er ikke en garanti for, at det er på lager.</p>
          <h2>Booking af tid</h2>
          <p>Når du booker en tid, sender vi en bekræftelse på e-mail. Kan du ikke komme, beder vi dig give besked på telefon eller e-mail. [Regler for ændring og aflysning bekræftes af Knud Pedersen]</p>
          <h2>Køb i butikken</h2>
          <p>[Betingelser for køb i butikken: betaling, bytte- og returret, garanti og reklamation. Leveres af Knud Pedersen.]</p>
          <h2>Service og reparation</h2>
          <p>[Betingelser for service: prisoverslag, afhentningsfrist og ansvar for indleverede genstande. Leveres af Knud Pedersen.]</p>
          <h2>Klager</h2>
          <p>Har du en klage, så kontakt os først. Du kan også klage til Nævnenes Hus, Toldboden 2, 8800 Viborg, via <a href="https://www.naevneneshus.dk" rel="noopener">naevneneshus.dk</a>.</p>
          <p className="muted">Senest opdateret: [dato]</p>
        </div>
      </div>
    </section>
  );
}
