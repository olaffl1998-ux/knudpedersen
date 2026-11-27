import { getBrand, genderOf, modelKey, priceBands, sizeOf } from "@/data/catalog";
import { dialColors } from "@/data/dialColors";
/** Gør ure klar til kataloget med filtre */
export const toItems = (list) => list.map((m, order) => ({
    m, order,
    brandName: getBrand(m.brand).name,
    gender: genderOf(m),
    size: sizeOf(m),
    material: m.specs.Kasse ?? "",
    movement: m.specs["Urværk"] ?? "",
    dial: dialColors[modelKey(m)] ?? "",
    band: priceBands.find((b) => m.price >= b.min && m.price < b.max).label,
}));
