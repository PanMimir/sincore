import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { getAllProjects } from "@/services/projectService";
import ProjectsClient from "./ProjectsClient";

// Metadata generowane po stronie serwera – SEO-friendly
export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: "projects" });
  return { title: t("title") };
}

// Ten komponent działa na serwerze – pobiera dane i przekazuje do klienta
// Dzięki temu dane są dostępne zanim strona dotrze do przeglądarki (SSG)
export default async function ProjectsPage() {
  const projects = await getAllProjects();

  return <ProjectsClient projects={projects} />;
}
