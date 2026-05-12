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
    <section className="py-24 border-t border-cyber-gray">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          <ScrollReveal>
            <p className="font-mono text-cyber-purple text-sm mb-2">{"$ ./whoami"}</p>
            <h2 className="font-mono font-bold text-3xl text-cyber-text mb-6">
              {t("about_title")}
            </h2>
            <p className="font-mono text-cyber-muted leading-relaxed mb-8">
              {t("about_bio")}
            </p>
            <Link
              href={`/${locale}/about`}
              className="inline-flex items-center gap-2 font-mono text-sm text-cyber-purple hover:text-cyber-purple-bright transition-colors"
            >
              {t("about_cta")} <ArrowRight size={14} />
            </Link>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <div className="space-y-3">
              {highlights.map((item, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 p-4 bg-cyber-dark border border-cyber-gray rounded-lg hover:border-cyber-purple/40 transition-colors"
                >
                  <span className="text-cyber-purple font-mono text-sm mt-0.5 shrink-0">▸</span>
                  <span className="font-mono text-sm text-cyber-muted">{item}</span>
                </div>
              ))}
            </div>
          </ScrollReveal>

        </div>
      </div>
    </section>
  );
}
