import { getBrand, modelHref, modelKey, models } from "@/data/catalog";
import { getJewelleryBrand, pieceHref, pieces } from "@/data/jewellery";

/** Lille indeks over ure og smykker til søgning og ønskeliste (sendes til browseren) */
export type IndexItem = { id: string; kind: "Ur" | "Smykke"; brand: string; name: string; ref: string; href: string; image: string | null; price: number | null };

export function productIndex(): IndexItem[] {
  return [
    ...models.map((m) => ({ id: `ur:${modelKey(m)}`, kind: "Ur" as const, brand: getBrand(m.brand)?.name || m.brand, name: m.name, ref: m.ref || "", href: modelHref(m), image: m.image || null, price: m.price ?? null })),
    ...pieces.map((p) => ({ id: `smykke:${p.brand}/${p.slug}`, kind: "Smykke" as const, brand: getJewelleryBrand(p.brand)?.name || p.brand, name: p.name, ref: p.ref || "", href: pieceHref(p), image: p.image || null, price: p.price ?? null })),
  ];
}
