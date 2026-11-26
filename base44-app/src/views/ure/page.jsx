import Link from "@/lib/next/link";
import Catalog from "@/components/Catalog";
import { getBrand, genderOf, models, priceBands, sizeOf } from "@/data/catalog";
import { Breadcrumbs } from "@/components/Seo";
export const metadata = {
    title: "Ure i Aarhus – Tudor, Omega, Breitling, Grand Seiko og flere",
    description: "Se ure fra Tudor, Omega, Breitling, Grand Seiko, TAG Heuer, Longines og flere hos Knud Pedersen i Aarhus. Filtrér efter mærke, størrelse, materiale og pris.",
    alternates: { canonical: "/ure" },
};
export default function Watches() {
    // Rolex vises ikke her (Rolex' krav). Rolex har sin egen sektion.
    const items = models.map((m, order) => ({
        m, order,
        brandName: getBrand(m.brand).name,
        gender: genderOf(m),
        size: sizeOf(m),
        material: m.specs.Kasse ?? "",
        movement: m.specs["Urværk"] ?? "",
        band: priceBands.find((b) => m.price >= b.min && m.price < b.max).label,
    }));
    return (<>
      <div className="container"><Breadcrumbs items={[{ name: "Ure", href: "/ure" }]}/></div>
      <section className="container page-head">
        <span className="label">Ure</span>
        <h1>Ure</h1>
        <p className="lead">{models.length} ure fra {new Set(models.map((m) => m.brand)).size} mærker. Vejledende priser. Urene kan ikke købes online. Book et møde, så har vi dem klar. Rolex finder du i <Link href="/rolex/discover">Rolex-sektionen</Link>.</p>
      </section>
      <section className="container" style={{ paddingBottom: 120 }}>
        <Catalog items={items} bandOrder={priceBands.map((b) => b.label)}/>
      </section>
    </>);
}
