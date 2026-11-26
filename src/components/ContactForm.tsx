"use client";

import Link from "next/link";
import { useState } from "react";

/** Kontaktformular med validering i feltet (vises når feltet forlades og ved afsendelse) */
export default function ContactForm() {
  const [v, setV] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [state, setState] = useState<"idle" | "sending" | "done" | "failed">("idle");
  const errors: Record<string, string> = {};
  if (!v.name?.trim()) errors.name = "Skriv dit navn.";
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v.email || "")) errors.email = "Skriv en gyldig e-mailadresse, fx navn@mail.dk.";
  if (!v.message?.trim() || v.message.trim().length < 5) errors.message = "Skriv din besked.";
  if (v.consent !== "1") errors.consent = "Sæt flueben, så vi må bruge dine oplysninger til at svare dig.";
  const show = (k: string) => touched[k] && errors[k];
  const a = (k: string) => ({ id: `c-${k}`, value: v[k] || "", onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => setV({ ...v, [k]: e.target.value }), onBlur: () => setTouched({ ...touched, [k]: true }), "aria-invalid": !!show(k) || undefined, "aria-describedby": show(k) ? `c-${k}-err` : undefined });

  if (state === "done") return <div className="ok-box" role="status"><h2>Tak for din besked</h2><p>Vi svarer hurtigst muligt, normalt inden for en hverdag.</p></div>;

  return (
    <form className="form" noValidate onSubmit={async (e) => {
      e.preventDefault();
      setTouched({ name: true, email: true, message: true, consent: true });
      if (Object.keys(errors).length) return;
      setState("sending");
      try {
        const r = await fetch("/api/booking", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...v, mode: "message", consent: true }) });
        setState(r.ok ? "done" : "failed");
      } catch { setState("failed"); }
    }}>
      <div className="field">
        <label htmlFor="c-purpose">Emne</label>
        <select {...a("purpose")}><option value="">Vælg emne</option><option>Ure</option><option>Smykker</option><option>Service og reparation</option><option>Andet</option></select>
      </div>
      <div className="form-2">
        <div className={`field${show("name") ? " has-error" : ""}`}><label htmlFor="c-name">Navn</label><input {...a("name")} autoComplete="name" />{show("name") && <p className="error" id="c-name-err">{errors.name}</p>}</div>
        <div className={`field${show("email") ? " has-error" : ""}`}><label htmlFor="c-email">E-mail</label><input {...a("email")} type="email" autoComplete="email" />{show("email") && <p className="error" id="c-email-err">{errors.email}</p>}</div>
      </div>
      <div className="field"><label htmlFor="c-phone">Telefon (valgfrit)</label><input {...a("phone")} type="tel" autoComplete="tel" /></div>
      <div className={`field${show("message") ? " has-error" : ""}`}><label htmlFor="c-message">Besked</label><textarea {...a("message")} />{show("message") && <p className="error" id="c-message-err">{errors.message}</p>}</div>
      <div className="check">
        <input id="c-consent" type="checkbox" checked={v.consent === "1"} onChange={(e) => { setV({ ...v, consent: e.target.checked ? "1" : "" }); setTouched({ ...touched, consent: true }); }} />
        <label htmlFor="c-consent">Knud Pedersen må bruge mine oplysninger til at svare på min henvendelse. Se <Link href="/privatlivspolitik">privatlivspolitikken</Link>.</label>
        {show("consent") && <p className="error">{errors.consent}</p>}
      </div>
      <div className="btn-row"><button className="btn" type="submit" disabled={state === "sending"}>{state === "sending" ? "Sender…" : "Send besked"}</button></div>
      {state === "failed" && <p className="error" role="alert">Beskeden kunne ikke sendes. Prøv igen, eller ring til os.</p>}
    </form>
  );
}
