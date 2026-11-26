import { SITE_URL, SHOW_PREVIEW_BANNER } from "@/lib/site";

const TEMPLATE = "%s | Knud Pedersen";
const DEFAULT_TITLE = "Knud Pedersen – Ure og smykker i Aarhus | Officiel Rolex-forhandler";

/** Oversætter Next-sidernes metadata ({ title, description, openGraph, alternates }) til TanStack head() */
export function metaHead(mod, params) {
  let md = {};
  try {
    md = (mod.generateMetadata ? mod.generateMetadata({ params }) : mod.metadata) || {};
  } catch {
    md = {};
  }
  let title = DEFAULT_TITLE;
  if (typeof md.title === "string") title = TEMPLATE.replace("%s", md.title);
  else if (md.title?.absolute) title = md.title.absolute;
  else if (md.title?.default) title = md.title.default;
  const meta = [{ title }, { property: "og:title", content: md.openGraph?.title || title }];
  if (md.description) {
    meta.push({ name: "description", content: md.description });
    meta.push({ property: "og:description", content: md.openGraph?.description || md.description });
  }
  const img = md.openGraph?.images?.[0];
  if (img) meta.push({ property: "og:image", content: (typeof img === "string" ? img : img.url).startsWith("http") ? (typeof img === "string" ? img : img.url) : `${SITE_URL}${typeof img === "string" ? img : img.url}` });
  if (SHOW_PREVIEW_BANNER || md.robots?.index === false) meta.push({ name: "robots", content: "noindex, nofollow" });
  const links = md.alternates?.canonical ? [{ rel: "canonical", href: `${SITE_URL}${md.alternates.canonical === "/" ? "" : md.alternates.canonical}` }] : [];
  return { meta, links };
}
