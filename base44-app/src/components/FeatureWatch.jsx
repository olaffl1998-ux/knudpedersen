import Link from "@/lib/next/link";
import { getBrand, modelHref } from "@/data/catalog";
import { formatPrice } from "@/lib/site";
/** Mørkt afsnit i fuld bredde med ét ur i fokus */
export default function FeatureWatch({ model, kicker, text }) {
    const b = getBrand(model.brand);
    const specs = Object.entries(model.specs).filter(([k]) => k !== "Reference").slice(0, 5);
    return (<section className="fx" aria-labelledby="fx-h">
      <div className="fx__media">
        <span className="fx__glow" aria-hidden="true"/>
                <img src={model.image} alt={`${b.name} ${model.name}, reference ${model.ref}`} loading="lazy"/>
      </div>
      <div className="fx__text">
        <span className="label">{kicker}</span>
        <h2 id="fx-h"><small>{b.name}</small>{model.name}</h2>
        <p>{text}</p>
        <dl className="fx__specs">
          <div><dt>Reference</dt><dd>{model.ref}</dd></div>
          {model.size && <div><dt>Størrelse</dt><dd>{model.size}</dd></div>}
          {specs.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}
        </dl>
        <p className="fx__price"><small>Vejledende udsalgspris</small>{formatPrice(model.price)}</p>
        <div className="btn-row">
          <Link className="btn btn--light" href={modelHref(model)}>Se uret</Link>
          <Link className="link-arrow link-arrow--light" href={`/book-tid?emne=${encodeURIComponent(`${b.name} ${model.name} ${model.ref}`)}&maerke=${b.slug}`}>Book en tid og prøv det</Link>
        </div>
      </div>
    </section>);
}
