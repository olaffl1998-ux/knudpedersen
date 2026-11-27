import Link from "@/lib/next/link";
import { Breadcrumbs } from "@/components/Seo";
export const metadata = { title: "Persondatapolitik", description: "Persondatapolitik hos Knud Pedersen Juveler, Ure, Optik, Århus A/S: hvilke persondata vi indsamler, hvorfor, og hvilke rettigheder du har.", alternates: { canonical: "/privatlivspolitik" } };
/** Teksten er Knud Pedersens egen persondatapolitik fra knudpedersen.dk */
export default function Privatliv() {
    return (<section className="section">
      <div className="container container--narrow">
        <Breadcrumbs items={[{ name: "Persondatapolitik", href: "/privatlivspolitik" }]}/>
        <div className="prose">
          <h1>Persondatapolitik</h1>
          <p><strong>Persondatapolitik hos KNUD PEDERSEN JUVELER, URE, OPTIK, ÅRHUS A/S</strong></p>
          <p>Vi indhenter kun persondata i de tilfælde, hvor dette skulle være relevant for os, og vi vil kun indhente persondata, hvis det er relevant for din aktivitet hos KNUD PEDERSEN JUVELER, URE, OPTIK, ÅRHUS A/S.</p>
          <p>Ved indsamling, behandling og anvendelse af dine persondata overholder vi altid alle relevante lovbestemmelser.</p>
          <p>Vi vil kun opbevare dine persondata, så længe vi enten er pålagt en juridisk forpligtelse hertil, eller så længe det er relevant for den hensigt, hvormed de blev indsamlet.</p>

          <h2>Oplysninger vi indsamler</h2>
          <p>Hvis du ønsker at købe og modtage et produkt eller en ydelse fra os, har vi brug for at indsamle visse persondata for at kunne gennemføre handlen og for at kunne tilbyde dig vores services. Vi kan bruge cookies til at holde styr på indholdet i din indkøbskurv, mens du bruger vores webshop.</p>
          <p>Vi kan indhente oplysninger som f.eks. navn, e-mailadresse, postadresse, leveringsadresse (hvis den varierer fra postadresse), telefonnummer og betalingsoplysninger.</p>
          <p>KNUD PEDERSEN JUVELER, URE, OPTIK, ÅRHUS A/S indsamler og behandler dine persondata, når du foretager dig følgende:</p>
          <ul>
            <li>Besøger vores hjemmeside</li>
            <li>Sender os spørgsmål, reklamationer eller feedback</li>
          </ul>

          <h2>Den dataansvarlige</h2>
          <p>Den dataansvarlige for indsamling, behandling og anvendelse af dine personoplysninger på https://knudpedersen.dk er KNUD PEDERSEN JUVELER, URE, OPTIK, ÅRHUS A/S, Skt. Clemens Torv 6, 8000 Aarhus C, cvr nr. 78299428</p>

          <h2>Behandlingsgrundlag og formål</h2>
          <p>Dine almindelige kontaktoplysninger som navn og adresse indhenter vi for at kunne levere det produkt eller den ydelse, som du har købt hos os. Din e-mailadresse indhenter vi for at kunne sende dig en ordrebekræftelse samt en leveringsbekræftelse.</p>
          <p>Dine oplysninger (undtagen din e-mailadresse, hvis du har givet samtykke til behandling heraf med henblik på modtagelse af tilbud) vil blive slettet 5 år efter, at du har modtaget din vare eller ydelse.</p>

          <h2>Andre modtagere af personoplysninger</h2>
          <p>Vi sælger ikke dine persondata til tredjemand, og vi overfører ikke dine persondata til tredjelande.</p>
          <p>Vi har vores hjemmeside hos Scannet A/S, som fungerer som vores databehandler. Alle persondata som du oplyser på vores hjemmeside vil blive opbevaret i Scannet A/Ss datacentre.</p>
          <p>Vi anvender eksterne virksomheder som leverandører for at levere vores ydelser bedst muligt. Disse eksterne leverandører er databehandlere og behandler i visse tilfælde personoplysninger i forbindelse med deres levering af ydelser til os. Vores databehandlere behandler kun personoplysninger efter vores instruks og i overensstemmelse med lovgivningens krav til databehandlere.</p>
          <p>Vi har indgået databehandleraftaler med vores databehandlere, hvilket er vores garanti for, at de overholder gældende regler om beskyttelse af dine personoplysninger.</p>

          <h2>Dine rettigheder</h2>
          <p>Som den registrerede har du en række rettigheder, som vi til enhver tid skal sikre opfyldelse af. Du har ret til at anmode os om følgende:</p>
          <ul>
            <li>At få adgang til og få rettet/ændret dine persondata</li>
            <li>At få slettet persondata</li>
          </ul>
          <p>Du har derudover ret til at protestere over behandlingen af dine personlige data, og du har ret til at indgive klage til en databeskyttelsesmyndighed.</p>
          <p>Ønsker du ikke længere, at vi skal behandle dine personoplysninger, eller at vi skal begrænse behandlingen af dine personoplysninger, kan du også sende os en anmodning herom til vores e-mailadresse <a href="mailto:sktclemenstorv@knudpedersen.dk">sktclemenstorv@knudpedersen.dk</a>.</p>
          <p>Læs også vores <Link href="/cookiepolitik">cookies og privatlivspolitik</Link>.</p>
        </div>
      </div>
    </section>);
}
