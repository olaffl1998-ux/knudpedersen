"use client";
import { useEffect, useState } from "react";
export default function BackToTop() {
    const [on, setOn] = useState(false);
    useEffect(() => {
        const f = () => setOn(window.scrollY > 800);
        window.addEventListener("scroll", f, { passive: true });
        return () => window.removeEventListener("scroll", f);
    }, []);
    return (<button type="button" className={`back-to-top${on ? " is-visible" : ""}`} aria-label="Tilbage til toppen" tabIndex={on ? 0 : -1} onClick={() => window.scrollTo({ top: 0 })}>↑</button>);
}
