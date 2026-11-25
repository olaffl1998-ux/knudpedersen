import { headers } from "next/headers";

/**
 * Rolex' guide: priser (Rolex' maksimale vejledende udsalgspris) må kun vises for besøgende
 * i forhandlerens område. Landet læses fra hostingens geo-header (Vercel eller Cloudflare).
 * Uden header (fx lokal udvikling) skjules prisen, medmindre ROLEX_PRICE_FALLBACK_SHOW=true.
 */
export async function canShowRolexPrice(): Promise<boolean> {
  const h = await headers();
  const country = h.get("x-vercel-ip-country") || h.get("cf-ipcountry");
  if (!country) return process.env.ROLEX_PRICE_FALLBACK_SHOW === "true";
  return country.toUpperCase() === "DK";
}
