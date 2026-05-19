"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "next/navigation";
import { routing } from "@/lib/routing";

interface LanguageSwitcherProps {
  articleSlugMap?: Record<string, Record<string, string>>;
}

export default function LanguageSwitcher({ articleSlugMap }: LanguageSwitcherProps) {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const switchLocale = (newLocale: string) => {
    const segments = pathname.split("/");

    if (segments[2] === "knowledge" && segments[3] && articleSlugMap) {
      const currentSlug = segments[3];
      const entry = Object.values(articleSlugMap).find((m) => m[locale] === currentSlug);
      const targetSlug = entry?.[newLocale];
      if (targetSlug) {
        router.push(`/${newLocale}/knowledge/${targetSlug}`);
      } else {
        router.push(`/${newLocale}/knowledge`);
      }
      return;
    }

    segments[1] = newLocale;
    router.push(segments.join("/"));
  };

  return (
    <div className="flex items-center gap-1 font-mono text-sm">
      {routing.locales.map((loc, i) => (
        <span key={loc} className="flex items-center">
          {i > 0 && <span className="text-border-strong mx-1">/</span>}
          <button
            onClick={() => switchLocale(loc)}
            className={
              locale === loc
                ? "text-accent-primary font-bold"
                : "text-text-muted hover:text-text-primary transition-colors duration-fast"
            }
          >
            {loc.toUpperCase()}
          </button>
        </span>
      ))}
    </div>
  );
}
