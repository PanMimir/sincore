"use client";

import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { ExternalLink, BookOpen, Download, GitBranch, Lock } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { Project } from "@/services/projectService";

interface ProjectCardProps {
  project: Project;
  index?: number;
  downloadable?: boolean;
}

const STATUS_CONFIG = {
  active: { label: "status_active", className: "text-success-400 border-success-500/40 bg-success-500/10" },
  wip:    { label: "status_wip",    className: "text-warning-400 border-warning-500/40 bg-warning-500/10" },
  archived: { label: "status_archived", className: "text-text-muted border-border-subtle bg-surface-elevated" },
} as const;

export default function ProjectCard({ project, index = 0, downloadable = false }: ProjectCardProps) {
  const t = useTranslations("projects");
  const locale = useLocale();

  const status = STATUS_CONFIG[project.status];
  const description = project.description[locale as keyof typeof project.description];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
      className="group relative flex flex-col bg-surface border border-border-subtle rounded-sincore-xl p-6 hover:border-border-strong transition-colors duration-normal"
    >
      <div className="mb-3">
        <div className="flex items-start gap-3 mb-2">
          <Link
            href={`/${locale}/projects/${project.slug}`}
            className="font-bold text-lg tracking-tight text-text-primary hover:text-accent-primary transition-colors duration-fast leading-tight"
          >
            {project.title}
          </Link>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className={cn("inline-block font-mono text-xs px-2 py-0.5 rounded border", status.className)}>
            {t(status.label)}
          </span>
          {downloadable && (
            <span className="inline-flex items-center gap-1 font-mono text-xs px-2 py-0.5 rounded border border-accent-primary/40 bg-accent-primary/10 text-accent-primary">
              <Download size={11} />
              {t("download_badge")}
            </span>
          )}
        </div>
      </div>

      <p className="text-text-secondary text-sm leading-relaxed mb-4 flex-1">
        {description}
      </p>

      <div className="flex flex-wrap gap-2 mb-5">
        {project.stack.map((tech) => (
          <span
            key={tech}
            className="font-mono text-xs px-2 py-1 bg-surface-elevated border border-border-subtle text-text-secondary rounded"
          >
            {tech}
          </span>
        ))}
      </div>

      <div className="flex items-center gap-3 mt-auto pt-4 border-t border-border-subtle">
        {project.githubUrl ? (
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 font-mono text-xs text-text-muted hover:text-accent-primary transition-colors duration-fast"
          >
            <GitBranch size={14} />
            {t("github")}
          </a>
        ) : (
          <span
            className="flex items-center gap-1.5 font-mono text-xs text-text-muted/60 italic"
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
            className="flex items-center gap-1.5 font-mono text-xs text-text-muted hover:text-accent-primary transition-colors duration-fast"
          >
            <BookOpen size={14} />
            {t("docs")}
          </a>
        )}
        {project.downloadUrl && (
          <a
            href={project.downloadUrl}
            className="flex items-center gap-1.5 font-mono text-xs text-text-muted hover:text-accent-primary transition-colors duration-fast"
          >
            <Download size={14} />
            {t("download")}
          </a>
        )}
        <Link
          href={`/${locale}/projects/${project.slug}`}
          className="flex items-center gap-1.5 font-mono text-xs text-text-muted hover:text-accent-primary transition-colors duration-fast ml-auto"
        >
          <ExternalLink size={14} />
          details
        </Link>
      </div>
    </motion.div>
  );
}
