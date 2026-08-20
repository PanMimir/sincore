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
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="mb-12 flex items-end justify-between">
            <div>
              <p className="mb-2 text-xs uppercase tracking-wider text-accent-primary">
                {t("articles_label")}
              </p>
              <h2 className="text-3xl font-bold tracking-tight text-text-primary">
                {t("articles_title")}
              </h2>
            </div>
            <Link
              href={`/${locale}/knowledge`}
              className="inline-flex shrink-0 items-center gap-2 text-sm font-medium text-text-secondary transition-colors duration-fast hover:text-accent-primary"
            >
              {t("articles_cta")} <ArrowRight size={14} />
            </Link>
          </div>
        </ScrollReveal>

        <div className="grid gap-6 md:grid-cols-3">
          {articles.map((article, i) => (
            <KnowledgeCard key={article.slug} article={article} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
