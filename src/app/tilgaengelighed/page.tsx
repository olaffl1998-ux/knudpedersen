import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Seo";
import { business } from "@/lib/site";

export const metadata: Metadata = { title: "Tilgængelighedserklæring", description: "Tilgængelighedserklæring for knudpedersen.dk: hvad vi gør for at siden kan bruges af alle, og hvordan du kontakter os om fejl.", alternates: { canonical: "/tilgaengelighed" } };

export default function Tilgaengelighed() {
  return (
    <section className="section">
      <div className="container container--narrow">
        <Breadcrumbs items={[{ name: "Tilgængelighedserklæring", href: "/tilgaengelighed" }]} />
        <div className="prose">
          <h1>Tilgængelighedserklæring</h1>
          <p>Siden er bygget efter WCAG 2.1 niveau AA: tydelig kontrast, tekstalternativer til billeder, fuld tastaturbetjening, synligt fokus og formularfejl, der forklarer, hvad der mangler.</p>
          <p>Indhold fra tredjeparter, fx Rolex-uret og Google Maps, styres ikke af os.</p>
          <p>Oplever du problemer, så skriv til {business.email} eller ring på {business.phone}.</p>
        </div>
      </div>
    </section>
  );
}
