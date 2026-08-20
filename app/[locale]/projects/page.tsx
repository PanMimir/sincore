import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { pageMetadata } from "@/lib/metadata";
import { getAllProjects } from "@/services/projectService";
import { hasDownload } from "@/lib/releases";
import ProjectsClient from "./ProjectsClient";

// Metadata generowane po stronie serwera – SEO-friendly
export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: "projects" });
  return pageMetadata({
    locale: params.locale,
    path: "projects",
    title: t("title"),
    description: t("seo_description"),
  });
}

// Ten komponent działa na serwerze – pobiera dane i przekazuje do klienta
// Dzięki temu dane są dostępne zanim strona dotrze do przeglądarki (SSG)
export default async function ProjectsPage({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale);

  const projects = await getAllProjects();

  // Które projekty mają gotowy plik do pobrania (GitHub Releases) — na tej
  // podstawie karty dostają badge "do pobrania".
  const checks = await Promise.all(
    projects.map(async (p) => ({
      slug: p.slug,
      ok: p.apkDownload === true || (await hasDownload(p.githubUrl)),
    }))
  );
  const downloadableSlugs = checks.filter((c) => c.ok).map((c) => c.slug);

  return <ProjectsClient projects={projects} downloadableSlugs={downloadableSlugs} />;
}
