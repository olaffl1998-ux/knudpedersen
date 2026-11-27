import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Seo";
import NewsList from "@/components/NewsList";

export const metadata: Metadata = {
  title: "Nyheder og arrangementer",
  description: "Smykkeaftener, nye kollektioner og urmagerdage hos Knud Pedersen på Skt. Clemens Torv i Aarhus.",
  alternates: { canonical: "/nyheder" },
};

export default function Nyheder() {
  return (
    <>
      <div className="container"><Breadcrumbs items={[{ name: "Nyheder og arrangementer", href: "/nyheder" }]} /></div>
      <section className="container page-head"><span className="label">I butikken</span><h1>Nyheder og arrangementer</h1><p className="lead">Smykkeaftener, nye kollektioner og dage med urmageren. Her kan du se, hvad der sker på Skt. Clemens Torv.</p></section>
      <section className="container" style={{ paddingBottom: 120 }}>
        <NewsList />
        <p className="muted" style={{ marginTop: 56 }}>Nyt fra Rolex finder du under <Link href="/rolex/discover">Rolex</Link>.</p>
      </section>
    </>
  );
}
