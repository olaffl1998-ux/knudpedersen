import Link from "next/link";
import { brands, brandHref, models, getBrand, modelHref, genderOf } from "@/data/catalog";
import { pieces } from "@/data/jewellery";
import { jewelleryCategories } from "@/data/categories";
import { rolexAssets } from "@/data/rolex";
import ModelCard from "@/components/ModelCard";
import Carousel from "@/components/Carousel";
import HeroSlides, { type Slide } from "@/components/HeroSlides";
import FeatureWatch from "@/components/FeatureWatch";
import { CountUp, Words } from "@/components/Motion";
import { formatPrice } from "@/lib/site";
import Hours from "@/components/Hours";
import { MapEmbed } from "@/components/Consent";
import { business, rolexClockSrc } from "@/lib/site";

/** Fotos fra Knud Pedersens nuværende hjemmeside */
const WORKSHOP = "/billeder/pics/Service_billede_forside.jpg";
const VIGNET = "/billeder/pics/KP_logo_vignet.png";
/** Foto af Rolex-afdelingen hos Knud Pedersen (fra den nuværende hjemmeside) */
const POS_IMG = "/billeder/pics/rolex-afdeling-knud-pedersen.jpg";

const pick = (brand: string, n = 1) => models.filter((m) => m.brand === brand && m.image).slice(0, n);

function RolexBanner({ s, eager }: { s: (typeof rolexAssets.slides)[number]; eager?: boolean }) {
  return (
    <Link href={s.href} className="rolex-banner">
      <picture>
        <source media="(max-width: 767px)" srcSet={s.mobile} />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={s.desktop} alt={s.alt} loading={eager ? "eager" : "lazy"} fetchPriority={eager ? "high" : undefined} />
      </picture>
      <span className="rolex-banner__cap"><small>Rolex</small><strong>{s.title}</strong><em>Opdag</em></span>
    </Link>
  );
}

/** [Kundeanmeldelser fra Google eller Trustpilot: navn, dato og kilde leveres af Knud Pedersen] */
const reviews: { text: string; name: string; date: string; source: string }[] = [];

