import Link from "next/link";
import { brands, models, genderOf } from "@/data/catalog";
import { pieces } from "@/data/jewellery";
import { jewelleryBrandList } from "@/data/jewellery";
import { rolexAssets } from "@/data/rolex";
import CampaignHero, { type Campaign } from "@/components/CampaignHero";
import FeatureWatch from "@/components/FeatureWatch";
import { CountUp, Words } from "@/components/Motion";
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
const T = "/billeder/pics/_thumbs/";
const ETERNITY_YG = "/billeder/shop/Ring-i-yg-1200.webp";
const ETERNITY_WG = "/billeder/shop/Ring-i-wg-1200-1.webp";
const AISLING_ROUNDS = "/billeder/shop/R-ASR4-S-RS-Aisling-Rounds-107ct-sides-015ct--RS30-1200.webp";
/** Rolex' officielle billede til forhandlere (Udforsk Rolex, serviceeftersyn) */
const ROLEX_SERVICE_IMG = "/billeder/pics/Rolex/v7images/discover-rolex-page-assets/discover-rolex-page-assets-landscape/keep-exploring-landscape/rolex-keep-exploring-servicing-2234_rolex-sav_retailers_176_controle-final_mise_heure_v2-landscape.jpg";
const TEAM_IMG = "/billeder/pics/Bundslider_Knud-Pedersen_11.jpg";
const stories = [
  { href: "/service", img: WORKSHOP, alt: "Urmager ved arbejdsbordet i Knud Pedersens værksted", title: "Professionel service", text: "Vores faguddannede urmagere følger urproducenternes træning og efteruddannelse og er godkendt til at servicere dit ur.", cta: "Læs om service" },
  { href: "/rolex/servicing", img: ROLEX_SERVICE_IMG, alt: "Rolex-serviceeftersyn", title: "Autoriseret Rolex-servicecenter", text: "Vores Rolex-oplærte urmagere servicerer dit Rolex-ur efter Rolex' egne standarder.", cta: "Rolex-serviceeftersyn" },
  { href: "/book-tid", img: TEAM_IMG, alt: "Medarbejderne hos Knud Pedersen på Skt. Clemens Torv", title: "Personlig rådgivning i butikken", text: "Book et møde, så har vi urene eller smykkerne klar, når du kommer. Møderne varer en time.", cta: "Book tid" },
];
const jewelLinks = [
  { href: "/smykker/ringe", label: "Ringe" },
  { href: "/vielsesringe", label: "Forlovelsesringe" },
  { href: "/smykker/oereringe", label: "Øreringe" },
  { href: "/smykker/halskaeder", label: "Halskæder" },
  { href: "/smykker/armbaand", label: "Armbånd" },
];
const campaigns: Campaign[] = [
  { brand: "Tudor", title: "Tudor Monarch", href: "/maerker/tudor", desktop: `${T}tudor-monarch-computer.w2400.h880.jpg`, mobile: `${T}tudor-monarch-mobil.w640.h640.jpg` },
  { brand: "Grand Seiko", title: "Snowflake, inspireret af naturen", href: "/maerker/grand-seiko", desktop: `${T}GS_Snowflake_logo_Desktop_2400x1100.w2400.h880.jpg`, mobile: `${T}GS_Snowflake_logo_Mobile_640x640-1.w640.h640.jpg` },
  { brand: "Marselis Jewellery", title: "Diamanter i 18 karat guld", href: "/smykker/marselis", desktop: `${T}0641-0554-4-Marselis--banner_desktop.w2400.h880.jpg`, mobile: `${T}0641-0554-4-Marselis--banner_mobile.w640.h640.jpg` },
  { brand: "TAG Heuer", title: "Designed to win", href: "/maerker/tag-heuer", desktop: `${T}2400x1100px_TAGH-DTW26-HolidaySeason_NESE_KnudPedersen.w2400.h880.jpg`, mobile: `${T}640x640px_TAGH-DTW26-HolidaySeason_NESE_KnudPedersen.w640.h640.jpg` },
  { brand: "Georg Jensen", title: "Sæsonens smykker", href: "/smykker/georg-jensen", desktop: `${T}GJ_AW26_JW_Seasonal-_WS-eCom-banner_2400x1100px-1.w2400.h880.jpg`, mobile: `${T}GJ_AW26_JW_Seasonal-_WS-eCom-banner_640x640px.w640.h640.jpg` },
  { brand: "Gucci", title: "Interlocking G", href: "/maerker/gucci", desktop: `${T}Gucci_GUCCI_INTERLOCKING_BANGLE_2400x1100.w2400.h880.jpg`, mobile: `${T}Gucci_GUCCI_INTERLOCKING_BANGLE_640x640.w640.h640.jpg` },
];

