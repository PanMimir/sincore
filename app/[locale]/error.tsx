"use client";

import { useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import { RotateCw } from "lucide-react";

/**
 * Awaria renderowania po stronie klienta. Bez tego pliku użytkownik dostawał surowy
 * ekran błędu Next.js. Komunikat mówi, co się stało i co można zrobić — bez
 * przepraszania i bez pokazywania treści wyjątku, która i tak nic mu nie powie.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations("error");
  const locale = useLocale();

  useEffect(() => {
    // Do konsoli przeglądarki i logów Vercela — stamtąd da się dojść do przyczyny.
    console.error("[sincore]", error);
  }, [error]);

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-3xl flex-col justify-center px-4 py-24 sm:px-6 lg:px-8">
      <p className="mb-4 font-mono text-sm tracking-[0.2em] text-warning-400">
        {t("label")}
      </p>

      <h1 className="mb-4 text-4xl font-bold tracking-tight text-text-primary sm:text-5xl">
        {t("title")}
      </h1>

      <p className="mb-10 max-w-xl text-base leading-relaxed text-text-muted">
        {t("description")}
      </p>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={reset}
          className="press inline-flex h-12 items-center gap-2 rounded-sincore-md bg-accent-400 px-6 font-mono text-sm font-bold text-neutral-950 transition-colors duration-fast hover:bg-accent-300"
        >
          <RotateCw size={16} />
          {t("retry")}
        </button>

        <Link
          href={`/${locale}`}
          className="inline-flex h-12 items-center gap-2 rounded-sincore-md border border-border-strong px-6 font-mono text-sm font-semibold text-text-primary transition-colors duration-fast hover:bg-surface-elevated"
        >
          {t("home")}
        </Link>
      </div>

      {error.digest && (
        <p className="mt-8 font-mono text-xs text-text-muted">
          {t("reference")}: <span className="text-text-secondary">{error.digest}</span>
        </p>
      )}
    </div>
  );
}
