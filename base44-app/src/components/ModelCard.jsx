import Link from "@/lib/next/link";
import { getBrand, modelHref, modelKey } from "@/data/catalog";
import { formatPrice } from "@/lib/site";
import { HeartButton } from "./Wishlist";
export default function ModelCard({ model, eager }) {
    const brand = getBrand(model.brand);
    const label = `${brand.name} ${model.name}`;
    return (<article className="card">
      <div className="card__media">
        {model.image ? (
        <img src={model.image} alt={`${label}, reference ${model.ref}`} loading={eager ? "eager" : "lazy"} decoding="async"/>) : <div className="ph">[Produktbillede]</div>}
        <HeartButton id={`ur:${modelKey(model)}`} label={label}/>
      </div>
      <div className="card__body">
        <span className="card__brand">{brand.name}</span>
        <Link className="card__name" href={modelHref(model)}>{model.name}</Link>
        <span className="card__meta">{model.ref}{model.size && ` · ${model.size}`}</span>
        <span className="card__price"><small>Vejl. pris</small>{formatPrice(model.price)}</span>
      </div>
    </article>);
}
