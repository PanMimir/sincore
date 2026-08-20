"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import KnowledgeCard from "@/components/common/KnowledgeCard";
import type { Article } from "@/services/articleService";

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
    <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
      {/* Nagłówek */}
      <div className="mb-12">
        <h1 className="mb-4 text-4xl font-bold tracking-tight text-text-primary sm:text-5xl">
          {t("title")}
        </h1>
        <p className="text-base text-text-muted">{t("subtitle")}</p>
      </div>

      {/* Wyszukiwarka */}
      <div className="relative mb-6">
        <Search
          size={16}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
        />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t("search_placeholder")}
          aria-label={t("search_label")}
          className="w-full max-w-md rounded border border-border-subtle bg-transparent py-2 pl-9 pr-4 font-mono text-sm text-text-primary transition-colors placeholder:text-text-muted focus:border-accent-primary focus:outline-none"
        />
      </div>

      {/* Filtry tagów */}
      {allTags.length > 0 && (
        <div className="mb-10 flex flex-wrap gap-2">
          <button
            type="button"
            aria-pressed={activeTag === null}
            onClick={() => setActiveTag(null)}
            className={cn(
              "rounded border px-3 py-1.5 font-mono text-sm transition-all duration-fast",
              activeTag === null
                ? "bg-accent-primary/20 border-accent-primary text-accent-primary"
                : "hover:border-accent-primary/50 border-border-subtle text-text-muted hover:text-text-primary"
            )}
          >
            {t("all")} ({articles.length})
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              type="button"
              aria-pressed={activeTag === tag}
              onClick={() => setActiveTag(tag === activeTag ? null : tag)}
              className={cn(
                "rounded border px-3 py-1.5 font-mono text-sm transition-all duration-fast",
                activeTag === tag
                  ? "bg-accent-primary/20 border-accent-primary text-accent-primary"
                  : "hover:border-accent-primary/50 border-border-subtle text-text-muted hover:text-text-primary"
              )}
            >
              #{tag}
            </button>
          ))}
        </div>
      )}

      {/* Siatka kart */}
      {filtered.length === 0 ? (
        <p className="py-16 text-center font-mono text-text-muted">{t("no_articles")}</p>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((article, i) => (
            <KnowledgeCard key={article.slug} article={article} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
