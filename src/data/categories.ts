import { models, genderOf, type Model } from "./catalog";
import { pieces, type Piece } from "./jewellery";

/** Underkategorier for ure. Hver har sin egen side på /ure/<slug>. Rolex indgår ikke (egen sektion). */
export type WatchCategory = { slug: string; label: string; title: string; intro: string; filter: (m: Model) => boolean };

const newest = new Set(
  [...models].filter((m) => m.oldId).sort((a, b) => (b.oldId ?? 0) - (a.oldId ?? 0)).slice(0, 48).map((m) => m.brand + m.slug),
);

export const watchCategories: WatchCategory[] = [
  { slug: "herreure", label: "Herreure", title: "Herreure", intro: "Herreure og unisex-ure fra vores mærker. Kom forbi og prøv dem på.", filter: (m) => genderOf(m) !== "Dame" },
  { slug: "dameure", label: "Dameure", title: "Dameure", intro: "Dameure og unisex-ure i mindre størrelser fra vores mærker.", filter: (m) => genderOf(m) !== "Herre" },
  { slug: "nyheder", label: "Nyheder", title: "Nye ure", intro: "De nyeste ure i butikken.", filter: (m) => newest.has(m.brand + m.slug) },
  { slug: "automatiske-ure", label: "Automatiske ure", title: "Automatiske ure", intro: "Mekaniske ure med automatisk optræk, der trækkes op af håndleddets bevægelser.", filter: (m) => /automatik|mekanisk|manuelt/i.test(m.specs["Urværk"] ?? "") },
  { slug: "quartz-ure", label: "Quartz- og solcelleure", title: "Quartz- og solcelleure", intro: "Præcise ure med quartz- eller solcelleværk.", filter: (m) => /quartz|solargraph/i.test(m.specs["Urværk"] ?? "") },
  { slug: "guldure", label: "Ure i guld og stål/guld", title: "Ure i guld", intro: "Ure i guld og i stål kombineret med guld.", filter: (m) => /guld/i.test(m.specs.Kasse ?? "") },
  { slug: "titaniumure", label: "Ure i titanium", title: "Ure i titanium", intro: "Lette og robuste ure i titanium.", filter: (m) => /titan/i.test(m.specs.Kasse ?? "") },
  { slug: "ure-under-25000", label: "Ure under 25.000 kr.", title: "Ure under 25.000 kr.", intro: "Kvalitetsure med en vejledende pris under 25.000 kr.", filter: (m) => m.price > 0 && m.price < 25000 },
];
export const getWatchCategory = (slug: string) => watchCategories.find((c) => c.slug === slug);

/** Underkategorier for smykker. Hver har sin egen side på /smykker/<slug>. */
export type JewelleryCategory = { slug: string; label: string; type: Piece["type"]; intro: string };
export const jewelleryCategories: JewelleryCategory[] = [
  { slug: "ringe", label: "Ringe", type: "Ringe", intro: "Ringe i guld og platin, med og uden diamanter og ædelsten." },
  { slug: "oereringe", label: "Øreringe", type: "Øreringe", intro: "Ørestikkere, creoler og øreringe i ædle metaller." },
  { slug: "halskaeder", label: "Halskæder", type: "Halskæder", intro: "Halskæder og vedhæng i guld og sølv." },
  { slug: "armbaand", label: "Armbånd", type: "Armbånd", intro: "Armbånd og armringe i ædle metaller." },
  { slug: "manchetknapper", label: "Manchetknapper", type: "Manchetknapper", intro: "Manchetknapper til det festlige sæt." },
];
export const getJewelleryCategory = (slug: string) => jewelleryCategories.find((c) => c.slug === slug);
export const piecesOfType = (t: string) => pieces.filter((p) => p.type === t);