const reviews: { text: string; name: string; date: string; source: string }[] = [];

export default function Home() {
  const byRef = (ref: string) => models.find((m) => m.ref === ref && m.image);
  const focus = byRef("1-66-06-04-22-05") ?? pick("glashutte-original")[0];
  const herre = models.find((m) => m.image && m.brand === "omega" && genderOf(m) === "Herre") ?? pick("omega")[0];
  const dame = models.find((m) => m.image && genderOf(m) === "Dame");
  const tiles = [
    { href: "/ure/herreure", title: "Herreure", img: herre?.image, big: false },
    { href: "/ure/dameure", title: "Dameure", img: dame?.image, big: false },
    { href: "/smykker", title: "Smykker og ringe", img: ETERNITY_WG, big: true },
    { href: "/service", title: "Service og reparation", img: focus?.image, big: false },
  ];
  const watchGroup = ["glashutte-original", "breitling", "omega", "grand-seiko", "tag-heuer", "longines", "baume-mercier", "oris", "doxa", "montblanc"];
  const jewelGroup = ["chopard", "georg-jensen", "gucci", "marselis", "ole-mathiesen"];
  const nameOf = (slug: string) => brands.find((b) => b.slug === slug) ?? jewelleryBrandList.find((b) => b.slug === slug);
  const jewelHref = (slug: string) => (jewelleryBrandList.some((b) => b.slug === slug) && !brands.some((b) => b.slug === slug) ? `/smykker/${slug}` : `/maerker/${slug}`);
  const brandGroups = [
    { label: "Ure", items: watchGroup.filter(nameOf).map((sl) => ({ href: `/maerker/${sl}`, name: nameOf(sl)!.name })) },
    { label: "Smykker", items: jewelGroup.filter(nameOf).map((sl) => ({ href: jewelHref(sl), name: nameOf(sl)!.name })) },
  ];
  const brandCount = 2 + brandGroups.reduce((n, g) => n + g.items.length, 0);

  return (
    <>
      {/* 1. Rolex-banner øverst på forsiden (Rolex' krav til officielle forhandlere) */}
      <section className="ed-bleed ed-bleed--first" aria-label="Rolex"><RolexBanner s={rolexAssets.slides[0]} eager /></section>

      {/* 2. Hero: mærkernes officielle kampagnebilleder i fuld bredde */}
      <h1 className="sr-only">Knud Pedersen, ure og smykker på Skt. Clemens Torv i Aarhus siden 1887</h1>
      <CampaignHero slides={campaigns} />

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
            <li><strong><CountUp to={brandCount} ms={1200} /></strong><span>Mærker med fabriksgaranti</span></li>
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
          <img className="rx-pos__photo" src={POS_IMG} alt="Rolex-afdelingen hos Knud Pedersen på Skt. Clemens Torv" loading="eager" fetchPriority="high" decoding="async" />
        </Link>
      </section>

      {/* 3b. Kategorier: fire kort i samme stil (produkt på lys flade, 4:5) */}
      <section className="hp-section hp-cats" aria-label="Kategorier">
        <div className="container">
          <ul className="cat-cards">
            {tiles.map((t) => (
              <li key={t.href}>
                <Link href={t.href} className={`cat-card${t.big ? " cat-card--big" : ""}`}>
                  <span className="cat-card__media">{t.img && /* eslint-disable-next-line @next/next/no-img-element */ <img src={t.img} alt="" loading="lazy" />}</span>
                  <strong>{t.title}</strong>
                  <span className="cat-card__cta">Udforsk</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 4b. Ét ur i fokus */}
      {focus && <FeatureWatch model={focus} kicker="I fokus" text="Saksisk urmageri fra Glashütte. Kom forbi og se det asymmetriske Pano-design og det håndoptrukne urværk på nært hold." />}

      {/* 5. Fra butikken og værkstedet: tre fotos i samme format */}
      <section className="hp-section hp-stories" aria-labelledby="historier">
        <div className="container">
          <div className="hp-head"><span className="label">Butikken</span><h2 id="historier">Fra butikken og værkstedet</h2></div>
          <ul className="story-cards">
            {stories.map((st) => (
              <li key={st.title}>
                <Link href={st.href} className="story-card">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <span className="story-card__media"><img src={st.img} alt={st.alt} loading="lazy" /></span>
                  <h3>{st.title}</h3>
                  <p>{st.text}</p>
                  <span className="link-arrow">{st.cta}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 6. Mærker: Rolex og Tudor for sig, derefter ure og smykker */}
      <section className="hp-section hp-brands" aria-labelledby="maerker-h">
        <div className="container">
          <div className="hp-head hp-head--center"><span className="label">Mærker</span><h2 id="maerker-h">{brandCount} mærker under ét tag</h2><Link className="link-arrow" href="/maerker">Alle mærker</Link></div>
          <ul className="brand-official">
            <li><Link href="/rolex/discover" aria-label="Rolex, officiel forhandler">{/* eslint-disable-next-line @next/next/no-img-element */}<img src={rolexAssets.plaque} alt="Officiel Rolex-forhandler" width={120} height={60} loading="lazy" /></Link></li>
            <li><Link href="/maerker/tudor" className="brand-official__tudor"><strong>Tudor</strong><small>Officiel forhandler</small></Link></li>
          </ul>
          {brandGroups.map((g) => (
            <div key={g.label} className="brand-group">
              <span className="label">{g.label}</span>
              <ul className="hp-brand-grid">
                {g.items.map((x) => <li key={x.href}><Link href={x.href}><span className="bn">{x.name}</span><span className="ba" aria-hidden="true">→</span></Link></li>)}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* 7. Rolex-banner #2 og point of sale-banner */}
      <section className="ed-bleed" aria-label="Rolex hos Knud Pedersen">
        <RolexBanner s={rolexAssets.slides[2]} />
      </section>
      {/* [Rolex point of sale-banner: foto af Rolex-afdelingen hos Knud Pedersen, leveres og godkendes af Rolex] */}

      {/* 8. Smykker */}
      <section className="hp-section hp-jewel" aria-labelledby="smykker-h">
        <div className="container hp-jewel__grid">
          <div className="hp-jewel__text">
            <span className="label">Smykker</span>
            <h2 id="smykker-h">Smykker i ædle metaller</h2>
            <p>Marselis Jewellery, Georg Jensen, Chopard og Gucci. Ringe, øreringe, halskæder og armbånd med certificerede diamanter.</p>
            <ul className="row-links">
              {jewelLinks.map((l) => <li key={l.label}><Link href={l.href}>{l.label}<span aria-hidden="true">→</span></Link></li>)}
            </ul>
            <div className="hp-actions">
              <Link className="btn" href="/smykker">Se alle smykker</Link>
              <a className="link-arrow" href="https://marselis.lovable.app/" target="_blank" rel="noopener">Besøg Marselis Jewellery</a>
            </div>
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <div className="hp-jewel__media"><img src={ETERNITY_YG} alt="Marselis Eternity-ring i gult guld med diamanter" loading="lazy" /></div>
        </div>
      </section>

      {/* 8b. Til det store ja: tekst til venstre, ring til højre */}
      <section className="hp-bridal" aria-labelledby="cine-title">
        <div className="hp-bridal__text">
          <span className="label">Vielsesringe og forlovelsesringe</span>
          <h2 id="cine-title">Til det store ja</h2>
          <p>Prøv ringe i ro og mag. Book en tid, så sætter vi tid af til jer.</p>
          <div className="hp-actions">
            <Link className="btn" href="/book-tid?formaal=vielsesringe">Book tid</Link>
            <Link className="link-arrow" href="/vielsesringe">Se vielsesringe</Link>
          </div>
          <p className="hp-bridal__extras">Gravering · Tilpasning af størrelse · Personlig rådgivning</p>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <div className="hp-bridal__media"><img src={AISLING_ROUNDS} alt="Forlovelsesring med diamanter" loading="lazy" /></div>
      </section>

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
