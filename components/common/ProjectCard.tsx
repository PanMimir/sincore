"use client";

import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { ExternalLink, BookOpen, Download, GitBranch, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Project } from "@/services/projectService";

interface ProjectCardProps {
  project: Project;
  index?: number;
  downloadable?: boolean;
}

const STATUS_CONFIG = {
  active: {
    label: "status_active",
    className: "text-success-400 border-success-500/40 bg-success-500/10",
  },
  wip: {
    label: "status_wip",
    className: "text-warning-400 border-warning-500/40 bg-warning-500/10",
  },
  paused: {
    label: "status_paused",
    className: "text-text-muted border-border-subtle bg-surface-elevated italic",
  },
  archived: {
    label: "status_archived",
    className: "text-text-muted border-border-subtle bg-surface-elevated",
  },
} as const;

export default function ProjectCard({
  project,
  index = 0,
  downloadable = false,
}: ProjectCardProps) {
  const t = useTranslations("projects");
  const locale = useLocale();

  const status = STATUS_CONFIG[project.status];
  const description = project.description[locale as keyof typeof project.description];

  return (
    <div
      className="fade-rise group relative flex flex-col rounded-sincore-xl border border-border-subtle bg-surface p-6 transition-colors duration-normal hover:border-border-strong"
      style={{ animationDelay: `${Math.min(index, 4) * 60}ms` }}
    >
      <div className="mb-3">
        <div className="mb-2 flex items-start gap-3">
          <Link
            href={`/${locale}/projects/${project.slug}`}
            className="text-lg font-bold leading-tight tracking-tight text-text-primary transition-colors duration-fast hover:text-accent-primary"
          >
            {project.title}
          </Link>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span
            className={cn(
              "inline-block rounded border px-2 py-0.5 font-mono text-xs",
              status.className
            )}
          >
            {t(status.label)}
          </span>
          {downloadable && (
            <span className="border-accent-primary/40 bg-accent-primary/10 inline-flex items-center gap-1 rounded border px-2 py-0.5 font-mono text-xs text-accent-primary">
              <Download size={11} />
              {t("download_badge")}
            </span>
          )}
        </div>
      </div>

      <p className="mb-4 flex-1 text-sm leading-relaxed text-text-secondary">
        {description}
      </p>

      <div className="mb-5 flex flex-wrap gap-2">
        {project.stack.map((tech) => (
          <span
            key={tech}
            className="rounded border border-border-subtle bg-surface-elevated px-2 py-1 font-mono text-xs text-text-secondary"
          >
            {tech}
          </span>
        ))}
      </div>

      <div className="mt-auto flex items-center gap-3 border-t border-border-subtle pt-4">
        {project.githubUrl ? (
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 font-mono text-xs text-text-muted transition-colors duration-fast hover:text-accent-primary"
          >
            <GitBranch size={14} />
            {t("github")}
          </a>
        ) : (
          <span
            className="text-text-muted/80 flex items-center gap-1.5 font-mono text-xs italic"
            title={t("private_repo")}
          >
            <Lock size={12} />
            {t("private_repo")}
          </span>
        )}
        {project.docsUrl && (
          <a
            href={project.docsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 font-mono text-xs text-text-muted transition-colors duration-fast hover:text-accent-primary"
          >
            <BookOpen size={14} />
            {t("docs")}
          </a>
        )}
        {project.downloadUrl && (
          <a
            href={project.downloadUrl}
            className="flex items-center gap-1.5 font-mono text-xs text-text-muted transition-colors duration-fast hover:text-accent-primary"
          >
            <Download size={14} />
            {t("download")}
          </a>
        )}
        <Link
          href={`/${locale}/projects/${project.slug}`}
          className="ml-auto flex items-center gap-1.5 font-mono text-xs text-text-muted transition-colors duration-fast hover:text-accent-primary"
        >
          <ExternalLink size={14} />
          details
        </Link>
      </div>
    </div>
  );
}
