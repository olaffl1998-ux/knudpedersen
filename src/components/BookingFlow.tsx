"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { business } from "@/lib/site";

type Brand = { slug: string; name: string };
const PURPOSES = [
  { key: "ur", label: "Se eller prøve et ur" },
  { key: "smykker", label: "Smykker" },
  { key: "vielsesringe", label: "Vielsesringe" },
  { key: "service", label: "Service eller reparation" },
  { key: "andet", label: "Andet" },
];
const STEPS = ["Formål", "Mærke", "Dato og tid", "Dine oplysninger"];
const iso = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function slots(d: Date) {
  const o = business.openingHours.find((h) => (h.days as readonly string[]).includes(DAYS[d.getDay()]));
  if (!o) return [];
  const open = parseInt(o.opens), close = parseInt(o.closes);
  return Array.from({ length: Math.max(0, close - open) }, (_, i) => `${String(open + i).padStart(2, "0")}:00`).filter((t) => parseInt(t) + 1 <= close + (o.closes.endsWith("30") ? 0.5 : 0));
}

function icsFile(date: string, time: string, title: string) {
  const [y, m, d] = date.split("-").map(Number);
  const h = parseInt(time);
  const p = (n: number) => String(n).padStart(2, "0");
  const dt = (hh: number) => `${y}${p(m)}${p(d)}T${p(hh)}0000`;
  const body = [
    "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Knud Pedersen//Booking//DA", "BEGIN:VEVENT",
    `UID:${Date.now()}@knudpedersen.dk`, `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, "").slice(0, 15)}Z`,
    `DTSTART;TZID=Europe/Copenhagen:${dt(h)}`, `DTEND;TZID=Europe/Copenhagen:${dt(h + 1)}`,
    `SUMMARY:${title}`, `LOCATION:${business.legalName}\\, ${business.street}\\, ${business.postalCode} ${business.city}`,
    "DESCRIPTION:Forespurgt møde. Knud Pedersen bekræfter tiden på e-mail.", "END:VEVENT", "END:VCALENDAR",
  ].join("\r\n");
  return URL.createObjectURL(new Blob([body], { type: "text/calendar" }));
}

