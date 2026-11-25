import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { RETAILER, getCollection, rolexModels } from "@/data/rolex";
import BookingForm from "@/components/BookingForm";
import { canShowRolexPrice } from "@/lib/geo";
import { business, formatPrice } from "@/lib/site";

type P = { params: Promise<{ kollektion: string; rmc: string }> };

const find = (kollektion: string, rmc: string) =>
  rolexModels.find((m) => m.collection === kollektion && m.rmc.toLowerCase() === rmc.toLowerCase());

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { kollektion, rmc } = await params;
  const m = find(kollektion, rmc);
  if (!m) return {};
  return {
    title: { absolute: `Rolex ${m.modelName} ${m.caseDescription}, ${m.rmc}` },
    description: `Oplev Rolex ${m.modelName} hos ${RETAILER.name}, officiel Rolex-forhandler med tilladelse til at sælge og vedligeholde Rolex-ure.`,
    alternates: { canonical: `/rolex/ure/${kollektion}/${m.rmc.toLowerCase()}` },
  };
}

export default async function RolexModelPage({ params }: P) {
  const { kollektion, rmc } = await params;
  const c = getCollection(kollektion);
  const m = find(kollektion, rmc);
  if (!c || !m) notFound();
  const showPrice = m.priceDkk && (await canShowRolexPrice());

  return (
    <div className="stack-lg section">
      <nav className="crumbs" aria-label="Brødkrummer"><ol><li><Link href="/rolex">Udforsk Rolex</Link></li><li><Link href="/rolex/ure">Rolex-ure</Link></li><li><Link href={`/rolex/ure/${c.slug}`}>{c.name}</Link></li><li aria-current="page">{m.modelName}</li></ol></nav>
      <div className="split">
        <div className="ph">Produktbillede {m.rmc} (fra Rolex) og fire galleribilleder</div>
        <div className="stack">
          <h1>Rolex<br />{m.modelName}<br /><span style={{ fontWeight: 400, fontSize: "1rem" }}>{m.caseDescription}<br />{m.rmc}</span></h1>
          {showPrice && <p className="price">Pris {formatPrice(m.priceDkk!)}</p>}
          <div className="cta-row">
            <a className="btn" href={`tel:${business.phoneE164}`}>Ring</a>
            <a className="btn ghost" href="#kontakt-model">Send en besked</a>
            <a className="btn ghost" href="#kontakt-model">Book en tid</a>
            <Link className="btn ghost" href="/rolex/kontakt">Find os</Link>
          </div>
        </div>
      </div>
      <div className="placeholder">Rolex-garanti, Det grønne segl og Rolex&apos; præsentationsæske: tekster fra Rolex, uændret.</div>
      <dl className="specs">{Object.entries(m.specs).map(([k, v]) => <div key={k} style={{ display: "contents" }}><dt>{k}</dt><dd>{v}</dd></div>)}</dl>
      <div className="placeholder">Tre modelegenskaber og standardtekst om tilgængelighed fra Rolex.</div>
      <section id="kontakt-model" className="stack"><h2>Kontakt os om denne model</h2><BookingForm variant="rolex" subject={`Rolex ${m.modelName} ${m.rmc}`} /></section>
    </div>
  );
}
