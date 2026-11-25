import type { Metadata } from "next";
import Link from "next/link";
import { RETAILER, rolexCollections } from "@/data/rolex";

export const metadata: Metadata = {
  title: { absolute: `Rolex-ure i ${RETAILER.city} | ${RETAILER.name}` },
  description: `Se Rolex-ure online hos ${RETAILER.name}, officiel Rolex-forhandler af Rolex-ure til mænd og kvinder.`,
  alternates: { canonical: "/rolex/ure" },
};

const families = ["Classic", "Professional", "Perpetual"] as const;
const familyLabel = { Classic: "Oyster Perpetual Classic", Professional: "Oyster Perpetual Professional", Perpetual: "Perpetual" };

export default function RolexWatches() {
  return (
    <div className="stack-lg section">
      <div className="ph">Forsidebillede af et ur fra kollektionen (fra Rolex, uden tilpasning)</div>
      <div className="stack measure">
        <h1>Rolex-ure hos {RETAILER.name} i {RETAILER.city}</h1>
        <p className="muted">Introtekst og tekst om tilgængelighed leveres af Rolex.</p>
        <p><Link href="/rolex/nye-ure-2026">Se de nye ure 2026</Link></p>
      </div>
      {families.map((f) => (
        <section key={f} className="stack" aria-labelledby={`fam-${f}`}>
          <h2 id={`fam-${f}`}>{familyLabel[f]}</h2>
          <div className="collection-group">
            {rolexCollections.filter((c) => c.family === f).map((c) => (
              <Link key={c.slug} href={`/rolex/ure/${c.slug}`}>
                <div className="ph">Billede fra Rolex</div>
                <strong>{c.name}</strong>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
