import Link from "next/link";
import { getTranslations, getLocale } from "next-intl/server";
import { BookOpen, Boxes, Circle } from "lucide-react";
import { cn } from "@/lib/utils";
import ScrollReveal from "@/components/common/ScrollReveal";

export interface ResolvedEvidence {
  kind: "project" | "article" | "note";
  label: string;
  href?: string;
}

export interface ResolvedItem {
  name: string;
  evidence: ResolvedEvidence[];
}

export interface ResolvedCategory {
  category: string;
  featured: boolean;
  label: string;
  note?: string;
  items: ResolvedItem[];
}

const EVIDENCE_ICON = {
  project: Boxes,
  article: BookOpen,
  note: Circle,
} as const;

/**
 * Stos technologiczny jako lista dowodów, nie deklaracji.
 *
 * Poprzednia wersja pokazywała paski poziomu w procentach. Zniknęły z dwóch powodów.
 * Praktyczny: nie działały — kolor paska brał się z `.split("")[0]`, co zwracało
 * literę "b" zamiast nazwy klasy, a `animate={{ width: undefined }}` kasowało
 * wyliczoną szerokość, więc każdy pasek miał 0 px i był przezroczysty. Ważniejszy:
 * "Java 75%" nie znaczy nic, bo to ocena wystawiona sobie samemu. Odnośnik do
 * wydanego projektu albo napisanego artykułu da się sprawdzić — i sam się
 * aktualizuje razem z portfolio.
 */
export default async function TechStackContent({ data }: { data: ResolvedCategory[] }) {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: "stack" });

  return (
    <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
      <ScrollReveal>
        <h1 className="mb-4 text-4xl font-bold text-text-primary sm:text-5xl">
          {t("title")}
        </h1>
        <p className="mb-16 max-w-2xl text-base text-text-muted">{t("subtitle")}</p>
      </ScrollReveal>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {data.map((category, catIndex) => (
          <ScrollReveal
            key={category.category}
            delay={catIndex * 0.06}
            // Wiedza domenowa idzie pierwsza i na całą szerokość. To jedyna kategoria,
            // której nie da się nadrobić kursem, więc nie powinna wyglądać jak reszta.
            className={cn(category.featured && "lg:col-span-2")}
          >
            <div
              className={cn(
                "h-full rounded-sincore-xl border bg-surface p-6",
                category.featured ? "border-accent-primary/40" : "border-border-subtle"
              )}
            >
              <div className="mb-6 border-b border-border-subtle pb-4">
                <h2
                  className={cn(
                    "text-lg font-bold",
                    category.featured ? "text-accent-primary" : "text-text-primary"
                  )}
                >
                  {category.label}
                </h2>
                {category.note && (
                  <p className="mt-2 text-sm leading-relaxed text-text-muted">
                    {category.note}
                  </p>
                )}
              </div>

              <ul
                className={cn(
                  "space-y-5",
                  category.featured &&
                    "sm:grid sm:grid-cols-2 sm:gap-x-8 sm:gap-y-5 sm:space-y-0"
                )}
              >
                {category.items.map((item) => (
                  <li key={item.name}>
                    <p className="mb-2 font-mono text-sm text-text-primary">
                      {item.name}
                    </p>

                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5">
                      {item.evidence.map((ev) => {
                        const Icon = EVIDENCE_ICON[ev.kind];
                        const content = (
                          <>
                            <Icon size={11} className="shrink-0" />
                            <span className="truncate">{ev.label}</span>
                          </>
                        );

                        // Notatka nie jest odnośnikiem — nie ma dokąd prowadzić.
                        return ev.href ? (
                          <Link
                            key={`${ev.kind}-${ev.label}`}
                            href={ev.href}
                            className="hover:border-accent-primary/50 inline-flex max-w-full items-center gap-1.5 rounded border border-border-subtle px-2 py-1 font-mono text-xs text-text-secondary transition-colors duration-fast hover:text-accent-primary"
                          >
                            {content}
                          </Link>
                        ) : (
                          <span
                            key={`${ev.kind}-${ev.label}`}
                            className="inline-flex max-w-full items-center gap-1.5 rounded border border-dashed border-border-subtle px-2 py-1 font-mono text-xs text-text-muted"
                          >
                            {content}
                          </span>
                        );
                      })}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </ScrollReveal>
        ))}
      </div>

      <p className="mt-12 max-w-2xl font-mono text-xs leading-relaxed text-text-muted">
        {t("evidence_note")}
      </p>
    </div>
  );
}
