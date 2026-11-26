import Link from "@/lib/next/link";
import { RolexBar } from "@/components/rolex/client";
import { RETAILER } from "@/data/rolex";
export const metadata = {
    title: { absolute: `Rolex Certified Pre-Owned | ${RETAILER.name}` },
    description: `Rolex Certified Pre-Owned hos ${RETAILER.name} i ${RETAILER.city}.`,
    alternates: { canonical: "/rolex-certified-pre-owned" },
    robots: { index: false },
};
/**
 * Pladsholder. Rolex Certified Pre-Owned kræver en separat aftale med Rolex og
 * leveres som egen sektion med Rolex' indhold. Siden er skjult for søgemaskiner indtil da.
 */
export default function CPO() {
    return (<div className="rx">
      <RolexBar />
      <div className="rx-wrap">
        <section className="rx-intro">
          <h1>Rolex Certified Pre-Owned</h1>
          <p>[Sektionen udfyldes med indhold fra Rolex, hvis {RETAILER.name} tilslutter sig Rolex Certified Pre-Owned-programmet.]</p>
          <p><Link className="rx-btn" href="/rolex/discover">Udforsk Rolex</Link></p>
        </section>
      </div>
    </div>);
}
