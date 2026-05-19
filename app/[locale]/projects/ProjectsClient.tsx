"use client";

import { useState } from"react";
import { useTranslations } from"next-intl";
import { cn } from"@/lib/utils";
import ProjectCard from"@/components/common/ProjectCard";
import type { Project } from"@/services/projectService";

const STATUS_FILTERS = ["all","active","wip","archived"] as const;
type StatusFilter = (typeof STATUS_FILTERS)[number];

export default function ProjectsClient({ projects }: { projects: Project[] }) {
  const t = useTranslations("projects");
  const [activeFilter, setActiveFilter] = useState<StatusFilter>("all");

  const filtered =
    activeFilter ==="all"
      ? projects
      : projects.filter((p) => p.status === activeFilter);

  // Zbiera wszystkie unikalne tagi ze wszystkich projektów
  const allTags = Array.from(new Set(projects.flatMap((p) => p.tags)));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
      <div className="mb-12">
        <h1 className="font-bold text-4xl sm:text-5xl text-text-primary mb-4">
          {t("title")}
        </h1>
        <p className="text-text-muted text-base">{t("subtitle")}</p>
      </div>

      {/* Filtry statusu */}
      <div className="flex flex-wrap gap-2 mb-10">
        {STATUS_FILTERS.map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={cn(
"font-mono text-sm px-4 py-2 rounded border transition-all duration-fast",
              activeFilter === filter
                ?"bg-accent-primary/20 border-accent-primary text-accent-primary"
                :"border-border-subtle text-text-muted hover:border-accent-primary/50 hover:text-text-primary"
            )}
          >
            {filter ==="all" ? t("all") : t(filter ==="wip" ?"status_wip" : filter ==="active" ?"status_active" :"status_archived")}
            <span className="ml-2 text-xs opacity-60">
              ({filter ==="all" ? projects.length : projects.filter((p) => p.status === filter).length})
            </span>
          </button>
        ))}
      </div>

      {/* Siatka kart projektów */}
      {filtered.length === 0 ? (
        <p className="font-mono text-text-muted text-center py-16">{t("no_projects")}</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((project, i) => (
            <ProjectCard key={project.slug} project={project} index={i} />
          ))}
        </div>
      )}

      {allTags.length > 0 && (
        <div className="mt-16 pt-8 border-t border-border-subtle">
          <p className="text-xs uppercase tracking-wider text-text-muted mb-3">{t("tags")}</p>
          <div className="flex flex-wrap gap-2">
            {allTags.map((tag) => (
              <span
                key={tag}
                className="font-mono text-xs px-2 py-1 border border-border-subtle text-text-muted rounded"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
