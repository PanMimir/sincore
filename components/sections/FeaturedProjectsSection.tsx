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
              <p className="font-mono text-cyber-purple text-sm mb-2">{"// featured"}</p>
              <h2 className="font-mono font-bold text-3xl text-cyber-text">
                {t("featured_title")}
              </h2>
            </div>
            <Link
              href={`/${locale}/projects`}
              className="flex items-center gap-2 font-mono text-sm text-cyber-muted hover:text-cyber-purple transition-colors"
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
