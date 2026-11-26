import Link from "next/link";
import { business } from "@/lib/site";
import { rolexAssets } from "@/data/rolex";
import { CookieSettingsButton } from "./Consent";
import Newsletter from "./Newsletter";
import BackToTop from "./BackToTop";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-brand">
        <div>
          <span className="footer-logo">KNUD PEDERSEN</span>
          <p>Ure og smykker på Skt. Clemens Torv i Aarhus. Officiel Rolex-forhandler og autoriseret Rolex-servicecenter.</p>
        </div>
        <div className="newsletter footer-newsletter">
          <h2>Nyhedsbrev</h2>
          <p className="footer-muted">Hør først om nye ure, smykker og arrangementer i butikken.</p>
          <Newsletter dark id="footer-nyhedsbrev" />
        </div>
      </div>
      <div className="container footer-top">
        <div>
          <h2>Butik</h2>
          <ul>
            <li><Link href="/ure">Ure</Link></li>
            <li><Link href="/smykker">Smykker</Link></li>
            <li><Link href="/vielsesringe">Vielsesringe</Link></li>
            <li><Link href="/maerker">Mærker</Link></li>
            <li><Link href="/brugte-ure">Brugte ure</Link></li>
            <li><Link href="/rolex/discover">Rolex</Link></li>
          </ul>
        </div>
        <div>
          <h2>Kundeservice</h2>
          <ul>
            <li><Link href="/book-tid">Book tid</Link></li>
            <li><Link href="/service">Service og reparation</Link></li>
            <li><Link href="/kontakt">Kontakt os</Link></li>
            <li><Link href="/handelsbetingelser">Handelsbetingelser</Link></li>
            <li><Link href="/oenskeliste">Ønskeliste</Link></li>
          </ul>
        </div>
        <div>
          <h2>Om os</h2>
          <ul>
            <li><Link href="/om-os">Vores historie</Link></li>
            <li><Link href="/om-os#vaerksted">Værkstedet</Link></li>
            <li><Link href="/om-os#job">Job hos Knud Pedersen</Link></li>
            <li><Link href="/rolex/knud-pedersen">Rolex hos Knud Pedersen</Link></li>
          </ul>
        </div>
        <div>
          <h2>Kontakt</h2>
          <address style={{ fontStyle: "normal" }}>
            {business.legalName}<br />{business.street}<br />{business.postalCode} {business.city}<br />
            <a href={`tel:${business.phoneE164}`}>Tlf. {business.phone}</a><br />
            <a href={`mailto:${business.email}`}>{business.email}</a>
          </address>
          <div className="social">
            <a href={business.instagram} rel="noopener">Instagram</a>
            <a href={business.facebook} rel="noopener">Facebook</a>
          </div>
        </div>
        <div className="footer-news">
          <h2>Officiel forhandler</h2>
          <Link className="footer-rolex" href="/rolex/discover" aria-label="Officiel Rolex-forhandler, Udforsk Rolex">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={rolexAssets.plaque} alt="Officiel Rolex-forhandler" width={120} height={60} loading="lazy" />
          </Link>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>© {new Date().getFullYear()} {business.legalName} · CVR {business.cvr}</span>
        <ul>
          <li><Link href="/handelsbetingelser">Handelsbetingelser</Link></li>
          <li><Link href="/privatlivspolitik">Privatlivspolitik</Link></li>
          <li><Link href="/cookiepolitik">Cookiepolitik</Link></li>
          <li><Link href="/tilgaengelighed">Tilgængelighedserklæring</Link></li>
          <li><CookieSettingsButton /></li>
        </ul>
      </div>
      <BackToTop />
    </footer>
  );
}
