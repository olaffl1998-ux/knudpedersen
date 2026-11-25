import type { Metadata } from "next";
import Link from "next/link";
import { jewelleryBrands } from "@/data/catalog";
import { Breadcrumbs } from "@/components/Seo";

export const metadata: Metadata = {
  title: "Smykker i Aarhus – Marselis, Chopard, Georg Jensen og flere",
  description: "Smykker i ædle metaller med certificerede diamanter hos Knud Pedersen i Aarhus. Ringe, øreringe, armbånd og halskæder samt omtrækning af perlekæder.",
  alternates: { canonical: "/smykker" },
};

export default function Smykker() {
  return (
    <section className="section tight-top">
      <div className="wrap stack-lg">
        <Breadcrumbs items={[{ name: "Smykker", href: "/smykker" }]} />
        <div className="split">
          <div className="stack"><p className="eyebrow">Smykker</p><h1>Smykker i ædle metaller</h1></div>
          <p className="measure muted">Ringe, armbånd, øreringe og halskæder med certificerede diamanter. Vi hjælper dig med at vælge, og du kan sætte dit eget præg på smykket.</p>
        </div>
        <div className="brand-grid">
          {jewelleryBrands.map((n) => <Link key={n} href={`/kontakt?emne=${encodeURIComponent(n)}`}>{n}<small>Smykker</small></Link>)}
        </div>
        <div className="placeholder">Smykkerne importeres med billeder, materialer og vejledende priser. Intet kan købes online.</div>
      </div>
    </section>
  );
}
