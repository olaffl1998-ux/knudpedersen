import Link from "@/lib/next/link";
import { RolexPage } from "@/components/rolex/parts";
import { RETAILER, rolexPageBlocks } from "@/data/rolex";
export const metadata = {
    title: { absolute: `Rolex hos ${RETAILER.name} i ${RETAILER.city}` },
    description: `${RETAILER.name} har været urmager i ${RETAILER.city} siden 1887 og er i dag officiel Rolex-forhandler og autoriseret Rolex-servicecenter på Skt. Clemens Torv.`,
    alternates: { canonical: "/rolex/knud-pedersen" },
};
const TITLES = { "VORES HISTORIE": "Vores historie", "KNUD PEDERSEN 1949": "Knud Pedersen 1949", "VESTERGADE 1958": "Vestergade 1958", "CLEMENS TORV 1967": "Clemens Torv 1967", "NY EJER 2017": "Ny ejer 2017", "CLEMENS TORV 2019": "Clemens Torv 2019" };
/** Forhandlerens egen side i Rolex-sektionen. Tekster godkendes af Rolex Digital Officer før lancering. */
export default function KnudPedersenRolex() {
    const b = rolexPageBlocks.history.filter((x) => x.type !== "h1");
    // Saml historien i kapitler: billede + overskrift + tekst
    const chapters = [];
    let img;
    for (let i = 0; i < b.length; i++) {
        const x = b[i];
        if (x.type === "img")
            img = x.src;
        if (x.type === "h4") {
            const p = b[i + 1];
            chapters.push({ title: TITLES[x.text] || x.text, text: p?.text || "", img });
            img = undefined;
        }
    }
    return (<RolexPage crumbs={[{ name: `Rolex hos ${RETAILER.name}`, href: "/rolex/knud-pedersen" }]} current="/rolex/knud-pedersen">
      <section className="rx-intro">
        <h1>Rolex hos {RETAILER.name}</h1>
        <p>Officiel Rolex-forhandler og autoriseret Rolex-servicecenter på Skt. Clemens Torv i {RETAILER.city}.</p>
      </section>
      <section className="rx-chapters" aria-label="Vores historie">
        {chapters.map((c, i) => (<article key={c.title} className={c.img ? (i % 2 ? "rev" : "") : "noimg"}>
            {c.img ? (
            <img src={c.img} alt={`${RETAILER.name}: ${c.title}`} loading="eager"/>) : null}
            <div><h2>{c.title}</h2><p>{c.text}</p></div>
          </article>))}
      </section>
      {/* Afsnittene "Vores hold", "Vores showroom" og "Vores værksted" kommer tilbage, når vi har billeder og tekster fra Knud Pedersen */}
      <p className="rx-center"><Link className="rx-btn" href="/rolex/contact-aarhus">Kontakt os</Link></p>
    </RolexPage>);
}
