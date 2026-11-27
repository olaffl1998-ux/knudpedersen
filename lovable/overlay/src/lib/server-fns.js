import { createServerFn } from "@tanstack/react-start";
import { getRequestHeader } from "@tanstack/react-start/server";
import { z } from "zod";
import { rolexPriceFor } from "@/data/rolex";

// eslint-disable-next-line no-control-regex
const clean = (v, max = 2000) => String(v ?? "").replace(/[\u0000-\u001f\u007f]/g, " ").trim().slice(0, max);

/**
 * Booking, kontakt og Rolex-formularer.
 * I Lovable-udgaven er der endnu ingen database koblet på. Indtil Lovable Cloud er slået til, giver formularerne
 * besked om at ringe eller skrive, så ingen henvendelse forsvinder i det stille.
 */
export const submitInquiry = createServerFn({ method: "POST" })
  .validator(z.record(z.string().max(60), z.unknown()))
  .handler(async ({ data }) => {
    if (clean(data.website)) return { ok: true }; // honeypot
    throw new Error("Formularen er ikke koblet på endnu");
  });

/** Tilmelding til nyhedsbrev (kobles på en udbyder med double opt-in senere) */
export const subscribeNewsletter = createServerFn({ method: "POST" })
  .validator(z.object({ email: z.string().max(200), consent: z.literal(true) }))
  .handler(async () => {
    throw new Error("Nyhedsbrevet er ikke koblet på endnu");
  });

/** Rolex' vejledende pris må kun vises for besøgende i Danmark (land fra Cloudflare) */
export const getRolexPrice = createServerFn({ method: "GET" })
  .validator(z.object({ rmc: z.string().max(40) }))
  .handler(async ({ data }) => {
    const country = (getRequestHeader("cf-ipcountry") || "").toUpperCase();
    return { price: country === "DK" ? rolexPriceFor(data.rmc) : null };
  });
