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
    <section className="border-t border-border-subtle py-24">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          <ScrollReveal>
            <h2 className="mb-6 text-3xl font-bold tracking-tight text-text-primary">
              {t("about_title")}
            </h2>
            <p className="mb-8 leading-relaxed text-text-secondary">{t("about_bio")}</p>
            <Link
              href={`/${locale}/about`}
              className="inline-flex items-center gap-2 text-sm font-medium text-accent-primary transition-colors duration-fast hover:text-accent-hover"
            >
              {t("about_cta")} <ArrowRight size={14} />
            </Link>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <div className="space-y-3">
              {highlights.map((item, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 rounded-sincore-lg border border-border-subtle bg-surface p-4 transition-colors duration-fast hover:border-border-strong"
                >
                  <span className="mt-0.5 shrink-0 text-sm text-accent-primary">▸</span>
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
