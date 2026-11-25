import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Seo";

export const metadata: Metadata = {
  title: "Om Knud Pedersen – ur- og smykkeforretning i Aarhus",
  description: "Mød Knud Pedersen, ur- og smykkeforretningen på Skt. Clemens Torv i Aarhus. Vores historie, vores hold og ledige stillinger.",
  alternates: { canonical: "/om-os" },
};

export default function OmOs() {
  return (
    <section className="section tight-top">
      <div className="wrap stack-lg">
        <Breadcrumbs items={[{ name: "Om os", href: "/om-os" }]} />
        <div className="split">
          <div className="stack"><p className="eyebrow">Om Knud Pedersen</p><h1>En ur- og smykkeforretning på Skt. Clemens Torv</h1></div>
          <p className="measure muted">Her kommer jeres historie: hvornår forretningen blev grundlagt, hvem der driver den i dag, og hvad I står for. Teksten skrives sammen med jer.</p>
        </div>
        <div className="cards">
          <div className="card"><p className="eyebrow">Holdet</p><h2 style={{ fontSize: "1.25rem" }}>Mød os</h2><p>Fotos, navne og roller for salgsrådgivere, urmagere og guldsmede.</p></div>
          <div className="card"><p className="eyebrow">Butikken</p><h2 style={{ fontSize: "1.25rem" }}>Besøg os</h2><p>Billeder fra butikken og værkstedet i Aarhus midtby.</p></div>
          <div className="card" id="job"><p className="eyebrow">Job</p><h2 style={{ fontSize: "1.25rem" }}>Arbejd hos os</h2><p>Ledige stillinger og uopfordrede ansøgninger sendes til sktclemenstorv@knudpedersen.dk.</p></div>
        </div>
      </div>
    </section>
  );
}
