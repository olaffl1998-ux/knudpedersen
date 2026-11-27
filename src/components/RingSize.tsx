"use client";

import { useState } from "react";

/** Dansk/europæisk ringstørrelse = indvendig omkreds i mm. US og UK er omtrentlige. */
export const usOf = (c: number) => Math.round(((c - 36.5) / 2.55) * 4) / 4;
export function ukOf(c: number) {
  const idx = 2 * ((c - 36.5) / 2.55) - 0.5; // A = 0
  const r = Math.round(idx * 2) / 2;
  if (r < 0 || r > 25.5) return "–";
  return String.fromCharCode(65 + Math.floor(r)) + (r % 1 ? "½" : "");
}
export const diaOf = (c: number) => (c / Math.PI).toFixed(1).replace(".", ",");

export function RingCalculator() {
  const [mode, setMode] = useState<"d" | "c">("d");
  const [v, setV] = useState("");
  const n = parseFloat(v.replace(",", "."));
  const c = !n ? null : mode === "d" ? n * Math.PI : n;
  const size = c && c > 38 && c < 80 ? Math.round(c) : null;
  return (
    <div className="ring-calc">
      <div className="ring-calc__tabs" role="tablist" aria-label="Hvad har du målt?">
        <button type="button" role="tab" aria-selected={mode === "d"} onClick={() => setMode("d")}>Jeg har en ring</button>
        <button type="button" role="tab" aria-selected={mode === "c"} onClick={() => setMode("c")}>Jeg har målt fingeren</button>
      </div>
      <label htmlFor="ring-v">{mode === "d" ? "Ringens indvendige diameter i mm" : "Fingerens omkreds i mm"}</label>
      <input id="ring-v" inputMode="decimal" value={v} onChange={(e) => setV(e.target.value)} placeholder={mode === "d" ? "fx 17,2" : "fx 54"} />
      <p className="ring-calc__out" aria-live="polite">
        {size ? <>Din størrelse er <strong>{size}</strong><span>US {usOf(size)} · UK {ukOf(size)}</span></> : v ? "Tjek tallet. Det skal være i millimeter." : "Skriv et mål, så finder vi størrelsen."}
      </p>
    </div>
  );
}

export function PrintButton() {
  return <button type="button" className="btn" onClick={() => window.print()}>Print ringmåleren</button>;
}
