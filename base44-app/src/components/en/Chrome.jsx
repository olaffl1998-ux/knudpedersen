"use client";
import { usePathname } from "@/lib/next/navigation";
import { useEffect } from "react";
/** Viser den engelske menu og bund på /en-siderne og den danske alle andre steder */
export default function Chrome({ da, en }) {
    const isEn = (usePathname() || "/").startsWith("/en");
    useEffect(() => { document.documentElement.lang = isEn ? "en" : "da"; }, [isEn]);
    return <>{isEn ? en : da}</>;
}
