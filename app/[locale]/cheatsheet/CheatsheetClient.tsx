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
      className="group/chip bg-accent-primary/5 border-accent-primary/25 hover:bg-accent-primary/10 hover:border-accent-primary/50 inline-flex items-center gap-2 rounded border px-2.5 py-1 text-left font-mono text-sm text-accent-primary transition-colors duration-fast"
    >
      {/* pre-wrap, bo dłuższe komendy (np. cel skrótu na pulpicie) muszą się zawinąć w kolumnie */}
      <span className="whitespace-pre-wrap">{code}</span>
      {copied ? (
        <Check size={12} className="shrink-0 text-success-400" />
      ) : (
        <Copy
          size={12}
          className="shrink-0 text-text-muted opacity-0 transition-opacity duration-fast group-hover/chip:opacity-100"
        />
      )}
    </button>
  );
}

/** Krótka pozycja: komenda albo zasada w dwóch kolumnach. */
function CompactRow({ item }: { item: CheatItem }) {
  return (
    <div className="grid grid-cols-1 gap-2 border-b border-border-subtle py-3.5 last:border-b-0 sm:grid-cols-[minmax(0,15rem)_1fr] sm:gap-6">
      <div className="sm:pt-0.5">
        {item.code ? (
          <CopyChip code={item.code} />
        ) : (
          <span className="text-sm font-semibold text-text-primary">{item.term}</span>
        )}
      </div>
      <p className="text-sm leading-relaxed text-text-secondary">{item.desc}</p>
    </div>
  );
}

