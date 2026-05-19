"use client";

import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import ProjectCard from "@/components/common/ProjectCard";
import ScrollReveal from "@/components/common/ScrollReveal";
import type { Project } from "@/services/projectService";

interface FeaturedProjectsSectionProps {
  projects: Project[];
}

export default function FeaturedProjectsSection({ projects }: FeaturedProjectsSectionProps) {
  const t = useTranslations("home");
  const locale = useLocale();

  return (
    <section className="py-24">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="text-xs uppercase tracking-wider text-accent-primary mb-2">{t("featured_label")}</p>
              <h2 className="font-bold text-3xl tracking-tight text-text-primary">
                {t("featured_title")}
              </h2>
            </div>
            <Link
              href={`/${locale}/projects`}
              className="inline-flex items-center gap-2 text-sm font-medium text-text-secondary hover:text-accent-primary transition-colors duration-fast"
            >
              {t("featured_cta")} <ArrowRight size={14} />
            </Link>
          </div>
        </ScrollReveal>

        <div className="grid md:grid-cols-2 gap-6">
          {projects.map((project, i) => (
            <ProjectCard key={project.slug} project={project} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
