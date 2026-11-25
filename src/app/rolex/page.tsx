import type { Metadata } from "next";
import Link from "next/link";
import { RETAILER } from "@/data/rolex";

export const metadata: Metadata = {
  title: { absolute: `Officiel Rolex-forhandler i ${RETAILER.city} | ${RETAILER.name}` },
  description: `${RETAILER.name} i ${RETAILER.city} er stolt af at være en del af netværket af officielle Rolex-forhandlere, der kan sælge og vedligeholde Rolex-ure.`,
  alternates: { canonical: "/rolex" },
};

const slides = [
  { label: "Urbanner", href: "/rolex/ure", text: "Linker til en kollektionsside" },
  { label: "Event- og partnerskabsbanner", href: "/rolex/oyster-story", text: "Linker til en artikel" },
  { label: "Urmageri-banner", href: "/rolex/urmageri", text: "Linker til urmageri" },
];

export default function DiscoverRolex() {
  return (
    <div className="stack-lg section">
      <div className="cards" aria-label="Rolex-forsidekarrusel (3 slides fra Rolex)">
        {slides.map((s) => (
          <Link key={s.label} href={s.href} className="ph" style={{ textDecoration: "none" }}>{s.label}<br />{s.text}</Link>
        ))}
      </div>
      <div className="stack measure">
        <h1>Velkommen til {RETAILER.name}, officiel Rolex-forhandler i {RETAILER.city}</h1>
        <p>{RETAILER.name} er stolt af at være en del af det verdensomspændende netværk af officielle Rolex-forhandlere med tilladelse til at sælge og vedligeholde Rolex-ure.</p>
      </div>
      <div className="collection-group">
        <Link href="/rolex/ure"><div className="ph">Billede fra Rolex</div><strong>Rolex-ure</strong><span>Find dit Rolex-ur</span></Link>
        <Link href="/rolex/kontakt"><div className="ph">Billede fra Rolex</div><strong>Kontakt os</strong><span>Send en besked eller book en tid</span></Link>
        <Link href="/rolex/accessories"><div className="ph">Billede fra Rolex</div><strong>Rolex-accessories</strong><span>Udforsk Rolex-accessories</span></Link>
      </div>
      <div className="collection-group">
        <Link href="/rolex/oyster-story"><strong>Oyster Story</strong><span>Et revolutionerende ur</span></Link>
        <Link href="/rolex/urmageri"><strong>Urmageri</strong><span>Skabelsen af den højeste standard</span></Link>
        <Link href="/rolex/servicing"><strong>Serviceeftersyn</strong><span>Vores filosofi for serviceeftersyn</span></Link>
      </div>
    </div>
  );
}
