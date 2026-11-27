import Link from "@/lib/next/link";
import CampaignHero from "@/components/CampaignHero";
import { rolexAssets } from "@/data/rolexAssets";
import { enAlternates, enJewellery, enWatchBrands } from "@/data/en";
import VisitBlock from "@/components/en/VisitBlock";
import { showroomBrands } from "@/data/brands";
export const metadata = {
    title: { absolute: "Knud Pedersen – Watches and jewellery in Aarhus | Official Rolex Retailer" },
    description: "Watch and jewellery store on Skt. Clemens Torv in Aarhus, Denmark, since 1887. Official Rolex Retailer and authorised dealer of Tudor, Omega, Breitling, Chopard, Georg Jensen and more.",
    alternates: enAlternates("/en"),
    openGraph: { locale: "en_GB" },
};
const T = "/billeder/pics/_thumbs/";
const campaigns = [
    { brand: "Grand Seiko", title: "Snowflake, inspired by nature", href: "/maerker/grand-seiko", desktop: `${T}GS_Snowflake_logo_Desktop_2400x1100.w2400.h880.jpg`, mobile: `${T}GS_Snowflake_logo_Mobile_640x640-1.w640.h640.jpg` },
    { brand: "Marselis Jewellery", title: "Diamonds in 18 carat gold", href: "/smykker/marselis", desktop: `${T}0641-0554-4-Marselis--banner_desktop.w2400.h880.jpg`, mobile: `${T}0641-0554-4-Marselis--banner_mobile.w640.h640.jpg` },
    { brand: "TAG Heuer", title: "Designed to win", href: "/maerker/tag-heuer", desktop: `${T}2400x1100px_TAGH-DTW26-HolidaySeason_NESE_KnudPedersen.w2400.h880.jpg`, mobile: `${T}640x640px_TAGH-DTW26-HolidaySeason_NESE_KnudPedersen.w640.h640.jpg` },
    { brand: "Georg Jensen", title: "Jewellery of the season", href: "/smykker/georg-jensen", desktop: `${T}GJ_AW26_JW_Seasonal-_WS-eCom-banner_2400x1100px-1.w2400.h880.jpg`, mobile: `${T}GJ_AW26_JW_Seasonal-_WS-eCom-banner_640x640px.w640.h640.jpg` },
    { brand: "Gucci", title: "Interlocking G", href: "/maerker/gucci", desktop: `${T}Gucci_GUCCI_INTERLOCKING_BANGLE_2400x1100.w2400.h880.jpg`, mobile: `${T}Gucci_GUCCI_INTERLOCKING_BANGLE_640x640.w640.h640.jpg` },
];
export default function HomeEn() {
    const s = rolexAssets.slides[0];
    const brandCount = showroomBrands.length;
    return (<>
      <h1 className="sr-only">Knud Pedersen, watches and jewellery on Skt. Clemens Torv in Aarhus since 1887</h1>
      {/* Rolex først, som på den danske forside. Rolex' billede vises uændret */}
      <section className="ed-bleed ed-bleed--first" aria-label="Rolex">
        <Link href={s.href} className="rolex-banner">
          <picture>
            <source media="(max-width: 767px)" srcSet={s.mobile}/>
                        <img src={s.desktop} alt={s.alt} loading="eager" fetchPriority="high"/>
          </picture>
          <span className="rolex-banner__cap"><small>Rolex</small><strong>Official Rolex Retailer</strong><em>Discover</em></span>
        </Link>
      </section>

      <CampaignHero slides={campaigns}/>

      <section className="ed-intro ed-welcome">
        <div className="container">
          <h2 className="ed-statement">Welcome to our exclusive watch and jewellery store in the heart of Aarhus</h2>
          <div className="ed-welcome__text">
            <p>We are proud to present some of the most renowned watch brands in the world. With great passion we guide our customers through an important choice, and every collection in the store has been carefully selected so you can fulfil your dreams and wishes.</p>
            <p>In the store you will also find a large and exclusive selection of jewellery in precious metals and with certified diamonds. We offer service and repair of your own watches and jewellery, and we restring pearl necklaces.</p>
            <p className="ed-welcome__sign">Welcome to Knud Pedersen.</p>
          </div>
          <ul className="ed-facts ed-facts--gold">
            <li><small>Since</small><strong>1887</strong><span>In the heart of Aarhus</span></li>
            <li><small>Selected</small><strong>{brandCount}</strong><span>Brands with manufacturer&apos;s warranty</span></li>
            <li><small>Official</small><strong>Rolex</strong><span>Retailer and authorised service centre</span></li>
          </ul>
        </div>
      </section>

      <section className="hp-section" aria-labelledby="en-watches">
        <div className="container">
          <div className="hp-jw__head"><span className="label">Watches</span><h2 id="en-watches">Our watch brands</h2><p>Authorised dealer of the finest Swiss, German and Japanese watchmakers.</p></div>
          <ul className="en-brands">
            <li><Link href="/rolex/discover"><strong>Rolex</strong><span>Official Rolex Retailer</span></Link></li>
            {enWatchBrands.map((b) => <li key={b.slug}><Link href={`/maerker/${b.slug}`}><strong>{b.name}</strong><span>{b.text}</span></Link></li>)}
          </ul>
          <div className="hp-jw__cta"><Link className="btn" href="/en/watches">All watch brands</Link></div>
        </div>
      </section>

      <section className="hp-section hp-jw" aria-labelledby="en-jewel">
        <div className="container">
          <div className="hp-jw__head"><span className="label">Jewellery</span><h2 id="en-jewel">Jewellery in precious metals</h2><p>Rings, earrings, necklaces and bracelets with certified diamonds from four of the finest jewellery houses.</p></div>
          <ul className="hp-jw__tiles">
            {enJewellery.map((t) => (<li key={t.href}><Link href={t.href} className="hp-jw__tile">
                                <span className="hp-jw__img"><img src={t.img} alt={`${t.name}: ${t.line}`} loading="eager"/></span>
                <span className="hp-jw__name">{t.name}</span><span className="hp-jw__line">{t.line}</span>
              </Link></li>))}
          </ul>
          <div className="hp-jw__cta"><Link className="btn" href="/en/jewellery">Explore jewellery</Link></div>
        </div>
      </section>

      <section className="section section--dark">
        <div className="container">
          <div className="section-head"><div><span className="label">The workshop</span><h2>Service that lasts for generations</h2></div><Link className="btn btn--outline-light" href="/en/service">Service and repair</Link></div>
          <ul className="services">
            <li><h3>Full service</h3><p>Complete overhaul of movement, case and bracelet to the manufacturer&apos;s standards.</p></li>
            <li><h3>Rolex service</h3><p>Authorised Rolex service centre with Rolex-trained watchmakers.</p></li>
            <li><h3>Battery and strap</h3><p>Battery change, water resistance test and a new strap or bracelet, often while you wait.</p></li>
          </ul>
        </div>
      </section>

      <VisitBlock />
    </>);
}
