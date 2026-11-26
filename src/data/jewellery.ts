import { JEWELLERY_RAW } from "./jewellery.raw";

export type JewelleryBrand = { slug: string; name: string; intro: string; website?: string };
export type Piece = {
  slug: string; brand: string; name: string; ref: string; price: number;
  image?: string; type: string; metal?: string; oldId: string;
};

export const jewelleryBrandList: JewelleryBrand[] = [
  { slug: "marselis", name: "Marselis Jewellery", website: "https://marselis.lovable.app/", intro: "Smykker med certificerede diamanter i 18 karat guld: Eternity, Flower, Rainbow Sapphire og tennisarmbånd." },
  { slug: "georg-jensen", name: "Georg Jensen", intro: "Dansk sølv- og guldsmedekunst siden 1904. Mercy, Offspring, Moonlight Grapes, Reflect, Fusion og Torun." },
  { slug: "chopard", name: "Chopard", intro: "Happy Diamonds, Happy Hearts og Ice Cube: Chopards smykker med de frit bevægelige diamanter og etisk guld." },
  { slug: "gucci", name: "Gucci", intro: "Smykker i 18 karat guld fra Gucci: Interlocking G, Horsebit, Link to Love og Icon." },
];
export const getJewelleryBrand = (slug: string) => jewelleryBrandList.find((b) => b.slug === slug);

const slugify = (t: string) =>
  t.toLowerCase().replace(/æ/g, "ae").replace(/ø/g, "oe").replace(/å/g, "aa").replace(/&/g, "og")
    .normalize("NFKD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

function typeOf(name: string): string {
  const n = name.toLowerCase();
  if (/manchet/.test(n)) return "Manchetknapper";
  if (/ørering|ørestik|creol|hoops|ear ?cuff|earcuff|earring/.test(n)) return "Øreringe";
  if (/halskæde|vedhæng|necklace|lariat/.test(n)) return "Halskæder";
  if (/armbånd|armring|bracelet|bangle/.test(n)) return "Armbånd";
  if (/ring|band/.test(n)) return "Ringe";
  return "Andet";
}
function metalOf(name: string): string | undefined {
  const n = name.toLowerCase();
  const m: string[] = [];
  if (/sølv/.test(n)) m.push("Sølv");
  if (/\byg\b|gulguld/.test(n)) m.push("Gult guld");
  if (/\bwg\b|hvidguld/.test(n)) m.push("Hvidguld");
  if (/\brg\b|rosaguld/.test(n)) m.push("Rosaguld");
  if (/18 ?k/.test(n) && !m.length) m.push("18 karat guld");
  return m.length ? m.join(", ") : undefined;
}

function parse(): Piece[] {
  const seen = new Set<string>();
  return JEWELLERY_RAW.trim().split("\n").map((line) => {
    const [brand, oldId, name, ref, price, img] = line.split("|");
    let slug = slugify(`${name} ${ref || oldId}`);
    if (seen.has(`${brand}/${slug}`)) slug = `${slug}-${oldId}`;
    seen.add(`${brand}/${slug}`);
    return {
      slug, brand, name: name.trim(), ref: ref.trim(), price: Number(price) || 0, oldId,
      image: img ? img.replace(/^\/upload_dir\//, "/billeder/").replace(/\.[a-z0-9]+$/i, ".webp") : undefined,
      type: typeOf(name), metal: metalOf(name),
    };
  });
}

export const pieces: Piece[] = parse();
export const piecesFor = (brand: string) => pieces.filter((p) => p.brand === brand);
export const getPiece = (brand: string, slug: string) => pieces.find((p) => p.brand === brand && p.slug === slug);
export const pieceHref = (p: Piece) => `/smykker/${p.brand}/${p.slug}`;
export const pieceTypes = ["Ringe", "Øreringe", "Halskæder", "Armbånd", "Manchetknapper", "Andet"];
