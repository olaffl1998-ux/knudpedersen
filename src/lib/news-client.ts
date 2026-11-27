export type NewsItem = { id: string; type: "Arrangement" | "Nyhed" | "Kollektion"; titel: string; dato: string | null; tidspunkt: string | null; tekst: string | null; billede: string | null; link: string | null };

/** Next-udgaven: nyhederne kommer fra Lovable Cloud i den rigtige udgave (se lovable/overlay/src/lib/news-client.js) */
export const fetchNews = (): Promise<NewsItem[]> => fetch("/api/news").then((r) => (r.ok ? r.json() : [])).catch(() => []);