export default function Home() {
  const heroWatch = pick("tudor", 1)[0];
  const byRef = (ref: string) => models.find((m) => m.ref === ref && m.image);
  const slideModels = [
    { m: heroWatch, kicker: "Officiel Tudor-forhandler" },
    { m: byRef("SBGE283") ?? pick("grand-seiko")[0], kicker: "Grand Seiko" },
    { m: byRef("1-39-11-06-80-70") ?? pick("glashutte-original")[0], kicker: "Glashütte Original" },
    { m: byRef("210.30.42.20.04.001") ?? pick("omega")[0], kicker: "Omega" },
  ].filter((x) => x.m);
  const slides: Slide[] = slideModels.map(({ m, kicker }) => ({
    href: modelHref(m!), image: m!.image!, brand: getBrand(m!.brand)!.name, name: m!.name, ref: m!.ref, price: formatPrice(m!.price), kicker,
  }));
  const focus = byRef("1-66-06-04-22-05") ?? pick("glashutte-original")[0];
  const featuredBrands = ["tudor", "omega", "breitling", "grand-seiko", "tag-heuer", "longines", "glashutte-original", "oris", "baume-mercier", "doxa", "chopard"];
  const featured = featuredBrands.flatMap((b) => pick(b, 1)).slice(0, 10);
  const ordered = [...brands.filter((b) => b.slug === "rolex" || b.slug === "tudor"), ...brands.filter((b) => b.slug !== "rolex" && b.slug !== "tudor")];
  const jewel = pieces.find((p) => p.image?.includes("KP_Rainbow_1")) ?? pieces.find((p) => p.brand === "marselis" && p.image);
  const gs = pick("grand-seiko", 2)[1];
  const bridal = pieces.find((p) => p.image && /Aisling-Ring-Oval/.test(p.image)) ?? pieces.find((p) => p.image && p.type === "Ringe");
  // Rolex-navnet bevæger sig ikke: Rolex' varemærke vises kun statisk
  const marquee = ordered.filter((b) => !b.rolex).map((b) => b.name);
  const herre = models.find((m) => m.image && m.brand === "omega" && genderOf(m) === "Herre") ?? pick("omega")[0];
  const dame = models.find((m) => m.image && genderOf(m) === "Dame");
  const ring = pieces.find((p) => p.image && /ring/i.test(p.type) && p.brand !== "marselis") ?? pieces.find((p) => p.image && p !== jewel);
  const tiles = [
    { href: "/ure/herreure", eyebrow: "Ure", title: "Herreure", img: herre?.image, zoom: false },
    { href: "/ure/dameure", eyebrow: "Ure", title: "Dameure", img: dame?.image, zoom: false },
    { href: "/smykker", eyebrow: "Smykker", title: "Smykker og ringe", img: ring?.image ?? jewel?.image, zoom: true },
    { href: "/service", eyebrow: "Værkstedet", title: "Service og reparation", img: WORKSHOP, zoom: false, photo: true },
  ];

  return (
    <>
      {/* 1. Rolex-banner øverst på forsiden (Rolex' krav til officielle forhandlere) */}
      <section className="ed-bleed ed-bleed--first" aria-label="Rolex"><RolexBanner s={rolexAssets.slides[0]} eager /></section>

      {/* 2. Hero: skiftende ure i stor størrelse */}
      <HeroSlides slides={slides} />

      {/* 3. Velkomst (Knud Pedersens egen tekst) */}
      <section className="ed-intro ed-welcome">
        <div className="container">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="ed-welcome__vignet" src={VIGNET} alt="" width={56} height={64} />
          <h2 className="ed-statement"><Words text="Velkommen til vores eksklusive ur- og smykkeforretning i hjertet af Aarhus" /></h2>
          <div className="ed-welcome__text">
            <p>Vi er stolte over at kunne præsentere en række af de mest anerkendte urmærker i verden. Vi vejleder med stor passion vores kunder i et kvalitativt og vigtigt valg af ur. Vores urkollektioner er nøje udvalgt til forretningen, så du kan få opfyldt dine drømme og ønsker.</p>
            <p>I butikken finder du et stort og eksklusivt udvalg af smykker i ædle metaller og med certificerede diamanter. Vi kan vejlede og guide dig i køb og investering af nye eksklusive smykker, hvor du også kan være med til at sætte dit eget personlige præg på smykket. Vi tilbyder også service og reparation af egne smykker og omtrækning af perlekæder.</p>
            <p className="ed-welcome__sign">Velkommen til Knud Pedersen.</p>
          </div>
          <ul className="ed-facts">
            <li><strong><CountUp from={1800} to={1887} /></strong><span>Grundlagt i Aarhus</span></li>
            <li><strong><CountUp to={brands.length} ms={1200} /></strong><span>Mærker med fabriksgaranti</span></li>
            <li><strong>Rolex</strong><span>Autoriseret servicecenter</span></li>
          </ul>
        </div>
      </section>

      {/* 3a. Rolex point of sale-banner: Rolex-uret og Rolex-afdelingen i butikken (uden animation) */}
      <section className="rx-pos" aria-label="Rolex hos Knud Pedersen">
        <Link href="/rolex/knud-pedersen" className="rx-pos__in">
          <span className="rx-pos__panel">
            <iframe className="rx-pos__clock" title="Rolex-ur" src={rolexClockSrc()} scrolling="no" tabIndex={-1} />
            <span className="rx-pos__txt"><small>Officiel Rolex-forhandler</small><strong>Rolex hos Knud Pedersen</strong><em>Opdag mere</em></span>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="rx-pos__plaque" src={rolexAssets.plaque} alt="Officiel Rolex-forhandler" width={120} height={60} />
          </span>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="rx-pos__photo" src={POS_IMG} alt="Rolex-afdelingen hos Knud Pedersen på Skt. Clemens Torv" loading="lazy" />
        </Link>
      </section>

      {/* 3b. Mærkerne glider roligt forbi */}
      <div className="ed-marquee" aria-label="Mærker hos Knud Pedersen">
        <ul>{marquee.map((n) => <li key={n}>{n}</li>)}</ul>
        <ul aria-hidden="true">{marquee.map((n) => <li key={n}>{n}</li>)}</ul>
      </div>

      {/* 3b. Kategorier i stort format */}
      <section className="ed-tiles" aria-label="Kategorier">
        {tiles.map((t) => (
          <Link key={t.href} href={t.href} className={`ed-tile${t.img ? "" : " ed-tile--type"}${t.zoom ? " ed-tile--zoom" : ""}${"photo" in t && t.photo ? " ed-tile--photo" : ""}`}>
            <span className="ed-tile__media">
              {t.img ? /* eslint-disable-next-line @next/next/no-img-element */ <img src={t.img} alt="" loading="lazy" /> : <span aria-hidden="true">KP</span>}
            </span>
            <span className="ed-tile__cap"><small>{t.eyebrow}</small><strong>{t.title}</strong><em>Udforsk</em></span>
          </Link>
        ))}
      </section>

      {/* 4. Udvalgte ure (ikke Rolex) */}
      <section className="section ed-featured">
        <div className="container">
          <Carousel title="Udvalgt lige nu" action={<Link className="link-arrow" href="/ure">Alle ure</Link>}>
            {featured.map((m) => <li key={m.brand + m.slug}><ModelCard model={m} /></li>)}
          </Carousel>
        </div>
      </section>

      {/* 4b. Ét ur i fokus */}
      {focus && <FeatureWatch model={focus} kicker="I fokus" text="Saksisk urmageri fra Glashütte. Kom forbi og se det asymmetriske Pano-design og det håndoptrukne urværk på nært hold." />}

      {/* 5. Redaktionelle features */}
      <section className="section section--white">
        <div className="container">
          <div className="section-head"><div><span className="label">Historier</span><h2>Fra butikken og værkstedet</h2></div></div>
          <div className="features">
            <Link href="/service" className="feature">
              <span className="feature__media feature__media--photo">{/* eslint-disable-next-line @next/next/no-img-element */}<img src={WORKSHOP} alt="Urmager servicerer et ur i Knud Pedersens værksted" loading="lazy" /></span>
              <h3>Ultimativ professionel service</h3>
              <p>Alle vores faguddannede urmagere følger urproducenternes træning og efteruddannelse, så vi er godkendt til at varetage service.</p>
              <span className="link-arrow">Læs om service</span>
            </Link>
            <Link href="/rolex/servicing" className="feature">
              <span className="feature__media feature__media--type" aria-hidden="true"><span><small>Værkstedet</small>Autoriseret<br />Rolex-<br />servicecenter</span></span>
              <h3>Autoriseret Rolex-servicecenter</h3>
              <p>Vores Rolex-oplærte urmagere servicerer dit Rolex-ur efter Rolex' egne standarder.</p>
              <span className="link-arrow">Rolex-serviceeftersyn</span>
            </Link>
            <Link href="/maerker/grand-seiko" className="feature">
              <span className="feature__media">{gs?.image && /* eslint-disable-next-line @next/next/no-img-element */ <img src={gs.image} alt={`Grand Seiko ${gs.name}`} loading="lazy" className="on-stage" />}</span>
              <h3>Grand Seiko</h3>
              <p>{getBrand("grand-seiko")!.intro}</p>
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
            {ordered.map((b) => (
              <li key={b.slug}><Link href={brandHref(b)}>{b.name}{(b.rolex || b.slug === "tudor") && <sup>Officiel forhandler</sup>}</Link></li>
            ))}
          </ul>
        </div>
      </section>

      {/* 7. Rolex-banner #2 og point of sale-banner */}
      <section className="ed-bleed" aria-label="Rolex hos Knud Pedersen">
        <RolexBanner s={rolexAssets.slides[2]} />
      </section>
      {/* [Rolex point of sale-banner: foto af Rolex-afdelingen hos Knud Pedersen, leveres og godkendes af Rolex] */}

      {/* 8. Smykker */}
      <section className="section">
        <div className="container split split--rev">
          <div className="split__media">
            {jewel?.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={jewel.image} alt={`Marselis Jewellery ${jewel.name}`} loading="lazy" className="on-stage" />
            ) : <div className="ph">[Smykkefoto]</div>}
          </div>
          <div className="split__text">
            <span className="label">Smykker</span>
            <h2>Smykker i ædle metaller</h2>
            <p className="muted">Marselis Jewellery, Georg Jensen, Chopard og Gucci. Ringe, øreringe, halskæder og armbånd med certificerede diamanter.</p>
            <ul className="cat-list">{jewelleryCategories.slice(0, 4).map((c) => <li key={c.slug}><Link href={`/smykker/${c.slug}`}>{c.label}</Link></li>)}<li><Link href="/vielsesringe">Vielsesringe</Link></li></ul>
            <p style={{ marginTop: 24 }}><a className="link-arrow" href="https://marselis.lovable.app/" target="_blank" rel="noopener">Besøg Marselis Jewellery</a></p>
          </div>
        </div>
      </section>

      {/* 8b. Vielsesringe: filmisk afsnit med centreret tekst */}
      {bridal?.image && (
        <section className="ed-cine" aria-labelledby="cine-title">
          <div className="ed-cine__media" aria-hidden="true">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={bridal.image} alt="" loading="lazy" />
          </div>
          <div className="ed-cine__text">
            <small>Vielsesringe og forlovelsesringe</small>
            <h2 id="cine-title">Til det store ja</h2>
            <p>Prøv ringe i ro og mag. Book en tid, så sætter vi tid af til jer.</p>
            <div className="btn-row">
              <Link className="btn btn--outline" href="/book-tid?formaal=vielsesringe">Book tid</Link>
              <Link className="link-arrow" href="/vielsesringe">Se vielsesringe</Link>
            </div>
          </div>
        </section>
      )}

      {/* 9. Værksted og services */}
      <section className="section section--dark">
        <div className="container">
          <div className="section-head"><div><span className="label">Værkstedet</span><h2>Service, der holder i generationer</h2></div><Link className="btn btn--outline-light" href="/service">Service og reparation</Link></div>
          <ul className="services">
            <li><h3>Serviceeftersyn</h3><p>Komplet eftersyn af urværk, kasse og lænke efter producentens krav.</p></li>
            <li><h3>Rolex-service</h3><p>Autoriseret Rolex-servicecenter med Rolex-oplærte urmagere.</p></li>
            <li><h3>Batteri og rem</h3><p>Batteriskift, tætningstest og ny rem eller lænke, ofte mens du venter.</p></li>
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
      {reviews.length > 0 && (
        <section className="section">
          <div className="container">
            <div className="section-head"><div><span className="label">Anmeldelser</span><h2>Det siger vores kunder</h2></div></div>
            <div className="reviews">
              {reviews.map((r) => (
                <figure key={r.name + r.date} className="review"><blockquote>{r.text}</blockquote><figcaption className="muted">{r.name}, {r.date} · {r.source}</figcaption></figure>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 12. Besøg butikken */}
      <section className="section section--white" aria-labelledby="besoeg">
        <div className="container visit">
          <MapEmbed query={`${business.legalName}, ${business.street}, ${business.postalCode} Aarhus`} label="Kort over Skt. Clemens Torv 6, Aarhus" />
          <div>
            <span className="label">Besøg os</span>
            <h2 id="besoeg">Skt. Clemens Torv 6</h2>
            <p>{business.postalCode} {business.city}, lige ved Aarhus Domkirke.</p>
            <Hours />
            <h3 className="h4">Parkering</h3>
            <p className="muted">Butikken ligger ved Domkirken midt i Aarhus. Der er parkeringshuse i gåafstand.</p>
            <div className="btn-row"><Link className="btn" href="/kontakt">Kontakt og rutevejledning</Link></div>
          </div>
        </div>
      </section>

      {/* 13. Nyhedsbrev: ligger i footeren lige under */}
    </>
  );
}
