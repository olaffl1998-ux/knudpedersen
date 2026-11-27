import Link from "@/lib/next/link";
import { Breadcrumbs } from "@/components/Seo";
import { PrintButton, RingCalculator, diaOf, ukOf, usOf } from "@/components/RingSize";
export const metadata = {
    title: "Find din ringstørrelse – guide og ringmåler til print",
    description: "Find din ringstørrelse hjemme: print vores ringmåler, mål en ring du har, eller mål fingeren. Tabel med danske, amerikanske og britiske størrelser.",
    alternates: { canonical: "/ringstoerrelse" },
};
const SIZES = Array.from({ length: 23 }, (_, i) => 44 + i); // 44–66
const PRINT = [46, 48, 50, 52, 54, 56, 58, 60, 62, 64];
export default function Ringstoerrelse() {
    return (<>
      <div className="container"><Breadcrumbs items={[{ name: "Smykker", href: "/smykker" }, { name: "Ringstørrelse", href: "/ringstoerrelse" }]}/></div>
      <section className="container page-head ring-head">
        <span className="label">Guide</span>
        <h1>Find din ringstørrelse</h1>
        <p className="lead">Den danske ringstørrelse er ringens indvendige omkreds i millimeter. Størrelse 54 er altså 54 mm rundt. Her er tre måder at finde den på.</p>
      </section>

      <section className="container ring-steps">
        <article>
          <span className="ring-steps__n">1</span>
          <h2>Mål en ring, du har</h2>
          <p>Læg en ring, der passer, på en lineal og mål den indvendige diameter fra kant til kant. Skriv målet i beregneren.</p>
        </article>
        <article>
          <span className="ring-steps__n">2</span>
          <h2>Mål fingeren</h2>
          <p>Vikl en smal papirstrimmel om fingeren ved roden. Sæt et mærke, hvor papiret mødes, og mål længden i millimeter.</p>
        </article>
        <article>
          <span className="ring-steps__n">3</span>
          <h2>Print ringmåleren</h2>
          <p>Print siden i 100 % (ikke &quot;tilpas til side&quot;). Læg en ring oven på cirklerne og find den, der passer til ringens inderkant.</p>
        </article>
      </section>

      <section className="container ring-grid">
        <div>
          <h2 className="label">Beregner</h2>
          <RingCalculator />
          <div className="ring-tips">
            <h3>Gode råd</h3>
            <ul>
              <li>Mål sidst på dagen, når fingrene er varme. Om morgenen og i kulde er de mindre.</li>
              <li>Ligger du mellem to størrelser, så vælg den største.</li>
              <li>Brede ringe (over 6 mm) skal ofte være en halv til en hel størrelse større.</li>
              <li>Skal ringen være en overraskelse? Lån en af din kærestes ringe i en dag, eller tag den med i butikken. Vi måler den på et øjeblik.</li>
            </ul>
          </div>
        </div>
        <div>
          <h2 className="label">Størrelsestabel</h2>
          <div className="ring-table-wrap">
            <table className="ring-table">
              <thead><tr><th scope="col">Dansk / EU</th><th scope="col">Diameter</th><th scope="col">US</th><th scope="col">UK</th></tr></thead>
              <tbody>{SIZES.map((s) => <tr key={s}><th scope="row">{s}</th><td>{diaOf(s)} mm</td><td>{usOf(s)}</td><td>{ukOf(s)}</td></tr>)}</tbody>
            </table>
          </div>
          <p className="muted" style={{ fontSize: 13 }}>US og UK er omtrentlige omregninger.</p>
        </div>
      </section>

      <section className="container ring-print" aria-labelledby="ring-print-h">
        <div className="ring-print__head">
          <div><h2 id="ring-print-h">Ringmåler til print</h2><p className="muted">Tjek først, at stregen herunder måler præcis 5 cm, når den er printet.</p></div>
          <PrintButton />
        </div>
        <svg className="ring-print__svg" viewBox="0 0 180 95" width="180mm" height="95mm" role="img" aria-label="Cirkler i ægte størrelse for ringstørrelse 46 til 64">
          <line x1="10" y1="8" x2="60" y2="8" stroke="#2a1a10" strokeWidth="0.4"/>
          <line x1="10" y1="6" x2="10" y2="10" stroke="#2a1a10" strokeWidth="0.4"/>
          <line x1="60" y1="6" x2="60" y2="10" stroke="#2a1a10" strokeWidth="0.4"/>
          <text x="62" y="9.3" fontSize="3.2" fill="#2a1a10">5 cm</text>
          {PRINT.map((s, i) => {
            const r = s / Math.PI / 2;
            const cx = 18 + (i % 5) * 36, cy = 36 + Math.floor(i / 5) * 40;
            return (<g key={s}>
                <circle cx={cx} cy={cy} r={r} fill="none" stroke="#2a1a10" strokeWidth="0.25"/>
                <line x1={cx - 1.5} y1={cy} x2={cx + 1.5} y2={cy} stroke="#a98024" strokeWidth="0.2"/>
                <line x1={cx} y1={cy - 1.5} x2={cx} y2={cy + 1.5} stroke="#a98024" strokeWidth="0.2"/>
                <text x={cx} y={cy + r + 6} fontSize="3.4" textAnchor="middle" fill="#2a1a10">Str. {s}</text>
              </g>);
        })}
        </svg>
      </section>

      <section className="container center" style={{ padding: "40px 0 120px" }}>
        <p className="lead">Er du i tvivl? Kom forbi på Skt. Clemens Torv, så måler vi fingeren gratis med vores ringmål.</p>
        <p className="btn-row" style={{ justifyContent: "center" }}><Link className="btn" href="/vielsesringe">Se vielsesringe</Link><Link className="btn btn--outline" href="/book-tid">Book tid</Link></p>
      </section>
    </>);
}