/** Rozbudowana pozycja: technika z cudzego źródła — opis, instrukcja, odnośnik. */
function TechniqueCard({ item }: { item: CheatItem }) {
  const t = useTranslations("cheatsheet");

  return (
    <article className="rounded-sincore-lg border border-border-subtle bg-surface p-6">
      <h3 className="mb-3 text-lg font-bold tracking-tight text-text-primary">
        {item.term}
      </h3>
      <p className="mb-5 text-sm leading-relaxed text-text-secondary">{item.desc}</p>

      {item.how && (
        <div className="border-accent-primary/40 mb-5 border-l-2 bg-neutral-900/20 py-3 pl-5">
          <h4 className="mb-2 font-mono text-xs uppercase tracking-wider text-text-muted">
            {t("how_label")}
          </h4>
          <p className="text-sm leading-relaxed text-text-secondary">{item.how}</p>
        </div>
      )}

      {item.source && (
        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1 border-t border-border-subtle pt-4">
          <span className="font-mono text-xs uppercase tracking-wider text-text-muted">
            {t("source_label")}
          </span>
          <a
            href={item.source.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 break-all text-sm text-accent-primary transition-colors duration-fast hover:text-accent-hover"
          >
            {item.source.label}
            <ExternalLink size={12} className="shrink-0" />
          </a>
        </div>
      )}
    </article>
  );
}

export default function CheatsheetClient({ cheatsheet }: { cheatsheet: Cheatsheet }) {
  const t = useTranslations("cheatsheet");
  const [activeTabId, setActiveTabId] = useState(cheatsheet.tabs[0].id);
  const [query, setQuery] = useState("");
  const [activeSection, setActiveSection] = useState("");

  const activeTab =
    cheatsheet.tabs.find((tab) => tab.id === activeTabId) ?? cheatsheet.tabs[0];
  const q = query.trim().toLowerCase();

  // Zakładka da się podlinkować: /cheatsheet?tab=poziom-wyzej
  useEffect(() => {
    const fromUrl = new URLSearchParams(window.location.search).get("tab");
    if (fromUrl && cheatsheet.tabs.some((tab) => tab.id === fromUrl))
      setActiveTabId(fromUrl);
  }, [cheatsheet.tabs]);

  const selectTab = (id: string) => {
    setActiveTabId(id);
    setQuery("");
    const url = new URL(window.location.href);
    if (id === cheatsheet.tabs[0].id) url.searchParams.delete("tab");
    else url.searchParams.set("tab", id);
    window.history.replaceState(null, "", url);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const sections = useMemo(() => {
    if (!q) return activeTab.sections;
    return activeTab.sections
      .map((section) => ({
        ...section,
        items: section.items.filter((item) =>
          [item.code, item.term, item.desc, item.how]
            .filter(Boolean)
            .some((field) => field!.toLowerCase().includes(q))
        ),
      }))
      .filter((section) => section.items.length > 0);
  }, [activeTab.sections, q]);

  const itemCount = activeTab.sections.reduce((sum, s) => sum + s.items.length, 0);
  const foundCount = sections.reduce((sum, s) => sum + s.items.length, 0);

  // Podświetlanie sekcji w spisie treści w miarę przewijania.
  useEffect(() => {
    const headings = activeTab.sections
      .map((s) => document.getElementById(s.id))
      .filter((el): el is HTMLElement => el !== null);
    if (headings.length === 0) return;

    setActiveSection(activeTab.sections[0].id);
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length > 0) setActiveSection(visible[0].target.id);
      },
      { rootMargin: "-80px 0px -70% 0px" }
    );

    headings.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [activeTab, sections]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
      {/* Nagłówek */}
      <div className="mb-10 max-w-3xl">
        <h1 className="mb-4 text-4xl font-bold tracking-tight text-text-primary sm:text-5xl">
          {t("title")}
        </h1>
        <p className="text-base leading-relaxed text-text-secondary">{t("subtitle")}</p>
      </div>

      {/* Zakładki */}
      <nav
        className="mb-8 flex flex-wrap justify-center gap-2"
        aria-label={t("tabs_aria")}
      >
        {cheatsheet.tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => selectTab(tab.id)}
            aria-current={tab.id === activeTabId ? "page" : undefined}
            className={cn(
              "rounded-sincore-sm border px-5 py-2.5 text-sm font-medium transition-all duration-fast",
              tab.id === activeTabId
                ? "bg-accent-primary/15 border-accent-primary text-accent-primary"
                : "hover:border-accent-primary/50 border-border-subtle text-text-muted hover:text-text-primary"
            )}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {/* Wstęp do zakładki */}
      <p className="mx-auto mb-10 max-w-3xl text-center text-sm leading-relaxed text-text-muted">
        {activeTab.intro}
      </p>

      {/* Wyszukiwarka */}
      <div className="relative mb-4">
        <Search
          size={16}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
        />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t("search_placeholder")}
          className="w-full max-w-md rounded border border-border-subtle bg-transparent py-2 pl-9 pr-4 font-mono text-sm text-text-primary transition-colors placeholder:text-text-muted focus:border-accent-primary focus:outline-none"
        />
      </div>

      <p className="mb-10 font-mono text-xs text-text-muted">
        {q ? t("found", { count: foundCount }) : t("total", { count: itemCount })}
      </p>

      <div className="lg:grid lg:grid-cols-[16rem_1fr] lg:items-start lg:gap-12">
        {/* Spis treści */}
        <nav className="sticky top-24 hidden lg:block">
          <p className="mb-3 font-mono text-xs uppercase tracking-wider text-text-muted">
            {t("contents")}
          </p>
          <ul className="space-y-1 border-l border-border-subtle">
            {activeTab.sections.map((section) => (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  className={cn(
                    "-ml-px block border-l py-1.5 pl-4 text-sm transition-colors duration-fast",
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
            <p className="py-16 font-mono text-text-muted">{t("no_results")}</p>
          ) : (
            sections.map((section) => {
              // Sekcja jest „rozbudowana”, gdy jej pozycje mają źródła — wtedy karty zamiast wierszy.
              const asCards = section.items.some((item) => item.source);

              return (
                <section key={section.id} className="mb-16 scroll-mt-24" id={section.id}>
                  <h2 className="mb-3 text-2xl font-bold tracking-tight text-text-primary">
                    {section.label}
                  </h2>
                  <p className="mb-6 max-w-3xl text-sm leading-relaxed text-text-secondary">
                    {section.intro}
                  </p>

                  {asCards ? (
                    <div className="space-y-4">
                      {section.items.map((item, i) => (
                        <TechniqueCard key={item.term ?? i} item={item} />
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-sincore-lg border border-border-subtle bg-surface px-5">
                      {section.items.map((item, i) => (
                        <CompactRow key={item.code ?? item.term ?? i} item={item} />
                      ))}
                    </div>
                  )}

                  {section.note && !q && (
                    <div className="border-accent-primary/40 mt-6 max-w-3xl border-l-2 bg-neutral-900/20 py-3 pl-5">
                      <h3 className="mb-2 font-mono text-xs uppercase tracking-wider text-text-muted">
                        {t("note")}
                      </h3>
                      <p className="text-sm leading-relaxed text-text-secondary">
                        {section.note}
                      </p>
                    </div>
                  )}
                </section>
              );
            })
          )}

          {/* Stopka ściągi */}
          <div className="max-w-3xl rounded-sincore-lg border border-border-subtle bg-surface p-6">
            <h3 className="mb-3 font-mono text-xs uppercase tracking-wider text-text-muted">
              {t("disclaimer_label")}
            </h3>
            <p className="mb-4 text-sm leading-relaxed text-text-secondary">
              {t("disclaimer", { date: cheatsheet.updated })}
            </p>
            <a
              href={cheatsheet.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-accent-primary transition-colors duration-fast hover:text-accent-hover"
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
