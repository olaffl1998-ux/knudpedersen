import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Seo";
import { rolexPageBlocks, type Block } from "@/data/rolex";
import { business } from "@/lib/site";

export const metadata: Metadata = {
  title: "Om Knud Pedersen – ur- og smykkeforretning i Aarhus",
  description: "Knud Pedersens historie fra 1949 til i dag, vores værksted og ledige stillinger. Ur- og smykkeforretning på Skt. Clemens Torv i Aarhus.",
  alternates: { canonical: "/om-os" },
};

/** Historien er Knud Pedersens egen tekst fra den nuværende hjemmeside */
function chapters() {
  const b = rolexPageBlocks.history.filter((x) => x.type !== "h1") as Block[];
  const out: { year: string; title: string; text: string; img?: string }[] = [];
  let img: string | undefined;
  for (let i = 0; i < b.length; i++) {
    const x = b[i];
    if (x.type === "img") img = x.src;
    if (x.type === "h4") {
      const p = b[i + 1] as { text?: string };
      const m = x.text.match(/^(.*?)\s*(\d{4})$/);
      const name = (m ? m[1] : x.text).toLowerCase().replace(/(^|\s)\S/g, (c) => c.toUpperCase());
      out.push({ year: m ? m[2] : "", title: name, text: p?.text || "", img });
      img = undefined;
    }
  }
  return out;
}

export default function OmOs() {
  const all = chapters();
  const intro = all.find((c) => !c.year);
  const ch = all.filter((c) => c.year);
  return (
    <>
      <div className="container"><Breadcrumbs items={[{ name: "Om os", href: "/om-os" }]} /></div>
      <section className="container page-head">
        <span className="label">Om Knud Pedersen</span>
        <h1>Ure og smykker på Skt. Clemens Torv</h1>
        <p className="lead">Knud Pedersen er en ur- og smykkeforretning i Aarhus midtby med eget værksted, officiel Rolex- og Tudor-forhandler og autoriseret Rolex-servicecenter.</p>
      </section>

      <section className="section" aria-labelledby="historie">
        <div className="container">
          <div className="section-head"><div><span className="label">Historie</span><h2 id="historie">Vores historie</h2>{intro && <p className="lead">{intro.text}</p>}</div></div>
          <ol className="timeline">
            {ch.map((c) => (
              <li key={c.title + c.year}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                {c.img ? <img src={c.img} alt={`Knud Pedersen, ${c.title} ${c.year}`} loading="lazy" /> : <div className="ph" role="img" aria-label="Pladsholder">[Billede: {c.title} {c.year}]</div>}
                <div><span className="year">{c.year}</span><h3>{c.title}</h3><p>{c.text}</p></div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section section--sand" id="hold">
        <div className="container">
          <div className="section-head"><div><span className="label">Holdet</span><h2>Mød os</h2><p className="muted">[Fotos, navne og roller for salgsrådgivere, urmagere og guldsmede leveres af Knud Pedersen]</p></div></div>
          <ul className="services services--3">
            {["Salgsrådgiver", "Urmager", "Guldsmed"].map((r) => <li key={r}><div className="ph" role="img" aria-label="Pladsholder">[Portræt]</div><span className="label">{r}</span><h3>[Navn]</h3></li>)}
          </ul>
        </div>
      </section>

      <section className="section" id="vaerksted">
        <div className="container split">
          <div className="split__media"><div className="ph" role="img" aria-label="Pladsholder">[Foto fra værkstedet]</div></div>
          <div className="split__text">
            <span className="label">Værkstedet</span>
            <h2>Eget værksted</h2>
            <p>Vores faguddannede urmagere og guldsmede servicerer og reparerer ure og smykker i huset.</p>
            <p><Link className="link-arrow" href="/service">Service og reparation</Link></p>
          </div>
        </div>
      </section>

      <section className="section section--white" id="job">
        <div className="container container--narrow center">
          <span className="label">Job</span>
          <h2>Arbejd hos os</h2>
          <p>[Ledige stillinger vises her.] Uopfordrede ansøgninger er velkomne på <a href={`mailto:${business.email}`}>{business.email}</a>.</p>
        </div>
      </section>
    </>
  );
}
