"use client";
import { useEffect, useRef, useState } from "react";
/** Vandret karrusel med pile og en tynd fremdriftslinje. Kan også swipes; ingen automatisk bevægelse. */
export default function Carousel({ title, eyebrow = "Udvalgt", children, action }) {
    const ref = useRef(null);
    const [pos, setPos] = useState({ start: true, end: false, p: 0, w: 1 });
    useEffect(() => {
        const el = ref.current;
        if (!el)
            return;
        const on = () => {
            const max = el.scrollWidth - el.clientWidth;
            setPos({ start: el.scrollLeft <= 2, end: el.scrollLeft >= max - 2, p: max > 0 ? el.scrollLeft / max : 1, w: el.scrollWidth > 0 ? el.clientWidth / el.scrollWidth : 1 });
        };
        on();
        el.addEventListener("scroll", on, { passive: true });
        window.addEventListener("resize", on);
        return () => { el.removeEventListener("scroll", on); window.removeEventListener("resize", on); };
    }, []);
    const go = (d) => ref.current?.scrollBy({ left: d * ref.current.clientWidth * 0.8, behavior: "smooth" });
    return (<div className="carousel">
      <div className="section-head">
        <div><span className="label">{eyebrow}</span><h2>{title}</h2></div>
        <div className="carousel__actions">
          {action}
          <div className="carousel__nav">
            <button type="button" onClick={() => go(-1)} aria-label="Forrige" disabled={pos.start}>←</button>
            <button type="button" onClick={() => go(1)} aria-label="Næste" disabled={pos.end}>→</button>
          </div>
        </div>
      </div>
      <ul className="carousel__track" ref={ref} tabIndex={0} aria-label={title}>{children}</ul>
      <div className="carousel__progress" aria-hidden="true"><span style={{ width: `${Math.max(8, pos.w * 100)}%`, left: `${pos.p * (100 - Math.max(8, pos.w * 100))}%` }}/></div>
    </div>);
}
