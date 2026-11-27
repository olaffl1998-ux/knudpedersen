"use client";

import Link from "next/link";
import { useState } from "react";

/** Tilmelding til nyhedsbrev. Samtykkefeltet er aldrig forudafkrydset (GDPR). */
export default function Newsletter({ dark = false, id = "nyhedsbrev" }: { dark?: boolean; id?: string }) {
  const [email, setEmail] = useState("");
  const [ok, setOk] = useState(false);
  const [consent, setConsent] = useState(false);
  const [err, setErr] = useState<{ email?: string; consent?: string }>({});
  const [state, setState] = useState<"idle" | "sending" | "done" | "failed">("idle");

  if (state === "done") return <p role="status">Tak, du er nu tilmeldt nyhedsbrevet. Du kan altid afmelde dig igen.</p>;

  return (
    <form noValidate onSubmit={async (e) => {
      e.preventDefault();
      const er: typeof err = {};
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) er.email = "Skriv en gyldig e-mailadresse.";
      if (!consent) er.consent = "Sæt flueben for at give samtykke.";
      setErr(er);
      if (Object.keys(er).length) return;
      setState("sending");
      try {
        const r = await fetch("/api/newsletter", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, consent }) });
        setState(r.ok ? "done" : "failed");
      } catch { setState("failed"); }
      setOk(true);
    }}>
      <div className="field">
        <label htmlFor={`${id}-email`}>E-mailadresse</label>
        <div className="row">
          <input id={`${id}-email`} type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} aria-invalid={!!err.email || undefined} aria-describedby={err.email ? `${id}-email-err` : undefined} />
          <button className={dark ? "btn btn--light" : "btn"} type="submit" disabled={state === "sending"}>Tilmeld</button>
        </div>
        {err.email && <p className="error" id={`${id}-email-err`}>{err.email}</p>}
      </div>
      <div className="check">
        <input id={`${id}-consent`} type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} aria-describedby={err.consent ? `${id}-consent-err` : undefined} />
        <label htmlFor={`${id}-consent`}>Ja tak, Knud Pedersen må sende mig nyheder om ure, smykker og arrangementer på e-mail. Jeg kan altid afmelde mig. Læs <Link href="/privatlivspolitik">privatlivspolitikken</Link>.</label>
        {err.consent && <p className="error" id={`${id}-consent-err`}>{err.consent}</p>}
      </div>
      {ok && state === "failed" && <p className="error" role="alert">Tilmeldingen gik ikke igennem. Prøv igen senere.</p>}
    </form>
  );
}
