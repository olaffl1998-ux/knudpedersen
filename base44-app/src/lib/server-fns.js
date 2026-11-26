import { createServerFn } from "@tanstack/react-start";
import { getRequestHeader } from "@tanstack/react-start/server";
import { z } from "zod";
import { rolexPriceFor } from "@/data/rolex";

// eslint-disable-next-line no-control-regex
const clean = (v, max = 2000) => String(v ?? "").replace(/[\u0000-\u001f\u007f]/g, " ").trim().slice(0, max);
const KNOWN = { mode: 20, variant: 20, purpose: 100, date: 20, time: 10, name: 200, phone: 40, email: 200, message: 4000, subject: 200, brand: 100 };

/** Booking, kontakt og Rolex-formularer gemmes som Henvendelse i Base44 */
export const submitInquiry = createServerFn({ method: "POST" })
  .validator(z.record(z.string().max(60), z.unknown()))
  .handler(async ({ data, context }) => {
    if (clean(data.website)) return { ok: true }; // honeypot
    const rec = {};
    for (const [k, max] of Object.entries(KNOWN)) rec[k] = clean(data[k], max);
    rec.mode = rec.mode === "message" ? "Besked" : "Booking";
    if (!rec.name || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(rec.email) || data.consent !== true) throw new Error("Manglende felter");
    const extra = Object.fromEntries(
      Object.entries(data).filter(([k]) => !(k in KNOWN) && !["consent", "website"].includes(k)).slice(0, 30).map(([k, v]) => [clean(k, 60), clean(v, 500)]),
    );
    rec.details = JSON.stringify(extra).slice(0, 4000);
    rec.status = "Ny";
    await context.getBase44().entities.Henvendelse.create(rec);
    return { ok: true };
  });

/** Tilmelding til nyhedsbrev (gemmes som Nyhedsbrev; kobles på en udbyder med double opt-in senere) */
export const subscribeNewsletter = createServerFn({ method: "POST" })
  .validator(z.object({ email: z.string().max(200), consent: z.literal(true) }))
  .handler(async ({ data, context }) => {
    const email = clean(data.email, 200);
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) throw new Error("Ugyldig e-mail");
    await context.getBase44().entities.Nyhedsbrev.create({ email, consent: true });
    return { ok: true };
  });

/** Rolex' vejledende pris må kun vises for besøgende i Danmark (land fra Cloudflare) */
export const getRolexPrice = createServerFn({ method: "GET" })
  .validator(z.object({ rmc: z.string().max(40) }))
  .handler(async ({ data }) => {
    const country = (getRequestHeader("cf-ipcountry") || "").toUpperCase();
    return { price: country === "DK" ? rolexPriceFor(data.rmc) : null };
  });
