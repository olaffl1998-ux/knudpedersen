"use client";
import Link from "@/lib/next/link";
import { Suspense, lazy, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { showroomBrands, zoneLabels } from "@/data/brands";
import { layout } from "./geometry";
// 3D-scenen hentes som en separat pakke, så resten af forsiden ikke venter på den
const ShowroomScene = lazy(() => import("./ShowroomScene"));
const ZONES = ["rolex-tudor", "ure", "smykker"];
const READY_TIMEOUT = 8000;
function hasWebGL() {
    try {
        const c = document.createElement("canvas");
        return !!(window.WebGLRenderingContext && (c.getContext("webgl2") || c.getContext("webgl")));
    }
    catch {
        return false;
    }
}
/** 2D-visningen: Rolex- og Tudor-plaketter øverst, derefter ure og smykker i et grid */
function BrandList({ plaque }) {
    return (<div className="showroom__list">
      <ul className="brand-official">
        <li><Link href="/rolex/discover" aria-label="Rolex, officiel forhandler"><img src={plaque} alt="Officiel Rolex-forhandler" width={120} height={60}/></Link></li>
        <li><Link href="/maerker/tudor" className="brand-official__tudor"><strong>Tudor</strong><small>Officiel forhandler</small></Link></li>
      </ul>
      {["ure", "smykker"].map((z) => (<div key={z} className="brand-group">
          <span className="label">{zoneLabels[z]}</span>
          <ul className="hp-brand-grid">
            {showroomBrands.filter((b) => b.zone === z).map((b) => (<li key={b.slug}><Link href={b.href}><span className="bn">{b.name}</span><span className="ba" aria-hidden="true">→</span></Link></li>))}
          </ul>
        </div>))}
    </div>);
}
export default function BrandShowroom({ plaque }) {
    const brands = showroomBrands;
    const { slots, zoneAngles } = useMemo(() => layout(brands), [brands]);
    const ring = useMemo(() => slots.map((s) => s.index), [slots]);
    const [mode, setMode] = useState("loading");
    const [can3d, setCan3d] = useState(false);
    const [ready, setReady] = useState(false);
    const [active, setActive] = useState(null);
    const [hover, setHover] = useState(null);
    const [lookAngle, setLookAngle] = useState(null);
    const [mobile, setMobile] = useState(false);
    const [current, setCurrent] = useState(ring[0] ?? 0);
    const stage = useRef(null);
    const touchX = useRef(null);
    // Start med det samme: tjek WebGL og reduceret bevægelse, ellers vis listen
    useEffect(() => {
        const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        const ok = hasWebGL() && !reduced;
        setCan3d(ok);
        setMobile(window.matchMedia("(max-width: 767px)").matches);
        setMode(ok ? "3d" : "list");
    }, []);
    // Hvis scenen ikke er klar efter 8 sekunder, vises listen i stedet
    useEffect(() => {
        if (mode !== "3d" || ready)
            return;
        const t = window.setTimeout(() => setMode((m) => (m === "3d" && !ready ? "list" : m)), READY_TIMEOUT);
        return () => window.clearTimeout(t);
    }, [mode, ready]);
    const open = useCallback((i) => {
        setActive(i);
        setCurrent(i);
        // Mobil: sørg for at hele scenen og bottom sheet'et er synligt
        if (window.matchMedia("(max-width: 767px)").matches)
            stage.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, []);
    const close = useCallback(() => {
        setActive((a) => {
            if (a != null) {
                const s = slots.find((x) => x.index === a);
                if (s)
                    setLookAngle(s.angle);
            }
            return null;
        });
    }, [slots]);
    const step = useCallback((d) => {
        const from = active ?? current;
        const k = ring.indexOf(from);
        const next = ring[(k + d + ring.length) % ring.length];
        if (active != null)
            open(next);
        else
            setCurrent(next);
    }, [active, current, ring, open]);
    const goZone = (z) => {
        setActive(null);
        setLookAngle(zoneAngles[z] + Math.random() * 1e-6);
        if (mobile) {
            const first = slots.find((s) => s.brand.zone === z);
            if (first)
                setCurrent(first.index);
        }
    };
    useEffect(() => {
        if (active == null)
            return;
        const k = (e) => {
            if (e.key === "Escape")
                close();
            if (e.key === "ArrowRight")
                step(1);
            if (e.key === "ArrowLeft")
                step(-1);
        };
        window.addEventListener("keydown", k);
        return () => window.removeEventListener("keydown", k);
    }, [active, close, step]);
    const b = active != null ? brands[active] : null;
    const count = brands.length;
    return (<section className="hp-section showroom" aria-labelledby="maerker-h">
      <div className="container">
        <div className="hp-head hp-head--center">
          <span className="label">Mærker</span>
          <h2 id="maerker-h">{count} mærker under ét tag</h2>
          <p className="showroom__intro">Gå på opdagelse i vores vitriner – klik på et mærke for at se mere.</p>
          <Link className="link-arrow" href="/maerker">Alle mærker</Link>
        </div>
      </div>

      {mode !== "list" && (<div className={`showroom__stage${ready ? " is-ready" : ""}${b ? " has-panel" : ""}`} ref={stage} onTouchStart={(e) => { touchX.current = e.touches[0].clientX; }} onTouchEnd={(e) => {
                if (!mobile || touchX.current == null || active != null)
                    return;
                const dx = e.changedTouches[0].clientX - touchX.current;
                if (Math.abs(dx) > 40)
                    step(dx < 0 ? 1 : -1);
                touchX.current = null;
            }}>
          {can3d && (<Suspense fallback={null}>
              <ShowroomScene brands={brands} active={active} hover={hover} lookAngle={lookAngle} mobile={mobile} current={current} onHover={setHover} onSelect={open} onReady={() => setReady(true)}/>
            </Suspense>)}
          {!ready && <div className="showroom__loader" role="status"><span className="sr-only">Indlæser showroom</span><i /></div>}

          {/* Mærkerne som rigtig HTML: kan nås med tastaturet og findes af søgemaskiner */}
          <ul className="showroom__keys" aria-label="Mærker i showroomet">
            {slots.map((s) => (<li key={s.brand.slug}>
                <button type="button" aria-label={`${s.brand.name}, ${zoneLabels[s.brand.zone]}. Åbn vitrinen`} onFocus={() => { setHover(s.index); if (active == null) {
                setLookAngle(s.angle);
                setCurrent(s.index);
            } }} onBlur={() => setHover(null)} onClick={() => open(s.index)}>{s.brand.name}</button>
              </li>))}
          </ul>

          {mobile && active == null && ready && (<div className="showroom__swipe">
              <button type="button" onClick={() => step(-1)} aria-label="Forrige mærke">←</button>
              <button type="button" className="showroom__current" onClick={() => open(current)}>{brands[current]?.name}<small>Tryk for at se mere</small></button>
              <button type="button" onClick={() => step(1)} aria-label="Næste mærke">→</button>
            </div>)}

          <aside className={`showroom__panel${b ? " is-open" : ""}`} aria-hidden={!b} aria-label={b ? `Om ${b.name}` : undefined}>
            {b && (<>
                <button type="button" className="showroom__close" onClick={close}>Luk <span aria-hidden="true">✕</span></button>
                <span className="label">{zoneLabels[b.zone]}</span>
                <h3>{b.name}</h3>
                {b.official && <p className="showroom__official">Officiel forhandler</p>}
                <p>{b.description}</p>
                {b.product && <p className="showroom__product"><small>I vitrinen</small>{b.product}</p>}
                <div className="hp-actions">
                  <Link className="btn" href={b.href}>Se alle {b.name}</Link>
                  <Link className="link-arrow" href={`/book-tid?maerke=${b.slug}`}>Book tid i butikken</Link>
                </div>
                <div className="showroom__arrows">
                  <button type="button" onClick={() => step(-1)} aria-label="Forrige mærke">←</button>
                  <button type="button" onClick={() => step(1)} aria-label="Næste mærke">→</button>
                </div>
              </>)}
          </aside>

          <div className="showroom__bar">
            <nav aria-label="Zoner">
              {ZONES.map((z, i) => (<span key={z}>{i > 0 && <i aria-hidden="true">·</i>}<button type="button" onClick={() => goZone(z)}>{zoneLabels[z]}</button></span>))}
            </nav>
            <button type="button" className="showroom__toggle" onClick={() => { setActive(null); setMode("list"); }}>Vis som liste</button>
          </div>
        </div>)}

      {mode === "list" && (<div className="container">
          <BrandList plaque={plaque}/>
          {can3d && <p className="showroom__back"><button type="button" className="link-arrow" onClick={() => setMode("3d")}>Vis 3D-showroom</button></p>}
        </div>)}
    </section>);
}
