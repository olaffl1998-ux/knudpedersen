"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { HeartButton } from "./Wishlist";

export type Variant = {
  key: string; href: string; ref: string; image?: string; price: string; size?: string;
  strap: string; specs: [string, string][];
};

/**
 * Produktvisning med rigtige varianter: samme ur på andre remme/lænker eller med anden urskive.
 * Hver variant er et rigtigt produkt med eget billede, eget referencenummer og egen pris.
 */
export default function WatchDetail({ brand, brandSlug, name, variants, initial, phone, phoneE164, street }: {
  brand: string; brandSlug: string; name: string; variants: Variant[]; initial: number; phone: string; phoneE164: string; street: string;
}) {
  const [sel, setSel] = useState(initial);
  const v = variants[sel];
  const subject = `${brand} ${name} ${v.ref}`;

  // Adressen følger den valgte variant, så den kan deles og bogmærkes
  useEffect(() => {
    if (window.location.pathname !== v.href) window.history.replaceState(null, "", v.href);
  }, [v.href]);

  return (
    <section className="container pdp">
      <div>
        <div className="pdp__media pdp__media--fade">
          {variants.map((x, i) => x.image && (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={x.key} src={x.image} alt={i === sel ? `${brand} ${name}, reference ${x.ref}` : ""} aria-hidden={i !== sel} className={i === sel ? "is-on" : ""} loading={i === initial ? "eager" : "lazy"} />
          ))}
        </div>
        {variants.length > 1 && (
          <div className="variants" role="radiogroup" aria-label="Vælg rem, lænke eller udførelse">
            <p className="variants__head"><span>Vælg rem, lænke eller udførelse</span><b>{v.strap}</b></p>
            <ul>
              {variants.map((x, i) => (
                <li key={x.key}>
                  <button type="button" role="radio" aria-checked={i === sel} className={i === sel ? "is-on" : ""} onClick={() => setSel(i)} title={`${x.strap} · ${x.ref}`}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    {x.image && <img src={x.image} alt="" loading="lazy" />}
                    <span>{x.strap}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <div>
        <span className="label">{brand}</span>
        <h1>{name}</h1>
        <p className="muted" aria-live="polite">Ref. {v.ref}{v.size && ` · ${v.size}`}</p>
        <p className="pdp__price" aria-live="polite"><small>Vejledende udsalgspris</small><span key={v.key} className="pdp__price-val">{v.price}</span></p>
        <div className="btn-row">
          <Link className="btn" href={`/book-tid?emne=${encodeURIComponent(subject)}&maerke=${brandSlug}`}>Book tid og prøv uret</Link>
          <a className="btn btn--outline" href={`tel:${phoneE164}`}>Ring {phone}</a>
          <span className="pdp__save"><HeartButton key={v.key} id={`ur:${v.key}`} label={subject} /></span>
        </div>
        <p className="notice">Uret kan ikke købes online. Prisen gælder uret som vist{variants.length > 1 ? " i den valgte udførelse" : ""}. Book en tid, så har vi det klar til dig i butikken på {street}.</p>
        <div className="accordion" style={{ marginTop: 24 }}>
          <details open>
            <summary>Specifikationer</summary>
            <div><dl className="specs">{v.specs.map(([k, val]) => <div key={k}><dt>{k}</dt><dd>{val}</dd></div>)}</dl></div>
          </details>
          <details><summary>Garanti og service</summary><div><p>Alle nye ure leveres med producentens internationale garanti. Vores eget værksted servicerer uret efter producentens krav. Garantiperioden afhænger af mærket, og vi fortæller gerne mere i butikken.</p></div></details>
          <details><summary>Remme og lænker</summary><div><p>{variants.length > 1 ? `Her kan du se ${name} i de udførelser, vi har hos os. Hver udførelse har sit eget referencenummer og sin egen pris.` : "Uret vises på den rem eller lænke, det leveres på."} Spørg os gerne om andre remme fra {brand}, når du besøger os.</p></div></details>
        </div>
      </div>
    </section>
  );
}
