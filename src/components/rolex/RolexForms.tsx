"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { availabilityText, messageIntro } from "@/data/rolex";

type Fields = Record<string, string>;
const emailOk = (v: string) => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v);

async function send(payload: Record<string, unknown>) {
  try {
    const r = await fetch("/api/booking", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    return r.ok;
  } catch {
    return false;
  }
}

function Field({ id, label, error, children }: { id: string; label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className={`rx-field${error ? " err" : ""}`}>
      <label htmlFor={id}>{label}</label>
      {children}
      {error && <p className="rx-error" id={`${id}-fejl`}>{error}</p>}
    </div>
  );
}

/** Kontaktoplysninger, fælles for begge flows */
function Details({ v, set, errors }: { v: Fields; set: (k: string, x: string) => void; errors: Fields }) {
  const a = (k: string) => ({ id: `rx-${k}`, value: v[k] || "", "aria-invalid": !!errors[k] || undefined, "aria-describedby": errors[k] ? `rx-${k}-fejl` : undefined });
  return (
    <>
      <Field id="rx-title" label="Titel">
        <select {...a("title")} onChange={(e) => set("title", e.target.value)}>
          <option value="">Vælg</option><option>Hr.</option><option>Fru</option><option>Frk.</option>
        </select>
      </Field>
      <div className="rx-two">
        <Field id="rx-first" label="Fornavn *" error={errors.first}><input {...a("first")} autoComplete="given-name" onChange={(e) => set("first", e.target.value)} /></Field>
        <Field id="rx-last" label="Efternavn *" error={errors.last}><input {...a("last")} autoComplete="family-name" onChange={(e) => set("last", e.target.value)} /></Field>
      </div>
      <Field id="rx-email" label="E-mailadresse *" error={errors.email}><input {...a("email")} type="email" autoComplete="email" onChange={(e) => set("email", e.target.value)} /></Field>
      <Field id="rx-phone" label="Telefonnummer" error={errors.phone}><input {...a("phone")} type="tel" autoComplete="tel" placeholder="+45" onChange={(e) => set("phone", e.target.value)} /></Field>
      <div className={`rx-check${errors.consent ? " err" : ""}`}>
        <input id="rx-consent" type="checkbox" checked={v.consent === "1"} onChange={(e) => set("consent", e.target.checked ? "1" : "")} aria-describedby={errors.consent ? "rx-consent-fejl" : undefined} />
        <label htmlFor="rx-consent">Jeg har læst og accepterer <Link href="/privatlivspolitik">privatlivspolitikken</Link> og <Link href="/cookiepolitik">cookiepolitikken</Link>. *</label>
        {errors.consent && <p className="rx-error" id="rx-consent-fejl">{errors.consent}</p>}
      </div>
      <div className="rx-check">
        <input id="rx-news" type="checkbox" checked={v.news === "1"} onChange={(e) => set("news", e.target.checked ? "1" : "")} />
        <label htmlFor="rx-news">Jeg vil gerne modtage nyhedsmails fra Knud Pedersen.</label>
      </div>
    </>
  );
}

function checkDetails(v: Fields) {
  const e: Fields = {};
  if (!v.first?.trim()) e.first = "Fornavn skal udfyldes.";
  if (!v.last?.trim()) e.last = "Efternavn skal udfyldes.";
  if (!emailOk(v.email || "")) e.email = "Indtast en gyldig e-mailadresse.";
  if (v.phone && v.phone.replace(/\D/g, "").length < 8) e.phone = "Skriv et telefonnummer med mindst 8 cifre.";
  if (v.consent !== "1") e.consent = "Du skal acceptere betingelserne.";
  return e;
}

function Steps({ n, of, label }: { n: number; of: number; label: string }) {
  return <p className="rx-steps" aria-live="polite">Trin {n} af {of}: {label}</p>;
}

/** Send en besked: besked → oplysninger → bekræftelse */
export function RolexMessage({ subject }: { subject?: string }) {
  const [step, setStep] = useState(1);
  const [v, setV] = useState<Fields>({ message: subject ? `Jeg er interesseret i ${subject}.` : "" });
  const [errors, setErrors] = useState<Fields>({});
  const [state, setState] = useState<"idle" | "sending" | "failed">("idle");
  const set = (k: string, x: string) => setV((o) => ({ ...o, [k]: x }));

  if (step === 3)
    return (
      <div className="rx-ok" role="status">
        <h3>Tak for din besked</h3>
        <p>Tak for din interesse for Rolex ure. Din besked er sendt til Knud Pedersen, og vi vender tilbage hurtigst muligt.</p>
      </div>
    );

  return (
    <form className="rx-form" noValidate onSubmit={async (e) => {
      e.preventDefault();
      if (step === 1) {
        if (!v.message?.trim()) return setErrors({ message: "Besked skal udfyldes." });
        setErrors({}); return setStep(2);
      }
      const errs = checkDetails(v); setErrors(errs);
      if (Object.keys(errs).length) return;
      setState("sending");
      const ok = await send({ ...v, name: `${v.first} ${v.last}`, mode: "message", variant: "rolex", subject, consent: true });
      if (ok) setStep(3); else setState("failed");
    }}>
      <Steps n={step} of={2} label={step === 1 ? "Din besked" : "Dine oplysninger"} />
      {step === 1 ? (
        <>
          <p>{messageIntro}</p>
          <Field id="rx-message" label="Indtast venligst din besked *" error={errors.message}>
            <textarea id="rx-message" rows={6} value={v.message} onChange={(e) => set("message", e.target.value)} aria-invalid={!!errors.message || undefined} aria-describedby={errors.message ? "rx-message-fejl" : undefined} />
          </Field>
          <button className="rx-btn" type="submit">Næste</button>
        </>
      ) : (
        <>
          <Details v={v} set={set} errors={errors} />
          <div className="rx-actions">
            <button className="rx-btn rx-btn-ghost" type="button" onClick={() => setStep(1)}>Tilbage</button>
            <button className="rx-btn" type="submit" disabled={state === "sending"}>{state === "sending" ? "Sender…" : "Send"}</button>
          </div>
          {state === "failed" && <p className="rx-error" role="alert">Beskeden kunne ikke sendes. Ring til os på 86 12 17 99, eller prøv igen.</p>}
        </>
      )}
    </form>
  );
}

const PURPOSES = ["Køb af et Rolex-ur", "Se et bestemt Rolex-ur", "Serviceeftersyn af mit Rolex", "Andet"];

/** Åbningstider → mødetider af én time */
function slotsFor(d: Date) {
  const day = d.getDay();
  if (day === 0) return [];
  const last = day === 6 ? 14 : day === 5 ? 17 : 16;
  return Array.from({ length: last - 10 + 1 }, (_, i) => `${String(10 + i).padStart(2, "0")}:00`);
}
const iso = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

/** Book en tid: formål → tilgængelighed → dato og tid → oplysninger → bekræftelse */
export function RolexAppointment({ subject }: { subject?: string }) {
  const [step, setStep] = useState(1);
  const [v, setV] = useState<Fields>({});
  const [errors, setErrors] = useState<Fields>({});
  const [state, setState] = useState<"idle" | "sending" | "failed">("idle");
  const set = (k: string, x: string) => setV((o) => ({ ...o, [k]: x }));
  const days = useMemo(() => {
    const out: Date[] = [];
    const start = new Date(); start.setHours(0, 0, 0, 0); start.setDate(start.getDate() + 1);
    const end = new Date(start); end.setMonth(end.getMonth() + 6);
    for (const d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) if (slotsFor(d).length) out.push(new Date(d));
    return out;
  }, []);
  const chosen = days.find((d) => iso(d) === v.date);
  const labels = ["Formål", "Tilgængelighed", "Dato og tid", "Dine oplysninger"];

  if (step === 5)
    return (
      <div className="rx-ok" role="status">
        <h3>Tak for din forespørgsel</h3>
        <p>Vi har modtaget dit ønske om et møde {chosen ? `${chosen.toLocaleDateString("da-DK", { weekday: "long", day: "numeric", month: "long" })} kl. ${v.time}` : ""}. Knud Pedersen bekræfter tiden på e-mail.</p>
      </div>
    );

  const next = async () => {
    const e: Fields = {};
    if (step === 1 && !v.purpose) e.purpose = "Vælg formålet med dit besøg.";
    if (step === 2 && v.ack !== "1") e.ack = "Bekræft at du har læst om tilgængelighed.";
    if (step === 3) { if (!v.date) e.date = "Vælg en dato."; if (!v.time) e.time = "Vælg et tidspunkt."; }
    if (step === 4) Object.assign(e, checkDetails(v));
    setErrors(e);
    if (Object.keys(e).length) return;
    if (step < 4) return setStep(step + 1);
    setState("sending");
    const ok = await send({ ...v, name: `${v.first} ${v.last}`, mode: "appointment", variant: "rolex", subject, availability: true, consent: true });
    if (ok) setStep(5); else setState("failed");
  };

  return (
    <form className="rx-form" noValidate onSubmit={(e) => { e.preventDefault(); next(); }}>
      <Steps n={step} of={4} label={labels[step - 1]} />
      {step === 1 && (
        <fieldset className={errors.purpose ? "err" : ""}>
          <legend>Hvad drejer dit besøg sig om? *</legend>
          {PURPOSES.map((p) => (
            <label key={p} className="rx-radio"><input type="radio" name="purpose" checked={v.purpose === p} onChange={() => set("purpose", p)} /> {p}</label>
          ))}
          {errors.purpose && <p className="rx-error">{errors.purpose}</p>}
        </fieldset>
      )}
      {step === 2 && (
        <div>
          <h3>Lagerstatus for modellen</h3>
          {availabilityText.map((t) => <p key={t.slice(0, 20)}>{t}</p>)}
          <div className={`rx-check${errors.ack ? " err" : ""}`}>
            <input id="rx-ack" type="checkbox" checked={v.ack === "1"} onChange={(e) => set("ack", e.target.checked ? "1" : "")} />
            <label htmlFor="rx-ack">Jeg har læst og forstået ovenstående. *</label>
            {errors.ack && <p className="rx-error">{errors.ack}</p>}
          </div>
        </div>
      )}
      {step === 3 && (
        <>
          <Field id="rx-date" label="Dato *" error={errors.date}>
            <select id="rx-date" value={v.date || ""} onChange={(e) => { set("date", e.target.value); set("time", ""); }}>
              <option value="">Vælg en dato</option>
              {days.map((d) => <option key={iso(d)} value={iso(d)}>{d.toLocaleDateString("da-DK", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</option>)}
            </select>
          </Field>
          {chosen && (
            <fieldset className={errors.time ? "err" : ""}>
              <legend>Tidspunkt (møder af én time) *</legend>
              <div className="rx-slots">
                {slotsFor(chosen).map((t) => (
                  <label key={t} className={v.time === t ? "on" : ""}><input type="radio" name="time" checked={v.time === t} onChange={() => set("time", t)} /> {t}</label>
                ))}
              </div>
              {errors.time && <p className="rx-error">{errors.time}</p>}
            </fieldset>
          )}
        </>
      )}
      {step === 4 && <Details v={v} set={set} errors={errors} />}
      <div className="rx-actions">
        {step > 1 && <button className="rx-btn rx-btn-ghost" type="button" onClick={() => setStep(step - 1)}>Tilbage</button>}
        <button className="rx-btn" type="submit" disabled={state === "sending"}>{step < 4 ? "Næste" : state === "sending" ? "Sender…" : "Book tid"}</button>
      </div>
      {state === "failed" && <p className="rx-error" role="alert">Forespørgslen kunne ikke sendes. Ring til os på 86 12 17 99, eller prøv igen.</p>}
    </form>
  );
}

/** Faneblade: Send en besked / Book en tid */
export function RolexContact({ subject, initial = "message" }: { subject?: string; initial?: "message" | "appointment" }) {
  const [tab, setTab] = useState(initial);
  return (
    <div className="rx-contact">
      <div className="rx-tabs" role="tablist">
        <button role="tab" type="button" aria-selected={tab === "message"} onClick={() => setTab("message")}>Send en besked</button>
        <button role="tab" type="button" aria-selected={tab === "appointment"} onClick={() => setTab("appointment")}>Book en tid</button>
      </div>
      <div role="tabpanel">{tab === "message" ? <RolexMessage subject={subject} /> : <RolexAppointment subject={subject} />}</div>
    </div>
  );
}
