"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "next/navigation";
import { routing } from "@/lib/routing";

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const switchLocale = (newLocale: string) => {
    // Zamień prefix języka w aktualnej ścieżce i przejdź na nową
    // np. /pl/projects → /en/projects
    const segments = pathname.split("/");
    segments[1] = newLocale;
    router.push(segments.join("/"));
  };

  return (
    <div className="flex items-center gap-1 font-mono text-xs">
      {routing.locales.map((loc, i) => (
        <span key={loc} className="flex items-center">
          {i > 0 && <span className="text-cyber-gray mx-1">/</span>}
          <button
            onClick={() => switchLocale(loc)}
            className={
              locale === loc
                ? "text-cyber-purple font-bold"
                : "text-cyber-muted hover:text-cyber-text transition-colors"
            }
          >
            {loc.toUpperCase()}
          </button>
        </span>
      ))}
    </div>
  );
}
