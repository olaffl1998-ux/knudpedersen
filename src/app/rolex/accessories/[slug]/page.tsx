import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { RolexPrice } from "@/components/rolex/client";
import { RolexMessage } from "@/components/rolex/RolexForms";
import { RImg, RolexPage } from "@/components/rolex/parts";
import { RETAILER, previewPrice, rolexAccessories } from "@/data/rolex";
import { business } from "@/lib/site";

type P = { params: Promise<{ slug: string }> };
export const dynamicParams = false;
export const generateStaticParams = () => rolexAccessories.map((a) => ({ slug: a.slug }));
const get = (s: string) => rolexAccessories.find((a) => a.slug === s);

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const a = get((await params).slug);
  if (!a) return {};
  return { title: { absolute: `Rolex ${a.name} ${a.material}, ${a.rmc}` }, description: a.featureText || a.title, alternates: { canonical: `/rolex/accessories/${a.slug}` } };
}

export default async function Accessory({ params }: P) {
  const a = get((await params).slug);
  if (!a) notFound();
  return (
    <RolexPage crumbs={[{ name: "Rolex-ure", href: "/rolex/watches" }, { name: "Rolex-accessories", href: "/rolex/accessories" }, { name: a.name, href: `/rolex/accessories/${a.slug}` }]} current="/rolex/accessories">
      <section className="rx-product">
        <div className="rx-packshot">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          {a.packshot && <img src={a.packshot} alt={a.title} />}
        </div>
        <div className="rx-product-info">
          <p className="rx-eyebrow">Rolex</p>
          <h1>{a.name}</h1>
          <p className="rx-case">{a.material}</p>
          <p className="rx-rmc">{a.rmc}</p>
          <RolexPrice rmc={a.rmc} preview={previewPrice(a.price)} />
          <ul className="rx-cta-list">
            <li><a className="rx-btn" href={`tel:${business.phoneE164}`}>Ring {business.phone}</a></li>
            <li><a className="rx-btn rx-btn-ghost" href="#kontakt">Send en besked</a></li>
          </ul>
        </div>
      </section>
      {a.featureImg && (
        <section className="rx-features"><article><RImg img={a.featureImg} alt={a.title} /><div><h2>{a.featureTitle}</h2><p>{a.featureText}</p></div></article></section>
      )}
      <section className="rx-specs"><h2>Specifikationer</h2><dl>{a.specs.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl></section>
      <section id="kontakt" className="rx-form-section"><h2>Kontakt os om {a.name}</h2><RolexMessage subject={`Rolex ${a.name} ${a.rmc}`} /></section>
      <p className="rx-note">{RETAILER.name} · {business.street} · {business.postalCode} {business.city}</p>
    </RolexPage>
  );
}
