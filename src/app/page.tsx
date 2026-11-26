import Link from "next/link";
import { brands, brandHref, models, nonRolexBrands } from "@/data/catalog";
import { rolexAssets } from "@/data/rolex";

export default function Home() {
  const rolexBanner = rolexAssets.slides[1];
  const heroWatches = ["omega", "tudor", "grand-seiko"]
    .map((b) => models.find((m) => m.brand === b && m.image))
    .filter((m): m is (typeof models)[number] => Boolean(m));
  const tiles = nonRolexBrands
    .map((b) => ({ b, m: models.find((m) => m.brand === b.slug && m.image) }))
    .filter((t) => t.m)
    .slice(0, 8);

  return (
    <>
      <section className="hero-c">
        <div className="wrap">
          <p className="eyebrow">Skt. Clemens Torv · Aarhus</p>
          <h1>Ure og smykker, valgt med omhu</h1>
          <p className="lead">Faguddannede urmagere og rådgivere, der tager sig tid til dig. Book et møde, så står urene klar, når du kommer.</p>
          <div className="cta-row">
            <Link className="btn" href="/kontakt">Book et møde</Link>
            <Link className="btn ghost" href="/ure">Se kollektionen</Link>
          </div>
          <div className="hero-trio" aria-hidden="true">
            {heroWatches.map((m) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={m.slug} src={m.image} alt="" fetchPriority="high" />
            ))}
          </div>
        </div>
      </section>

      {/* Rolex-banner 1 (krav: to Rolex-bannere og et butiksbanner på forsiden) */}
      <section className="section">
        <div className="wrap">
          <div className="banner">
            <Link href={rolexBanner.href} className="banner-img">
              <picture>
                <source media="(max-width: 700px)" srcSet={rolexBanner.mobile} />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={rolexBanner.desktop} alt={rolexBanner.alt} loading="lazy" />
              </picture>
            </Link>
            <div className="txt">
              <p className="eyebrow">{rolexBanner.eyebrow}</p>
              <h2>{rolexBanner.title}</h2>
              <div><Link className="btn ghost" href={rolexBanner.href}>Opdag</Link></div>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap stack-lg">
          <div className="section-head">
            <p className="eyebrow">Vores mærker</p>
            <h2>{brands.length} urmærker under ét tag</h2>
            <p className="muted measure">Autoriseret forhandler af alle mærker i butikken: originale ure, fuld fabriksgaranti og service efter producentens krav.</p>
          </div>
          <div className="tiles">
            {tiles.map(({ b, m }) => (
              <Link key={b.slug} href={brandHref(b)} className="tile">
                <span className="tile-img">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={m!.image} alt="" loading="lazy" />
                </span>
                <span className="tile-name">{b.name}</span>
                <span className="tile-link">Se ure</span>
              </Link>
            ))}
          </div>
          <div className="center"><Link className="btn ghost" href="/ure">Alle mærker</Link></div>
        </div>
      </section>

      <section className="atelier">
        <div className="wrap">
          <div className="atelier-txt">
            <p className="eyebrow">Værkstedet</p>
            <h2>Service i vores eget urmagerværksted</h2>
            <p>Vores urmagere er certificeret af producenterne og servicerer dit ur efter deres standarder. Vi er officielt Rolex-servicecenter, og vi omtrækker også perlekæder og tilpasser smykker.</p>
            <div className="cta-row"><Link className="btn" href="/service">Læs om service</Link></div>
          </div>
          <div className="atelier-cards">
            <Link href="/smykker" className="mini">
              <p className="eyebrow">Smykker</p>
              <h3>Ringe, øreringe og halskæder</h3>
              <span className="tile-link">Se smykker</span>
            </Link>
            <Link href="/kontakt" className="mini">
              <p className="eyebrow">Personlig rådgivning</p>
              <h3>Book et møde i butikken</h3>
              <span className="tile-link">Book tid</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Rolex-banner 2: butiksbanner (point of sale) */}
      <section className="section">
        <div className="wrap">
          <div className="banner">
            <div className="txt">
              <p className="eyebrow">Rolex i Aarhus</p>
              <h2>Besøg vores Rolex-afdeling</h2>
              <p className="muted">Skt. Clemens Torv 6, 8000 Aarhus C.</p>
              <div><Link className="btn ghost" href="/rolex/kontakt">Kontakt os</Link></div>
            </div>
            <div className="ph">Butiksbanner<br />Foto af butikken efter Rolex&apos; fotoguide, godkendt af Rolex</div>
          </div>
        </div>
      </section>
    </>
  );
}
