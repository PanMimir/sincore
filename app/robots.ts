import type { MetadataRoute } from "next";

// Next.js generuje /robots.txt automatycznie z tego pliku
export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "https://nullsec.dev";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Blokuj Next.js internale przed indeksowaniem
      disallow: ["/api/", "/_next/"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
