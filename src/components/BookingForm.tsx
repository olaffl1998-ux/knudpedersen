"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";

type Props = {
  /** "rolex" viser Rolex' tilgængelighedsnote og bruger Rolex' bekræftelsestekst */
  variant?: "standard" | "rolex";
  defaultPurpose?: string;
  subject?: string;
};

const PURPOSES = ["Køb af ur", "Rolex", "Smykker", "Service eller reparation", "Andet"];
const TIMES = ["10.00", "11.00", "12.00", "13.00", "14.00", "15.00", "16.00"];

export default function BookingForm({ variant = "standard", defaultPurpose = "", subject }: Props) {
  const [mode, setMode] = useState<"appointment" | "message">("appointment");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [state, setState] = useState<"idle" | "sending" | "sent" | "failed">("idle");
  const today = new Date().toISOString().slice(0, 10);
  const maxDate = new Date(Date.now() + 182 * 864e5).toISOString().slice(0, 10);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const v = (k: string) => String(fd.get(k) ?? "").trim();
    const errs: Record<string, string> = {};
    if (mode === "appointment") {
      if (!v("purpose")) errs.purpose = "Vælg hvad mødet drejer sig om.";
      if (!v("date")) errs.date = "Vælg en dato.";
      if (!v("time")) errs.time = "Vælg et tidspunkt.";
    } else if (!v("message")) errs.message = "Skriv din besked.";
    if (!v("name")) errs.name = "Skriv dit navn.";
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v("email"))) errs.email = "Skriv en gyldig e-mailadresse.";
    if (mode === "appointment" && v("phone").replace(/\D/g, "").length < 8) errs.phone = "Skriv et telefonnummer med mindst 8 cifre.";
    if (!fd.get("consent")) errs.consent = "Sæt flueben for at vi må bruge dine oplysninger til at svare dig.";
    if (variant === "rolex" && mode === "appointment" && !fd.get("availability")) errs.availability = "Bekræft at du har læst om tilgængelighed.";
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setState("sending");
    try {
      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...Object.fromEntries(fd.entries()), mode, variant, subject }),
      });
      setState(res.ok ? "sent" : "failed");
    } catch {
      setState("failed");
    }
  }

  if (state === "sent") {
    return (
      <div className="ok" role="status">
        {variant === "rolex" ? (
          <p><strong>Tak for din interesse i Rolex-ure.</strong> Din henvendelse er sendt, og en af vores medarbejdere vender tilbage hurtigst muligt. Du modtager en kopi på e-mail.</p>
        ) : (
          <p><strong>Tak for din henvendelse.</strong> Vi har modtaget den og vender tilbage hurtigst muligt. Du modtager en kopi på e-mail.</p>
        )}
      </div>
    );
  }

  const err = (k: string) => errors[k] && <span className="err" id={`err-${k}`}>{errors[k]}</span>;
  const inv = (k: string) => (errors[k] ? { "aria-invalid": true as const, "aria-describedby": `err-${k}` } : {});

  return (
    <div className="stack">
      <div className="cta-row" role="tablist" aria-label="Vælg type henvendelse">
        <button type="button" role="tab" aria-selected={mode === "appointment"} className={`btn${mode === "appointment" ? "" : " ghost"}`} onClick={() => setMode("appointment")}>Book en tid</button>
        <button type="button" role="tab" aria-selected={mode === "message"} className={`btn${mode === "message" ? "" : " ghost"}`} onClick={() => setMode("message")}>Send en besked</button>
      </div>
      <form className="book" onSubmit={onSubmit} noValidate>
        {mode === "appointment" && (
          <>
            <label className="full" htmlFor="f-purpose">Hvad drejer det sig om?
              <select id="f-purpose" name="purpose" defaultValue={variant === "rolex" ? "Rolex" : defaultPurpose} {...inv("purpose")}>
                <option value="">Vælg</option>
                {PURPOSES.map((p) => <option key={p}>{p}</option>)}
              </select>
              {err("purpose")}
            </label>
            {variant === "rolex" && (
              <label className="check full" htmlFor="f-availability">
                <input id="f-availability" name="availability" type="checkbox" {...inv("availability")} />
                <span>Jeg har læst, at Rolex-ure fremstilles i begrænset antal, og at modellerne ikke altid er tilgængelige i butikken. (Tekst leveres af Rolex.)</span>
                {err("availability")}
              </label>
            )}
            <label htmlFor="f-date">Dato
              <input id="f-date" name="date" type="date" min={today} max={maxDate} {...inv("date")} />
              {err("date")}
            </label>
            <label htmlFor="f-time">Tidspunkt
              <select id="f-time" name="time" defaultValue="" {...inv("time")}>
                <option value="">Vælg</option>
                {TIMES.map((t) => <option key={t}>{t}</option>)}
              </select>
              {err("time")}
            </label>
          </>
        )}
        <label htmlFor="f-name">Navn
          <input id="f-name" name="name" autoComplete="name" {...inv("name")} />
          {err("name")}
        </label>
        <label htmlFor="f-phone">Telefon{mode === "message" && " (valgfri)"}
          <input id="f-phone" name="phone" type="tel" autoComplete="tel" {...inv("phone")} />
          {err("phone")}
        </label>
        <label className="full" htmlFor="f-email">E-mail
          <input id="f-email" name="email" type="email" autoComplete="email" {...inv("email")} />
          {err("email")}
        </label>
        <label className="full" htmlFor="f-message">{mode === "message" ? "Besked" : "Besked (valgfri)"}
          <textarea id="f-message" name="message" rows={4} defaultValue={subject ? `Jeg er interesseret i ${subject}.` : ""} {...inv("message")} />
          {err("message")}
        </label>
        <label className="hp" aria-hidden="true">Udfyld ikke dette felt<input name="website" tabIndex={-1} autoComplete="off" /></label>
        <label className="check full" htmlFor="f-consent">
          <input id="f-consent" name="consent" type="checkbox" {...inv("consent")} />
          <span>Jeg accepterer, at Knud Pedersen bruger mine oplysninger til at svare på min henvendelse. Læs <Link href="/privatlivspolitik">privatlivspolitikken</Link>.</span>
        </label>
        {err("consent")}
        {state === "failed" && <p className="err full" role="alert">Vi kunne ikke sende din henvendelse. Prøv igen, eller ring på 86 12 17 99.</p>}
        <div className="full">
          <button className="btn" type="submit" disabled={state === "sending"}>{state === "sending" ? "Sender…" : mode === "appointment" ? "Book tid" : "Send besked"}</button>
        </div>
      </form>
    </div>
  );
}
