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

/** Historiske fotos fra Knud Pedersens nuværende hjemmeside */
const HISTORY_PHOTOS: Record<string, string> = {
  "1949": "/billeder/historie/1949.jpg",
  "1958": "/billeder/historie/1958.jpg",
  "1967": "/billeder/historie/1967.jpg",
  "2017": "/billeder/historie/2017.jpg",
  "2019": "/billeder/historie/2019.jpg",
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
          <ol className="timeline timeline--text">
            {ch.map((c) => (
              <li key={c.title + c.year}>
                <span className="year">{c.year}</span>
                <div><h3>{c.title}</h3><p>{c.text}</p></div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                {HISTORY_PHOTOS[c.year] ? <img className="timeline__photo" src={HISTORY_PHOTOS[c.year]} alt={`Knud Pedersen, ${c.title} ${c.year}`} loading="lazy" /> : <span />}
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section section--sand" id="hold">
        <div className="container">
          <div className="section-head"><div><span className="label">Holdet</span><h2>Mød os</h2><p className="muted">Salgsrådgivere, urmagere og guldsmede under samme tag. Kom forbi butikken og sig hej.</p></div></div>
          <ul className="services services--3">
            {[["Salgsrådgiver", "Rådgivning om ure og smykker, i ro og mag og uden forpligtelser."], ["Urmager", "Service og reparation af ure i vores eget værksted."], ["Guldsmed", "Rensning, tilpasning og reparation af smykker."]].map(([r, t]) => <li key={r}><span className="label">{r}</span><h3>{r === "Salgsrådgiver" ? "I butikken" : "I værkstedet"}</h3><p>{t}</p></li>)}
          </ul>
        </div>
      </section>

      <section className="section" id="vaerksted">
        <div className="container split">
          <div className="split__media">{/* [Foto fra værkstedet] */}<div className="type-panel" aria-hidden="true"><small>Værkstedet</small><span>Urmagere og guldsmede under samme tag</span></div></div>
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
          <p>Uopfordrede ansøgninger er velkomne på <a href={`mailto:${business.email}`}>{business.email}</a>.</p>
        </div>
      </section>
    </>
  );
}
