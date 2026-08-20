import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, GitBranch, BookOpen, Lock } from "lucide-react";
import { getAllProjects, getProjectBySlug } from "@/services/projectService";
import { pageMetadata } from "@/lib/metadata";
import ReleaseDownload from "@/components/common/ReleaseDownload";
import ApkDownloadGate from "@/components/common/ApkDownloadGate";
import { cn } from "@/lib/utils";
import { setRequestLocale } from "next-intl/server";

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

  return pageMetadata({
    locale: params.locale,
    path: `projects/${params.slug}`,
    title: project.title,
    description:
      project.description[params.locale as "pl" | "en"] ?? project.description.pl,
  });
}

const STATUS_CONFIG = {
  active: {
    label: "status_active",
    className: "text-success-400 border-success-500/40 bg-success-500/10",
  },
  wip: {
    label: "status_wip",
    className: "text-warning-400 border-warning-400/40 bg-yellow-400/10",
  },
  paused: {
    label: "status_paused",
    className: "text-text-muted border-text-muted/40 bg-text-muted/10 italic",
  },
  archived: {
    label: "status_archived",
    className: "text-text-muted border-text-muted/40 bg-text-muted/10",
  },
} as const;

export default async function ProjectPage({
  params,
}: {
  params: { locale: string; slug: string };
}) {
  setRequestLocale(params.locale);

  const [project, t] = await Promise.all([
    getProjectBySlug(params.slug),
    getTranslations({ locale: params.locale, namespace: "projects" }),
  ]);

  if (!project) notFound();

  const status = STATUS_CONFIG[project.status];
  const description =
    project.description[params.locale as keyof typeof project.description];
  const tCommon = await getTranslations({ locale: params.locale, namespace: "common" });

  return (
    <div className="mx-auto max-w-4xl px-4 py-24 sm:px-6 lg:px-8">
      {/* Powrót */}
      <Link
        href={`/${params.locale}/projects`}
        className="mb-10 inline-flex items-center gap-2 font-mono text-sm text-text-muted transition-colors hover:text-accent-primary"
      >
        <ArrowLeft size={14} />
        {tCommon("back")}
      </Link>

      {/* Nagłówek projektu */}
      <div className="mb-8 border-b border-border-subtle pb-8">
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <h1 className="text-4xl font-bold tracking-tight text-text-primary">
            {project.title}
          </h1>
          <span
            className={cn("rounded border px-2 py-1 font-mono text-xs", status.className)}
          >
            {t(status.label)}
          </span>
        </div>
        <p className="text-base leading-relaxed text-text-muted">{description}</p>
      </div>

      {/* Pobieranie: APK za bramką hasła (Vercel Blob) albo release z GitHuba */}
      {project.apkDownload ? (
        <ApkDownloadGate />
      ) : (
        <ReleaseDownload githubUrl={project.githubUrl} locale={params.locale} />
      )}

      <div className="mb-8">
        <p className="mb-3 text-xs uppercase tracking-wider text-text-muted">
          {t("stack_label")}
        </p>
        <div className="flex flex-wrap gap-2">
          {project.stack.map((tech) => (
            <span
              key={tech}
              className="bg-accent-primary/10 border-accent-primary/20 rounded border px-3 py-1.5 font-mono text-sm text-accent-primary"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>

      <div className="mb-8">
        <p className="mb-3 text-xs uppercase tracking-wider text-text-muted">
          {t("tags")}
        </p>
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
          <p className="mb-3 text-xs uppercase tracking-wider text-text-muted">
            {t("screenshots_label")}
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            {project.screenshots.map((src, i) => (
              <Image
                key={i}
                src={src}
                alt={`${project.title} screenshot ${i + 1}`}
                width={800}
                height={500}
                className="h-auto w-full rounded border border-border-subtle object-cover"
                sizes="(max-width: 640px) 100vw, 50vw"
              />
            ))}
          </div>
        </div>
      )}

      {/* Linki */}
      <div className="flex flex-wrap gap-4 border-t border-border-subtle pt-8">
        {project.githubUrl ? (
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="border-accent-primary/50 hover:bg-accent-primary/10 flex items-center gap-2 rounded border px-5 py-2.5 font-mono text-sm text-accent-primary transition-all duration-fast hover:border-accent-primary"
          >
            <GitBranch size={16} />
            {t("github")}
          </a>
        ) : (
          <span className="text-text-muted/85 flex items-center gap-2 rounded border border-border-subtle px-5 py-2.5 font-mono text-sm italic">
            <Lock size={14} />
            {t("private_repo")}
          </span>
        )}
        {project.docsUrl && (
          <a
            href={project.docsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:border-accent-primary/50 flex items-center gap-2 rounded border border-border-subtle px-5 py-2.5 font-mono text-sm text-text-muted transition-all duration-fast hover:text-text-primary"
          >
            <BookOpen size={16} />
            {t("docs")}
          </a>
        )}
      </div>
    </div>
  );
}
