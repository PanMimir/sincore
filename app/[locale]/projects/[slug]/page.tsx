import { notFound } from"next/navigation";
import { getTranslations } from"next-intl/server";
import type { Metadata } from"next";
import Link from"next/link";
import Image from"next/image";
import { ArrowLeft, GitBranch, BookOpen, Download, Lock } from"lucide-react";
import { getAllProjects, getProjectBySlug } from"@/services/projectService";
import { cn } from"@/lib/utils";

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
  return {
    title: project.title,
    alternates: {
      canonical: `/${params.locale}/projects/${params.slug}`,
      languages: {
        pl: `/pl/projects/${params.slug}`,
        en: `/en/projects/${params.slug}`,
"x-default": `/en/projects/${params.slug}`,
      },
    },
  };
}

const STATUS_CONFIG = {
  active:   { label:"status_active",   className:"text-success-400 border-success-500/40 bg-success-500/10" },
  wip:      { label:"status_wip",      className:"text-warning-400 border-warning-400/40 bg-yellow-400/10" },
  archived: { label:"status_archived", className:"text-text-muted border-text-muted/40 bg-text-muted/10" },
} as const;

export default async function ProjectPage({
  params,
}: {
  params: { locale: string; slug: string };
}) {
  const [project, t] = await Promise.all([
    getProjectBySlug(params.slug),
    getTranslations({ locale: params.locale, namespace:"projects" }),
  ]);

  if (!project) notFound();

  const status = STATUS_CONFIG[project.status];
  const description = project.description[params.locale as keyof typeof project.description];
  const tCommon = await getTranslations({ locale: params.locale, namespace:"common" });

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
      {/* Powrót */}
      <Link
        href={`/${params.locale}/projects`}
        className="inline-flex items-center gap-2 font-mono text-sm text-text-muted hover:text-accent-primary transition-colors mb-10"
      >
        <ArrowLeft size={14} />
        {tCommon("back")}
      </Link>

      {/* Nagłówek projektu */}
      <div className="mb-8 pb-8 border-b border-border-subtle">
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <h1 className="font-bold tracking-tight text-4xl text-text-primary">
            {project.title}
          </h1>
          <span className={cn("font-mono text-xs px-2 py-1 rounded border", status.className)}>
            {t(status.label)}
          </span>
        </div>
        <p className="text-text-muted text-base leading-relaxed">{description}</p>
      </div>

      <div className="mb-8">
        <p className="text-xs uppercase tracking-wider text-text-muted mb-3">{t("stack_label")}</p>
        <div className="flex flex-wrap gap-2">
          {project.stack.map((tech) => (
            <span
              key={tech}
              className="font-mono text-sm px-3 py-1.5 bg-accent-primary/10 border border-accent-primary/20 text-accent-primary rounded"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>

      <div className="mb-8">
        <p className="text-xs uppercase tracking-wider text-text-muted mb-3">{t("tags")}</p>
        <div className="flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <span key={tag} className="font-mono text-sm text-text-muted">
              #{tag}
            </span>
          ))}
        </div>
      </div>

      {project.screenshots && project.screenshots.length > 0 && (
        <div className="mb-8">
          <p className="text-xs uppercase tracking-wider text-text-muted mb-3">{t("screenshots_label")}</p>
          <div className="grid gap-4 sm:grid-cols-2">
            {project.screenshots.map((src, i) => (
              <Image
                key={i}
                src={src}
                alt={`${project.title} screenshot ${i + 1}`}
                width={800}
                height={500}
                className="rounded border border-border-subtle w-full h-auto object-cover"
                sizes="(max-width: 640px) 100vw, 50vw"
              />
            ))}
          </div>
        </div>
      )}

      {/* Linki */}
      <div className="flex flex-wrap gap-4 pt-8 border-t border-border-subtle">
        {project.githubUrl ? (
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-5 py-2.5 border border-accent-primary/50 hover:border-accent-primary text-accent-primary hover:bg-accent-primary/10 font-mono text-sm rounded transition-all duration-fast"
          >
            <GitBranch size={16} />
            {t("github")}
          </a>
        ) : (
          <span className="flex items-center gap-2 px-5 py-2.5 border border-border-subtle text-text-muted/70 italic font-mono text-sm rounded">
            <Lock size={14} />
            {t("private_repo")}
          </span>
        )}
        {project.docsUrl && (
          <a
            href={project.docsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-5 py-2.5 border border-border-subtle hover:border-accent-primary/50 text-text-muted hover:text-text-primary font-mono text-sm rounded transition-all duration-fast"
          >
            <BookOpen size={16} />
            {t("docs")}
          </a>
        )}
        {project.downloadUrl && (
          <a
            href={project.downloadUrl}
            className="flex items-center gap-2 px-5 py-2.5 border border-border-subtle hover:border-accent-primary/50 text-text-muted hover:text-text-primary font-mono text-sm rounded transition-all duration-fast"
          >
            <Download size={16} />
            {t("download")}
          </a>
        )}
      </div>
    </div>
  );
}
