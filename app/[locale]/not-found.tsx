import Link from "next/link";
import { getLocale, getTranslations } from "next-intl/server";
import { ArrowRight, BookOpen, Boxes } from "lucide-react";

/**
 * Strona 404 w brandzie i w języku czytelnika.
 *
 * Domyślna strona Next.js pokazywała białe "This page could not be found" — bez
 * nawigacji, bez stopki, po angielsku także polskiemu czytelnikowi i bez jednego
 * odnośnika, którym można wrócić. Zabłądzona wizyta z linkami to wizyta uratowana.
 */
export default async function NotFound() {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: "notFound" });

  const links = [
    { href: `/${locale}/knowledge`, label: t("link_knowledge"), Icon: BookOpen },
    { href: `/${locale}/projects`, label: t("link_projects"), Icon: Boxes },
  ];

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-3xl flex-col justify-center px-4 py-24 sm:px-6 lg:px-8">
      <p className="mb-4 font-mono text-sm tracking-[0.2em] text-accent-primary">404</p>

      <h1 className="mb-4 text-4xl font-bold tracking-tight text-text-primary sm:text-5xl">
        {t("title")}
      </h1>

      <p className="mb-10 max-w-xl text-base leading-relaxed text-text-muted">
        {t("description")}
      </p>

      <div className="flex flex-wrap gap-3">
        {links.map(({ href, label, Icon }) => (
          <Link
            key={href}
            href={href}
            className="inline-flex h-12 items-center gap-2 rounded-sincore-md border border-border-strong px-6 font-mono text-sm font-semibold text-text-primary transition-colors duration-fast hover:bg-surface-elevated"
          >
            <Icon size={16} />
            {label}
          </Link>
        ))}

        <Link
          href={`/${locale}`}
          className="inline-flex h-12 items-center gap-2 rounded-sincore-md bg-accent-400 px-6 font-mono text-sm font-bold text-neutral-950 transition-colors duration-fast hover:bg-accent-300"
        >
          {t("link_home")}
          <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
}
