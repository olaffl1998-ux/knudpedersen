import Link from "next/link";
import { brands, brandHref, models } from "@/data/catalog";
import { rolexAssets } from "@/data/rolex";

export default function Home() {
  const rolexBanner = rolexAssets.slides[1];
  const hero = models.find((m) => m.ref === "M79000N-0001") ?? models[0];
  return (
    <>
      <section className="hero section">
        <div className="wrap">
          <div className="stack">
            <p className="eyebrow">Ure og smykker i hjertet af Aarhus</p>
            <h1>Knud Pedersen – ure og smykker på Skt. Clemens Torv</h1>
            <p className="lead">
              Hos os møder du faguddannede urmagere og rådgivere, der tager sig tid til dig. Book et møde, så står urene klar, når du kommer.
            </p>
            <div className="cta-row" style={{ marginTop: "1rem" }}>
              <Link className="btn" href="/kontakt">Book et møde</Link>
              <Link className="btn ghost" href="/ure">Se vores ure</Link>
            </div>
          </div>
          <div className="hero-art" aria-hidden="true">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={hero.image} alt="" fetchPriority="high" />
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

      <section className="section tight-top">
        <div className="wrap stack-lg">
          <div className="split">
            <div><p className="eyebrow">Vores mærker</p><h2>{brands.length} urmærker under ét tag</h2></div>
            <p className="measure muted">
              Vi er autoriseret forhandler af alle mærker i butikken. Det betyder originale ure, fuld fabriksgaranti og service efter producentens krav.
            </p>
          </div>
          <div className="brand-grid">
            {brands.map((b) => (
              <Link key={b.slug} href={brandHref(b)}>{b.name}<small>{b.kind}</small></Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section soft">
        <div className="wrap cards">
          <div className="card">
            <p className="eyebrow">Værksted</p>
            <h3>Service på dit ur</h3>
            <p>Vores urmagere er certificeret af producenterne og servicerer dit ur efter deres standarder. Vi er også officielt Rolex-servicecenter.</p>
            <Link href="/service">Læs om service</Link>
          </div>
          <div className="card">
            <p className="eyebrow">Smykker</p>
            <h3>Smykker med certificerede diamanter</h3>
            <p>Ringe, øreringe og halskæder fra Marselis, Chopard, Georg Jensen og flere. Vi omtrækker også perlekæder.</p>
            <Link href="/smykker">Se smykker</Link>
          </div>
          <div className="card">
            <p className="eyebrow">Personlig rådgivning</p>
            <h3>Book et møde</h3>
            <p>Vælg et tidspunkt hos en salgs- eller servicemedarbejder. Så har vi god tid til dig.</p>
            <Link href="/kontakt">Book tid</Link>
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
