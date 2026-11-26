import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Seo";
import { WishlistClient } from "@/components/ProductList";
import { productIndex } from "@/lib/productIndex";

export const metadata: Metadata = { title: "Ønskeliste", alternates: { canonical: "/oenskeliste" }, robots: { index: false, follow: true } };

export default function Oenskeliste() {
  return (
    <>
      <div className="container"><Breadcrumbs items={[{ name: "Ønskeliste", href: "/oenskeliste" }]} /></div>
      <section className="container page-head"><span className="label">Ønskeliste</span><h1>Dine gemte favoritter</h1><p className="lead">Gem ure og smykker, du vil se nærmere på, og book en tid, så har vi dem klar til dig i butikken.</p></section>
      <section className="container" style={{ paddingBottom: 120 }}><WishlistClient items={productIndex()} /></section>
    </>
  );
}
