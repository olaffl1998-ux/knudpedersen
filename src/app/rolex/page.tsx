import type { Metadata } from "next";
import Link from "next/link";
import { RETAILER, rolexAssets } from "@/data/rolex";

export const metadata: Metadata = {
  title: { absolute: `Officiel Rolex-forhandler i ${RETAILER.city} | ${RETAILER.name}` },
  description: `${RETAILER.name} i ${RETAILER.city} er stolt af at være en del af netværket af officielle Rolex-forhandlere, der kan sælge og vedligeholde Rolex-ure.`,
  alternates: { canonical: "/rolex" },
};

/* eslint-disable @next/next/no-img-element */
export default function DiscoverRolex() {
  return (
    <div className="stack-lg section">
      <div className="rolex-carousel" aria-label="Udvalgt fra Rolex" tabIndex={0}>
        {rolexAssets.slides.map((s, i) => (
          <Link key={s.href} href={s.href} className="rolex-hero">
            <picture>
              <source media="(max-width: 700px)" srcSet={s.mobile} />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={s.desktop} alt={s.alt} loading={i === 0 ? "eager" : "lazy"} />
            </picture>
            <span className="cap"><small>{s.eyebrow}</small><strong>{s.title}</strong><span>Opdag</span></span>
          </Link>
        ))}
      </div>
      <div className="stack measure">
        <h1>Velkommen til {RETAILER.name}, officiel Rolex-forhandler i {RETAILER.city}</h1>
        <p>{RETAILER.name} er stolt af at være en del af det verdensomspændende netværk af officielle Rolex-forhandlere med tilladelse til at sælge og vedligeholde Rolex-ure.</p>
      </div>
      <div className="collection-group">
        <Link href="/rolex/ure"><img src={rolexAssets.tiles.watches} alt="" loading="lazy" /><strong>Rolex-ure</strong><span>Find dit Rolex-ur</span></Link>
        <Link href="/rolex/kontakt"><img src={rolexAssets.tiles.contact} alt="" loading="lazy" /><strong>Kontakt os</strong><span>Send en besked eller book en tid</span></Link>
        <Link href="/rolex/accessories"><img src={rolexAssets.tiles.accessories} alt="" loading="lazy" /><strong>Rolex-accessories</strong><span>Udforsk Rolex-accessories</span></Link>
      </div>
      <div className="collection-group">
        <Link href="/rolex/oyster-story"><img src={rolexAssets.tiles.oysterStory} alt="" loading="lazy" /><strong>Oyster Story</strong><span>Et revolutionerende ur</span></Link>
        <Link href="/rolex/urmageri"><img src={rolexAssets.tiles.watchmaking} alt="" loading="lazy" /><strong>Urmageri</strong><span>Skabelsen af den højeste standard</span></Link>
        <Link href="/rolex/servicing"><img src={rolexAssets.tiles.servicing} alt="" loading="lazy" /><strong>Serviceeftersyn</strong><span>Vores filosofi for serviceeftersyn</span></Link>
      </div>
    </div>
  );
}
