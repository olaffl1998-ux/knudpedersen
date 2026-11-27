import { Breadcrumbs } from "@/components/Seo";
import { CompareClient } from "@/components/CompareClient";
import { getBrand, modelHref, modelKey, models } from "@/data/catalog";
import { dialColors } from "@/data/dialColors";
export const metadata = {
    title: "Sammenlign ure",
    description: "Sammenlign op til tre ure side om side: størrelse, materiale, urværk, vandtæthed og vejledende pris.",
    alternates: { canonical: "/sammenlign" },
    robots: { index: false, follow: true },
};
export default function Sammenlign() {
    const items = models
        .filter((m) => !getBrand(m.brand)?.rolex)
        .map((m) => ({
        key: modelKey(m), brand: getBrand(m.brand).name, name: m.name, ref: m.ref, price: m.price, image: m.image ?? null, href: modelHref(m),
        rows: {
            "Størrelse": m.size || "",
            "Kasse": m.specs.Kasse || "",
            "Urværk": m.specs["Urværk"] || "",
            "Vandtæthed": m.specs["Vandtæthed"] || "",
            "Urskive": m.specs.Skive || dialColors[modelKey(m)] || "",
            "Leveres på": m.specs["Leveres på"] || "",
            "Kollektion": m.specs.Kollektion || m.collection || "",
        },
    }));
    return (<>
      <div className="container"><Breadcrumbs items={[{ name: "Ure", href: "/ure" }, { name: "Sammenlign", href: "/sammenlign" }]}/></div>
      <section className="container page-head"><span className="label">Sammenlign</span><h1>Ure side om side</h1><p className="lead">Se op til tre ure ved siden af hinanden. Book en tid, så kan du prøve dem på håndleddet i butikken.</p></section>
      <section className="container" style={{ paddingBottom: 120 }}><CompareClient items={items}/></section>
    </>);
}
