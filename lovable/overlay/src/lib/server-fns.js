import { createServerFn } from "@tanstack/react-start";
import { getRequestHeader } from "@tanstack/react-start/server";
import { z } from "zod";
import { rolexPriceFor } from "@/data/rolex";

// eslint-disable-next-line no-control-regex
const clean = (v, max = 2000) => String(v ?? "").replace(/[\u0000-\u001f\u007f]/g, " ").trim().slice(0, max);

const KNOWN = { mode: 20, variant: 20, purpose: 100, date: 20, time: 10, name: 200, phone: 40, email: 200, message: 4000, subject: 200, brand: 100 };
const EMAIL = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

/** Lovable Cloud (Supabase). Lovable lægger adressen og den offentlige nøgle i miljøet */
function cloud() {
  const env = globalThis.process?.env ?? {};
  const url = env.SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL;
  const key = env.SUPABASE_PUBLISHABLE_KEY || env.SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY;
  if (!url || !key) throw new Error("Lovable Cloud er ikke sat op");
  return { url: url.replace(/\/$/, ""), key };
}
/** Gemmer én række. Tabellerne tillader kun, at besøgende opretter rækker (ingen læsning) */
async function insert(table, row) {
  const { url, key } = cloud();
  const res = await fetch(`${url}/rest/v1/${table}`, {
    method: "POST",
    headers: { apikey: key, Authorization: `Bearer ${key}`, "Content-Type": "application/json", Prefer: "return=minimal" },
    body: JSON.stringify(row),
  });
  return res.status;
}

/** Booking, kontakt og Rolex-formularer gemmes i tabellen henvendelser i Lovable Cloud */
export const submitInquiry = createServerFn({ method: "POST" })
  .validator(z.record(z.string().max(60), z.unknown()))
  .handler(async ({ data }) => {
    if (clean(data.website)) return { ok: true }; // honeypot
    const rec = {};
    for (const [k, max] of Object.entries(KNOWN)) rec[k] = clean(data[k], max) || null;
    rec.mode = rec.mode === "message" ? "Besked" : "Booking";
    if (!rec.name || !EMAIL.test(rec.email || "") || data.consent !== true) throw new Error("Manglende felter");
    rec.details = Object.fromEntries(
      Object.entries(data).filter(([k]) => !(k in KNOWN) && !["consent", "website"].includes(k)).slice(0, 30).map(([k, v]) => [clean(k, 60), clean(v, 500)]),
    );
    rec.status = "Ny";
    const st = await insert("henvendelser", rec);
    if (st >= 300) throw new Error(`Henvendelsen kunne ikke gemmes (${st})`);
    return { ok: true };
  });

/** Tilmelding til nyhedsbrev gemmes i tabellen nyhedsbrev (kobles på en udbyder med double opt-in senere) */
export const subscribeNewsletter = createServerFn({ method: "POST" })
  .validator(z.object({ email: z.string().max(200), consent: z.literal(true) }))
  .handler(async ({ data }) => {
    const email = clean(data.email, 200).toLowerCase();
    if (!EMAIL.test(email)) throw new Error("Ugyldig e-mail");
    const st = await insert("nyhedsbrev", { email, consent: true });
    // 409: e-mailen er allerede tilmeldt, og det er fint
    if (st >= 300 && st !== 409) throw new Error(`Tilmeldingen kunne ikke gemmes (${st})`);
    return { ok: true };
  });

/** Rolex' vejledende pris må kun vises for besøgende i Danmark (land fra Cloudflare) */
export const getRolexPrice = createServerFn({ method: "GET" })
  .validator(z.object({ rmc: z.string().max(40) }))
  .handler(async ({ data }) => {
    const country = (getRequestHeader("cf-ipcountry") || "").toUpperCase();
    return { price: country === "DK" ? rolexPriceFor(data.rmc) : null };
  });
