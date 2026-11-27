import Link from "@/lib/next/link";
import { getJewelleryBrand, pieceHref } from "@/data/jewellery";
import { formatPrice, thumb } from "@/lib/site";
import { HeartButton } from "./Wishlist";
export default function PieceCard({ piece }) {
    const brand = getJewelleryBrand(piece.brand);
    const label = `${brand.name} ${piece.name}`;
    return (<article className="card">
      <div className="card__media">
        {piece.image ? (
        <img src={thumb(piece.image)} alt={label} loading="eager" decoding="async"/>) : <div className="ph" aria-hidden="true">[Produktbillede]</div>}
        <HeartButton id={`smykke:${piece.brand}/${piece.slug}`} label={label}/>
      </div>
      <div className="card__body">
        <span className="card__brand">{brand.name}</span>
        <Link className="card__name" href={pieceHref(piece)}>{piece.name}</Link>
        {piece.ref && <span className="card__meta">{piece.ref}</span>}
        <span className="card__price">{piece.price ? <><small>Vejl. pris</small>{formatPrice(piece.price)}</> : "Pris på forespørgsel"}</span>
      </div>
    </article>);
}
