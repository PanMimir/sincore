"use client";

import { useState } from"react";
import { useTranslations } from"next-intl";
import { Search } from"lucide-react";
import { cn } from"@/lib/utils";
import KnowledgeCard from"@/components/common/KnowledgeCard";
import type { Article } from"@/services/articleService";

export default function KnowledgeClient({ articles }: { articles: Article[] }) {
  const t = useTranslations("knowledge");
  const [query, setQuery] = useState("");
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const allTags = Array.from(new Set(articles.flatMap((a) => a.tags))).sort();

  const filtered = articles.filter((a) => {
    const matchesTag = !activeTag || a.tags.includes(activeTag);
    if (!matchesTag) return false;
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return (
      a.title.toLowerCase().includes(q) ||
      a.description.toLowerCase().includes(q) ||
      a.tags.some((tag) => tag.toLowerCase().includes(q))
    );
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
      {/* Nagłówek */}
      <div className="mb-12">
        <h1 className="font-bold tracking-tight text-4xl sm:text-5xl text-text-primary mb-4">
          {t("title")}
        </h1>
        <p className="text-text-muted text-base">{t("subtitle")}</p>
      </div>

      {/* Wyszukiwarka */}
      <div className="relative mb-6">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none"
        />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t("search_placeholder")}
          className="w-full max-w-md pl-9 pr-4 py-2 bg-transparent border border-border-subtle rounded font-mono text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-primary transition-colors"
        />
      </div>

      {/* Filtry tagów */}
      {allTags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-10">
          <button
            onClick={() => setActiveTag(null)}
            className={cn(
"font-mono text-sm px-3 py-1.5 rounded border transition-all duration-fast",
              activeTag === null
                ?"bg-accent-primary/20 border-accent-primary text-accent-primary"
                :"border-border-subtle text-text-muted hover:border-accent-primary/50 hover:text-text-primary"
            )}
          >
            {t("all")} ({articles.length})
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setActiveTag(tag === activeTag ? null : tag)}
              className={cn(
"font-mono text-sm px-3 py-1.5 rounded border transition-all duration-fast",
                activeTag === tag
                  ?"bg-accent-primary/20 border-accent-primary text-accent-primary"
                  :"border-border-subtle text-text-muted hover:border-accent-primary/50 hover:text-text-primary"
              )}
            >
              #{tag}
            </button>
          ))}
        </div>
      )}

      {/* Siatka kart */}
      {filtered.length === 0 ? (
        <p className="font-mono text-text-muted text-center py-16">{t("no_articles")}</p>
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
