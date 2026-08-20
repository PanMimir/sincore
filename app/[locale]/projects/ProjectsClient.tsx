"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import ProjectCard from "@/components/common/ProjectCard";
import type { Project } from "@/services/projectService";

const STATUS_FILTERS = ["all", "active", "wip", "paused", "archived"] as const;
type StatusFilter = (typeof STATUS_FILTERS)[number];

const STATUS_LABEL_KEYS: Record<Exclude<StatusFilter, "all">, string> = {
  active: "status_active",
  wip: "status_wip",
  paused: "status_paused",
  archived: "status_archived",
};

export default function ProjectsClient({
  projects,
  downloadableSlugs,
}: {
  projects: Project[];
  downloadableSlugs: string[];
}) {
  const t = useTranslations("projects");
  const [activeFilter, setActiveFilter] = useState<StatusFilter>("all");

  const filtered =
    activeFilter === "all" ? projects : projects.filter((p) => p.status === activeFilter);

  // Zbiera wszystkie unikalne tagi ze wszystkich projektów
  const allTags = Array.from(new Set(projects.flatMap((p) => p.tags)));

  return (
    <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
      <div className="mb-12">
        <h1 className="mb-4 text-4xl font-bold text-text-primary sm:text-5xl">
          {t("title")}
        </h1>
        <p className="text-base text-text-muted">{t("subtitle")}</p>
      </div>

      {/* Filtry statusu */}
      <div className="mb-10 flex flex-wrap gap-2">
        {STATUS_FILTERS.map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={cn(
              "rounded border px-4 py-2 font-mono text-sm transition-all duration-fast",
              activeFilter === filter
                ? "bg-accent-primary/20 border-accent-primary text-accent-primary"
                : "hover:border-accent-primary/50 border-border-subtle text-text-muted hover:text-text-primary"
            )}
          >
            {filter === "all" ? t("all") : t(STATUS_LABEL_KEYS[filter])}
            <span className="ml-2 text-xs opacity-60">
              (
              {filter === "all"
                ? projects.length
                : projects.filter((p) => p.status === filter).length}
              )
            </span>
          </button>
        ))}
      </div>

      {/* Siatka kart projektów */}
      {filtered.length === 0 ? (
        <p className="py-16 text-center font-mono text-text-muted">{t("no_projects")}</p>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((project, i) => (
            <ProjectCard
              key={project.slug}
              project={project}
              index={i}
              downloadable={downloadableSlugs.includes(project.slug)}
            />
          ))}
        </div>
      )}

      {allTags.length > 0 && (
        <div className="mt-16 border-t border-border-subtle pt-8">
          <p className="mb-3 text-xs uppercase tracking-wider text-text-muted">
            {t("tags")}
          </p>
          <div className="flex flex-wrap gap-2">
            {allTags.map((tag) => (
              <span
                key={tag}
                className="rounded border border-border-subtle px-2 py-1 font-mono text-xs text-text-muted"
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
