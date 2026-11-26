import { getBrand, genderOf, priceBands, sizeOf } from "@/data/catalog";
/** Gør ure klar til kataloget med filtre */
export const toItems = (list) => list.map((m, order) => ({
    m, order,
    brandName: getBrand(m.brand).name,
    gender: genderOf(m),
    size: sizeOf(m),
    material: m.specs.Kasse ?? "",
    movement: m.specs["Urværk"] ?? "",
    band: priceBands.find((b) => m.price >= b.min && m.price < b.max).label,
}));
