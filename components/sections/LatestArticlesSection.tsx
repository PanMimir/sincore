"use client";

import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import KnowledgeCard from "@/components/common/KnowledgeCard";
import ScrollReveal from "@/components/common/ScrollReveal";
import type { Article } from "@/services/articleService";

export default function LatestArticlesSection({ articles }: { articles: Article[] }) {
  const t = useTranslations("home");
  const locale = useLocale();

  if (articles.length === 0) return null;

  return (
    <section className="py-24">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="text-xs uppercase tracking-wider text-accent-primary mb-2">
                {t("articles_label")}
              </p>
              <h2 className="font-bold text-3xl tracking-tight text-text-primary">
                {t("articles_title")}
              </h2>
            </div>
            <Link
              href={`/${locale}/knowledge`}
              className="inline-flex items-center gap-2 text-sm font-medium text-text-secondary hover:text-accent-primary transition-colors duration-fast shrink-0"
            >
              {t("articles_cta")} <ArrowRight size={14} />
            </Link>
          </div>
        </ScrollReveal>

        <div className="grid md:grid-cols-3 gap-6">
          {articles.map((article, i) => (
            <KnowledgeCard key={article.slug} article={article} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
