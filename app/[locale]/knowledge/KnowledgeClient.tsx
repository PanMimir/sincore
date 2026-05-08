"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import KnowledgeCard from "@/components/common/KnowledgeCard";
import type { Article } from "@/services/articleService";

export default function KnowledgeClient({ articles }: { articles: Article[] }) {
  const t = useTranslations("knowledge");
  const [activeTag, setActiveTag] = useState<string | null>(null);

  // Wszystkie unikalne tagi z wszystkich artykułów
  const allTags = Array.from(new Set(articles.flatMap((a) => a.tags))).sort();

  const filtered = activeTag
    ? articles.filter((a) => a.tags.includes(activeTag))
    : articles;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
      {/* Nagłówek */}
      <div className="mb-12">
        <p className="font-mono text-cyber-purple text-sm mb-2">{"$ cat ./knowledge/**/*.md"}</p>
        <h1 className="font-mono font-bold text-4xl sm:text-5xl text-cyber-text mb-4">
          {t("title")}
        </h1>
        <p className="text-cyber-muted text-base">{t("subtitle")}</p>
      </div>

      {/* Filtry tagów */}
      {allTags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-10">
          <button
            onClick={() => setActiveTag(null)}
            className={cn(
              "font-mono text-sm px-3 py-1.5 rounded border transition-all duration-200",
              activeTag === null
                ? "bg-cyber-purple/20 border-cyber-purple text-cyber-purple"
                : "border-cyber-gray text-cyber-muted hover:border-cyber-purple/50 hover:text-cyber-text"
            )}
          >
            {t("all")} ({articles.length})
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setActiveTag(tag === activeTag ? null : tag)}
              className={cn(
                "font-mono text-sm px-3 py-1.5 rounded border transition-all duration-200",
                activeTag === tag
                  ? "bg-cyber-purple/20 border-cyber-purple text-cyber-purple"
                  : "border-cyber-gray text-cyber-muted hover:border-cyber-purple/50 hover:text-cyber-text"
              )}
            >
              #{tag}
            </button>
          ))}
        </div>
      )}

      {/* Siatka kart */}
      {filtered.length === 0 ? (
        <p className="font-mono text-cyber-muted text-center py-16">{t("no_articles")}</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((article, i) => (
            <KnowledgeCard key={article.slug} article={article} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
