import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { RETAILER, getCollection, modelsInCollection, rolexCollections } from "@/data/rolex";

type P = { params: Promise<{ kollektion: string }> };

export const dynamicParams = false;
export function generateStaticParams() {
  return rolexCollections.map((c) => ({ kollektion: c.slug }));
}

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const c = getCollection((await params).kollektion);
  if (!c) return {};
  return {
    title: { absolute: `Rolex ${c.name}-ure | ${RETAILER.name}` },
    description: `Se Rolex ${c.name}-ure online hos ${RETAILER.name}, officiel Rolex-forhandler af Rolex-ure til mænd og kvinder. Oplev mere hos ${RETAILER.name}.`,
    alternates: { canonical: `/rolex/ure/${c.slug}` },
  };
}

export default async function Collection({ params }: P) {
  const c = getCollection((await params).kollektion);
  if (!c) notFound();
  const models = modelsInCollection(c.slug);
  return (
    <div className="stack-lg section">
      <nav className="crumbs" aria-label="Brødkrummer"><ol><li><Link href="/rolex">Udforsk Rolex</Link></li><li><Link href="/rolex/ure">Rolex-ure</Link></li><li aria-current="page">{c.name}</li></ol></nav>
      <div className="ph">Forsidebillede af {c.name} fra Rolex (fuld bredde)</div>
      <div className="stack measure">
        <h1>Rolex {c.name}</h1>
        <p className="muted">Introtekst og historiefortælling (tekst, billeder og video) leveres af Rolex.</p>
      </div>
      {models.length ? (
        <div className="collection-group">
          {models.map((m) => (
            <Link key={m.rmc} href={`/rolex/ure/${c.slug}/${m.rmc.toLowerCase()}`}>
              <div className="ph">{m.rmc}</div>
              <strong>{m.modelName}</strong>
              <span>{m.caseDescription}</span>
            </Link>
          ))}
        </div>
      ) : (
        <div className="placeholder">Modellerne i {c.name} importeres fra Rolex&apos; Technical Specifications-fil og sorteres efter Rolex&apos; ranking. Seks vises først, resten med &quot;Vis flere&quot;.</div>
      )}
    </div>
  );
}
