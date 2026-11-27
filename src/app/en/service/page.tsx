import type { Metadata } from "next";
import Link from "next/link";
import { enAlternates } from "@/data/en";
import VisitBlock from "@/components/en/VisitBlock";

export const metadata: Metadata = {
  title: "Watch and jewellery service in Aarhus – authorised Rolex service centre",
  description: "Service and repair of watches and jewellery in our own workshop in Aarhus. Authorised Rolex service centre with Rolex-trained watchmakers.",
  alternates: enAlternates("/en/service"),
};

const items = [
  ["Full service", "A complete overhaul of movement, case and bracelet to the manufacturer's standards."],
  ["Rolex service", "Authorised Rolex service centre with Rolex-trained watchmakers."],
  ["Battery and strap", "Battery change, water resistance test and a new strap or bracelet, often while you wait."],
  ["Jewellery service", "Cleaning, resizing and repair of jewellery by our goldsmiths."],
  ["Pearl necklaces", "Restringing of pearl necklaces in our own workshop."],
  ["Estimate", "Bring your watch or jewellery to the store and we will give you an estimate before any work begins."],
];

export default function ServiceEn() {
  return (
    <>
      <section className="container page-head jw-head">
        <span className="label">Service</span>
        <h1>Service and repair</h1>
        <p className="lead">Our trained watchmakers and goldsmiths service and repair watches and jewellery in our own workshop on Skt. Clemens Torv.</p>
      </section>
      <section className="container section" aria-label="Our services">
        <ul className="services services--3">{items.map(([h, t]) => <li key={h}><h3>{h}</h3><p>{t}</p></li>)}</ul>
        <p className="en-note">Read about Rolex servicing on <Link href="/rolex/servicing" hrefLang="da">our Rolex pages</Link> (in Danish).</p>
      </section>
      <VisitBlock />
    </>
  );
}
