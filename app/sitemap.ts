import type { MetadataRoute } from "next";
import { routing } from "@/lib/routing";
import { getAllProjects } from "@/services/projectService";
import { getAllArticles } from "@/services/articleService";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "https://sincore.io";

// Statyczne sekcje serwisu — te same dla wszystkich języków
const STATIC_ROUTES = [
  "/",
  "/services",
  "/projects",
  "/knowledge",
  "/cheatsheet",
  "/stack",
  "/about",
  "/contact",
];

/**
 * Dynamicznie generuje /sitemap.xml.
 * Next.js wywołuje tę funkcję przy build time i serwuje wynik jako XML.
 * Zawiera: strony statyczne × języki + każdy projekt × języki + każdy artykuł × języki.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [];

  // Strony statyczne
  for (const route of STATIC_ROUTES) {
    for (const locale of routing.locales) {
      const path = route === "/" ? `/${locale}` : `/${locale}${route}`;
      entries.push({
        url: `${BASE_URL}${path}`,
        lastModified: new Date(),
        changeFrequency: route === "/" ? "weekly" : "monthly",
        priority: route === "/" ? 1.0 : 0.8,
        alternates: {
          languages: Object.fromEntries(
            routing.locales.map((l) => [
              l,
              `${BASE_URL}/${l}${route === "/" ? "" : route}`,
            ])
          ),
        },
      });
    }
  }

  // Projekty
  const projects = await getAllProjects();
  for (const project of projects) {
    for (const locale of routing.locales) {
      entries.push({
        url: `${BASE_URL}/${locale}/projects/${project.slug}`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.7,
      });
    }
  }

  // Artykuły (per język — mogą mieć różne sligi)
  for (const locale of routing.locales) {
    const articles = await getAllArticles(locale);
    for (const article of articles) {
      entries.push({
        url: `${BASE_URL}/${locale}/knowledge/${article.slug}`,
        lastModified: article.date ? new Date(article.date) : new Date(),
        changeFrequency: "monthly",
        priority: 0.6,
      });
    }
  }

  return entries;
}
