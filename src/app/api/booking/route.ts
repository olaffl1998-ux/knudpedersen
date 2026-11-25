import { NextResponse } from "next/server";

/**
 * Modtager booking- og kontaktformularen.
 * Hvis RESEND_API_KEY er sat, sendes en e-mail til butikken og en kopi til kunden.
 * Ellers logges henvendelsen kun (fx i forhåndsvisningen).
 */

const clean = (v: unknown, max = 2000) => String(v ?? "").replace(/[\u0000-\u001f\u007f]/g, " ").trim().slice(0, max);
const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Ugyldig forespørgsel" }, { status: 400 });
  }
  // Honeypot mod spam
  if (clean(body.website)) return NextResponse.json({ ok: true });

  const data = {
    mode: clean(body.mode, 20) === "message" ? "Besked" : "Booking",
    variant: clean(body.variant, 20),
    purpose: clean(body.purpose, 100),
    date: clean(body.date, 20),
    time: clean(body.time, 10),
    name: clean(body.name, 200),
    phone: clean(body.phone, 40),
    email: clean(body.email, 200),
    message: clean(body.message),
    subject: clean(body.subject, 200),
  };
  if (!data.name || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(data.email) || !body.consent) {
    return NextResponse.json({ error: "Manglende felter" }, { status: 422 });
  }

  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.info("[booking] modtaget (ingen e-mail sendt, RESEND_API_KEY mangler)", { mode: data.mode, purpose: data.purpose, date: data.date });
    return NextResponse.json({ ok: true });
  }

  const to = process.env.BOOKING_TO_EMAIL || "sktclemenstorv@knudpedersen.dk";
  const from = process.env.BOOKING_FROM_EMAIL || "booking@knudpedersen.dk";
  const rows = Object.entries(data).filter(([, v]) => v).map(([k, v]) => `<tr><td><b>${esc(k)}</b></td><td>${esc(v)}</td></tr>`).join("");
  const send = (payload: object) =>
    fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

  const shop = await send({
    from, to, reply_to: data.email,
    subject: `${data.mode} fra hjemmesiden: ${data.purpose || data.subject || data.name}`,
    html: `<table>${rows}</table>`,
  });
  if (!shop.ok) return NextResponse.json({ error: "Kunne ikke sende" }, { status: 502 });

  await send({
    from, to: data.email,
    subject: "Tak for din henvendelse til Knud Pedersen",
    html: `<p>Kære ${esc(data.name)}</p><p>Tak for din henvendelse. Vi vender tilbage hurtigst muligt.</p><table>${rows}</table><p>Venlig hilsen<br>Knud Pedersen, Skt. Clemens Torv 6, 8000 Aarhus C, tlf. 86 12 17 99</p>`,
  }).catch(() => undefined);

  return NextResponse.json({ ok: true });
}
