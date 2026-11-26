import { getBrand, modelHref, modelKey, models } from "@/data/catalog";
import { getJewelleryBrand, pieceHref, pieces } from "@/data/jewellery";
export function productIndex() {
    return [
        ...models.map((m) => ({ id: `ur:${modelKey(m)}`, kind: "Ur", brand: getBrand(m.brand)?.name || m.brand, name: m.name, ref: m.ref || "", href: modelHref(m), image: m.image || null, price: m.price ?? null })),
        ...pieces.map((p) => ({ id: `smykke:${p.brand}/${p.slug}`, kind: "Smykke", brand: getJewelleryBrand(p.brand)?.name || p.brand, name: p.name, ref: p.ref || "", href: pieceHref(p), image: p.image || null, price: p.price ?? null })),
    ];
}
