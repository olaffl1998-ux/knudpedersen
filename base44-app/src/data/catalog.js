import { RAW } from "./products.raw";
export const brands = [
    { slug: "rolex", name: "Rolex", kind: "Ure", rolex: true, intro: "" },
    { slug: "tudor", name: "Tudor", kind: "Ure", intro: "Tudor kombinerer robuste sportsure med klassisk design og egne manufakturværker. Black Bay og Pelagos er blandt de modeller, vi oftest viser frem i butikken." },
    { slug: "glashutte-original", name: "Glashütte Original", kind: "Ure", intro: "Tysk finurmageri fra Glashütte i Sachsen, hvor næsten alle dele laves i eget hus." },
    { slug: "chopard", name: "Chopard", kind: "Ure og smykker", intro: "Fra Chopard fører vi både ure og smykker i verdensklasse, fra Happy Diamonds til Alpine Eagle." },
    { slug: "breitling", name: "Breitling", kind: "Ure", intro: "Breitling er kendt for kronografer til luft, land og hav, med Navitimer som det ikoniske pilotur." },
    { slug: "omega", name: "Omega", kind: "Ure", intro: "Omega står bag Speedmaster, det første ur på Månen, og Seamaster-serien af dykkerure." },
    { slug: "grand-seiko", name: "Grand Seiko", kind: "Ure", intro: "Grand Seiko hylder den japanske spiritualitet, der er dybt inspireret af naturen og årstiderne." },
    { slug: "tag-heuer", name: "TAG Heuer", kind: "Ure", intro: "Schweiziske sportsure med rødder i motorsport, fra Carrera til Monaco." },
    { slug: "longines", name: "Longines", kind: "Ure", intro: "Longines forener tradition og elegance i ure til både hverdag og fest." },
    { slug: "baume-mercier", name: "Baume & Mercier", kind: "Ure", intro: "Klassisk schweizisk urmageri med kollektioner som Riviera og Clifton." },
    { slug: "oris", name: "Oris", kind: "Ure", intro: "Uafhængigt schweizisk mærke med mekaniske ure og fokus på bæredygtighed." },
    { slug: "doxa", name: "Doxa", kind: "Ure", intro: "Doxa har lavet professionelle dykkerure siden 1967, kendt for den orange urskive." },
    { slug: "montblanc", name: "Montblanc", kind: "Ure, penne og tilbehør", intro: "Montblanc ure, skriveredskaber og læderartikler." },
    { slug: "gucci", name: "Gucci", kind: "Ure og smykker", intro: "Gucci ure og smykker med italiensk design." },
    { slug: "ole-mathiesen", name: "Ole Mathiesen", kind: "Ure", intro: "Dansk urdesign med rene linjer siden 1845." },
];
export const jewelleryBrands = ["Marselis Jewellery", "Chopard", "Gucci", "Marc'Harit", "Georg Jensen", "Perler"];
export const straps = {
    "steel": { key: "steel", name: "Stållænke", type: "steel", color: "#C9CCD0", material: "Rustfrit stål" },
    "steel-gold": { key: "steel-gold", name: "Stål- og guldlænke", type: "bicolor", color: "#C9A55A", material: "Stål og 18 kt. guld" },
    "nato-black": { key: "nato-black", name: "NATO-rem, sort", type: "nato", color: "#1E1E1E", material: "Polyamid" },
    "nato-blue": { key: "nato-blue", name: "NATO-rem, blå", type: "nato", color: "#1F3A66", material: "Polyamid" },
    "nato-brown": { key: "nato-brown", name: "NATO-rem, brun", type: "nato", color: "#4A2C20", material: "Polyamid" },
    "nato-grey": { key: "nato-grey", name: "NATO-rem, grå", type: "nato", color: "#6E6E6A", material: "Polyamid" },
    "rubber-black": { key: "rubber-black", name: "Gummirem, sort", type: "rubber", color: "#191919", material: "Gummi" },
    "rubber-blue": { key: "rubber-blue", name: "Gummirem, blå", type: "rubber", color: "#1C3F78", material: "Gummi" },
    "leather-brown": { key: "leather-brown", name: "Læderrem, brun", type: "leather", color: "#6B3E22", material: "Kalveskind" },
    "leather-black": { key: "leather-black", name: "Læderrem, sort", type: "leather", color: "#1B1714", material: "Kalveskind" },
    "alligator-brown": { key: "alligator-brown", name: "Alligatorrem, mørkebrun", type: "leather", color: "#3E2416", material: "Alligator" },
    "titanium": { key: "titanium", name: "Titaniumlænke", type: "steel", color: "#A9ADB2", material: "Titanium" },
    "gold": { key: "gold", name: "Guldlænke", type: "bicolor", color: "#C9A55A", material: "18 kt. guld" },
    "fabric-black": { key: "fabric-black", name: "Tekstilrem, sort", type: "nato", color: "#232323", material: "Jacquard-vævet tekstil" },
    "original-strap": { key: "original-strap", name: "Original rem", type: "leather", color: "#2B211B", material: "Som på billedet" },
};
/**
 * Rem- og lænketyper, som mærket tilbyder til sine ure. Bruges som "andre muligheder" i vælgeren.
 * Den præcise pasform (bredde og hornafstand) bekræftes i butikken.
 */
