import { NextResponse } from "next/server";

/**
 * Tilmelding til nyhedsbrev. [Nyhedsbrevsudbyder, fx Klaviyo eller Mailchimp, kobles på her med double opt-in.]
 * Indtil da logges tilmeldingen kun.
 */
export async function POST(req: Request) {
  let b: { email?: string; consent?: boolean };
  try { b = await req.json(); } catch { return NextResponse.json({ error: "Ugyldig" }, { status: 400 }); }
  const email = String(b.email || "").trim().slice(0, 200);
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) || b.consent !== true) return NextResponse.json({ error: "Manglende felter" }, { status: 422 });
  console.info("[nyhedsbrev] tilmelding modtaget");
  return NextResponse.json({ ok: true });
}
