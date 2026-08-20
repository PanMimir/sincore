"use client";

import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { ArrowRight, Calendar, Tag } from "lucide-react";
import type { Article } from "@/services/articleService";

interface KnowledgeCardProps {
  article: Article;
  index?: number;
}

export default function KnowledgeCard({ article, index = 0 }: KnowledgeCardProps) {
  const t = useTranslations("knowledge");
  const locale = useLocale();

  const formattedDate = article.date
    ? new Date(article.date).toLocaleDateString(locale === "pl" ? "pl-PL" : "en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : null;

  return (
    <article
      // Kaskada zatrzymuje się na piątej karcie. Wcześniej opóźnienie rosło bez końca
      // i przy czternastu artykułach ostatnia karta pojawiała się po ~1,1 s.
      className="fade-rise group relative flex flex-col rounded-sincore-xl border border-border-subtle bg-surface p-6 transition-colors duration-normal hover:border-border-strong"
      style={{ animationDelay: `${Math.min(index, 4) * 60}ms` }}
    >
      {formattedDate && (
        <div className="mb-3 flex items-center gap-1.5 font-mono text-xs text-text-muted">
          <Calendar size={12} />
          {formattedDate}
        </div>
      )}

      {/* Jeden link na całą kartę: ::after rozciąga obszar klikalny na cały kafelek,
          więc czytnik ekranu widzi jedno odniesienie zamiast dwóch prowadzących w to
          samo miejsce, a mysz trafia w kartę, nie w sam tytuł. */}
      <Link
        href={`/${locale}/knowledge/${article.slug}`}
        className="mb-2 text-lg font-bold leading-snug tracking-tight text-text-primary transition-colors duration-fast after:absolute after:inset-0 after:content-[''] hover:text-accent-primary"
      >
        {article.title}
      </Link>

      <p className="mb-4 flex-1 text-sm leading-relaxed text-text-secondary">
        {article.description}
      </p>

      {article.tags.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-1.5">
          {article.tags.map((tag) => (
            <span
              key={tag}
              className="flex items-center gap-1 rounded bg-surface-elevated px-2 py-0.5 font-mono text-xs text-text-muted"
            >
              <Tag size={10} />
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Element wizualny, nie drugi odnośnik — klika się cała karta. */}
      <span className="mt-auto inline-flex items-center gap-1.5 text-xs font-medium text-accent-primary transition-colors duration-fast group-hover:text-accent-hover">
        {t("read_more")}
        <ArrowRight size={12} />
      </span>
    </article>
  );
}
