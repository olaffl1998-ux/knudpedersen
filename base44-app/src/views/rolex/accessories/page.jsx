import Link from "@/lib/next/link";
import { Blocks, RImg, RolexPage } from "@/components/rolex/parts";
import { RETAILER, rolexAccessories, rolexPageBlocks } from "@/data/rolex";
export const metadata = {
    title: { absolute: `Rolex-accessories | ${RETAILER.name}` },
    description: `Rolex-manchetknapper og Rolex-bordure hos ${RETAILER.name}, officiel Rolex-forhandler i ${RETAILER.city}.`,
    alternates: { canonical: "/rolex/accessories" },
};
export default function Accessories() {
    const b = rolexPageBlocks.accessories;
    const cover = b[0];
    // Rolex' sektioner har "h1" som underoverskrifter; vises som h2
    const body = b.slice(1).map((x) => (x.type === "h1" ? { ...x, type: "h2" } : x));
    return (<RolexPage crumbs={[{ name: "Rolex-ure", href: "/rolex/watches" }, { name: "Rolex-accessories", href: "/rolex/accessories" }]} current="/rolex/accessories">
      <RImg img={{ l: cover.landscape, p: cover.portrait }} alt={cover.alt || "Rolex-accessories"} className="rx-cover" eager/>
      <section className="rx-intro"><h1>Rolex-accessories</h1></section>
      <section className="rx-editorial"><Blocks blocks={body}/></section>
      <section className="rx-models">
        <h2>Alle Rolex-accessories</h2>
        <ul className="rx-grid">
          {rolexAccessories.map((a) => (<li key={a.slug}>
              <Link href={`/rolex/accessories/${a.slug}`} className="rx-model-card">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                {a.packshot && <img src={a.packshot} alt={a.title} loading="lazy"/>}
                <span className="rx-eyebrow">Rolex</span>
                <strong>{a.name}</strong>
                <span>{a.material}</span>
              </Link>
            </li>))}
        </ul>
      </section>
    </RolexPage>);
}
