import type { MetadataRoute } from "next";

// Next.js generuje /robots.txt automatycznie z tego pliku
export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "https://sincore.io";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Tylko API. /_next/ było tu wcześniej i blokowało robotom pobieranie CSS
      // i JavaScriptu — Google renderuje stronę jak przeglądarka i bez tych plików
      // ocenia układ, którego użytkownik nigdy nie zobaczy.
      disallow: ["/api/"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
