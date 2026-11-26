"use client";
import { useEffect, useState } from "react";
import { business } from "@/lib/site";
const DAY = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
/** "Åbent i dag 10.00–17.30" ud fra dansk tid. Vises først i browseren, så den altid er korrekt. */
export function todayText(now = new Date()) {
    const dk = new Date(now.toLocaleString("en-US", { timeZone: "Europe/Copenhagen" }));
    const d = DAY[dk.getDay()];
    const o = business.openingHours.find((h) => h.days.includes(d));
    if (!o)
        return "Lukket i dag";
    const mins = dk.getHours() * 60 + dk.getMinutes();
    const [oh, om] = o.opens.split(":").map(Number);
    const [ch, cm] = o.closes.split(":").map(Number);
    const range = `${o.opens.replace(":", ".")}–${o.closes.replace(":", ".")}`;
    if (mins < oh * 60 + om)
        return `Åbner i dag kl. ${o.opens.replace(":", ".")}`;
    if (mins >= ch * 60 + cm)
        return `Lukket for i dag (åbent ${range})`;
    return `Åbent i dag ${range}`;
}
export function OpeningToday() {
    const [t, setT] = useState("");
    useEffect(() => setT(todayText()), []);
    return <span suppressHydrationWarning>{t || "Se åbningstider"}</span>;
}
