"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

/** Sammenlign op til 3 ure. Gemmes i browseren (kun model-nøgler). Rolex er ikke med (Rolex' egne regler). */
const KEY = "kp-compare-v1";
const EVT = "kp-compare";
export const COMPARE_MAX = 3;

export function readCompare(): string[] {
  try { return JSON.parse(localStorage.getItem(KEY) || "[]"); } catch { return []; }
}
export function writeCompare(ids: string[]) {
  try { localStorage.setItem(KEY, JSON.stringify(ids.slice(0, COMPARE_MAX))); } catch {}
  window.dispatchEvent(new Event(EVT));
}
export function useCompare() {
  const [ids, setIds] = useState<string[]>([]);
  useEffect(() => {
    const sync = () => setIds(readCompare());
    sync();
    window.addEventListener(EVT, sync);
    window.addEventListener("storage", sync);
    return () => { window.removeEventListener(EVT, sync); window.removeEventListener("storage", sync); };
  }, []);
  const toggle = (id: string) => {
    const cur = readCompare();
    if (cur.includes(id)) return writeCompare(cur.filter((x) => x !== id));
    writeCompare([...cur, id].slice(-COMPARE_MAX));
  };
  return { ids, toggle, has: (id: string) => ids.includes(id), clear: () => writeCompare([]) };
}

export function CompareButton({ id, label, big = false }: { id: string; label: string; big?: boolean }) {
  const { has, toggle } = useCompare();
  const on = has(id);
  return (
    <button type="button" className={`cmp-btn${big ? " cmp-btn--big" : ""}`} aria-pressed={on} aria-label={on ? `Fjern ${label} fra sammenligning` : `Sammenlign ${label}`} onClick={() => toggle(id)}>
      <svg viewBox="0 0 20 20" aria-hidden="true"><rect x="2.5" y="4" width="6" height="12" rx="1" /><rect x="11.5" y="4" width="6" height="12" rx="1" /></svg>
      <span>{on ? "Valgt" : "Sammenlign"}</span>
    </button>
  );
}

/** Bjælke i bunden, når man har valgt ure til sammenligning */
export function CompareBar() {
  const { ids, clear } = useCompare();
  if (!ids.length) return null;
  return (
    <div className="cmp-bar" role="region" aria-label="Sammenlign ure">
      <span><strong>{ids.length}</strong> af {COMPARE_MAX} ure valgt{ids.length < 2 ? ". Vælg mindst ét mere" : ""}</span>
      <span className="cmp-bar__btns">
        <button type="button" className="linklike" onClick={clear}>Ryd</button>
        {ids.length >= 2 ? <Link className="btn btn--sm" href="/sammenlign">Sammenlign nu</Link> : <span className="btn btn--sm is-disabled" aria-disabled="true">Sammenlign nu</span>}
      </span>
    </div>
  );
}
