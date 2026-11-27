import Link from "@/lib/next/link";
import { enAlternates, enJewellery, enJewelleryTypes } from "@/data/en";
import VisitBlock from "@/components/en/VisitBlock";
export const metadata = {
    title: "Jewellery in Aarhus – Marselis, Georg Jensen, Chopard and Gucci",
    description: "Rings, earrings, necklaces and bracelets in precious metals with certified diamonds at Knud Pedersen in Aarhus.",
    alternates: enAlternates("/en/jewellery"),
};
export default function JewelleryEn() {
    return (<>
      <section className="container page-head jw-head">
        <span className="label">Jewellery</span>
        <h1>Jewellery in precious metals</h1>
        <p className="lead">Rings, bracelets, earrings and necklaces with certified diamonds. Our jewellery is not sold online. Book an appointment and we will have the pieces ready for you.</p>
      </section>
      <section className="container" aria-label="Jewellery houses">
        <ul className="hp-jw__tiles">
          {enJewellery.map((t) => (<li key={t.href}><Link href={t.href} className="hp-jw__tile">
                            <span className="hp-jw__img"><img src={t.img} alt={`${t.name}: ${t.line}`} loading="eager"/></span>
              <span className="hp-jw__name">{t.name}</span><span className="hp-jw__line">{t.line}</span>
              <span className="en-tile-text">{t.text}</span>
            </Link></li>))}
        </ul>
        <nav className="hp-jw__types" aria-label="Jewellery types">{enJewelleryTypes.map((l) => <Link key={l.label} href={l.href}>{l.label}</Link>)}</nav>
        <p className="en-note">The jewellery catalogue is in Danish.</p>
      </section>
      <section className="section">
        <div className="container container--narrow center">
          <span className="label">The workshop</span>
          <h2>Restringing, resizing and repairs</h2>
          <p>Our goldsmiths restring pearl necklaces, resize rings and repair jewellery in our own workshop. Bring your piece to the store.</p>
        </div>
      </section>
      <VisitBlock />
    </>);
}
