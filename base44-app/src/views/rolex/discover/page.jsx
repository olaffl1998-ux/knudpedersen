import Link from "@/lib/next/link";
import { RolexCarousel } from "@/components/rolex/client";
import { KeepExploring, RImg } from "@/components/rolex/parts";
import { RETAILER, availabilityText, rolexAssets, rolexPageBlocks } from "@/data/rolex";
import { business } from "@/lib/site";
export const metadata = {
    title: { absolute: `Officiel Rolex-forhandler i ${RETAILER.city} | ${RETAILER.name}` },
    description: `${RETAILER.name} er officiel Rolex-forhandler i ${RETAILER.city} med tilladelse til at sælge og vedligeholde Rolex-ure. Se Rolex-kollektionerne og kontakt os.`,
    alternates: { canonical: "/rolex/discover" },
};
/** Fliserne fra den nuværende Udforsk Rolex-side (Rolex-ure, accessories, kontakt) */
function tiles(blocks) {
    const out = [];
    for (let i = 0; i < blocks.length; i++) {
        const b = blocks[i];
        if (b.type === "h3" && blocks[i + 1]?.type === "image") {
            const im = blocks[i + 1];
            const ps = blocks.slice(i + 2, i + 5).filter((x) => x.type === "p");
            out.push({ title: b.text, eyebrow: ps[0]?.text || "", text: ps[1]?.text || "", href: im.href || "/rolex/watches", img: { l: im.landscape, p: im.portrait }, alt: im.alt?.trim() || b.text });
        }
    }
    return out;
}
export default function DiscoverRolex() {
    const blocks = rolexPageBlocks.discover;
    const t = tiles(blocks);
    const explore = blocks.filter((b) => b.type === "img");
    const exploreText = ["Historien om Oyster", "Skabelsen af den højeste standard", "Vores filosofi for serviceeftersyn"];
    const exploreHref = ["/rolex/world-of-rolex", "/rolex/watchmaking", "/rolex/servicing"];
    const exploreImgs = explore.filter((e) => e.href).slice(0, 3);
    return (<>
      <RolexCarousel slides={rolexAssets.slides}/>
      <section className="rx-intro">
        <h1>Officiel Rolex-forhandler i {RETAILER.city}. Velkommen til {RETAILER.name}</h1>
        <p>{availabilityText[2]}</p>
        <p className="rx-links">
          <a href={`tel:${business.phoneE164}`}>Ring {business.phone}</a>
          <Link href="/rolex/contact-aarhus#besked">Send en besked</Link>
          <Link href="/rolex/contact-aarhus#book">Book en tid</Link>
          <Link href="/rolex/contact-aarhus">Find os</Link>
        </p>
      </section>
      <section className="rx-tiles" aria-label="Rolex hos Knud Pedersen">
        {t.map((x) => (<Link key={x.title} href={x.href} className="rx-tile">
            <RImg img={x.img} alt={x.alt}/>
            <span className="rx-eyebrow">{x.eyebrow}</span>
            <strong>{x.text || x.title}</strong>
          </Link>))}
      </section>
      <section className="rx-explore">
        <h2>Udforsk Rolex</h2>
        <div className="rx-tiles">
          {exploreImgs.map((e, i) => (<Link key={e.src} href={exploreHref[i]} className="rx-tile">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={e.src} alt={e.alt || exploreText[i]} loading="lazy"/>
              <span className="rx-eyebrow">Udforsk</span>
              <strong>{exploreText[i]}</strong>
            </Link>))}
        </div>
      </section>
      <KeepExploring current="/rolex/discover"/>
    </>);
}
