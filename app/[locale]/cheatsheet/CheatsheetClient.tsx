"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Check, Copy, ExternalLink, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Cheatsheet, CheatItem } from "@/services/cheatsheetService";

function CopyChip({ code }: { code: string }) {
  const t = useTranslations("cheatsheet");
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
    } catch {
      // Schowek bywa zablokowany (brak HTTPS, uprawnienia) — wtedy po prostu nic.
    }
  };

  useEffect(() => {
    if (!copied) return;
    const id = setTimeout(() => setCopied(false), 1400);
    return () => clearTimeout(id);
  }, [copied]);

  return (
    <button
      onClick={copy}
      title={copied ? t("copied") : t("copy")}
      aria-label={`${t("copy")}: ${code}`}
      className="group/chip inline-flex items-center gap-2 font-mono text-sm text-accent-primary bg-accent-primary/5 border border-accent-primary/25 rounded px-2.5 py-1 text-left hover:bg-accent-primary/10 hover:border-accent-primary/50 transition-colors duration-fast"
    >
      {/* pre-wrap, bo dłuższe komendy (np. cel skrótu na pulpicie) muszą się zawinąć w kolumnie */}
      <span className="whitespace-pre-wrap">{code}</span>
      {copied ? (
        <Check size={12} className="shrink-0 text-success-400" />
      ) : (
        <Copy
          size={12}
          className="shrink-0 text-text-muted opacity-0 group-hover/chip:opacity-100 transition-opacity duration-fast"
        />
      )}
    </button>
  );
}

function ItemRow({ item }: { item: CheatItem }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-[minmax(0,15rem)_1fr] gap-2 sm:gap-6 py-3.5 border-b border-border-subtle last:border-b-0">
      <div className="sm:pt-0.5">
        {item.code ? (
          <CopyChip code={item.code} />
        ) : (
          <span className="text-sm font-semibold text-text-primary">{item.term}</span>
        )}
      </div>
      <p className="text-sm text-text-secondary leading-relaxed">{item.desc}</p>
    </div>
  );
}

export default function CheatsheetClient({ cheatsheet }: { cheatsheet: Cheatsheet }) {
  const t = useTranslations("cheatsheet");
  const [query, setQuery] = useState("");
  const [activeSection, setActiveSection] = useState(cheatsheet.sections[0]?.id ?? "");

  const q = query.trim().toLowerCase();

  const sections = useMemo(() => {
    if (!q) return cheatsheet.sections;
    return cheatsheet.sections
      .map((section) => ({
        ...section,
        items: section.items.filter((item) =>
          [item.code, item.term, item.desc]
            .filter(Boolean)
            .some((field) => field!.toLowerCase().includes(q))
        ),
      }))
      .filter((section) => section.items.length > 0);
  }, [cheatsheet.sections, q]);

  const itemCount = cheatsheet.sections.reduce((sum, s) => sum + s.items.length, 0);
  const foundCount = sections.reduce((sum, s) => sum + s.items.length, 0);

  // Podświetlanie sekcji w spisie treści w miarę przewijania.
  useEffect(() => {
    const headings = cheatsheet.sections
      .map((s) => document.getElementById(s.id))
      .filter((el): el is HTMLElement => el !== null);
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length > 0) setActiveSection(visible[0].target.id);
      },
      { rootMargin: "-80px 0px -70% 0px" }
    );

    headings.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [cheatsheet.sections, sections]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
      {/* Nagłówek */}
      <div className="mb-10 max-w-3xl">
        <h1 className="font-bold tracking-tight text-4xl sm:text-5xl text-text-primary mb-4">
          {t("title")}
        </h1>
        <p className="text-text-secondary text-base leading-relaxed mb-4">{t("subtitle")}</p>
        <p className="text-text-muted text-sm leading-relaxed">{t("lead")}</p>
      </div>

      {/* Wyszukiwarka */}
      <div className="relative mb-4">
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

      <p className="font-mono text-xs text-text-muted mb-10">
        {q ? t("found", { count: foundCount }) : t("total", { count: itemCount })}
      </p>

      <div className="lg:grid lg:grid-cols-[16rem_1fr] lg:gap-12 lg:items-start">
        {/* Spis treści */}
        <nav className="hidden lg:block sticky top-24">
          <p className="font-mono text-xs uppercase tracking-wider text-text-muted mb-3">
            {t("contents")}
          </p>
          <ul className="space-y-1 border-l border-border-subtle">
            {cheatsheet.sections.map((section) => (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  className={cn(
                    "block text-sm py-1.5 pl-4 -ml-px border-l transition-colors duration-fast",
                    activeSection === section.id
                      ? "border-accent-primary text-accent-primary"
                      : "border-transparent text-text-muted hover:text-text-primary"
                  )}
                >
                  {section.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Treść */}
        <div className="min-w-0">
          {sections.length === 0 ? (
            <p className="font-mono text-text-muted py-16">{t("no_results")}</p>
          ) : (
            sections.map((section) => (
              <section key={section.id} className="mb-16 scroll-mt-24" id={section.id}>
                <h2 className="font-bold tracking-tight text-2xl text-text-primary mb-3">
                  {section.label}
                </h2>
                <p className="text-text-secondary text-sm leading-relaxed mb-6 max-w-3xl">
                  {section.intro}
                </p>

                <div className="border border-border-subtle rounded-sincore-lg bg-surface px-5">
                  {section.items.map((item, i) => (
                    <ItemRow key={item.code ?? item.term ?? i} item={item} />
                  ))}
                </div>

                {section.note && !q && (
                  <div className="border-l-2 border-accent-primary/40 pl-5 py-3 mt-6 bg-neutral-900/20 max-w-3xl">
                    <h3 className="font-mono text-xs uppercase tracking-wider text-text-muted mb-2">
                      {t("note")}
                    </h3>
                    <p className="text-sm text-text-secondary leading-relaxed">{section.note}</p>
                  </div>
                )}
              </section>
            ))
          )}

          {/* Stopka ściągi */}
          <div className="border border-border-subtle rounded-sincore-lg p-6 bg-surface max-w-3xl">
            <h3 className="font-mono text-xs uppercase tracking-wider text-text-muted mb-3">
              {t("disclaimer_label")}
            </h3>
            <p className="text-sm text-text-secondary leading-relaxed mb-4">
              {t("disclaimer", { date: cheatsheet.updated })}
            </p>
            <a
              href={cheatsheet.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-accent-primary hover:text-accent-hover transition-colors duration-fast"
            >
              {t("docs_link")}
              <ExternalLink size={13} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
