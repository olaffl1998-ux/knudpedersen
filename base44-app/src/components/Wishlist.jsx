"use client";
import { useEffect, useState } from "react";
/** Ønskeliste gemt i browseren (ingen konto). Gemmer kun produkt-id'er. */
const KEY = "kp-wishlist-v1";
const EVT = "kp-wishlist";
export function readWishlist() {
    try {
        return JSON.parse(localStorage.getItem(KEY) || "[]");
    }
    catch {
        return [];
    }
}
function write(ids) {
    try {
        localStorage.setItem(KEY, JSON.stringify(ids));
    }
    catch { /* ignoreres */ }
    window.dispatchEvent(new Event(EVT));
}
export function useWishlist() {
    const [ids, setIds] = useState([]);
    useEffect(() => {
        const sync = () => setIds(readWishlist());
        sync();
        window.addEventListener(EVT, sync);
        window.addEventListener("storage", sync);
        return () => { window.removeEventListener(EVT, sync); window.removeEventListener("storage", sync); };
    }, []);
    const toggle = (id) => { const cur = readWishlist(); write(cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id]); };
    return { ids, toggle, has: (id) => ids.includes(id) };
}
export function HeartButton({ id, label }) {
    const { has, toggle } = useWishlist();
    const on = has(id);
    return (<button type="button" className="heart" aria-pressed={on} aria-label={on ? `Fjern ${label} fra ønskelisten` : `Føj ${label} til ønskelisten`} onClick={() => toggle(id)}>
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20.5s-7.5-4.6-9.3-9.2C1.4 8 3.6 4.5 7.1 4.5c2 0 3.6 1.1 4.9 2.9 1.3-1.8 2.9-2.9 4.9-2.9 3.5 0 5.7 3.5 4.4 6.8-1.8 4.6-9.3 9.2-9.3 9.2z"/></svg>
    </button>);
}
export function WishlistCount() {
    const { ids } = useWishlist();
    return ids.length ? <span className="count">{ids.length}</span> : null;
}
