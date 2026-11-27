import { getNews } from "@/lib/server-fns";

/** Henter publicerede nyheder fra Lovable Cloud */
export const fetchNews = () => getNews().catch(() => []);
