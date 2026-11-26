import { Breadcrumbs } from "@/components/Seo";
import { business } from "@/lib/site";
export const metadata = { title: "Tilgængelighedserklæring", alternates: { canonical: "/tilgaengelighed" } };
export default function Tilgaengelighed() {
    return (<section className="section">
      <div className="container container--narrow">
        <Breadcrumbs items={[{ name: "Tilgængelighedserklæring", href: "/tilgaengelighed" }]}/>
        <div className="prose">
          <h1>Tilgængelighedserklæring</h1>
          <p>Siden er bygget efter WCAG 2.1 niveau AA: tydelig kontrast, tekstalternativer til billeder, fuld tastaturbetjening, synligt fokus og formularfejl, der forklarer, hvad der mangler.</p>
          <p>Indhold fra tredjeparter, fx Rolex-uret og Google Maps, styres ikke af os.</p>
          <p>Oplever du problemer, så skriv til {business.email} eller ring på {business.phone}.</p>
        </div>
      </div>
    </section>);
}
