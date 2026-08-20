"use client";

import { useTranslations } from "next-intl";
import { Terminal, Cpu, Code2, Monitor, Database } from "lucide-react";
import ScrollReveal from "@/components/common/ScrollReveal";

const SKILL_ICONS = [Terminal, Cpu, Database, Monitor, Code2];

export default function AboutContent() {
  const t = useTranslations("about");

  // Tłumaczenia zwracają tablicę jako string z przecinkami w next-intl
  // Używamy rawu żeby dostać tablicę
  const skills = t.raw("skills") as string[];

  return (
    <div className="mx-auto max-w-5xl px-4 py-24 sm:px-6 lg:px-8">
      <ScrollReveal>
        <h1 className="mb-16 text-4xl font-bold text-text-primary sm:text-5xl">
          {t("title")}
        </h1>
      </ScrollReveal>

      <div className="grid items-start gap-16 lg:grid-cols-2">
        <div>
          <ScrollReveal delay={0.1} className="space-y-4">
            <p className="text-lg leading-relaxed text-text-primary">{t("bio_1")}</p>
            <p className="mt-6 text-xs uppercase tracking-wider text-accent-primary">
              {t("focus_label")}
            </p>
            <p className="text-text-primary">{t("focus_value")}</p>
          </ScrollReveal>

          <ScrollReveal delay={0.2} className="mt-8 space-y-4">
            <p className="leading-relaxed text-text-muted">{t("bio_2")}</p>
            <p className="leading-relaxed text-text-muted">{t("bio_3")}</p>
          </ScrollReveal>
        </div>

        {/* Prawa — specjalizacje + podejście */}
        <div className="space-y-10">
          <ScrollReveal delay={0.15}>
            <h2 className="mb-6 text-xl font-bold text-text-primary">
              {t("skills_title")}
            </h2>
            <ul className="space-y-3">
              {skills.map((skill, i) => {
                const Icon = SKILL_ICONS[i] ?? Terminal;
                return (
                  <li
                    key={i}
                    className="slide-in flex items-start gap-3 rounded-sincore-md border border-border-subtle bg-surface p-3 transition-colors duration-fast hover:border-border-strong"
                    style={{ animationDelay: `${120 + i * 60}ms` }}
                  >
                    <Icon size={16} className="mt-0.5 shrink-0 text-accent-primary" />
                    <span className="text-sm text-text-primary">{skill}</span>
                  </li>
                );
              })}
            </ul>
          </ScrollReveal>

          <ScrollReveal delay={0.25}>
            <div className="border-l-2 border-accent-primary pl-5">
              <h3 className="mb-3 text-xs uppercase tracking-wider text-accent-primary">
                {t("approach_title")}
              </h3>
              <p className="text-sm italic leading-relaxed text-text-muted">
                {t("approach")}
              </p>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </div>
  );
}
