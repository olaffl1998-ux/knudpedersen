import type { Metadata } from "next";
import { Blocks, RImg, RolexPage } from "@/components/rolex/parts";
import { RETAILER, servicingPrices as S, type Block, type PriceCard } from "@/data/rolex";

export const metadata: Metadata = {
  title: { absolute: `Priser på Rolex-serviceeftersyn | ${RETAILER.name}` },
  description: `Priser for serviceeftersyn af moderne, klassiske og vintage Rolex-ure hos ${RETAILER.name}, autoriseret Rolex-servicecenter i ${RETAILER.city}.`,
  alternates: { canonical: "/rolex/servicing-prices" },
};

function Card({ c }: { c: PriceCard }) {
  return (
    <section className="rx-price-card">
      <RImg img={c.img} alt={c.alt} />
      <div>
        <h2>{c.title}</h2>
        <p className="rx-eyebrow">{c.sub}</p>
        <table>
          <caption className="sr-only">{c.title}: priser for komplet serviceeftersyn</caption>
          <thead><tr><th scope="col">Modeller</th><th scope="col">Pris (kr.)</th></tr></thead>
          <tbody>
            {c.rows.map((r) => (
              <tr key={r.families.join()}><td>{r.families.join(" · ")}</td><td>{r.price}</td></tr>
            ))}
          </tbody>
        </table>
        {c.notes.map((n) => <p key={n} className="rx-note">{n}</p>)}
      </div>
    </section>
  );
}

export default function ServicingPrices() {
  const cover = S.cover as Extract<Block, { type: "image" }>;
  const [modern, classic, vintage] = S.cards;
  return (
    <RolexPage crumbs={[{ name: "Serviceeftersyn", href: "/rolex/servicing" }, { name: "Priser", href: "/rolex/servicing-prices" }]} current="/rolex/servicing-prices">
      <RImg img={{ l: cover.landscape, p: cover.portrait }} alt={cover.alt || "Priser for serviceeftersyn"} className="rx-cover" eager />
      <section className="rx-intro">
        <h1>Se priserne for serviceeftersyn af dit Rolex-ur hos {RETAILER.name}</h1>
        <Blocks blocks={S.intro} />
      </section>
      {modern && <Card c={modern} />}
      {classic && <Card c={classic} />}
      <section className="rx-editorial"><Blocks blocks={S.modern} /></section>
      {vintage && <Card c={vintage} />}
      <section className="rx-editorial"><Blocks blocks={S.vintage} /></section>
      <section className="rx-editorial"><Blocks blocks={S.tail} /></section>
      <section className="rx-editorial rx-ref"><Blocks blocks={S.ref} /></section>
      {S.policy && <p className="rx-note">{S.policy}</p>}
    </RolexPage>
  );
}
