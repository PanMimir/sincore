"use client";

import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import { Mail } from "lucide-react";
import ScrollReveal from "@/components/common/ScrollReveal";

export default function CtaSection() {
  const t = useTranslations("home");
  const locale = useLocale();

  return (
    <section className="border-t border-border-subtle py-24">
      <div className="mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
        <ScrollReveal>
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
            {t("cta_title")}
          </h2>
          <p className="mx-auto mb-10 max-w-lg leading-relaxed text-text-secondary">
            {t("cta_subtitle")}
          </p>
          <Link
            href={`/${locale}/contact`}
            className="inline-flex h-12 items-center gap-2 rounded-sincore-md bg-accent-400 px-8 text-sm font-bold text-neutral-950 transition-all duration-fast ease-sincore-out hover:-translate-y-px hover:bg-accent-300 active:bg-accent-500"
          >
            <Mail size={16} />
            {t("cta_button")}
          </Link>
        </ScrollReveal>
      </div>
    </section>
  );
}
