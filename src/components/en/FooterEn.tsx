import { OpenNow } from "@/components/OpeningToday";
import Link from "next/link";
import { business } from "@/lib/site";
import { rolexAssets } from "@/data/rolexAssets";
import { enHours, enNav } from "@/data/en";
import BackToTop from "../BackToTop";

/** Bunden på de engelske sider */
export default function FooterEn() {
  return (
    <footer className="site-footer">
      <div className="container footer-brand">
        <div>
          <span className="footer-logo">KNUD PEDERSEN</span>
          <p>Watches and jewellery on Skt. Clemens Torv in Aarhus. Official Rolex Retailer and authorised Rolex service centre.</p>
        </div>
      </div>
      <div className="container footer-top">
        <div>
          <h2>Explore</h2>
          <ul>{enNav.map((n) => <li key={n.href}><Link href={n.href}>{n.label}</Link></li>)}</ul>
        </div>
        <div>
          <h2>Opening hours</h2>
          <ul>{enHours.map((h) => <li key={h.label}>{h.label}: {h.time}</li>)}</ul>
        </div>
        <div>
          <h2>Contact</h2>
          <OpenNow en className="open-now--footer" />
          <address style={{ fontStyle: "normal" }}>
            {business.legalName}<br />{business.street}<br />{business.postalCode} {business.city}, Denmark<br />
            <a href={`tel:${business.phoneE164}`}>+45 {business.phone}</a><br />
            <a href={`mailto:${business.email}`}>{business.email}</a>
          </address>
          <div className="social">
            <a href={business.instagram} rel="noopener">Instagram</a>
            <a href={business.facebook} rel="noopener">Facebook</a>
          </div>
        </div>
        <div className="footer-news">
          <h2>Official retailer</h2>
          <Link className="footer-rolex" href="/rolex/discover" aria-label="Official Rolex Retailer">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={rolexAssets.plaque} alt="Official Rolex Retailer" width={120} height={60} loading="eager" />
          </Link>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>© {new Date().getFullYear()} {business.legalName} · CVR {business.cvr}</span>
        <ul>
          <li><Link href="/" hrefLang="da">Dansk</Link></li>
          <li><Link href="/privatlivspolitik" hrefLang="da">Privacy policy (in Danish)</Link></li>
          <li><Link href="/cookiepolitik" hrefLang="da">Cookie policy (in Danish)</Link></li>
        </ul>
      </div>
      <BackToTop />
    </footer>
  );
}
