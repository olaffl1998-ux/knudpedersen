"use client";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { StrapSvg, WatchSvg } from "./WatchArt";
/**
 * Lænke-/rem-vælger: uret står i midten på den valgte rem, og de andre kompatible
 * remme og lænker ligger på hver side. Klik, pile eller swipe skifter.
 */
export default function StrapPicker({ model, straps, brandName }) {
    const [sel, setSel] = useState(0);
    const [offset, setOffset] = useState(0);
    const boxRef = useRef(null);
    const trackRef = useRef(null);
    const touchX = useRef(null);
    const others = straps.map((s, i) => ({ s, i })).filter((o) => o.i !== sel);
    const half = Math.ceil(others.length / 2);
    const left = others.slice(0, half);
    const right = others.slice(half);
    const measure = useCallback(() => {
        const box = boxRef.current, track = trackRef.current;
        if (!box || !track || !track.children[0])
            return;
        const slotW = track.children[0].getBoundingClientRect().width;
        const vw = box.getBoundingClientRect().width;
        setOffset(Math.round(vw / 2 - slotW * (left.length + 0.5)));
    }, [left.length]);
    useLayoutEffect(measure, [measure, sel]);
    useEffect(() => {
        window.addEventListener("resize", measure);
        return () => window.removeEventListener("resize", measure);
    }, [measure]);
    const go = (i) => setSel(Math.max(0, Math.min(straps.length - 1, i)));
    const current = straps[sel];
    return (<div>
      <div className="picker" ref={boxRef} onTouchStart={(e) => (touchX.current = e.touches[0].clientX)} onTouchEnd={(e) => {
            if (touchX.current === null)
                return;
            const dx = e.changedTouches[0].clientX - touchX.current;
            if (Math.abs(dx) > 40)
                go(dx < 0 ? sel + 1 : sel - 1);
            touchX.current = null;
        }}>
        <div className="track" ref={trackRef} style={{ transform: `translateX(${offset}px)` }}>
          {left.map(({ s, i }) => (<button key={s.key} type="button" className="slot" onClick={() => go(i)} aria-label={`Vis uret på ${s.name}`}>
              <StrapSvg strap={s}/>
            </button>))}
          <div className="slot is-watch" aria-live="polite">
            {model.image ? (
        <img src={model.image} alt={`${brandName} ${model.name} ${model.ref}`}/>) : (<WatchSvg model={model} strap={current}/>)}
          </div>
          {right.map(({ s, i }) => (<button key={s.key} type="button" className="slot" onClick={() => go(i)} aria-label={`Vis uret på ${s.name}`}>
              <StrapSvg strap={s}/>
            </button>))}
        </div>
        <div className="pick-nav">
          <button type="button" onClick={() => go(sel - 1)} disabled={sel === 0} aria-label="Forrige rem">‹</button>
          <span>{sel + 1} / {straps.length}</span>
          <button type="button" onClick={() => go(sel + 1)} disabled={sel === straps.length - 1} aria-label="Næste rem">›</button>
        </div>
      </div>

      <div className="strap-info">
        <div>
          <p className="label">Valgt rem eller lænke</p>
          <h2 style={{ fontSize: "1.25rem" }}>{current.name}</h2>
        </div>
        <p className="note">
          {sel === 0
            ? `Uret leveres på denne ${current.type === "steel" || current.type === "bicolor" ? "lænke" : "rem"}, som vist på billedet.`
            : `${current.material}. ${brandName} tilbyder også denne type til kollektionen. Vi bekræfter pasformen, når du besøger os.`}
        </p>
      </div>
      <div className="chips" role="group" aria-label="Vælg rem eller lænke">
        {straps.map((s, i) => {
            const dot = s.type === "steel" ? "#C9CCD0" : s.type === "bicolor" ? "linear-gradient(90deg,#C9CCD0 50%,#C9A55A 50%)" : s.color;
            return (<button key={s.key} type="button" className="chip" aria-pressed={i === sel} onClick={() => go(i)}>
              <i style={{ background: dot }}/>
              {s.name}
            </button>);
        })}
      </div>
    </div>);
}
