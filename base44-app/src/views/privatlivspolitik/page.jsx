import { Breadcrumbs } from "@/components/Seo";
import { business } from "@/lib/site";
export const metadata = { title: "Privatlivspolitik", description: "Sådan behandler Knud Pedersen A/S dine personoplysninger, når du booker tid, skriver til os eller tilmelder dig nyhedsbrevet.", alternates: { canonical: "/privatlivspolitik" } };
export default function Privatliv() {
    return (<section className="section">
      <div className="container container--narrow">
        <Breadcrumbs items={[{ name: "Privatlivspolitik", href: "/privatlivspolitik" }]}/>
        <div className="prose">
          <p className="tag">Udkast – skal gennemgås før lancering</p>
          <h1>Privatlivspolitik</h1>
          <h2>Dataansvarlig</h2>
          <p>{business.legalName}, {business.street}, {business.postalCode} {business.city}, CVR {business.cvr}. Kontakt: {business.email}, tlf. {business.phone}.</p>
          <h2>Hvilke oplysninger vi behandler</h2>
          <ul>
            <li>Når du booker et møde eller sender en besked: navn, e-mail, telefonnummer, ønsket tidspunkt og din besked.</li>
            <li>Når du besøger siden: tekniske oplysninger og, hvis du har givet samtykke, statistik om brugen af siden.</li>
          </ul>
          <h2>Formål og retsgrundlag</h2>
          <p>Vi bruger oplysningerne til at besvare din henvendelse og forberede dit besøg (databeskyttelsesforordningens art. 6, stk. 1, litra b og f). Statistik og marketing sker kun med dit samtykke (art. 6, stk. 1, litra a).</p>
          <h2>Opbevaring</h2>
          <p>Henvendelser slettes senest 12 måneder efter sidste kontakt, medmindre de indgår i et køb eller en serviceordre, hvor bogføringslovens regler gælder.</p>
          <h2>Modtagere</h2>
          <p>Vi bruger databehandlere til hosting og afsendelse af e-mail. De behandler kun oplysningerne efter vores instruks og inden for EU/EØS eller med gyldigt overførselsgrundlag. Vi sælger aldrig dine oplysninger.</p>
          <h2>Dine rettigheder</h2>
          <p>Du har ret til indsigt, berigtigelse, sletning, begrænsning, dataportabilitet og indsigelse, og du kan altid trække et samtykke tilbage. Skriv til {business.email}. Du kan klage til Datatilsynet, www.datatilsynet.dk.</p>
        </div>
      </div>
    </section>);
}