export default function BookingFlow({ brands }: { brands: Brand[] }) {
  const [step, setStep] = useState(0);
  const [v, setV] = useState<Record<string, string>>({});
  const [err, setErr] = useState<Record<string, string>>({});
  const [state, setState] = useState<"idle" | "sending" | "done" | "failed">("idle");
  const set = (k: string, x: string) => { setV((o) => ({ ...o, [k]: x })); setErr((e) => ({ ...e, [k]: "" })); };

  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const init: Record<string, string> = {};
    if (q.get("formaal") && PURPOSES.some((p) => p.key === q.get("formaal"))) init.purpose = q.get("formaal")!;
    if (q.get("maerke")) { init.brand = brands.find((b) => b.slug === q.get("maerke"))?.name ?? ""; init.purpose ||= "ur"; }
    if (q.get("emne")) init.subject = q.get("emne")!.slice(0, 120);
    setV(init);
    if (init.purpose && init.brand) setStep(2);
    else if (init.purpose) setStep(1);
  }, [brands]);

  const days = useMemo(() => {
    const out: Date[] = [];
    const s = new Date(); s.setHours(0, 0, 0, 0); s.setDate(s.getDate() + 1);
    const e = new Date(s); e.setMonth(e.getMonth() + 3);
    for (const d = new Date(s); d <= e; d.setDate(d.getDate() + 1)) if (slots(d).length) out.push(new Date(d));
    return out;
  }, []);
  const chosen = days.find((d) => iso(d) === v.date);
  const purposeLabel = PURPOSES.find((p) => p.key === v.purpose)?.label ?? "";
  const needsBrand = v.purpose === "ur" || v.purpose === "service";

  const validate = () => {
    const e: Record<string, string> = {};
    if (step === 0 && !v.purpose) e.purpose = "Vælg hvad mødet drejer sig om.";
    if (step === 2) { if (!v.date) e.date = "Vælg en dato."; if (!v.time) e.time = "Vælg et tidspunkt."; }
    if (step === 3) {
      if (!v.name?.trim()) e.name = "Skriv dit navn.";
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v.email || "")) e.email = "Skriv en gyldig e-mailadresse, fx navn@mail.dk.";
      if ((v.phone || "").replace(/\D/g, "").length < 8) e.phone = "Skriv et telefonnummer med mindst 8 cifre.";
      if (v.consent !== "1") e.consent = "Sæt flueben, så vi må bruge dine oplysninger til at bekræfte mødet.";
    }
    setErr(e);
    return !Object.keys(e).length;
  };
  const next = async () => {
    if (!validate()) return;
    if (step === 0 && !needsBrand) return setStep(2);
    if (step < 3) return setStep(step + 1);
    setState("sending");
    try {
      const r = await fetch("/api/booking", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...v, purpose: purposeLabel, mode: "appointment", consent: true }) });
      setState(r.ok ? "done" : "failed");
    } catch { setState("failed"); }
  };

  if (state === "done" && chosen) {
    const title = `Møde hos Knud Pedersen: ${purposeLabel}${v.brand ? ` (${v.brand})` : ""}`;
    return (
      <div className="ok-box" role="status">
        <span className="label">Tak, {v.name}</span>
        <h2>Vi har modtaget din forespørgsel</h2>
        <p>{purposeLabel}{v.brand ? `, ${v.brand}` : ""}, {chosen.toLocaleDateString("da-DK", { weekday: "long", day: "numeric", month: "long" })} kl. {v.time}. Vi bekræfter tiden på e-mail til {v.email}.</p>
        <div className="btn-row">
          <a className="btn" href={icsFile(v.date, v.time, title)} download="knud-pedersen-moede.ics">Føj til kalender</a>
          <Link className="btn btn--outline" href="/">Til forsiden</Link>
        </div>
      </div>
    );
  }

  const fid = (k: string) => ({ id: `b-${k}`, "aria-invalid": !!err[k] || undefined, "aria-describedby": err[k] ? `b-${k}-err` : undefined });
  const E = ({ k }: { k: string }) => (err[k] ? <p className="error" id={`b-${k}-err`}>{err[k]}</p> : null);

  return (
    <form className="form" noValidate onSubmit={(e) => { e.preventDefault(); next(); }}>
      <ol className="steps" aria-label="Trin">
        {STEPS.map((s, i) => <li key={s} className={i < step ? "is-done" : i === step ? "is-current" : ""} aria-current={i === step ? "step" : undefined}>{i + 1}. {s}</li>)}
      </ol>
      {v.subject && <p className="notice">Om: <strong>{v.subject}</strong></p>}

      {step === 0 && (
        <fieldset>
          <legend className="h3" style={{ fontFamily: "var(--font-display)", marginBottom: 16 }}>Hvad drejer mødet sig om?</legend>
          <div className="choice-grid">
            {PURPOSES.map((p) => <label key={p.key} className="choice"><input type="radio" name="purpose" checked={v.purpose === p.key} onChange={() => set("purpose", p.key)} />{p.label}</label>)}
          </div>
          <E k="purpose" />
          <p className="muted" style={{ marginTop: 16 }}>Rolex? Book via <Link href="/rolex/contact-aarhus#book">Rolex-sektionen</Link>.</p>
        </fieldset>
      )}
      {step === 1 && (
        <fieldset>
          <legend className="h3" style={{ fontFamily: "var(--font-display)", marginBottom: 16 }}>Hvilket mærke? (valgfrit)</legend>
          <div className="choice-grid">
            {brands.map((b) => <label key={b.slug} className="choice"><input type="radio" name="brand" checked={v.brand === b.name} onChange={() => set("brand", b.name)} />{b.name}</label>)}
            <label className="choice"><input type="radio" name="brand" checked={v.brand === "Ved ikke endnu"} onChange={() => set("brand", "Ved ikke endnu")} />Ved ikke endnu</label>
          </div>
        </fieldset>
      )}
      {step === 2 && (
        <>
          <div className="field">
            <label htmlFor="b-date">Dato</label>
            <select {...fid("date")} value={v.date || ""} onChange={(e) => { set("date", e.target.value); set("time", ""); }}>
              <option value="">Vælg en dato</option>
              {days.map((d) => <option key={iso(d)} value={iso(d)}>{d.toLocaleDateString("da-DK", { weekday: "long", day: "numeric", month: "long" })}</option>)}
            </select>
            <E k="date" />
          </div>
          {chosen && (
            <fieldset>
              <legend>Tidspunkt (møder af en time)</legend>
              <div className="slots" style={{ marginTop: 8 }}>
                {slots(chosen).map((t) => <label key={t} className="choice" style={{ justifyContent: "center" }}><input type="radio" name="time" checked={v.time === t} onChange={() => set("time", t)} />{t}</label>)}
              </div>
              <E k="time" />
            </fieldset>
          )}
        </>
      )}
      {step === 3 && (
        <>
          <div className={`field${err.name ? " has-error" : ""}`}><label htmlFor="b-name">Navn</label><input {...fid("name")} autoComplete="name" value={v.name || ""} onChange={(e) => set("name", e.target.value)} onBlur={validate} /><E k="name" /></div>
          <div className="form-2">
            <div className={`field${err.email ? " has-error" : ""}`}><label htmlFor="b-email">E-mail</label><input {...fid("email")} type="email" autoComplete="email" value={v.email || ""} onChange={(e) => set("email", e.target.value)} /><E k="email" /></div>
            <div className={`field${err.phone ? " has-error" : ""}`}><label htmlFor="b-phone">Telefon</label><input {...fid("phone")} type="tel" autoComplete="tel" value={v.phone || ""} onChange={(e) => set("phone", e.target.value)} /><E k="phone" /></div>
          </div>
          <div className="field"><label htmlFor="b-message">Besked (valgfrit)</label><textarea id="b-message" value={v.message || ""} onChange={(e) => set("message", e.target.value)} /></div>
          <div className="check">
            <input id="b-consent" type="checkbox" checked={v.consent === "1"} onChange={(e) => set("consent", e.target.checked ? "1" : "")} aria-describedby={err.consent ? "b-consent-err" : undefined} />
            <label htmlFor="b-consent">Knud Pedersen må bruge mine oplysninger til at bekræfte og forberede mødet. Se <Link href="/privatlivspolitik">privatlivspolitikken</Link>.</label>
            <E k="consent" />
          </div>
        </>
      )}
      <div className="btn-row">
        {step > 0 && <button type="button" className="btn btn--outline" onClick={() => setStep(step === 2 && !needsBrand ? 0 : step - 1)}>Tilbage</button>}
        <button type="submit" className="btn" disabled={state === "sending"}>{step < 3 ? "Fortsæt" : state === "sending" ? "Sender…" : "Send forespørgsel"}</button>
      </div>
      {state === "failed" && <p className="error" role="alert">Forespørgslen kunne ikke sendes. Ring på {business.phone}, eller prøv igen.</p>}
    </form>
  );
}
