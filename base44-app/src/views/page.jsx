import Link from "@/lib/next/link";
import { brands, brandHref, models, getBrand, modelHref, genderOf } from "@/data/catalog";
import { pieces } from "@/data/jewellery";
import { rolexAssets } from "@/data/rolex";
import ModelCard from "@/components/ModelCard";
import Carousel from "@/components/Carousel";
import Hours from "@/components/Hours";
import { MapEmbed } from "@/components/Consent";
import { business } from "@/lib/site";
const pick = (brand, n = 1) => models.filter((m) => m.brand === brand && m.image).slice(0, n);
function RolexBanner({ s }) {
    return (<Link href={s.href} className="rolex-banner">
      <picture>
        <source media="(max-width: 767px)" srcSet={s.mobile}/>
        <img src={s.desktop} alt={s.alt} loading="lazy"/>
      </picture>
      <span className="rolex-banner__cap"><small>{s.eyebrow}</small><strong>{s.title}</strong><em>Opdag</em></span>
    </Link>);
}
/** [Kundeanmeldelser fra Google eller Trustpilot: navn, dato og kilde leveres af Knud Pedersen] */
const reviews = [];
export default function Home() {
    const heroWatch = pick("tudor", 1)[0];
    const featuredBrands = ["tudor", "omega", "breitling", "grand-seiko", "tag-heuer", "longines", "glashutte-original", "oris", "baume-mercier", "doxa", "chopard"];
    const featured = featuredBrands.flatMap((b) => pick(b, 1)).slice(0, 10);
    const ordered = [...brands.filter((b) => b.slug === "rolex" || b.slug === "tudor"), ...brands.filter((b) => b.slug !== "rolex" && b.slug !== "tudor")];
    const jewel = pieces.find((p) => p.brand === "marselis" && p.image);
    const tudor = pick("tudor", 3)[2] ?? pick("tudor")[0];
    const gs = pick("grand-seiko", 2)[1];
    const jewelTypes = ["Ringe", "Øreringe", "Halskæder", "Armbånd"];
    const herre = models.find((m) => m.image && m.brand === "omega" && genderOf(m) === "Herre") ?? pick("omega")[0];
    const dame = models.find((m) => m.image && genderOf(m) === "Dame");
    const ring = pieces.find((p) => p.image && /ring/i.test(p.type) && p.brand !== "marselis") ?? pieces.find((p) => p.image && p !== jewel);
    const tiles = [
        { href: "/ure?koen=herre", eyebrow: "Ure", title: "Herreure", img: herre?.image, zoom: false },
        { href: "/ure?koen=dame", eyebrow: "Ure", title: "Dameure", img: dame?.image, zoom: false },
        { href: "/smykker", eyebrow: "Smykker", title: "Smykker og ringe", img: ring?.image ?? jewel?.image, zoom: true },
        { href: "/service", eyebrow: "Værkstedet", title: "Service og reparation", img: undefined, zoom: false },
    ];
    return (<>
      {/* 1. Hero: lys scene i fuld bredde med ét ur i stor størrelse */}
      <section className="ed-hero" aria-labelledby="hero-h">
        {/* [Hero-foto eller -film: butikken på Skt. Clemens Torv] kan erstatte urscenen, når det er leveret */}
        <div className="ed-hero__text">
          <span className="label label--brass">Skt. Clemens Torv · Aarhus · Siden 1887</span>
          <h1 id="hero-h">Ure og smykker,<br />valgt med omhu</h1>
          <p className="lead">Officiel Rolex- og Tudor-forhandler med eget urmagerværksted midt i Aarhus.</p>
          <div className="btn-row">
            <Link className="btn" href="/book-tid">Book et møde</Link>
            <Link className="link-arrow" href="/ure">Se alle ure</Link>
          </div>
        </div>
        {heroWatch && (<Link className="ed-hero__watch" href={modelHref(heroWatch)} aria-label={`${getBrand(heroWatch.brand).name} ${heroWatch.name}`}>
            <img src={heroWatch.image} alt={`${getBrand(heroWatch.brand).name} ${heroWatch.name}, reference ${heroWatch.ref}`} fetchPriority="high"/>
            <span className="ed-hero__cap"><small>{getBrand(heroWatch.brand).name}</small>{heroWatch.name}<em>Ref. {heroWatch.ref}</em></span>
          </Link>)}
      </section>

      {/* 2. Rolex-banner #1 */}
      <section className="ed-bleed" aria-label="Rolex"><RolexBanner s={rolexAssets.slides[0]}/></section>

      {/* 3. Indledning */}
      <section className="ed-intro">
        <div className="container">
          <p className="ed-statement">Siden 1887 har vi hjulpet Aarhus med at finde det ur eller smykke, der skal følge med resten af livet. Og med at passe på det bagefter.</p>
          <ul className="ed-facts">
            <li><strong>1887</strong><span>Grundlagt i Aarhus</span></li>
            <li><strong>{brands.length}</strong><span>Mærker med fabriksgaranti</span></li>
            <li><strong>Rolex</strong><span>Autoriseret servicecenter</span></li>
          </ul>
        </div>
      </section>

      {/* 3b. Kategorier i stort format */}
      <section className="ed-tiles" aria-label="Kategorier">
        {tiles.map((t) => (<Link key={t.href} href={t.href} className={`ed-tile${t.img ? "" : " ed-tile--type"}${t.zoom ? " ed-tile--zoom" : ""}`}>
            <span className="ed-tile__media">
            </span>
            <span className="ed-tile__cap"><small>{t.eyebrow}</small><strong>{t.title}</strong><em>Udforsk</em></span>
          </Link>))}
      </section>

      {/* 4. Udvalgte ure (ikke Rolex) */}
      <section className="section ed-featured">
        <div className="container">
          <Carousel title="Udvalgt lige nu" action={<Link className="link-arrow" href="/ure">Alle ure</Link>}>
            {featured.map((m) => <li key={m.brand + m.slug}><ModelCard model={m}/></li>)}
          </Carousel>
        </div>
      </section>

      {/* 5. Redaktionelle features */}
      <section className="section section--white">
        <div className="container">
          <div className="section-head"><div><span className="label">Historier</span><h2>Fra butikken og værkstedet</h2></div></div>
          <div className="features">
            <Link href="/maerker/tudor" className="feature">
              <h3>Officiel Tudor-forhandler</h3>
              <p>Se Black Bay, Pelagos og resten af Tudors kollektioner hos os på Skt. Clemens Torv.</p>
              <span className="link-arrow">Se Tudor</span>
            </Link>
            <Link href="/service" className="feature">
              <span className="feature__media feature__media--type" aria-hidden="true"><span><small>Værkstedet</small>Autoriseret<br />Rolex-<br />servicecenter</span></span>
              <h3>Service i eget værksted</h3>
              <p>Vores urmagere servicerer dit ur efter producentens standarder. Vi er autoriseret Rolex-servicecenter.</p>
              <span className="link-arrow">Læs om service</span>
            </Link>
            <Link href="/maerker/grand-seiko" className="feature">
              <h3>Grand Seiko</h3>
              <p>{getBrand("grand-seiko").intro}</p>
              <span className="link-arrow">Se Grand Seiko</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 6. Mærkegrid */}
      <section className="section">
        <div className="container">
          <div className="ed-head"><span className="label">Mærker</span><h2>{brands.length} mærker under ét tag</h2><Link className="link-arrow" href="/maerker">Alle mærker</Link></div>
          <ul className="ed-brands">
            {ordered.map((b) => (<li key={b.slug}><Link href={brandHref(b)}>{b.name}{(b.rolex || b.slug === "tudor") && <sup>Officiel forhandler</sup>}</Link></li>))}
          </ul>
        </div>
      </section>

      {/* 7. Rolex-banner #2 og point of sale-banner */}
      <section className="ed-bleed" aria-label="Rolex hos Knud Pedersen">
        <RolexBanner s={rolexAssets.slides[2]}/>
      </section>
      <section className="container section--tight">
        <div className="ph ph--banner">[Rolex point of sale-banner: foto af Rolex-afdelingen hos Knud Pedersen, leveres og godkendes af Rolex]</div>
      </section>

      {/* 8. Smykker */}
      <section className="section">
        <div className="container split split--rev">
          <div className="split__media">
            {jewel?.image ? (
        <img src={jewel.image} alt={`Marselis Jewellery ${jewel.name}`} loading="lazy" className="on-stage"/>) : <div className="ph">[Smykkefoto]</div>}
          </div>
          <div className="split__text">
            <span className="label">Smykker</span>
            <h2>Smykker i ædle metaller</h2>
            <p className="muted">Marselis Jewellery, Georg Jensen, Chopard og Gucci. Ringe, øreringe, halskæder og armbånd med certificerede diamanter.</p>
            <ul className="cat-list">{jewelTypes.map((t) => <li key={t}><Link href="/smykker">{t}</Link></li>)}<li><Link href="/vielsesringe">Vielsesringe</Link></li></ul>
          </div>
        </div>
      </section>

      {/* 9. Værksted og services */}
      <section className="section section--dark">
        <div className="container">
          <div className="section-head"><div><span className="label">Værkstedet</span><h2>Service, der holder i generationer</h2></div><Link className="btn btn--outline-light" href="/service">Service og reparation</Link></div>
          <ul className="services">
            <li><h3>Serviceeftersyn</h3><p>Komplet eftersyn af urværk, kasse og lænke efter producentens krav.</p></li>
            <li><h3>Rolex-service</h3><p>Autoriseret Rolex-servicecenter med Rolex-oplærte urmagere.</p></li>
            <li><h3>Batteri og rem</h3><p>Batteriskift, tætningstest og ny rem eller lænke, mens du venter. [Ventetid bekræftes]</p></li>
            <li><h3>Smykkeservice</h3><p>Omtrækning af perlekæder, rensning og tilpasning af ringe.</p></li>
          </ul>
        </div>
      </section>

      {/* 10. Book et møde */}
      <section className="section section--sand">
        <div className="container center">
          <span className="label">Personlig rådgivning</span>
          <h2>Book et møde i butikken</h2>
          <p className="lead">Fortæl os, hvad du er interesseret i, så har vi urene eller smykkerne klar, når du kommer. Møderne varer en time.</p>
          <div className="btn-row" style={{ justifyContent: "center" }}>
            <Link className="btn" href="/book-tid">Book tid</Link>
            <a className="btn btn--outline" href={`tel:${business.phoneE164}`}>Ring {business.phone}</a>
          </div>
        </div>
      </section>

      {/* 11. Anmeldelser: vises først, når rigtige anmeldelser er leveret (ingen opdigtede anmeldelser) */}
      {reviews.length > 0 && (<section className="section">
          <div className="container">
            <div className="section-head"><div><span className="label">Anmeldelser</span><h2>Det siger vores kunder</h2></div></div>
            <div className="reviews">
              {reviews.map((r) => (<figure key={r.name + r.date} className="review"><blockquote>{r.text}</blockquote><figcaption className="muted">{r.name}, {r.date} · {r.source}</figcaption></figure>))}
            </div>
          </div>
        </section>)}

      {/* 12. Besøg butikken */}
      <section className="section section--white" aria-labelledby="besoeg">
        <div className="container visit">
          <MapEmbed query={`${business.legalName}, ${business.street}, ${business.postalCode} Aarhus`} label="Kort over Skt. Clemens Torv 6, Aarhus"/>
          <div>
            <span className="label">Besøg os</span>
            <h2 id="besoeg">Skt. Clemens Torv 6</h2>
            <p>{business.postalCode} {business.city}, lige ved Aarhus Domkirke.</p>
            <Hours />
            <h3 className="h4">Parkering</h3>
            <p className="muted">[Nærmeste parkeringshuse og gåafstand bekræftes af butikken]</p>
            <div className="btn-row"><Link className="btn" href="/kontakt">Kontakt og rutevejledning</Link></div>
          </div>
        </div>
      </section>

      {/* 13. Nyhedsbrev: ligger i footeren lige under */}
    </>);
}
