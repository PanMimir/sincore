"use client";

import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import { Mail } from "lucide-react";
import ScrollReveal from "@/components/common/ScrollReveal";

export default function CtaSection() {
  const t = useTranslations("home");
  const locale = useLocale();

  return (
    <section className="py-24 border-t border-border-subtle">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <ScrollReveal>
          <h2 className="font-bold text-3xl sm:text-4xl tracking-tight text-text-primary mb-4">
            {t("cta_title")}
          </h2>
          <p className="text-text-secondary mb-10 max-w-lg mx-auto leading-relaxed">
            {t("cta_subtitle")}
          </p>
          <Link
            href={`/${locale}/contact`}
            className="inline-flex items-center gap-2 h-12 px-8 bg-accent-400 hover:bg-accent-300 active:bg-accent-500 text-neutral-950 font-bold text-sm rounded-sincore-md transition-all duration-fast ease-sincore-out hover:-translate-y-px"
          >
            <Mail size={16} />
            {t("cta_button")}
          </Link>
        </ScrollReveal>
      </div>
    </section>
  );
}
