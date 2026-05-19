"use client";

import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { motion } from "framer-motion";
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
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
      className="group flex flex-col bg-surface border border-border-subtle rounded-sincore-xl p-6 hover:border-border-strong transition-colors duration-normal"
    >
      {formattedDate && (
        <div className="flex items-center gap-1.5 text-text-muted font-mono text-xs mb-3">
          <Calendar size={12} />
          {formattedDate}
        </div>
      )}

      <Link
        href={`/${locale}/knowledge/${article.slug}`}
        className="font-bold text-lg tracking-tight text-text-primary hover:text-accent-primary transition-colors duration-fast leading-snug mb-2"
      >
        {article.title}
      </Link>

      <p className="text-text-secondary text-sm leading-relaxed mb-4 flex-1">
        {article.description}
      </p>

      {article.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          {article.tags.map((tag) => (
            <span
              key={tag}
              className="flex items-center gap-1 font-mono text-xs px-2 py-0.5 bg-surface-elevated text-text-muted rounded"
            >
              <Tag size={10} />
              {tag}
            </span>
          ))}
        </div>
      )}

      <Link
        href={`/${locale}/knowledge/${article.slug}`}
        className="inline-flex items-center gap-1.5 text-xs font-medium text-accent-primary hover:text-accent-hover transition-colors duration-fast mt-auto"
      >
        {t("read_more")}
        <ArrowRight size={12} />
      </Link>
    </motion.article>
  );
}
