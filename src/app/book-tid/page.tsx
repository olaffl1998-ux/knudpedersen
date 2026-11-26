import type { Metadata } from "next";
import { Suspense } from "react";
import BookingFlow from "@/components/BookingFlow";
import { Breadcrumbs } from "@/components/Seo";
import { nonRolexBrands } from "@/data/catalog";

export const metadata: Metadata = {
  title: "Book tid – personlig rådgivning i butikken",
  description: "Book en tid hos Knud Pedersen på Skt. Clemens Torv i Aarhus: se og prøv ure, smykker og vielsesringe, eller aflever dit ur til service.",
  alternates: { canonical: "/book-tid" },
};

export default function BookTid() {
  return (
    <>
      <div className="container"><Breadcrumbs items={[{ name: "Book tid", href: "/book-tid" }]} /></div>
      <section className="container container--narrow page-head">
        <span className="label">Book tid</span>
        <h1>Book en tid i butikken</h1>
        <p className="lead">Vælg hvad du vil tale om, og find en tid, der passer dig. Vi bekræfter tiden på e-mail. Ønsker du en tid til Rolex, så <a href="/rolex/contact-aarhus#book">book her</a>.</p>
      </section>
      <section className="container container--narrow" style={{ paddingBottom: 120 }}>
        <Suspense><BookingFlow brands={nonRolexBrands.map((b) => ({ slug: b.slug, name: b.name }))} /></Suspense>
      </section>
    </>
  );
}