const brandStrapOptions = {
    tudor: ["steel", "fabric-black", "rubber-black", "leather-brown"],
    omega: ["steel", "nato-black", "rubber-black", "leather-brown", "leather-black"],
    "tag-heuer": ["steel", "rubber-black", "leather-black", "leather-brown"],
    longines: ["steel", "leather-brown", "leather-black", "rubber-black"],
    "glashutte-original": ["steel", "alligator-brown", "rubber-black"],
    "grand-seiko": ["steel", "titanium", "alligator-brown", "leather-black"],
    "baume-mercier": ["steel", "leather-brown", "leather-black", "rubber-blue"],
    oris: ["steel", "rubber-black", "leather-brown", "nato-grey"],
    doxa: ["steel", "rubber-black"],
    montblanc: ["steel", "leather-brown", "leather-black"],
    chopard: ["steel", "alligator-brown", "rubber-black"],
    gucci: ["steel", "leather-black"],
};
export const collectionSlug = (c) => c.toLowerCase().replace(/æ/g, "ae").replace(/ø/g, "oe").replace(/å/g, "aa").replace(/ü/g, "u").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
export const nonRolexBrands = brands.filter((b) => !b.rolex);
export const getBrand = (slug) => brands.find((b) => b.slug === slug);
export const getModelsForBrand = (slug) => models.filter((m) => m.brand === slug);
export const getModel = (brand, slug) => models.find((m) => m.brand === brand && m.slug === slug);
export const brandHref = (b) => (b.rolex ? "/rolex/discover" : `/maerker/${b.slug}`);
/** Produktadresse: /ur/[mærke]-[model]-[reference] */
export const modelKey = (m) => `${m.brand}-${m.slug}`;
export const modelHref = (m) => `/ur/${modelKey(m)}`;
export const getModelByKey = (key) => models.find((m) => modelKey(m) === key);
/** Filtre til /ure. Køn er afledt af navn og størrelse og skal gennemgås før lancering. */
export function genderOf(m) {
    if (/lady|ladies|dame|women|femme|\bmini\b/i.test(`${m.name} ${m.collection ?? ""}`))
        return "Dame";
    const d = parseFloat((m.size || "").replace(",", "."));
    if (!d)
        return "Unisex";
    if (d <= 34)
        return "Dame";
    if (d >= 39)
        return "Herre";
    return "Unisex";
}
export function sizeOf(m) {
    const d = parseFloat((m.size || "").replace(",", "."));
    if (!d)
        return null;
    if (d < 34)
        return "Under 34 mm";
    if (d < 39)
        return "34–38 mm";
    if (d < 42)
        return "39–41 mm";
    return "42 mm og derover";
}
export const priceBands = [
    { key: "0-15000", label: "Under 15.000 kr.", min: 0, max: 15000 },
    { key: "15000-30000", label: "15.000–30.000 kr.", min: 15000, max: 30000 },
    { key: "30000-60000", label: "30.000–60.000 kr.", min: 30000, max: 60000 },
    { key: "60000-", label: "Over 60.000 kr.", min: 60000, max: Infinity },
];
// Billederne er kopieret fra den gamle webshop til public/billeder (konverteret til webp, maks. 1000 px).
const OLD_HOST = "https://shop16933.sfstatic.io/upload_dir/";
const localImage = (img) => (img.startsWith("http") ? img.replace(OLD_HOST, "/billeder/") : "/billeder/shop/" + img).replace(/\.(jpe?g|png|webp)$/i, ".webp");
const slugify = (t) => t.toLowerCase().replace(/[æ]/g, "ae").replace(/[ø]/g, "oe").replace(/[å]/g, "aa").replace(/&/g, "og")
    .normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
function fittedStrap(kind, material) {
    if (kind === "Lænke") {
        if (/guld/i.test(material) && /stål/i.test(material))
            return "steel-gold";
        if (/titanium/i.test(material))
            return "titanium";
        if (/guld/i.test(material))
            return "gold";
        return "steel";
    }
    return "original-strap";
}
function lookFor(dial) {
    const d = dial.toLowerCase();
    const col = d.startsWith("blå") ? "#1F3A66" : d.startsWith("champagne") ? "#C9B07A" : /hvid|sølv|opalin|perlemor/.test(d) ? "#E6E3DD" : "#141414";
    return { dial: col, bezel: col, case: "#C9CCD0" };
}
function parseProducts() {
    const seen = new Set();
    const out = [];
    for (const line of RAW.trim().split("\n")) {
        const [brand, oldId, name, ref, price, img, collection, diameter, strapKind, material, movement, water, dial] = line.split("|");
        let slug = slugify(`${name}-${ref}`);
        while (seen.has(`${brand}/${slug}`))
            slug += "-2";
        seen.add(`${brand}/${slug}`);
        const fitted = fittedStrap(strapKind, material);
        const options = (brandStrapOptions[brand] ?? ["steel"]).filter((k) => k !== fitted && !(fitted !== "original-strap" && k === "steel"));
        const specs = { Reference: ref };
        if (collection)
            specs.Kollektion = collection;
        if (material)
            specs.Kasse = material;
        if (movement)
            specs["Urværk"] = movement;
        if (water)
            specs["Vandtæthed"] = water;
        if (dial)
            specs.Skive = dial;
        if (strapKind)
            specs["Leveres på"] = strapKind === "Lænke" ? "Lænke" : "Rem";
        out.push({
            slug, brand, name, ref,
            size: diameter,
            price: Number(price),
            example: false,
            image: localImage(img),
            collection: collection || undefined,
            oldId: Number(oldId),
            look: lookFor(dial),
            straps: [fitted, ...options],
            specs,
        });
    }
    return out;
}
export const models = parseProducts();
