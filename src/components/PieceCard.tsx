import Link from "next/link";
import { getJewelleryBrand, pieceHref, type Piece } from "@/data/jewellery";
import { formatPrice } from "@/lib/site";

export default function PieceCard({ piece }: { piece: Piece }) {
  const brand = getJewelleryBrand(piece.brand)!;
  return (
    <Link className="model-card" href={pieceHref(piece)}>
      <div className="img">
        {piece.image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={piece.image} alt={`${brand.name} ${piece.name}`} loading="lazy" decoding="async" />
        )}
      </div>
      <p className="eyebrow">{brand.name}</p>
      <h3>{piece.name}</h3>
      {piece.ref && <p className="ref">{piece.ref}</p>}
      <p className="price">{piece.price ? <><small>Vejl. pris</small>{formatPrice(piece.price)}</> : <small>Pris på forespørgsel</small>}</p>
    </Link>
  );
}
