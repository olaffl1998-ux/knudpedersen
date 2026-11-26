import Link from "@/lib/next/link";
import { SITE_URL, business } from "@/lib/site";
export function JsonLd({ data }) {
    return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}/>;
}
export function Breadcrumbs({ items }) {
    const all = [{ name: "Forside", href: "/" }, ...items];
    return (<nav className="crumbs" aria-label="Brødkrummer">
      <ol>
        {all.map((c, i) => (<li key={c.href}>
            {i === all.length - 1 ? <span aria-current="page">{c.name}</span> : <Link href={c.href}>{c.name}</Link>}
          </li>))}
      </ol>
      <JsonLd data={{
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: all.map((c, i) => ({ "@type": "ListItem", position: i + 1, name: c.name, item: `${SITE_URL}${c.href}` })),
        }}/>
    </nav>);
}
export const storeJsonLd = {
    "@context": "https://schema.org",
    "@type": "JewelryStore",
    "@id": `${SITE_URL}/#butik`,
    name: business.name,
    legalName: business.legalName,
    url: SITE_URL,
    telephone: business.phoneE164,
    email: business.email,
    vatID: `DK${business.cvr}`,
    address: {
        "@type": "PostalAddress",
        streetAddress: business.street,
        postalCode: business.postalCode,
        addressLocality: "Aarhus",
        addressCountry: business.country,
    },
    geo: { "@type": "GeoCoordinates", latitude: business.geo.lat, longitude: business.geo.lng },
    openingHoursSpecification: business.openingHours.map((o) => ({
        "@type": "OpeningHoursSpecification",
        dayOfWeek: o.days,
        opens: o.opens,
        closes: o.closes,
    })),
    sameAs: [business.instagram, business.facebook],
};
