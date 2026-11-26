import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Seo";

export const metadata: Metadata = {
  title: "Brugte ure i Aarhus",
  description: "Brugte ure hos Knud Pedersen i Aarhus. Kontakt os for det aktuelle udvalg.",
  alternates: { canonical: "/brugte-ure" },
};

export default function BrugteUre() {
  return (
    <>
      <div className="container"><Breadcrumbs items={[{ name: "Ure", href: "/ure" }, { name: "Brugte ure", href: "/brugte-ure" }]} /></div>
      <section className="container page-head">
        <span className="label">Brugte ure</span>
        <h1>Brugte ure</h1>
        <p className="lead">[Tekst om brugte ure hos Knud Pedersen: hvordan urene kontrolleres, hvilken garanti der gives, og om I tager ure i bytte. Leveres af Knud Pedersen.]</p>
      </section>
      <section className="container" style={{ paddingBottom: 120 }}>
        <div className="empty">
          <p>[Det aktuelle udvalg af brugte ure vises her, når listen er klar.]</p>
          <p className="btn-row" style={{ justifyContent: "center" }}><Link className="btn" href="/kontakt">Spørg til udvalget</Link><Link className="btn btn--outline" href="/rolex-certified-pre-owned">Rolex Certified Pre-Owned</Link></p>
        </div>
      </section>
    </>
  );
}
