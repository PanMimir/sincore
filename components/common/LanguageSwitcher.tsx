"use client";

import Link from "next/link";
import { useLocale } from "next-intl";
import { usePathname } from "next/navigation";
import { routing } from "@/lib/routing";

interface LanguageSwitcherProps {
  articleSlugMap?: Record<string, Record<string, string>>;
}

/**
 * Przełącznik języka.
 *
 * Świadomie na <Link>, nie na <button> z router.push(): przełącznik musi być
 * prawdziwym odnośnikiem, żeby robot wyszukiwarki miał czym przejść do drugiej
 * wersji językowej, a użytkownik mógł otworzyć ją w nowej karcie albo skopiować
 * adres. Wcześniej angielska wersja serwisu wisiała wyłącznie na mapie strony.
 */
export default function LanguageSwitcher({ articleSlugMap }: LanguageSwitcherProps) {
  const locale = useLocale();
  const pathname = usePathname();

  /** Adres tej samej strony w innym języku. Artykuły mają różne sligi — stąd id-mapa. */
  const hrefFor = (target: string): string => {
    const segments = pathname.split("/");

    if (segments[2] === "knowledge" && segments[3] && articleSlugMap) {
      const currentSlug = segments[3];
      const entry = Object.values(articleSlugMap).find((m) => m[locale] === currentSlug);
      const targetSlug = entry?.[target];
      // Brak tłumaczenia artykułu → lista bazy wiedzy, nie martwy adres.
      return targetSlug ? `/${target}/knowledge/${targetSlug}` : `/${target}/knowledge`;
    }

    segments[1] = target;
    return segments.join("/") || `/${target}`;
  };

  return (
    <div className="flex items-center gap-1 font-mono text-sm">
      {routing.locales.map((loc, i) => {
        const isCurrent = locale === loc;
        return (
          <span key={loc} className="flex items-center">
            {i > 0 && (
              <span className="mx-1 text-border-strong" aria-hidden="true">
                /
              </span>
            )}
            <Link
              href={hrefFor(loc)}
              hrefLang={loc}
              lang={loc}
              aria-current={isCurrent ? "true" : undefined}
              className={
                isCurrent
                  ? "font-bold text-accent-primary"
                  : "text-text-muted transition-colors duration-fast hover:text-text-primary"
              }
            >
              {loc.toUpperCase()}
            </Link>
          </span>
        );
      })}
    </div>
  );
}
