import Link from "@/lib/next/link";
import { brands, brandHref, getModelsForBrand } from "@/data/catalog";
import { Breadcrumbs } from "@/components/Seo";
export const metadata = {
    title: "Mærker – ure og smykker hos Knud Pedersen i Aarhus",
    description: "Knud Pedersen er officiel Rolex- og Tudor-forhandler og autoriseret forhandler af Omega, Breitling, Grand Seiko, TAG Heuer, Longines og flere mærker.",
    alternates: { canonical: "/maerker" },
};
export default function Brands() {
    const ordered = [...brands.filter((b) => b.slug === "rolex" || b.slug === "tudor"), ...brands.filter((b) => b.slug !== "rolex" && b.slug !== "tudor")];
    return (<>
      <div className="container"><Breadcrumbs items={[{ name: "Mærker", href: "/maerker" }]}/></div>
      <section className="container page-head">
        <span className="label">Mærker</span>
        <h1>{brands.length} urmærker under ét tag</h1>
        <p className="lead">Vi er autoriseret forhandler af alle mærker i butikken: originale ure, fuld fabriksgaranti og service efter producentens krav.</p>
      </section>
      <section className="container" style={{ paddingBottom: 120 }}>
        <ul className="brand-grid">
          {ordered.map((b) => (<li key={b.slug}>
              <Link href={brandHref(b)}>
                <strong>{b.name}</strong>
                <span>{b.rolex ? "Officiel Rolex-forhandler" : b.slug === "tudor" ? "Officiel Tudor-forhandler" : `${getModelsForBrand(b.slug).length || ""} ${b.kind.toLowerCase()}`.trim()}</span>
              </Link>
            </li>))}
        </ul>
      </section>
    </>);
}
