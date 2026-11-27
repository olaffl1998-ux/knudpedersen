import { JEWELLERY_RAW } from "./jewellery.raw";
export const jewelleryBrandList = [
    { slug: "marselis", name: "Marselis Jewellery", website: "https://marselis.lovable.app/", intro: "Smykker med certificerede diamanter i 18 karat guld: Eternity, Flower, Rainbow Sapphire og tennisarmbånd." },
    { slug: "georg-jensen", name: "Georg Jensen", intro: "Dansk sølv- og guldsmedekunst siden 1904. Mercy, Offspring, Moonlight Grapes, Reflect, Fusion og Torun." },
    { slug: "chopard", name: "Chopard", intro: "Happy Diamonds, Happy Hearts og Ice Cube: Chopards smykker med de frit bevægelige diamanter og etisk guld." },
    { slug: "gucci", name: "Gucci", intro: "Smykker i 18 karat guld fra Gucci: Interlocking G, Horsebit, Link to Love og Icon." },
];
export const getJewelleryBrand = (slug) => jewelleryBrandList.find((b) => b.slug === slug);
const slugify = (t) => t.toLowerCase().replace(/æ/g, "ae").replace(/ø/g, "oe").replace(/å/g, "aa").replace(/&/g, "og")
    .normalize("NFKD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
function typeOf(name) {
    const n = name.toLowerCase();
    if (/manchet/.test(n))
        return "Manchetknapper";
    if (/ørering|ørestik|creol|hoops|ear ?cuff|earcuff|earring/.test(n))
        return "Øreringe";
    if (/halskæde|vedhæng|necklace|lariat/.test(n))
        return "Halskæder";
    if (/armbånd|armring|bracelet|bangle/.test(n))
        return "Armbånd";
    if (/ring|band/.test(n))
        return "Ringe";
    return "Andet";
}
/** Når navnet ikke siger typen, gør mærkets referencenummer det (Chopard: 79/81 halskæder, 82 ringe, 83/84 øreringe, 85 armbånd; Gucci: YBA armbånd, YBB halskæder, YBC ringe, YBD øreringe) */
function typeByRef(brand, ref) {
    const r = ref.trim().toUpperCase();
    if (brand === "chopard")
        return { "79": "Halskæder", "81": "Halskæder", "82": "Ringe", "83": "Øreringe", "84": "Øreringe", "85": "Armbånd" }[r.slice(0, 2)];
    if (brand === "gucci")
        return { YBA: "Armbånd", YBB: "Halskæder", YBC: "Ringe", YBD: "Øreringe" }[r.slice(0, 3)];
    return undefined;
}
function metalOf(name) {
    const n = name.toLowerCase();
    const m = [];
    if (/sølv/.test(n))
        m.push("Sølv");
    if (/\byg\b|gulguld/.test(n))
        m.push("Gult guld");
    if (/\bwg\b|hvidguld/.test(n))
        m.push("Hvidguld");
    if (/\brg\b|rosaguld/.test(n))
        m.push("Rosaguld");
    if (/18 ?k/.test(n) && !m.length)
        m.push("18 karat guld");
    return m.length ? m.join(", ") : undefined;
}
function parse() {
    const seen = new Set();
    return JEWELLERY_RAW.trim().split("\n").map((line) => {
        const [brand, oldId, name, ref, price, img] = line.split("|");
        let slug = slugify(`${name} ${ref || oldId}`);
        if (seen.has(`${brand}/${slug}`))
            slug = `${slug}-${oldId}`;
        seen.add(`${brand}/${slug}`);
        return {
            slug, brand, name: name.trim(), ref: ref.trim(), price: Number(price) || 0, oldId,
            image: img ? img.replace(/^\/upload_dir\//, "/billeder/").replace(/\.[a-z0-9]+$/i, ".webp") : undefined,
            type: (() => { const t = typeOf(name); return t === "Andet" ? typeByRef(brand, ref) ?? t : t; })(), metal: metalOf(name),
        };
    });
}
export const pieces = parse();
export const piecesFor = (brand) => pieces.filter((p) => p.brand === brand);
export const getPiece = (brand, slug) => pieces.find((p) => p.brand === brand && p.slug === slug);
export const pieceHref = (p) => `/smykker/${p.brand}/${p.slug}`;
export const pieceTypes = ["Ringe", "Øreringe", "Halskæder", "Armbånd", "Manchetknapper", "Andet"];
