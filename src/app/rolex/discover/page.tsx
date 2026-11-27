import type { Metadata } from "next";
import Link from "next/link";
import { RolexCarousel } from "@/components/rolex/client";
import { KeepExploring, RImg } from "@/components/rolex/parts";
import { RETAILER, availabilityText, getCollection, rolexAssets, rolexGroups, rolexPageBlocks, type Block } from "@/data/rolex";
import { business } from "@/lib/site";

export const metadata: Metadata = {
  title: { absolute: `Officiel Rolex-forhandler i ${RETAILER.city} | ${RETAILER.name}` },
  description: `${RETAILER.name} er officiel Rolex-forhandler i ${RETAILER.city} med tilladelse til at sælge og vedligeholde Rolex-ure. Se Rolex-kollektionerne og kontakt os.`,
  alternates: { canonical: "/rolex/discover" },
};

type Tile = { title: string; eyebrow: string; text: string; href: string; img: { l?: string; p?: string }; alt: string };

/** Fliserne fra den nuværende Udforsk Rolex-side (Rolex-ure, accessories, kontakt) */
function tiles(blocks: Block[]): Tile[] {
  const out: Tile[] = [];
  for (let i = 0; i < blocks.length; i++) {
    const b = blocks[i];
    if (b.type === "h3" && blocks[i + 1]?.type === "image") {
      const im = blocks[i + 1] as Extract<Block, { type: "image" }>;
      const ps = blocks.slice(i + 2, i + 5).filter((x) => x.type === "p") as { text: string }[];
      out.push({ title: b.text, eyebrow: ps[0]?.text || "", text: ps[1]?.text || "", href: im.href || "/rolex/watches", img: { l: im.landscape, p: im.portrait }, alt: im.alt?.trim() || b.text });
    }
  }
  return out;
}

export default function DiscoverRolex() {
  const blocks = rolexPageBlocks.discover;
  const t = tiles(blocks);
  const explore = blocks.filter((b) => b.type === "img") as Extract<Block, { type: "img" }>[];
  const exploreText = ["Historien om Oyster", "Skabelsen af den højeste standard", "Vores filosofi for serviceeftersyn"];
  const exploreHref = ["/rolex/world-of-rolex", "/rolex/watchmaking", "/rolex/servicing"];
  const exploreImgs = explore.filter((e) => e.href).slice(0, 3);
  return (
    <>
      <RolexCarousel slides={rolexAssets.slides} />
      <section className="rx-intro rx-intro--split">
        <h1>Velkommen til {RETAILER.name} Officiel Rolex-forhandler i {RETAILER.city}</h1>
        <div>
        <p>{availabilityText[2]}</p>
        <p className="rx-links">
          <a href={`tel:${business.phoneE164}`}>Ring {business.phone}</a>
          <Link href="/rolex/contact-aarhus#besked">Send en besked</Link>
          <Link href="/rolex/contact-aarhus#book">Book en tid</Link>
          <Link href="/rolex/contact-aarhus">Find os</Link>
        </p>
        </div>
      </section>
      <section className="rx-selection" aria-labelledby="rx-sel">
        <h2 id="rx-sel">Vores udvalg af Rolex</h2>
        <ul className="rx-grid rx-grid-4">
          {rolexGroups.flatMap((g) => g.items).slice(0, 8).map((slug) => {
            const c = getCollection(slug)!;
            return (
              <li key={slug}>
                <Link href={`/rolex/${slug}`} className="rx-col-card">
                  <RImg img={c.card} alt={`Rolex ${c.name}`} />
                  <span className="rx-eyebrow">Rolex</span>
                  <strong>{c.name}</strong>
                </Link>
              </li>
            );
          })}
        </ul>
        <p className="rx-center"><Link className="rx-btn" href="/rolex/watches">Udforsk Rolex-kollektionerne</Link></p>
      </section>
      <section className="rx-tiles" aria-label="Rolex hos Knud Pedersen">
        {t.map((x) => (
          <Link key={x.title} href={x.href} className="rx-tile">
            <RImg img={x.img} alt={x.alt} />
            <span className="rx-eyebrow">{x.eyebrow}</span>
            <strong>{x.text || x.title}</strong>
          </Link>
        ))}
      </section>
      <section className="rx-explore">
        <h2>Udforsk Rolex</h2>
        <div className="rx-tiles">
          {exploreImgs.map((e, i) => (
            <Link key={e.src} href={exploreHref[i]} className="rx-tile">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={e.src} alt={e.alt || exploreText[i]} loading="eager" />
              <span className="rx-eyebrow">Udforsk</span>
              <strong>{exploreText[i]}</strong>
            </Link>
          ))}
        </div>
      </section>
      <KeepExploring current="/rolex/discover" />
    </>
  );
}
