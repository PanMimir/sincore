"use client";

import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { ExternalLink, BookOpen, Download, GitBranch, Lock } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { Project } from "@/services/projectService";

interface ProjectCardProps {
  project: Project;
  index?: number; // do staggered animations (każda karta wchodzi z lekkim opóźnieniem)
}

// Kolory i etykiety statusów
const STATUS_CONFIG = {
  active: { label: "status_active", className: "text-cyber-green border-cyber-green/40 bg-cyber-green/10" },
  wip:    { label: "status_wip",    className: "text-yellow-400 border-yellow-400/40 bg-yellow-400/10" },
  archived: { label: "status_archived", className: "text-cyber-muted border-cyber-muted/40 bg-cyber-muted/10" },
} as const;

export default function ProjectCard({ project, index = 0 }: ProjectCardProps) {
  const t = useTranslations("projects");
  const locale = useLocale();

  const status = STATUS_CONFIG[project.status];
  const description = project.description[locale as keyof typeof project.description];

  return (
    // staggered animation – karta wchodzi po 100ms * index
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className="group relative flex flex-col bg-cyber-dark border border-cyber-gray rounded-lg p-6 hover:border-cyber-purple/50 transition-all duration-300 hover:shadow-glow-purple-sm"
    >
      {/* Nagłówek */}
      <div className="mb-3">
        <div className="flex items-start gap-3 mb-2">
          <Link
            href={`/${locale}/projects/${project.slug}`}
            className="font-mono font-bold text-lg text-cyber-text hover:text-cyber-purple transition-colors leading-tight"
          >
            {project.title}
          </Link>
        </div>

        {/* Badge statusu */}
        <span className={cn("inline-block font-mono text-xs px-2 py-0.5 rounded border", status.className)}>
          {t(status.label)}
        </span>
      </div>

      {/* Opis */}
      <p className="text-cyber-muted text-sm leading-relaxed mb-4 flex-1">
        {description}
      </p>

      {/* Stack tags */}
      <div className="flex flex-wrap gap-2 mb-5">
        {project.stack.map((tech) => (
          <span
            key={tech}
            className="font-mono text-xs px-2 py-1 bg-cyber-purple/10 border border-cyber-purple/20 text-cyber-purple rounded"
          >
            {tech}
          </span>
        ))}
      </div>

      {/* Linki */}
      <div className="flex items-center gap-3 mt-auto pt-4 border-t border-cyber-gray">
        {project.githubUrl ? (
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 font-mono text-xs text-cyber-muted hover:text-cyber-purple transition-colors"
          >
            <GitBranch size={14} />
            {t("github")}
          </a>
        ) : (
          <span
            className="flex items-center gap-1.5 font-mono text-xs text-cyber-muted/60 italic"
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
            className="flex items-center gap-1.5 font-mono text-xs text-cyber-muted hover:text-cyber-purple transition-colors"
          >
            <BookOpen size={14} />
            {t("docs")}
          </a>
        )}
        {project.downloadUrl && (
          <a
            href={project.downloadUrl}
            className="flex items-center gap-1.5 font-mono text-xs text-cyber-muted hover:text-cyber-purple transition-colors"
          >
            <Download size={14} />
            {t("download")}
          </a>
        )}
        {/* Link do strony projektu – zawsze widoczny */}
        <Link
          href={`/${locale}/projects/${project.slug}`}
          className="flex items-center gap-1.5 font-mono text-xs text-cyber-muted hover:text-cyber-purple transition-colors ml-auto"
        >
          <ExternalLink size={14} />
          details
        </Link>
      </div>
    </motion.div>
  );
}
