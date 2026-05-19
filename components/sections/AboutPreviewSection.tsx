"use client";

import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import ScrollReveal from "@/components/common/ScrollReveal";

export default function AboutPreviewSection() {
  const t = useTranslations("home");
  const locale = useLocale();
  const highlights = t.raw("about_highlights") as string[];

  return (
    <section className="py-24 border-t border-border-subtle">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          <ScrollReveal>
            <h2 className="font-bold text-3xl tracking-tight text-text-primary mb-6">
              {t("about_title")}
            </h2>
            <p className="text-text-secondary leading-relaxed mb-8">
              {t("about_bio")}
            </p>
            <Link
              href={`/${locale}/about`}
              className="inline-flex items-center gap-2 text-sm font-medium text-accent-primary hover:text-accent-hover transition-colors duration-fast"
            >
              {t("about_cta")} <ArrowRight size={14} />
            </Link>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <div className="space-y-3">
              {highlights.map((item, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 p-4 bg-surface border border-border-subtle rounded-sincore-lg hover:border-border-strong transition-colors duration-fast"
                >
                  <span className="text-accent-primary text-sm mt-0.5 shrink-0">▸</span>
                  <span className="text-sm text-text-secondary">{item}</span>
                </div>
              ))}
            </div>
          </ScrollReveal>

        </div>
      </div>
    </section>
  );
}
