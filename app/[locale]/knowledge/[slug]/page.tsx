import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Calendar, ExternalLink, Tag } from "lucide-react";
import {
  getAllArticles,
  getArticleBySlug,
  getArticleSlugMap,
} from "@/services/articleService";
import { pageMetadata } from "@/lib/metadata";
import ArticleJsonLd from "@/components/common/ArticleJsonLd";
import { setRequestLocale } from "next-intl/server";

export async function generateStaticParams({ params }: { params: { locale: string } }) {
  const articles = await getAllArticles(params.locale);
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { locale: string; slug: string };
}): Promise<Metadata> {
  const article = await getArticleBySlug(params.slug, params.locale);
  if (!article) return {};

  // Hreflang: ekwiwalent w drugim języku ma inny slug, więc szukamy go przez id-mapę.
  // Gdy brakuje tłumaczenia, wskazujemy sami na siebie — lepsze to niż martwy adres.
  const slugMap = await getArticleSlugMap();
  const entry = slugMap[article.id] ?? {};

  return pageMetadata({
    locale: params.locale,
    paths: {
      pl: `knowledge/${entry.pl ?? params.slug}`,
      en: `knowledge/${entry.en ?? params.slug}`,
    },
    // titleSeo (opcjonalny) skraca długi tytuł na potrzeby wyniku wyszukiwania,
    // nie ruszając nagłówka artykułu.
    title: article.titleSeo ?? article.title,
    description: article.description,
    type: "article",
    publishedTime: article.date || undefined,
  });
}

export default async function ArticlePage({
  params,
}: {
  params: { locale: string; slug: string };
}) {
  setRequestLocale(params.locale);

  const [article, tCommon, tKnowledge] = await Promise.all([
    getArticleBySlug(params.slug, params.locale),
    getTranslations({ locale: params.locale, namespace: "common" }),
    getTranslations({ locale: params.locale, namespace: "knowledge" }),
  ]);

  if (!article) notFound();

  const formattedDate = article.date
    ? new Date(article.date).toLocaleDateString(
        params.locale === "pl" ? "pl-PL" : "en-US",
        { year: "numeric", month: "long", day: "numeric" }
      )
    : null;

  return (
    <div className="mx-auto max-w-3xl px-4 py-24 sm:px-6 lg:px-8">
      <ArticleJsonLd
        locale={params.locale}
        slug={params.slug}
        title={article.title}
        description={article.description}
        date={article.date}
        tags={article.tags}
        sectionLabel={tKnowledge("title")}
      />

      {/* Powrót */}
      <Link
        href={`/${params.locale}/knowledge`}
        className="mb-10 inline-flex items-center gap-2 font-mono text-sm text-text-muted transition-colors hover:text-accent-primary"
      >
        <ArrowLeft size={14} />
        {tCommon("back")}
      </Link>

      {/* Nagłówek artykułu */}
      <header className="mb-10 border-b border-border-subtle pb-8">
        {formattedDate && (
          <div className="mb-4 flex items-center gap-1.5 font-mono text-xs text-text-muted">
            <Calendar size={12} />
            {formattedDate}
          </div>
        )}
        <h1 className="mb-4 text-3xl font-bold leading-tight tracking-tight text-text-primary sm:text-4xl">
          {article.title}
        </h1>
        <p className="mb-5 text-base leading-relaxed text-text-muted">
          {article.description}
        </p>
        {article.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {article.tags.map((tag) => (
              <span
                key={tag}
                className="bg-surface-elevated/50 flex items-center gap-1 rounded px-2 py-1 font-mono text-xs text-text-muted"
              >
                <Tag size={10} />
                {tag}
              </span>
            ))}
          </div>
        )}
      </header>

      <div
        className="article-content"
        dangerouslySetInnerHTML={{ __html: article.content ?? "" }}
      />

      {/* Źródła */}
      {article.references && article.references.length > 0 && (
        <footer className="mt-12 border-t border-border-subtle pt-8">
          <h2 className="mb-4 font-mono text-sm font-semibold uppercase tracking-wider text-text-muted">
            {tKnowledge("sources")}
          </h2>
          <ul className="space-y-2">
            {article.references.map((ref) => (
              <li key={ref.url}>
                <a
                  href={ref.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 font-mono text-sm text-accent-primary transition-colors hover:text-text-primary"
                >
                  <ExternalLink size={12} />
                  {ref.title}
                </a>
              </li>
            ))}
          </ul>
        </footer>
      )}
    </div>
  );
}
