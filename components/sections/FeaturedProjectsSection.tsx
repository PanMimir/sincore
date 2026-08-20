"use client";

import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import ProjectCard from "@/components/common/ProjectCard";
import ScrollReveal from "@/components/common/ScrollReveal";
import type { Project } from "@/services/projectService";

interface FeaturedProjectsSectionProps {
  projects: Project[];
  downloadableSlugs: string[];
}

export default function FeaturedProjectsSection({
  projects,
  downloadableSlugs,
}: FeaturedProjectsSectionProps) {
  const t = useTranslations("home");
  const locale = useLocale();

  return (
    <section className="py-24">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="mb-12 flex items-end justify-between">
            <div>
              <p className="mb-2 text-xs uppercase tracking-wider text-accent-primary">
                {t("featured_label")}
              </p>
              <h2 className="text-3xl font-bold tracking-tight text-text-primary">
                {t("featured_title")}
              </h2>
            </div>
            <Link
              href={`/${locale}/projects`}
              className="inline-flex items-center gap-2 text-sm font-medium text-text-secondary transition-colors duration-fast hover:text-accent-primary"
            >
              {t("featured_cta")} <ArrowRight size={14} />
            </Link>
          </div>
        </ScrollReveal>

        <div className="grid gap-6 md:grid-cols-2">
          {projects.map((project, i) => (
            <ProjectCard
              key={project.slug}
              project={project}
              index={i}
              downloadable={downloadableSlugs.includes(project.slug)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
