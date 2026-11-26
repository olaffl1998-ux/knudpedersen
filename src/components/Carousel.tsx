"use client";

import { useRef } from "react";

/** Vandret karrusel med pile. Kan også scrolles/swipes; ingen automatisk bevægelse. */
export default function Carousel({ title, children, action }: { title: string; children: React.ReactNode; action?: React.ReactNode }) {
  const ref = useRef<HTMLUListElement>(null);
  const go = (d: number) => ref.current?.scrollBy({ left: d * ref.current.clientWidth * 0.8, behavior: "smooth" });
  return (
    <div className="carousel">
      <div className="section-head">
        <div><span className="label">Udvalgt</span><h2>{title}</h2></div>
        <div className="btn-row" style={{ alignItems: "center" }}>
          {action}
          <div className="carousel__nav">
            <button type="button" onClick={() => go(-1)} aria-label="Forrige">←</button>
            <button type="button" onClick={() => go(1)} aria-label="Næste">→</button>
          </div>
        </div>
      </div>
      <ul className="carousel__track" ref={ref} tabIndex={0} aria-label={title}>{children}</ul>
    </div>
  );
}
