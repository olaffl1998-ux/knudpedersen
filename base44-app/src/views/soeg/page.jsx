import { Breadcrumbs } from "@/components/Seo";
import { SearchClient } from "@/components/ProductList";
import { productIndex } from "@/lib/productIndex";
export const metadata = { title: "Søg", alternates: { canonical: "/soeg" }, robots: { index: false, follow: true } };
export default function Soeg() {
    return (<>
      <div className="container"><Breadcrumbs items={[{ name: "Søg", href: "/soeg" }]}/></div>
      <section className="container page-head"><span className="label">Søg</span><h1>Find et ur eller smykke</h1></section>
      <section className="container" style={{ paddingBottom: 120 }}><SearchClient items={productIndex()}/></section>
    </>);
}
