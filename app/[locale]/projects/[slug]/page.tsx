import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, GitBranch, BookOpen, Download } from "lucide-react";
import { getAllProjects, getProjectBySlug } from "@/services/projectService";
import { cn } from "@/lib/utils";

// Generuje statyczne ścieżki dla wszystkich projektów przy build time
// Next.js pre-renderuje każdy projekt jako osobny plik HTML
export async function generateStaticParams() {
  const projects = await getAllProjects();
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { locale: string; slug: string };
}): Promise<Metadata> {
  const project = await getProjectBySlug(params.slug);
  if (!project) return {};
  return { title: project.title };
}

const STATUS_CONFIG = {
  active:   { label: "status_active",   className: "text-cyber-green border-cyber-green/40 bg-cyber-green/10" },
  wip:      { label: "status_wip",      className: "text-yellow-400 border-yellow-400/40 bg-yellow-400/10" },
  archived: { label: "status_archived", className: "text-cyber-muted border-cyber-muted/40 bg-cyber-muted/10" },
} as const;

export default async function ProjectPage({
  params,
}: {
  params: { locale: string; slug: string };
}) {
  const [project, t] = await Promise.all([
    getProjectBySlug(params.slug),
    getTranslations({ locale: params.locale, namespace: "projects" }),
  ]);

  if (!project) notFound();

  const status = STATUS_CONFIG[project.status];
  const description = project.description[params.locale as keyof typeof project.description];
  const tCommon = await getTranslations({ locale: params.locale, namespace: "common" });

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
      {/* Powrót */}
      <Link
        href={`/${params.locale}/projects`}
        className="inline-flex items-center gap-2 font-mono text-sm text-cyber-muted hover:text-cyber-purple transition-colors mb-10"
      >
        <ArrowLeft size={14} />
        {tCommon("back")}
      </Link>

      {/* Nagłówek projektu */}
      <div className="mb-8 pb-8 border-b border-cyber-gray">
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <h1 className="font-mono font-bold text-4xl text-cyber-text">
            {project.title}
          </h1>
          <span className={cn("font-mono text-xs px-2 py-1 rounded border", status.className)}>
            {t(status.label)}
          </span>
        </div>
        <p className="text-cyber-muted text-base leading-relaxed">{description}</p>
      </div>

      {/* Stack */}
      <div className="mb-8">
        <p className="font-mono text-xs text-cyber-muted mb-3">{"// stack"}</p>
        <div className="flex flex-wrap gap-2">
          {project.stack.map((tech) => (
            <span
              key={tech}
              className="font-mono text-sm px-3 py-1.5 bg-cyber-purple/10 border border-cyber-purple/20 text-cyber-purple rounded"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>

      {/* Tagi */}
      <div className="mb-8">
        <p className="font-mono text-xs text-cyber-muted mb-3">{"// tagi"}</p>
        <div className="flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <span key={tag} className="font-mono text-sm text-cyber-muted">
              #{tag}
            </span>
          ))}
        </div>
      </div>

      {/* Linki */}
      <div className="flex flex-wrap gap-4 pt-8 border-t border-cyber-gray">
        {project.githubUrl && (
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-5 py-2.5 border border-cyber-purple/50 hover:border-cyber-purple text-cyber-purple hover:bg-cyber-purple/10 font-mono text-sm rounded transition-all duration-200"
          >
            <GitBranch size={16} />
            {t("github")}
          </a>
        )}
        {project.docsUrl && (
          <a
            href={project.docsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-5 py-2.5 border border-cyber-gray hover:border-cyber-purple/50 text-cyber-muted hover:text-cyber-text font-mono text-sm rounded transition-all duration-200"
          >
            <BookOpen size={16} />
            {t("docs")}
          </a>
        )}
        {project.downloadUrl && (
          <a
            href={project.downloadUrl}
            className="flex items-center gap-2 px-5 py-2.5 border border-cyber-gray hover:border-cyber-purple/50 text-cyber-muted hover:text-cyber-text font-mono text-sm rounded transition-all duration-200"
          >
            <Download size={16} />
            {t("download")}
          </a>
        )}
      </div>
    </div>
  );
}
