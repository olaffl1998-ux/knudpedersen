import Link from "next/link";
import { business } from "@/lib/site";
import { nonRolexBrands } from "@/data/catalog";
import { CookieSettingsButton } from "./Consent";

export default function Footer() {
  return (
    <footer className="site">
      <div className="wrap">
        <div>
          <h2>Knud Pedersen</h2>
          <p>
            {business.street}<br />{business.postalCode} {business.city}<br />
            <a href={`tel:${business.phoneE164}`}>Tlf. {business.phone}</a>
            <a href={`mailto:${business.email}`}>{business.email}</a>
          </p>
        </div>
        <div>
          <h2>Åbningstider</h2>
          <p>
            {business.openingHours.map((o) => (
              <span key={o.label}>{o.label} {o.opens.replace(":", ".")}–{o.closes.replace(":", ".")}<br /></span>
            ))}
            Søndag lukket
          </p>
        </div>
        <div>
          <h2>Mærker</h2>
          <Link href="/rolex">Rolex</Link>
          {nonRolexBrands.slice(0, 6).map((b) => <Link key={b.slug} href={`/ure/${b.slug}`}>{b.name}</Link>)}
          <Link href="/ure">Alle mærker</Link>
        </div>
        <div>
          <h2>Info</h2>
          <Link href="/service">Service og reparation</Link>
          <Link href="/om-os#job">Job hos Knud Pedersen</Link>
          <Link href="/privatlivspolitik">Privatlivspolitik</Link>
          <Link href="/cookiepolitik">Cookiepolitik</Link>
          <Link href="/tilgaengelighed">Tilgængelighedserklæring</Link>
          <CookieSettingsButton />
          <a href={business.instagram} rel="noopener">Instagram</a>
          <a href={business.facebook} rel="noopener">Facebook</a>
        </div>
        <div className="legal">
          <span>© {new Date().getFullYear()} {business.legalName} · CVR {business.cvr}</span>
          <span>Officiel Rolex-forhandler i Aarhus</span>
        </div>
      </div>
    </footer>
  );
}
