import Link from "@/lib/next/link";
import { enAlternates } from "@/data/en";
import VisitBlock from "@/components/en/VisitBlock";
export const metadata = {
    title: "About Knud Pedersen – watches and jewellery in Aarhus",
    description: "A watch and jewellery store in the centre of Aarhus with its own workshop, Official Rolex and Tudor Retailer and authorised Rolex service centre.",
    alternates: enAlternates("/en/about"),
};
export default function AboutEn() {
    return (<>
      <section className="container page-head jw-head">
        <span className="label">About us</span>
        <h1>Watches and jewellery on Skt. Clemens Torv</h1>
        <p className="lead">Knud Pedersen is a watch and jewellery store in the centre of Aarhus with its own workshop. We are an Official Rolex and Tudor Retailer and an authorised Rolex service centre.</p>
      </section>
      <section className="section section--sand">
        <div className="container">
          <ul className="services services--3">
            <li><span className="label">In the store</span><h3>Sales advisers</h3><p>Advice on watches and jewellery, in peace and quiet and without obligation.</p></li>
            <li><span className="label">In the workshop</span><h3>Watchmakers</h3><p>Service and repair of watches in our own workshop.</p></li>
            <li><span className="label">In the workshop</span><h3>Goldsmiths</h3><p>Cleaning, resizing and repair of jewellery.</p></li>
          </ul>
        </div>
      </section>
      <section className="section">
        <div className="container container--narrow center">
          <span className="label">Our history</span>
          <h2>Part of Aarhus since 1887</h2>
          <p>Read the full story of the store, with photos from the archive, on <Link href="/om-os" hrefLang="da">our Danish history page</Link>.</p>
        </div>
      </section>
      <VisitBlock />
    </>);
}
