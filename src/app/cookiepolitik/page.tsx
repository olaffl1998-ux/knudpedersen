import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Seo";
import { CookieSettingsButton } from "@/components/Consent";

export const metadata: Metadata = { title: "Cookies og privatlivspolitik", description: "Knud Pedersens cookie- og privatlivspolitik: hvilke cookies vi bruger, hvad vi bruger dem til, og hvordan du trækker dit samtykke tilbage.", alternates: { canonical: "/cookiepolitik" } };

/** Cookies, som den nye hjemmeside faktisk sætter (oversigten i Knud Pedersens politik) */
const rows = [
  ["kp-consent-v1", "Nødvendig", "Husker dit cookievalg (gemmes i din browser)", "Til du sletter det"],
  ["Rolex-ur (static.rolex.com)", "Nødvendig for Rolex-indhold", "Viser Rolex-uret, som Rolex kræver. Rolex kan sætte egne cookies, fx rlx-consent", "Se Rolex' cookiepolitik"],
  ["Google Maps", "Eksternt indhold", "Viser kortet på kontaktsiden. Indlæses kun efter samtykke", "Se Googles politik"],
  ["Statistik", "Statistik", "Indlæses kun efter samtykke", "Op til 13 måneder"],
];

/** Teksten er Knud Pedersens egen cookie- og privatlivspolitik fra knudpedersen.dk */
export default function Cookies() {
  return (
    <section className="section">
      <div className="container container--narrow">
        <Breadcrumbs items={[{ name: "Cookies og privatlivspolitik", href: "/cookiepolitik" }]} />
        <div className="prose">
          <h1>Cookies og privatlivspolitik</h1>
          <p>
            Knud Pedersen Juveler, Ure, Optik, Århus A/S<br />Skt. Clemens Torv 6<br />8000 Aarhus C.<br />Danmark<br />CVR: DK-78299428<br />
            Kontakt: Tlf. 86 12 17 99<br />Email: <a href="mailto:sktclemenstorv@knudpedersen.dk">sktclemenstorv@knudpedersen.dk</a>
          </p>

          <h2>Introduktion</h2>
          <p>Når du besøger vores website indsamles der oplysninger om dig, som bruges til at tilpasse og forbedre vores indhold. Hvis du ikke ønsker, at der indsamles oplysninger, bør du slette dine cookies (se vejledning herunder) og undlade videre brug af websitet.</p>

          <h2>Hvad er en cookie?</h2>
          <p>En cookie er en lille datafil, som sendes til browseren og lagres der, så en hjemmeside kan genkende din computer. Alle hjemmesider kan sende cookies til din browser, hvis browserindstillingerne tillader det. Hjemmesider kan kun læse oplysninger fra cookies, de selv har gemt og kan ikke læse cookies fra andre hjemmesider. Der er to typer af cookies: permanente og midlertidige (session cookies). Permanente cookies gemmes som en fil på din computer i en længere periode. Sessionscookies placeres midlertidigt på din computer, når du besøger et websted, men forsvinder, når du lukker siden ned, hvilket betyder, at de ikke er permanent gemt på din computer. De fleste virksomheder anvender cookies på deres hjemmesider for at forbedre brugervenligheden, og cookies kan ikke skade dine filer eller øge risikoen for virus på din computer.</p>

          <h2>Hvad bruger vi cookies til?</h2>
          <p>Mange funktioner på en hjemmeside er afhængige af, at der placeres en cookie, når en bruger besøger en hjemmeside, så først og fremmest, sætter vi cookies for at have en funktionel side. Vi gør derudover brug af både 1. part og 3. part cookies til at forbedre brugeroplevelsen på vores side og tilbyde relevant markedsføring. Når der sættes en 3. part cookie, så betyder det, at vi har tilladt en tredjepart, som f.eks. et socialt medie, Google Analytics eller lign. at placere en cookie i din browser, når du besøger vores hjemmeside.</p>
          <p>På vores side anvender vi følgende typer af cookies:</p>

          <h3>Nødvendige/Tekniske</h3>
          <p>Tekniske cookies er nødvendige for, at langt de fleste hjemmesider fungerer, som de skal. Som navnet angiver, har de kun teknisk betydning og dermed ikke nogen indvirkning på din privatsfære, idet de ikke registrerer, hvad du søger efter på andre hjemmesider.</p>
          <h3>Funktionelle</h3>
          <p>Funktionelle cookies anvendes for at huske dine brugerpræferencer ved at huske de valg og indstillinger du foretager på hjemmesiden, det kan f.eks. dreje sig om, hvilke præferencer du har i forhold til sprog og tekststørrelse.</p>
          <h3>Statistiske</h3>
          <p>Statistikcookies bruges til at optimere design, brugervenlighed og effektiviteten af en hjemmeside. De indsamlede oplysninger kan f.eks. indgå i analyser af, hvilke informationer der er mest populære på siden, så bliver vi opmærksomme på, hvad der skal være nemt at finde på siden.</p>
          <h3>Markedsføring</h3>
          <p>Markedsføringscookies indsamler oplysninger ved at følge dig på de enkelte hjemmesider, du besøger og kan siges at registrere de digitale fodspor, du sætter. Markedsføringscookies er derfor ”trackingcookies”. De indsamlede oplysninger bruges til at skabe et overblik over dine interesser, vaner og aktiviteter for at vise relevante annoncer for ting, du tidligere har vist interesse for. På den måde får du et mere målrettet indhold, eksempelvis i form af foreslået information, artikler og annoncer.</p>

          <h2>Oversigt over cookies</h2>
          <div style={{ overflowX: "auto" }}>
            <table style={{ borderCollapse: "collapse", width: "100%", fontSize: ".9rem" }}>
              <thead><tr>{["Navn", "Kategori", "Formål", "Varighed"].map((h) => <th key={h} style={{ textAlign: "left", borderBottom: "1px solid var(--line)", padding: ".5rem" }}>{h}</th>)}</tr></thead>
              <tbody>{rows.map((r) => <tr key={r[0]}>{r.map((c, i) => <td key={i} style={{ borderBottom: "1px solid var(--line)", padding: ".5rem", verticalAlign: "top" }}>{c}</td>)}</tr>)}</tbody>
            </table>
          </div>

          <h2>Du kan altid slette cookies eller trække dit samtykke tilbage</h2>
          <p>Du kan blokere eller slette cookies på denne hjemmeside ved at trække dit samtykke tilbage eller slå dem fra i din browsers indstillinger. Du skal dog være opmærksom på, at hvis cookies fravælges ellers slettes, kan der være funktioner og services, der ikke længere er anvendelige. Du har altid mulighed for at trække dit samtykke til cookies tilbage her:</p>
          <div><CookieSettingsButton /></div>

          <h2>Personoplysninger</h2>
          <p>Personoplysninger er alle slags informationer, der i et eller andet omfang kan henføres til dig. Når du benytter vores website indsamler og behandler vi en række sådanne informationer. Det sker f.eks. ved alm. tilgang af indhold, hvis du tilmelder dig vores nyhedsbrev, deltager i konkurrencer, registrerer dig som bruger eller øvrig brug af services. Vi indsamler og behandler typisk følgende typer af oplysninger: Et unikt ID og tekniske oplysninger om din computer, tablet eller mobiltelefon, dit IP-nummer, geografisk placering, samt hvilke sider du klikker på (interesser). I det omfang du selv giver eksplicit samtykke hertil og selv indtaster informationerne behandles desuden: Navn, telefonnummer, e-mail og adresse.</p>

          <h2>Sikkerhed</h2>
          <p>Vi har truffet tekniske og organisatoriske foranstaltninger mod, at dine oplysninger hændeligt eller ulovligt bliver slettet, offentliggjort, fortabt, forringet eller kommer til uvedkommendes kendskab, misbruges eller i øvrigt behandles i strid med lovgivningen.</p>

          <h2>Formål</h2>
          <p>Oplysningerne bruges til at identificere dig som bruger og kunne levere de services, du har efterspurgt, som f.eks. at fremsende et nyhedsbrev. Herudover anvender vi oplysningerne til at optimere vores services og indhold.</p>

          <h2>Periode for opbevaring</h2>
          <p>Oplysningerne opbevares i det tidsrum, der er tilladt i henhold til lovgivningen, og vi sletter dem, når de ikke længere er nødvendige. Perioden afhænger af karakteren af oplysningen og baggrunden for opbevaring. Det er derfor ikke muligt at angive en generel tidsramme for, hvornår informationer slettes.</p>

          <h2>Indsigt og klager</h2>
          <p>Du har ret til at få oplyst, hvilke personoplysninger, vi behandler om dig. Du kan desuden til enhver tid gøre indsigelse mod, at oplysninger anvendes. Du kan også tilbagekalde dit samtykke til, at der bliver behandlet oplysninger om dig. Hvis de oplysninger, der behandles om dig, er forkerte har du ret til at de bliver rettet eller slettet. Henvendelse herom kan ske til: <a href="mailto:sktclemenstorv@knudpedersen.dk">sktclemenstorv@knudpedersen.dk</a>. Hvis du vil klage over vores behandling af dine personoplysninger, har du også mulighed for at tage kontakt til Datatilsynet.</p>

          <h2>Vilkår og betingelser - Rolex Section</h2>
          <p>Når du navigerer på Rolex sektionen på denne webside styres nogle cookies af ROLEX SA, som anvender følgende cookiepolitik: <a href="https://www.rolex.com/legal-notices/cookies" target="_blank" rel="noopener">https://www.rolex.com/legal-notices/cookies</a></p>
        </div>
      </div>
    </section>
  );
}
