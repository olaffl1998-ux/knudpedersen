"use client";
import { useEffect, useState } from "react";
import { business } from "@/lib/site";
const DAY = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const DA = ["søndag", "mandag", "tirsdag", "onsdag", "torsdag", "fredag", "lørdag"];
const EN = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const hoursFor = (dow) => business.openingHours.find((h) => h.days.includes(DAY[dow]));
const toMin = (t) => { const [h, m] = t.split(":").map(Number); return h * 60 + m; };
const fmt = (t, en) => (en ? t : t.replace(":", "."));
/** Åbent nu / lukket ud fra dansk tid og åbningstiderne i site.ts. */
export function openStatus(now = new Date(), en = false) {
    const dk = new Date(now.toLocaleString("en-US", { timeZone: "Europe/Copenhagen" }));
    const dow = dk.getDay();
    const mins = dk.getHours() * 60 + dk.getMinutes();
    const o = hoursFor(dow);
    if (o && mins >= toMin(o.opens) && mins < toMin(o.closes)) {
        const soon = toMin(o.closes) - mins <= 30;
        return { open: true, text: en ? `Open now${soon ? ", closing soon" : ""} · closes at ${fmt(o.closes, en)}` : `Åbent nu · lukker kl. ${fmt(o.closes, en)}${soon ? " (snart)" : ""}` };
    }
    if (o && mins < toMin(o.opens))
        return { open: false, text: en ? `Closed · opens today at ${fmt(o.opens, en)}` : `Lukket · åbner i dag kl. ${fmt(o.opens, en)}` };
    for (let i = 1; i <= 7; i++) {
        const d = (dow + i) % 7;
        const n = hoursFor(d);
        if (!n)
            continue;
        const when = i === 1 ? (en ? "tomorrow" : "i morgen") : (en ? EN[d] : DA[d]);
        return { open: false, text: en ? `Closed · opens ${when} at ${fmt(n.opens, en)}` : `Lukket · åbner ${when} kl. ${fmt(n.opens, en)}` };
    }
    return { open: false, text: en ? "Closed" : "Lukket" };
}
/** Kort tekst til topbjælken */
export function todayText(now = new Date()) { return openStatus(now).text; }
/** Lille mærke med grøn/grå prik. Beregnes i browseren, så det altid passer. */
export function OpenNow({ en = false, className = "" }) {
    const [s, setS] = useState(null);
    useEffect(() => {
        const tick = () => setS(openStatus(new Date(), en));
        tick();
        const t = setInterval(tick, 60_000);
        return () => clearInterval(t);
    }, [en]);
    return (<span className={`open-now ${s ? (s.open ? "is-open" : "is-closed") : ""} ${className}`} suppressHydrationWarning>
      <i aria-hidden="true"/>{s ? s.text : en ? "See opening hours" : "Se åbningstider"}
    </span>);
}
export function OpeningToday() { return <OpenNow />; }
