/**
 * Mærkerne i 3D-showroomet på forsiden.
 *
 * Butikken kan selv tilføje, fjerne eller ændre mærker her. Felterne:
 * - name: mærkets navn
 * - zone: "rolex-tudor", "ure" eller "smykker"
 * - description: 2–3 linjers beskrivelse i panelet
 * - product: navnet på produktet i vitrinen
 * - image: produktbillede (fritlagt PNG/WebP). Vises som et billede i vitrinen, der altid vender mod kameraet
 * - model: (valgfri) sti til en 3D-model i .glb-format (Draco-komprimeret). Har mærket en model, vises den i stedet for billedet
 * - href: link til mærkesiden
 * - official: "Officiel forhandler" vises i panelet
 * - framed: billedet vises uændret på en lys plade (bruges til Rolex og Tudor, hvis materiale ikke må ændres)
 *
 * Rolex og Tudor: kun officielt materiale fra mærkerne til forhandlere. Ingen animation af Rolex' materiale.
 */
export type ShowroomZone = "rolex-tudor" | "ure" | "smykker";

export type ShowroomBrand = {
  slug: string;
  name: string;
  zone: ShowroomZone;
  description: string;
  product?: string;
  image?: string;
  model?: string;
  href: string;
  official?: boolean;
  framed?: boolean;
};

export const zoneLabels: Record<ShowroomZone, string> = {
  "rolex-tudor": "Rolex & Tudor",
  ure: "Ure",
  smykker: "Smykker",
};

const S = "/billeder/showroom/";

export const showroomBrands: ShowroomBrand[] = [
  // Zone 1: Rolex & Tudor
  { slug: "rolex", name: "Rolex", zone: "rolex-tudor", official: true, framed: true, href: "/rolex/discover",
    description: "Knud Pedersen er officiel Rolex-forhandler og autoriseret Rolex-servicecenter i Aarhus. Udforsk Rolex' kollektioner i vores Rolex-afdeling.",
    product: "Officiel Rolex-forhandler", image: "/billeder/pics/Rolex/Rolex-retailer-plaque-120x60_da.jpg" },
  { slug: "tudor", name: "Tudor", zone: "rolex-tudor", official: true, framed: true, href: "/maerker/tudor",
    description: "Tudor kombinerer robuste sportsure med klassisk design og egne manufakturværker. Black Bay og Pelagos er blandt de modeller, vi oftest viser frem.",
    product: "Tudor Black Bay 31", image: "/billeder/shop/M79600-0001-1.webp" },

  // Zone 2: Ure
  { slug: "glashutte-original", name: "Glashütte Original", zone: "ure", href: "/maerker/glashutte-original",
    description: "Tysk finurmageri fra Glashütte i Sachsen, hvor næsten alle dele laves i eget hus.", product: "PanoInverse", image: `${S}glashutte-original.webp` },
  { slug: "breitling", name: "Breitling", zone: "ure", href: "/maerker/breitling",
    description: "Breitling er kendt for kronografer til luft, land og hav, med Navitimer som det ikoniske pilotur.", product: "Se udvalget i butikken" },
  { slug: "omega", name: "Omega", zone: "ure", href: "/maerker/omega",
    description: "Omega står bag Speedmaster, det første ur på Månen, og Seamaster-serien af dykkerure.", product: "Seamaster Diver 300M", image: `${S}omega.webp` },
  { slug: "grand-seiko", name: "Grand Seiko", zone: "ure", href: "/maerker/grand-seiko",
    description: "Grand Seiko hylder den japanske spiritualitet, der er dybt inspireret af naturen og årstiderne.", product: "Evolution 9 SBGE283", image: `${S}grand-seiko.webp` },
  { slug: "tag-heuer", name: "TAG Heuer", zone: "ure", href: "/maerker/tag-heuer",
    description: "Schweiziske sportsure med rødder i motorsport, fra Carrera til Monaco.", product: "Aquaracer Professional 200 Solargraph", image: `${S}tag-heuer.webp` },
  { slug: "longines", name: "Longines", zone: "ure", href: "/maerker/longines",
    description: "Longines forener tradition og elegance i ure til både hverdag og fest.", product: "Spirit Zulu Time", image: `${S}longines.webp` },
  { slug: "baume-mercier", name: "Baume & Mercier", zone: "ure", href: "/maerker/baume-mercier",
    description: "Klassisk schweizisk urmageri med kollektioner som Riviera og Clifton.", product: "Clifton", image: `${S}baume-mercier.webp` },
  { slug: "oris", name: "Oris", zone: "ure", href: "/maerker/oris",
    description: "Uafhængigt schweizisk mærke med mekaniske ure og fokus på bæredygtighed.", product: "Aquis Calibre 400", image: `${S}oris.webp` },
  { slug: "doxa", name: "Doxa", zone: "ure", href: "/maerker/doxa",
    description: "Doxa har lavet professionelle dykkerure siden 1967, kendt for den orange urskive.", product: "SUB 200 Caribbean", image: `${S}doxa.webp` },
  { slug: "montblanc", name: "Montblanc", zone: "ure", href: "/maerker/montblanc",
    description: "Montblanc ure, skriveredskaber og læderartikler.", product: "TimeWalker", image: `${S}montblanc.webp` },

  // Zone 3: Smykker
  { slug: "chopard", name: "Chopard", zone: "smykker", href: "/smykker/chopard",
    description: "Happy Diamonds, Happy Hearts og Ice Cube: Chopards smykker med de frit bevægelige diamanter og etisk guld.", product: "Happy Hearts armbånd", image: `${S}chopard.webp` },
  { slug: "georg-jensen", name: "Georg Jensen", zone: "smykker", href: "/smykker/georg-jensen",
    description: "Dansk sølv- og guldsmedekunst siden 1904. Mercy, Offspring, Moonlight Grapes, Reflect, Fusion og Torun.", product: "Mercy armring i 18 karat guld", image: `${S}georg-jensen.webp` },
  { slug: "gucci", name: "Gucci", zone: "smykker", href: "/smykker/gucci",
    description: "Smykker i 18 karat guld fra Gucci: Interlocking G, Horsebit, Link to Love og Icon.", product: "Link to Love armbånd", image: `${S}gucci.webp` },
  { slug: "marselis", name: "Marselis Jewellery", zone: "smykker", href: "/smykker/marselis",
    description: "Smykker med certificerede diamanter i 18 karat guld: Eternity, Flower, Rainbow Sapphire og tennisarmbånd.", product: "Eternity ring", image: `${S}marselis.webp` },
  { slug: "ole-mathiesen", name: "Ole Mathiesen", zone: "smykker", href: "/maerker/ole-mathiesen",
    description: "Dansk design med rene linjer siden 1845.", product: "Se udvalget i butikken" },
];
