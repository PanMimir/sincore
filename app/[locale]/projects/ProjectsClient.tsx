"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import ProjectCard from "@/components/common/ProjectCard";
import type { Project } from "@/services/projectService";

const STATUS_FILTERS = ["all", "active", "wip", "archived"] as const;
type StatusFilter = (typeof STATUS_FILTERS)[number];

export default function ProjectsClient({ projects }: { projects: Project[] }) {
  const t = useTranslations("projects");
  const [activeFilter, setActiveFilter] = useState<StatusFilter>("all");

  const filtered =
    activeFilter === "all"
      ? projects
      : projects.filter((p) => p.status === activeFilter);

  // Zbiera wszystkie unikalne tagi ze wszystkich projektów
  const allTags = Array.from(new Set(projects.flatMap((p) => p.tags)));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
      {/* Nagłówek sekcji */}
      <div className="mb-12">
        <p className="font-mono text-cyber-purple text-sm mb-2">$ ls ./projects</p>
        <h1 className="font-mono font-bold text-4xl sm:text-5xl text-cyber-text mb-4">
          {t("title")}
        </h1>
        <p className="text-cyber-muted text-base">{t("subtitle")}</p>
      </div>

      {/* Filtry statusu */}
      <div className="flex flex-wrap gap-2 mb-10">
        {STATUS_FILTERS.map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={cn(
              "font-mono text-sm px-4 py-2 rounded border transition-all duration-200",
              activeFilter === filter
                ? "bg-cyber-purple/20 border-cyber-purple text-cyber-purple"
                : "border-cyber-gray text-cyber-muted hover:border-cyber-purple/50 hover:text-cyber-text"
            )}
          >
            {filter === "all" ? t("all") : t(filter === "wip" ? "status_wip" : filter === "active" ? "status_active" : "status_archived")}
            <span className="ml-2 text-xs opacity-60">
              ({filter === "all" ? projects.length : projects.filter((p) => p.status === filter).length})
            </span>
          </button>
        ))}
      </div>

      {/* Siatka kart projektów */}
      {filtered.length === 0 ? (
        <p className="font-mono text-cyber-muted text-center py-16">{t("no_projects")}</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((project, i) => (
            <ProjectCard key={project.slug} project={project} index={i} />
          ))}
        </div>
      )}

      {/* Tagi – helper do nawigacji */}
      {allTags.length > 0 && (
        <div className="mt-16 pt-8 border-t border-cyber-gray">
          <p className="font-mono text-xs text-cyber-muted mb-3">{"// tagi"}</p>
          <div className="flex flex-wrap gap-2">
            {allTags.map((tag) => (
              <span
                key={tag}
                className="font-mono text-xs px-2 py-1 border border-cyber-gray text-cyber-muted rounded"
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
