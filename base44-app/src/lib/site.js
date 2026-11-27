export const SITE_URL = (import.meta.env.VITE_SITE_URL || "https://knudpedersen.dk").replace(/\/$/, "");
export const SHOW_PREVIEW_BANNER = import.meta.env.VITE_PREVIEW_BANNER !== "false";
export const business = {
    name: "Knud Pedersen",
    legalName: "Knud Pedersen A/S",
    cvr: "78299428",
    street: "Skt. Clemens Torv 6",
    postalCode: "8000",
    city: "Aarhus C",
    country: "DK",
    phone: "86 12 17 99",
    phoneE164: "+4586121799",
    email: "sktclemenstorv@knudpedersen.dk",
    geo: { lat: 56.1563067, lng: 10.2087654 },
    instagram: "https://www.instagram.com/knud_pedersen_ure_og_smykker/",
    facebook: "https://www.facebook.com/urmagerknudpedersen/",
    openingHours: [
        { label: "Mandag–torsdag", days: ["Monday", "Tuesday", "Wednesday", "Thursday"], opens: "10:00", closes: "17:30" },
        { label: "Fredag", days: ["Friday"], opens: "10:00", closes: "18:00" },
        { label: "Lørdag", days: ["Saturday"], opens: "10:00", closes: "15:00" },
    ],
};
export const mainNav = [
    { href: "/rolex/discover", label: "Rolex", key: "rolex" },
    { href: "/ure", label: "Ure", key: "ure", mega: "ure" },
    { href: "/smykker", label: "Smykker", key: "smykker", mega: "smykker" },
    { href: "/maerker", label: "Mærker", key: "maerker", mega: "maerker" },
    { href: "/service", label: "Service", key: "service", mega: "service" },
    { href: "/om-os", label: "Om os", key: "om-os", mega: "om-os" },
];
export const formatPrice = (n) => `${n.toLocaleString("da-DK")} kr.`;
/** Rolex-uret (Rolex' iframe). Nøglen er den, den nuværende knudpedersen.dk bruger. */
export const ROLEX_CLOCK_KEY = import.meta.env.VITE_ROLEX_CLOCK_API_KEY || "a3fd140c73bc8f81cc1b8d85379ba066";
export const rolexClockSrc = (colour = "gold") => `https://static.rolex.com/retailers/clock/?colour=${colour}&apiKey=${ROLEX_CLOCK_KEY}&lang=da`;
/** Lille udgave (480 px) af et produktbillede til lister og kort. Store billeder bruges kun på produktsiden */
export const thumb = (src) => (src.startsWith("/billeder/shop/") && !src.includes("/shop/s/") ? src.replace("/billeder/shop/", "/billeder/shop/s/") : src);
