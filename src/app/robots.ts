import type { MetadataRoute } from "next";
import { SITE_URL, SHOW_PREVIEW_BANNER } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  // Forhåndsvisningen må ikke indekseres
  if (SHOW_PREVIEW_BANNER) return { rules: { userAgent: "*", disallow: "/" } };
  return { rules: { userAgent: "*", allow: "/", disallow: "/api/" }, sitemap: `${SITE_URL}/sitemap.xml` };
}
