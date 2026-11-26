"use client";
import { createContext, useContext, useEffect, useState } from "react";
import Link from "@/lib/next/link";
const KEY = "kp-consent-v1";
const ConsentCtx = createContext({ consent: null, save: () => { }, open: () => { } });
export const useConsent = () => useContext(ConsentCtx);
export function ConsentProvider({ children }) {
    const [consent, setConsent] = useState(null);
    const [show, setShow] = useState(false);
    const [custom, setCustom] = useState(false);
    const [draft, setDraft] = useState({ statistics: false, marketing: false, external: false });
    useEffect(() => {
        try {
            const raw = localStorage.getItem(KEY);
            if (raw) {
                setConsent(JSON.parse(raw));
                return;
            }
        }
        catch { /* ignoreres */ }
        setShow(true);
    }, []);
    const save = (c) => {
        setConsent(c);
        setShow(false);
        setCustom(false);
        try {
            localStorage.setItem(KEY, JSON.stringify({ ...c, date: new Date().toISOString() }));
        }
        catch { /* ignoreres */ }
    };
    return (<ConsentCtx.Provider value={{ consent, save, open: () => { setDraft(consent ?? draft); setShow(true); } }}>
      {children}
      {show && (<div className="cookie" role="dialog" aria-label="Cookie-indstillinger">
          <div>
            <h2>Cookies</h2>
            <p> Nødvendige cookies får siden til at virke. Med dit samtykke bruger vi også
              cookies til statistik og marketing, og vi viser indhold fra Google Maps. Du kan altid ændre dit valg nederst på siden.{" "}
              <Link href="/cookiepolitik">Læs cookiepolitikken</Link>.
            </p>
            {custom && (<fieldset>
                <legend className="note">Vælg kategorier</legend>
                <label className="check"><input type="checkbox" checked disabled/> <span>Nødvendige (altid aktive)</span></label>
                <label className="check"><input id="c-stat" type="checkbox" checked={draft.statistics} onChange={(e) => setDraft({ ...draft, statistics: e.target.checked })}/> Statistik</label>
                <label className="check"><input id="c-mark" type="checkbox" checked={draft.marketing} onChange={(e) => setDraft({ ...draft, marketing: e.target.checked })}/> Marketing</label>
                <label className="check"><input id="c-ext" type="checkbox" checked={draft.external} onChange={(e) => setDraft({ ...draft, external: e.target.checked })}/> Eksternt indhold (kort)</label>
              </fieldset>)}
            {/* "Afvis alle" og "Accepter alle" er lige synlige og lige lette at vælge */}
            <div className="btn-row">
              <button className="btn" type="button" onClick={() => save({ statistics: false, marketing: false, external: false })}>Afvis alle</button>
              <button className="btn" type="button" onClick={() => save({ statistics: true, marketing: true, external: true })}>Accepter alle</button>
            </div>
            <p style={{ marginTop: 16, marginBottom: 0 }}>
              {custom ? (<button className="linklike" type="button" onClick={() => save(draft)}>Gem mine valg</button>) : (<button className="linklike" type="button" onClick={() => setCustom(true)}>Tilpas valg</button>)}
            </p>
          </div>
        </div>)}
    </ConsentCtx.Provider>);
}
export function CookieSettingsButton() {
    const { open } = useConsent();
    return <button type="button" className="linklike" onClick={open}>Cookie-indstillinger</button>;
}
/** Viser Google Maps kun efter samtykke til eksternt indhold */
export function MapEmbed({ query, label }) {
    const { consent, save } = useConsent();
    if (consent?.external) {
        return (<iframe title={label} src={`https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed`} style={{ border: 0, width: "100%", aspectRatio: "16/10" }} loading="lazy" referrerPolicy="no-referrer-when-downgrade"/>);
    }
    return (<div className="map" role="img" aria-label={label}>
      <b>Skt. Clemens Torv 6, Aarhus</b>
      <button type="button" className="btn btn--outline" onClick={() => save({ ...(consent ?? { statistics: false, marketing: false }), external: true })}>
        Vis kort (Google Maps sætter cookies)
      </button>
    </div>);
}
