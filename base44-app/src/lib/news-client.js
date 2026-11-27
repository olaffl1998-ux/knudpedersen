/** Next-udgaven: nyhederne kommer fra Lovable Cloud i den rigtige udgave (se lovable/overlay/src/lib/news-client.js) */
export const fetchNews = () => fetch("/api/news").then((r) => (r.ok ? r.json() : [])).catch(() => []);
