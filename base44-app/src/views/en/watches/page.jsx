import Link from "@/lib/next/link";
import { enAlternates, enWatchBrands } from "@/data/en";
import VisitBlock from "@/components/en/VisitBlock";
export const metadata = {
    title: "Watches in Aarhus – Rolex, Tudor, Omega, Breitling and more",
    description: "Official Rolex Retailer and authorised dealer of Tudor, Omega, Breitling, Grand Seiko, TAG Heuer, Longines and more on Skt. Clemens Torv in Aarhus.",
    alternates: enAlternates("/en/watches"),
};
export default function WatchesEn() {
    return (<>
      <section className="container page-head jw-head">
        <span className="label">Watches</span>
        <h1>Our watch brands</h1>
        <p className="lead">See and try the watches in our store in Aarhus. All watches come with the manufacturer&apos;s international warranty. Prices are recommended retail prices in Danish kroner.</p>
      </section>
      <section className="container section" aria-label="Watch brands">
        <ul className="en-brands en-brands--big">
          <li><Link href="/rolex/discover"><strong>Rolex</strong><span>Official Rolex Retailer and authorised Rolex service centre.</span></Link></li>
          {enWatchBrands.map((b) => <li key={b.slug}><Link href={`/maerker/${b.slug}`}><strong>{b.name}</strong><span>{b.text}</span></Link></li>)}
        </ul>
        <p className="en-note">The brand pages and the watch catalogue are in Danish. Model names, sizes and prices read the same in every language.</p>
      </section>
      <VisitBlock />
    </>);
}
