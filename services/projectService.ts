import projectsData from "@/data/projects.json";
import { type Locale } from "@/lib/routing";

// Typ projektu – interfejs który zostanie zachowany nawet po przejściu na API
export interface Project {
  slug: string;
  title: string;
  description: Record<Locale, string>;
  stack: string[];
  tags: string[];
  status: "active" | "wip" | "paused" | "archived";
  githubUrl: string | null;
  docsUrl: string | null;
  downloadUrl: string | null;
  featured: boolean;
  thumbnail: string | null;
  screenshots: string[];
}

/**
 * Pobiera wszystkie projekty.
 *
 * WAŻNE: Ta funkcja teraz czyta z lokalnego JSON.
 * W przyszłości wystarczy zamienić jej wnętrze na fetch() do Spring Boot API –
 * reszta aplikacji nie musi wiedzieć skąd dane pochodzą.
 */
export async function getAllProjects(): Promise<Project[]> {
  return projectsData as Project[];
}

export async function getFeaturedProjects(): Promise<Project[]> {
  const all = await getAllProjects();
  return all.filter((p) => p.featured);
}

export async function getProjectBySlug(
  slug: string
): Promise<Project | undefined> {
  const all = await getAllProjects();
  return all.find((p) => p.slug === slug);
}
