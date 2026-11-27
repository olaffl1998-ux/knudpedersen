"use client";
import Link from "@/lib/next/link";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
/**
 * Mærker – "spotlysene tændes".
 * Kun transform og opacity animeres. Rolex- og Tudor-billederne vises uændrede (ingen beskæring, zoom eller effekter på selve billedet).
 */
const countLabel = (b) => b.note ?? (b.count ? `${b.count} ${b.category === "Smykker" ? "smykker" : b.category === "Ure" ? "ure" : "varer"}` : b.category);
export default function BrandShowcase({ featured, grid, total }) {
    const root = useRef(null);
    const [view, setView] = useState("grid");
    // Scroll-animationer, blød scroll og marquee
    useEffect(() => {
        const el = root.current;
        if (!el)
            return;
        gsap.registerPlugin(ScrollTrigger);
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        const mobile = window.matchMedia("(max-width: 767px)").matches;
        el.classList.add("is-js");
        if (reduce) {
            el.classList.add("is-static");
            return;
        }
        const lenis = new Lenis({ duration: 1.1, smoothWheel: true });
        lenis.on("scroll", ScrollTrigger.update);
        const raf = (t) => lenis.raf(t * 1000);
        gsap.ticker.add(raf);
        gsap.ticker.lagSmoothing(0);
        const ctx = gsap.context(() => {
            // 1. Intro: lyset tændes
            const intro = el.querySelector(".bx-intro");
            const tl = gsap.timeline({ scrollTrigger: { trigger: intro, start: "top 75%", once: true } });
            tl.to(".bx-dark", { opacity: 0, duration: 1.4, ease: "power2.inOut" })
                .from(".bx-eyebrow i", { opacity: 0, duration: 0.5, stagger: 0.07 }, "-=0.7")
                .from(".bx-rule", { scaleX: 0, duration: 0.6, ease: "power2.out" }, "<0.2")
                .from(".bx-h1 .w > span", { yPercent: 105, duration: 0.9, ease: "power3.out", stagger: 0.06 }, "<")
                .from(".bx-num", { textContent: 0, duration: 1.2, ease: "power1.out", snap: { textContent: 1 } }, "<")
                .from(".bx-lead, .bx-all", { opacity: 0, y: 12, duration: 0.8, stagger: 0.1 }, "-=0.5");
            // 3. Rolex og Tudor: feltet toner frem (billedet selv røres ikke)
            gsap.utils.toArray(".bx-hero").forEach((h, i) => {
                gsap.from(h, { opacity: 0, y: 40, duration: 1.1, delay: i * 0.12, ease: "power2.out", scrollTrigger: { trigger: h, start: "top 85%", once: true } });
            });
            // 4. Vitrinerne toner ind i en diagonal bølge
            const cols = mobile ? 2 : 4;
            ScrollTrigger.batch(".bx-cell", {
                start: "top 90%", once: true,
                onEnter: (cells) => cells.forEach((c) => {
                    const k = Number(c.dataset.i);
                    gsap.fromTo(c, { opacity: 0, scale: 0.96 }, { opacity: 1, scale: 1, duration: 0.8, ease: "power2.out", delay: mobile ? 0 : ((k % cols) + Math.floor(k / cols)) * 0.05 });
                }),
            });
            gsap.from(".bx-end", { opacity: 0, duration: 1, scrollTrigger: { trigger: ".bx-end", start: "top 90%", once: true } });
        }, el);
        // 2. Marquee: kører langsomt mod venstre, følger scrollens retning og fart
        const track = el.querySelector(".bx-marquee__track");
        const band = el.querySelector(".bx-marquee");
        let x = 0, dir = -1, boost = 0, paused = false;
        const tick = () => {
            if (!track || paused)
                return;
            const dt = gsap.ticker.deltaRatio(60) * (1000 / 60);
            const v = lenis.velocity;
            if (Math.abs(v) > 0.5)
                dir = v > 0 ? -1 : 1;
            boost += (Math.min(Math.abs(v), 40) * 0.12 - boost) * 0.08;
            x += dir * (0.035 + boost * 0.02) * dt;
            const w = track.scrollWidth / 2;
            if (x <= -w)
                x += w;
            if (x > 0)
                x -= w;
            track.style.transform = `translate3d(${x}px,0,0)`;
        };
        gsap.ticker.add(tick);
        const stop = () => { paused = true; }, go = () => { paused = false; };
        band?.addEventListener("pointerenter", stop);
        band?.addEventListener("pointerleave", go);
        return () => {
            ctx.revert();
            gsap.ticker.remove(tick);
            gsap.ticker.remove(raf);
            lenis.destroy();
            band?.removeEventListener("pointerenter", stop);
            band?.removeEventListener("pointerleave", go);
        };
    }, []);
    // Magnetisk "Alle mærker" (kun med mus)
    useEffect(() => {
        const el = root.current;
        if (!el || !window.matchMedia("(hover: hover) and (pointer: fine)").matches || window.matchMedia("(prefers-reduced-motion: reduce)").matches)
            return;
        const mag = el.querySelector(".bx-all");
        const mx = mag && gsap.quickTo(mag, "x", { duration: 0.5, ease: "power3" }), my = mag && gsap.quickTo(mag, "y", { duration: 0.5, ease: "power3" });
        const onMag = (e) => {
            if (!mag || !mx || !my)
                return;
            const r = mag.getBoundingClientRect();
            const dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height / 2);
            const near = Math.abs(dx) < r.width / 2 + 40 && Math.abs(dy) < r.height / 2 + 40;
            mx(near ? dx * 0.25 : 0);
            my(near ? dy * 0.35 : 0);
        };
        window.addEventListener("pointermove", onMag);
        return () => window.removeEventListener("pointermove", onMag);
    }, []);
    const words = ["mærker", "under", "ét", "tag"];
    return (<div ref={root} className="bx">
      <div className="bx-grain" aria-hidden="true"/>

      {/* 1. Intro */}
      <section className="bx-intro">
        <div className="bx-dark" aria-hidden="true"/>
        <div className="container bx-intro__in">
          <div>
            <p className="bx-eyebrow"><span className="sr-only">Mærker</span>{"MÆRKER".split("").map((c, i) => <i key={i} aria-hidden="true">{c}</i>)}</p>
            <span className="bx-rule" aria-hidden="true"/>
            <h1 className="bx-h1">
              <span className="w"><span className="bx-num">{total}</span></span>
              {words.map((w) => <span className="w" key={w}><span>{w}</span></span>)}
            </h1>
            <p className="bx-lead">Vi er autoriseret forhandler af alle mærker i butikken: originale ure og smykker, fuld fabriksgaranti og service efter producentens krav.</p>
          </div>
          <a className="bx-all" href="#vitriner">Alle mærker →</a>
        </div>
      </section>

      {/* 2. Mærkebånd */}
      <div className="bx-marquee" aria-hidden="true">
        <div className="bx-marquee__track">
          {[0, 1].map((k) => (<span className="bx-marquee__set" key={k}>
              {[...featured, ...grid].map((b) => <span key={b.slug} className="bx-mq"><b data-name={b.name}>{b.name}</b><em>♦</em></span>)}
            </span>))}
        </div>
      </div>

      {/* 3. Rolex og Tudor */}
      <section className="container bx-heroes" aria-label="Rolex og Tudor">
        {featured.map((b) => <HeroField key={b.slug} b={b}/>)}
      </section>

      {/* 4./5. Vitrinerne */}
      <section className="container bx-cases" id="vitriner" aria-label="Alle mærker">
        <div className="bx-toggle" role="group" aria-label="Visning">
          <button type="button" aria-pressed={view === "grid"} onClick={() => setView("grid")}>Grid</button>
          <button type="button" aria-pressed={view === "list"} onClick={() => setView("list")}>Liste</button>
        </div>
        {view === "grid" ? <Grid brands={grid}/> : <List brands={grid}/>}
      </section>

      {/* 6. Afslutning */}
      <section className="bx-end">
        <div className="container bx-end__in">
          <p>Kan du ikke finde dit mærke? Vi hjælper gerne i butikken på Skt. Clemens Torv.</p>
          <Link className="btn bx-shimmer" href="/book-tid">Book tid</Link>
        </div>
      </section>
    </div>);
}
function HeroField({ b }) {
    const ref = useRef(null);
    const light = useRef(null);
    const move = (e) => {
        const r = ref.current.getBoundingClientRect();
        light.current.style.transform = `translate3d(${e.clientX - r.left - 300}px,${e.clientY - r.top - 300}px,0)`;
    };
    const h = b.hero;
    return (<Link ref={ref} className="bx-hero" href={b.href} onMouseMove={move} data-see>
      <div className="bx-hero__stage">
        {/* Lyset falder på væggen bag billedet, ikke på selve billedet */}
        <div ref={light} className="bx-hero__light" aria-hidden="true"/>
        {h.video
            ? <video className="bx-hero__media" src={h.video} poster={h.poster} muted playsInline loop preload="none" width={h.width} height={h.height}/>
            : <img className="bx-hero__media" src={h.src} alt={h.alt} width={h.width} height={h.height} loading="eager" decoding="async"/>}
      </div>
      <div className="bx-hero__text">
        <h2>{b.name}</h2>
        <p>Officiel forhandler</p>
        <span className="bx-link">Opdag kollektionen →</span>
      </div>
    </Link>);
}
/** Udvid feltet til fuld skærm og gå videre til mærket */
function expandAndGo(e, name) {
    const a = e.currentTarget;
    if (a.dataset.go || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0 || window.matchMedia("(prefers-reduced-motion: reduce)").matches)
        return;
    e.preventDefault();
    const r = a.getBoundingClientRect();
    const o = document.createElement("div");
    o.className = "bx-expand";
    o.innerHTML = `<span>${name.replace(/[<>&]/g, "")}</span>`;
    document.body.appendChild(o);
    const W = window.innerWidth, H = window.innerHeight;
    gsap.fromTo(o, { x: r.left, y: r.top, scaleX: r.width / W, scaleY: r.height / H, transformOrigin: "0 0" }, { x: 0, y: 0, scaleX: 1, scaleY: 1, duration: 0.55, ease: "power3.inOut", onComplete: () => {
            a.dataset.go = "1";
            a.click();
            delete a.dataset.go;
            gsap.to(o, { opacity: 0, duration: 0.5, delay: 0.25, onComplete: () => o.remove() });
        } });
}
function Grid({ brands }) {
    const grid = useRef(null);
    const spot = useRef(null);
    const glint = useRef(null);
    const fine = useRef(false);
    useEffect(() => { fine.current = window.matchMedia("(hover: hover) and (pointer: fine)").matches && !window.matchMedia("(prefers-reduced-motion: reduce)").matches; }, []);
    const onMove = (e) => {
        if (!fine.current)
            return;
        const r = grid.current.getBoundingClientRect();
        const t = `translate3d(${e.clientX - r.left - 260}px,${e.clientY - r.top - 260}px,0)`;
        spot.current.style.transform = t;
        glint.current.style.transform = t;
        const cell = e.target.closest(".bx-cell__in");
        if (cell) {
            const c = cell.getBoundingClientRect();
            const px = (e.clientX - c.left) / c.width - 0.5, py = (e.clientY - c.top) / c.height - 0.5;
            cell.style.transform = `perspective(1000px) rotateX(${(-py * 12).toFixed(2)}deg) rotateY(${(px * 12).toFixed(2)}deg)`;
            cell.style.setProperty("--gx", `${(px * 100 + 50).toFixed(0)}%`);
        }
    };
    const reset = (e) => { const c = e.currentTarget.querySelector(".bx-cell__in"); if (c)
        c.style.transform = ""; };
    return (<div ref={grid} className="bx-gridwrap" onMouseMove={onMove}>
      <div ref={glint} className="bx-grid__glint" aria-hidden="true"/>
      <ul className="bx-grid">
      {brands.map((b, i) => (<li key={b.slug} className="bx-cell" data-i={i} onMouseLeave={reset}>
          <Link className="bx-cell__in" href={b.href} data-see onClick={(e) => expandAndGo(e, b.name)}>
            {b.image && (<span className="bx-cell__img" aria-hidden="true">
                <img className="g" src={b.image} alt="" loading="eager" decoding="async"/>
                <span className="c"><img src={b.image} alt="" loading="eager" decoding="async"/></span>
              </span>)}
            <span className="bx-cell__glare" aria-hidden="true"/>
            <span className="bx-cell__txt">
              <strong>{b.name}</strong>
              <span className="bx-sub"><span className="a">{countLabel(b)}</span><span className="b">Se {b.name} →</span></span>
            </span>
          </Link>
        </li>))}
      </ul>
      <div ref={spot} className="bx-grid__spot" aria-hidden="true"/>
    </div>);
}
function List({ brands }) {
    const box = useRef(null);
    const [cur, setCur] = useState(null);
    const [prev, setPrev] = useState(null);
    const st = useRef({ x: 0, y: 0, tx: 0, ty: 0, on: false });
    useEffect(() => {
        if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches || window.matchMedia("(prefers-reduced-motion: reduce)").matches)
            return;
        const s = st.current;
        const tick = () => {
            const dx = s.tx - s.x;
            s.x += dx * 0.12;
            s.y += (s.ty - s.y) * 0.12;
            if (box.current)
                box.current.style.transform = `translate3d(${s.x - 140}px,${s.y - 175}px,0) rotate(${Math.max(-8, Math.min(8, dx * 0.06)).toFixed(2)}deg)`;
        };
        gsap.ticker.add(tick);
        const move = (e) => { s.tx = e.clientX; s.ty = e.clientY; };
        window.addEventListener("pointermove", move);
        return () => { gsap.ticker.remove(tick); window.removeEventListener("pointermove", move); };
    }, []);
    const enter = (b) => { if (b.slug !== cur?.slug) {
        setPrev(cur);
        setCur(b);
    } };
    return (<div className="bx-list" onMouseLeave={() => { setPrev(cur); setCur(null); }}>
      <ul>
        {brands.map((b) => (<li key={b.slug}>
            <Link href={b.href} data-see onMouseEnter={() => enter(b)} onFocus={() => enter(b)}>
              <strong>{b.name}</strong><span>{countLabel(b)}</span>
            </Link>
          </li>))}
      </ul>
      <div ref={box} className={`bx-follow${cur?.image ? " is-on" : ""}`} aria-hidden="true">
        {prev?.image && <img key={`p-${prev.slug}`} className="out" src={prev.image} alt=""/>}
        {cur?.image && <img key={`c-${cur.slug}`} className="in" src={cur.image} alt="" style={{ "--d": "0s" }}/>}
      </div>
    </div>);
}
