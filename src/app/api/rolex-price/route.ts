import { NextResponse } from "next/server";
import { rolexPriceFor } from "@/data/rolex";

/**
 * Rolex' vejledende udsalgspris må kun vises for besøgende i Danmark.
 * Landet læses fra hostingens geo-header (Vercel eller Cloudflare). Uden header vises ingen pris.
 */
export async function GET(req: Request) {
  const country = (req.headers.get("x-vercel-ip-country") || req.headers.get("cf-ipcountry") || "").toUpperCase();
  const allowed = country === "DK" || (!country && process.env.ROLEX_PRICE_FALLBACK_SHOW === "true");
  const rmc = new URL(req.url).searchParams.get("rmc") || "";
  const price = allowed ? rolexPriceFor(rmc) : null;
  return NextResponse.json({ price }, { headers: { "Cache-Control": "private, no-store", Vary: "x-vercel-ip-country, cf-ipcountry" } });
}
