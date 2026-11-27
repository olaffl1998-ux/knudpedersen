import { daAlternates } from "@/data/en";
import Link from "@/lib/next/link";
import { models } from "@/data/catalog";
import { showroomBrands } from "@/data/brands";
import BrandShowroom from "@/components/showroom/BrandShowroom";
import { rolexAssets } from "@/data/rolexAssets";
import CampaignHero from "@/components/CampaignHero";
import FeatureWatch from "@/components/FeatureWatch";
import { CountUp, Words } from "@/components/Motion";
import Hours from "@/components/Hours";
import { MapEmbed } from "@/components/Consent";
export const metadata = {
    title: { absolute: "Knud Pedersen – Ure og smykker i Aarhus | Officiel Rolex-forhandler" },
    description: "Ure og smykker på Skt. Clemens Torv i Aarhus. Officiel Rolex-forhandler og forhandler af Tudor, Omega, Chopard og flere. Book tid eller service.",
    alternates: daAlternates("/"),
};
import { business, rolexClockSrc } from "@/lib/site";
/** Fotos fra Knud Pedersens nuværende hjemmeside */
const WORKSHOP = "/billeder/pics/Service_billede_forside.webp";
const VIGNET = "/billeder/pics/KP_logo_vignet.png";
/** Foto af Rolex-afdelingen hos Knud Pedersen (fra den nuværende hjemmeside) */
const POS_IMG = "/billeder/pics/rolex-afdeling-knud-pedersen.jpg";
const pick = (brand, n = 1) => models.filter((m) => m.brand === brand && m.image).slice(0, n);
function RolexBanner({ s, eager }) {
    return (<Link href={s.href} className="rolex-banner">
      <picture>
        <source media="(max-width: 767px)" srcSet={s.mobile}/>
                <img src={s.desktop} alt={s.alt} loading="eager" fetchPriority={eager ? "high" : "low"}/>
      </picture>
      <span className="rolex-banner__cap"><small>Rolex</small><strong>{s.title}</strong><em>Opdag</em></span>
    </Link>);
}
/** [Kundeanmeldelser fra Google eller Trustpilot: navn, dato og kilde leveres af Knud Pedersen] */
const T = "/billeder/pics/_thumbs/";
const jewelTiles = [
    { href: "/smykker/marselis", name: "Marselis Jewellery", line: "Diamanter i 18 karat guld", img: "/billeder/shop/R-ASO4-S-GG-Aisling-Ring-Oval-Center-Round-Sides-GG-standing-1200.webp", alt: "Marselis Elegance-ring i guld med diamanter" },
    { href: "/smykker/georg-jensen", name: "Georg Jensen", line: "Fusion", img: "/billeder/shop/20000332.webp", zoom: 1.12, alt: "Georg Jensen Fusion-ring i hvidguld" },
    { href: "/smykker/chopard", name: "Chopard", line: "Happy Diamonds", img: "/billeder/shop/798232-9001.webp", alt: "Chopard Happy Spirit-vedhæng med bevægelige diamanter" },
    { href: "/smykker/gucci", name: "Gucci", line: "Interlocking G", img: "/billeder/shop/YBD786563002_001.webp", zoom: 1.3, alt: "Gucci Interlocking-øreringe med grøn emalje" },
];
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
    { href: "/smykker/oereringe", label: "Øreringe" },
    { href: "/smykker/halskaeder", label: "Halskæder" },
    { href: "/smykker/armbaand", label: "Armbånd" },
];
const campaigns = [
    { brand: "Grand Seiko", title: "Snowflake, inspireret af naturen", href: "/maerker/grand-seiko", desktop: `${T}GS_Snowflake_logo_Desktop_2400x1100.w2400.h880.jpg`, mobile: `${T}GS_Snowflake_logo_Mobile_640x640-1.w640.h640.jpg` },
    { brand: "Marselis Jewellery", title: "Diamanter i 18 karat guld", href: "/smykker/marselis", desktop: `${T}0641-0554-4-Marselis--banner_desktop.w2400.h880.jpg`, mobile: `${T}0641-0554-4-Marselis--banner_mobile.w640.h640.jpg` },
    { brand: "TAG Heuer", title: "Designed to win", href: "/maerker/tag-heuer", desktop: `${T}2400x1100px_TAGH-DTW26-HolidaySeason_NESE_KnudPedersen.w2400.h880.jpg`, mobile: `${T}640x640px_TAGH-DTW26-HolidaySeason_NESE_KnudPedersen.w640.h640.jpg` },
    { brand: "Georg Jensen", title: "Sæsonens smykker", href: "/smykker/georg-jensen", desktop: `${T}GJ_AW26_JW_Seasonal-_WS-eCom-banner_2400x1100px-1.w2400.h880.jpg`, mobile: `${T}GJ_AW26_JW_Seasonal-_WS-eCom-banner_640x640px.w640.h640.jpg` },
    { brand: "Gucci", title: "Interlocking G", href: "/maerker/gucci", desktop: `${T}Gucci_GUCCI_INTERLOCKING_BANGLE_2400x1100.w2400.h880.jpg`, mobile: `${T}Gucci_GUCCI_INTERLOCKING_BANGLE_640x640.w640.h640.jpg` },
];
const reviews = [];
export default function Home() {
    const byRef = (ref) => models.find((m) => m.ref === ref && m.image);
    const focus = byRef("1-66-06-04-22-05") ?? pick("glashutte-original")[0];
    const brandCount = showroomBrands.length;
    return (<>
      {/* 1. Rolex-banner øverst på forsiden (Rolex' krav til officielle forhandlere) */}
      <section className="ed-bleed ed-bleed--first" aria-label="Rolex"><RolexBanner s={rolexAssets.slides[0]} eager/></section>

      {/* 2. Hero: mærkernes officielle kampagnebilleder i fuld bredde */}
      <h1 className="sr-only">Knud Pedersen, ure og smykker på Skt. Clemens Torv i Aarhus siden 1887</h1>
      <CampaignHero slides={campaigns}/>

      {/* 3. Velkomst (Knud Pedersens egen tekst) */}
      <section className="ed-intro ed-welcome">
        <div className="container">
                    <img className="ed-welcome__vignet" src={VIGNET} alt="" width={56} height={64}/>
          <h2 className="ed-statement"><Words text="Velkommen til vores eksklusive ur- og smykkeforretning i hjertet af Aarhus"/></h2>
          <div className="ed-welcome__text">
            <p>Vi er stolte over at kunne præsentere en række af de mest anerkendte urmærker i verden. Vi vejleder med stor passion vores kunder i et kvalitativt og vigtigt valg af ur. Vores urkollektioner er nøje udvalgt til forretningen, så du kan få opfyldt dine drømme og ønsker.</p>
            <p>I butikken finder du et stort og eksklusivt udvalg af smykker i ædle metaller og med certificerede diamanter. Vi kan vejlede og guide dig i køb og investering af nye eksklusive smykker, hvor du også kan være med til at sætte dit eget personlige præg på smykket. Vi tilbyder også service og reparation af egne smykker og omtrækning af perlekæder.</p>
            <p className="ed-welcome__sign">Velkommen til Knud Pedersen.</p>
          </div>
          <ul className="ed-facts ed-facts--gold">
            <li><small>Siden</small><strong><CountUp from={1800} to={1887}/></strong><span>{new Date().getFullYear() - 1887} år på Skt. Clemens Torv i Aarhus</span></li>
            <li><small>Udvalgte</small><strong><CountUp to={brandCount} ms={1200}/></strong><span>Mærker med fabriksgaranti</span></li>
            <li><small>Officiel</small><strong>Rolex</strong><span>Forhandler og autoriseret servicecenter</span></li>
          </ul>
        </div>
      </section>

      {/* 3a. Rolex point of sale-banner: Rolex-uret og Rolex-afdelingen i butikken (uden animation) */}
      <section className="rx-pos" aria-label="Rolex hos Knud Pedersen">
        <Link href="/rolex/knud-pedersen" className="rx-pos__in">
          <span className="rx-pos__panel">
            <iframe className="rx-pos__clock" title="Rolex-ur" src={rolexClockSrc()} scrolling="no" tabIndex={-1}/>
            <span className="rx-pos__txt"><small>Officiel Rolex-forhandler</small><strong>Rolex hos Knud Pedersen</strong><em>Opdag mere</em></span>
          </span>
                    <img className="rx-pos__photo" src={POS_IMG} alt="Rolex-afdelingen hos Knud Pedersen på Skt. Clemens Torv" loading="eager" fetchPriority="high" decoding="async"/>
        </Link>
      </section>

      {/* 4b. Ét ur i fokus */}
      {focus && <FeatureWatch model={focus} kicker="I fokus" text="Saksisk urmageri fra Glashütte. Kom forbi og se det asymmetriske Pano-design og det håndoptrukne urværk på nært hold."/>}

      {/* 5. Fra butikken og værkstedet: tre fotos i samme format */}
      <section className="hp-section hp-stories" aria-labelledby="historier">
        <div className="container">
          <div className="hp-head"><span className="label">Butikken</span><h2 id="historier">Fra butikken og værkstedet</h2></div>
          <ul className="story-cards">
            {stories.map((st) => (<li key={st.title}>
                <Link href={st.href} className="story-card">
                                    <span className="story-card__media"><img src={st.img} alt={st.alt} loading="eager"/></span>
                  <h3>{st.title}</h3>
                  <p>{st.text}</p>
                  <span className="link-arrow">{st.cta}</span>
                </Link>
              </li>))}
          </ul>
        </div>
      </section>

      {/* 6. Mærker: interaktivt 3D-showroom med vitriner (falder tilbage til en liste) */}
      <BrandShowroom plaque={rolexAssets.plaque}/>

      {/* 7. Rolex-banner #2 og point of sale-banner */}
      <section className="ed-bleed" aria-label="Rolex hos Knud Pedersen">
        <RolexBanner s={rolexAssets.slides[2]}/>
      </section>
      {/* [Rolex point of sale-banner: foto af Rolex-afdelingen hos Knud Pedersen, leveres og godkendes af Rolex] */}

      {/* 8. Smykker: de fire smykkemærker i deres egne kampagnebilleder */}
      <section className="hp-section hp-jw" aria-labelledby="smykker-h">
        <div className="container">
          <div className="hp-jw__head">
            <span className="label">Smykker</span>
            <h2 id="smykker-h">Smykker i ædle metaller</h2>
            <p>Ringe, øreringe, halskæder og armbånd med certificerede diamanter fra fire af de fineste smykkehuse.</p>
          </div>
          <ul className="hp-jw__tiles">
            {jewelTiles.map((t) => (<li key={t.href}>
                <Link href={t.href} className="hp-jw__tile">
                                    <span className="hp-jw__img" style={"zoom" in t ? { ["--z"]: t.zoom } : undefined}><img src={t.img} alt={t.alt} loading="eager" decoding="async"/></span>
                  <span className="hp-jw__name">{t.name}</span>
                  <span className="hp-jw__line">{t.line}</span>
                </Link>
              </li>))}
          </ul>
          <nav className="hp-jw__types" aria-label="Smykketyper">
            {jewelLinks.map((l) => <Link key={l.label} href={l.href}>{l.label}</Link>)}
          </nav>
          <div className="hp-jw__cta"><Link className="btn" href="/smykker">Se alle smykker</Link></div>
        </div>
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
            <p className="muted">Butikken ligger ved Domkirken midt i Aarhus. Der er parkeringshuse i gåafstand.</p>
            <div className="btn-row"><Link className="btn" href="/kontakt">Kontakt og rutevejledning</Link></div>
          </div>
        </div>
      </section>

      {/* 13. Nyhedsbrev: ligger i footeren lige under */}
    </>);
}
