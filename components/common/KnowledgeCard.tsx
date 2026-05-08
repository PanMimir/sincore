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
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className="group flex flex-col bg-cyber-dark border border-cyber-gray rounded-lg p-6 hover:border-cyber-purple/50 transition-all duration-300 hover:shadow-glow-purple-sm"
    >
      {/* Data */}
      {formattedDate && (
        <div className="flex items-center gap-1.5 text-cyber-muted font-mono text-xs mb-3">
          <Calendar size={12} />
          {formattedDate}
        </div>
      )}

      {/* Tytuł */}
      <Link
        href={`/${locale}/knowledge/${article.slug}`}
        className="font-mono font-bold text-lg text-cyber-text hover:text-cyber-purple transition-colors leading-snug mb-2"
      >
        {article.title}
      </Link>

      {/* Opis */}
      <p className="text-cyber-muted text-sm leading-relaxed mb-4 flex-1">
        {article.description}
      </p>

      {/* Tagi */}
      {article.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          {article.tags.map((tag) => (
            <span
              key={tag}
              className="flex items-center gap-1 font-mono text-xs px-2 py-0.5 bg-cyber-gray/50 text-cyber-muted rounded"
            >
              <Tag size={10} />
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Link do artykułu */}
      <Link
        href={`/${locale}/knowledge/${article.slug}`}
        className="flex items-center gap-1.5 font-mono text-xs text-cyber-purple hover:text-cyber-purple-bright transition-colors mt-auto"
      >
        {t("read_more")}
        <ArrowRight size={12} />
      </Link>
    </motion.article>
  );
}
