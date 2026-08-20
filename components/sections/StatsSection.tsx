"use client";

import { useTranslations } from "next-intl";

interface StatsSectionProps {
  projectCount: number;
  articleCount: number;
  /** Liczony od zatrudnienia w ITPE (07.2015) w app/[locale]/page.tsx. */
  experienceYears: number;
}

export default function StatsSection({
  projectCount,
  articleCount,
  experienceYears,
}: StatsSectionProps) {
  const t = useTranslations("home");

  const stats = [
    { value: String(projectCount), label: t("stats_projects") },
    {
      value: String(experienceYears),
      label: t("stats_experience", { years: experienceYears }),
    },
    { value: String(articleCount), label: t("stats_articles") },
  ];

  return (
    <section className="border-y border-border-subtle py-16">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-3 gap-8 text-center">
          {stats.map((stat, i) => (
            <div key={i} className="fade-rise" style={{ animationDelay: `${i * 80}ms` }}>
              <p className="mb-1 text-3xl font-bold tracking-tight text-accent-primary sm:text-4xl">
                {stat.value}
              </p>
              <p className="text-xs uppercase tracking-wider text-text-muted sm:text-sm">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
