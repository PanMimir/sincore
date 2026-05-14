"use client";

import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import { Mail } from "lucide-react";
import ScrollReveal from "@/components/common/ScrollReveal";

export default function CtaSection() {
  const t = useTranslations("home");
  const locale = useLocale();

  return (
    <section className="py-24 border-t border-cyber-gray">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <ScrollReveal>
          <h2 className="font-mono font-bold text-3xl sm:text-4xl text-cyber-text mb-4">
            {t("cta_title")}
          </h2>
          <p className="text-cyber-muted mb-10 max-w-lg mx-auto leading-relaxed">
            {t("cta_subtitle")}
          </p>
          <Link
            href={`/${locale}/contact`}
            className="inline-flex items-center gap-2 px-8 py-4 bg-cyber-purple hover:bg-cyber-purple-bright text-white font-mono text-sm rounded transition-all duration-200 shadow-glow-purple-sm hover:shadow-glow-purple"
          >
            <Mail size={16} />
            {t("cta_button")}
          </Link>
        </ScrollReveal>
      </div>
    </section>
  );
}
