import Link from "next/link";
import { getBrand, modelHref, straps, type Model } from "@/data/catalog";
import { formatPrice } from "@/lib/site";
import { WatchSvg } from "./WatchArt";

export default function ModelCard({ model }: { model: Model }) {
  const brand = getBrand(model.brand)!;
  return (
    <Link className="model-card" href={modelHref(model)}>
      <div className="img"><WatchSvg model={model} strap={straps[model.straps[0]]} /></div>
      <p className="eyebrow">{brand.name}</p>
      <h3>{model.name}</h3>
      <p className="price"><small>Vejl. pris</small>{formatPrice(model.price)} {model.example && <span className="tag">Eksempel</span>}</p>
    </Link>
  );
}
