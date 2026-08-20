import fs from "fs";
import path from "path";
import type { MetadataRoute } from "next";
import { routing } from "@/lib/routing";
import { getAllProjects } from "@/services/projectService";
import { getAllArticles, getArticleSlugMap } from "@/services/articleService";
import { BASE_URL } from "@/lib/metadata";

// Statyczne sekcje serwisu — te same dla wszystkich języków.
// Usługi celowo poza mapą: strona istnieje, ale nie prowadzi do niej żaden odnośnik.
const STATIC_ROUTES = [
  "/",
  "/projects",
  "/knowledge",
  "/cheatsheet",
  "/stack",
  "/about",
  "/contact",
];

/**
 * Data ostatniej zmiany brana z pliku źródłowego strony.
 *
 * Wcześniej wszystkie wpisy dostawały `new Date()`, czyli czas builda — mapa mówiła
 * wyszukiwarce, że przy każdym wdrożeniu zmieniło się wszystko naraz. Po kilku takich
 * sygnałach Google przestaje ufać temu polu i zaczyna je ignorować.
 */
function sourceFileDate(...candidates: string[]): Date {
  for (const relative of candidates) {
    try {
      return fs.statSync(path.join(process.cwd(), relative)).mtime;
    } catch {
      // Plik nie istnieje — próbujemy następnego kandydata.
    }
  }
  return new Date();
}

const ROUTE_SOURCES: Record<string, string[]> = {
  "/": ["app/[locale]/page.tsx", "translations/pl/index.json"],
  "/projects": ["data/projects.json"],
  "/knowledge": ["content/articles/pl"],
  "/cheatsheet": ["data/cheatsheet.json"],
  "/stack": ["data/techstack.json"],
  "/about": ["app/[locale]/about/AboutContent.tsx"],
  "/contact": ["app/[locale]/contact/ContactContent.tsx"],
};

/** Alternatywne wersje językowe dla wpisu o tej samej ścieżce w obu językach. */
function sharedAlternates(route: string) {
  const suffix = route === "/" ? "" : route;
  return {
    languages: {
      ...Object.fromEntries(routing.locales.map((l) => [l, `${BASE_URL}/${l}${suffix}`])),
      "x-default": `${BASE_URL}/en${suffix}`,
    },
  };
}

/**
 * Dynamicznie generuje /sitemap.xml.
 * Zawiera: strony statyczne × języki + każdy projekt × języki + każdy artykuł × języki.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [];

  // Strony statyczne
  for (const route of STATIC_ROUTES) {
    const lastModified = sourceFileDate(...(ROUTE_SOURCES[route] ?? []));
    for (const locale of routing.locales) {
      const path = route === "/" ? `/${locale}` : `/${locale}${route}`;
      entries.push({
        url: `${BASE_URL}${path}`,
        lastModified,
        changeFrequency: route === "/" ? "weekly" : "monthly",
        priority: route === "/" ? 1.0 : 0.8,
        alternates: sharedAlternates(route),
      });
    }
  }

  // Projekty — slug ten sam w obu językach
  const projects = await getAllProjects();
  const projectsChanged = sourceFileDate("data/projects.json");
  for (const project of projects) {
    for (const locale of routing.locales) {
      entries.push({
        url: `${BASE_URL}/${locale}/projects/${project.slug}`,
        lastModified: projectsChanged,
        changeFrequency: "monthly",
        priority: 0.7,
        alternates: sharedAlternates(`/projects/${project.slug}`),
      });
    }
  }

  // Artykuły — slug różny w każdym języku, więc wersje szukamy przez mapę id → slug
  const slugMap = await getArticleSlugMap();
  for (const locale of routing.locales) {
    const articles = await getAllArticles(locale);
    for (const article of articles) {
      const entry = slugMap[article.id] ?? {};
      const languages: Record<string, string> = {};
      for (const l of routing.locales) {
        if (entry[l]) languages[l] = `${BASE_URL}/${l}/knowledge/${entry[l]}`;
      }
      if (entry.en) languages["x-default"] = `${BASE_URL}/en/knowledge/${entry.en}`;

      entries.push({
        url: `${BASE_URL}/${locale}/knowledge/${article.slug}`,
        lastModified: article.date ? new Date(article.date) : new Date(),
        changeFrequency: "monthly",
        priority: 0.6,
        ...(Object.keys(languages).length > 1 ? { alternates: { languages } } : {}),
      });
    }
  }

  return entries;
}
