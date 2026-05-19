import { notFound } from"next/navigation";
import { getTranslations } from"next-intl/server";
import type { Metadata } from"next";
import Link from"next/link";
import { ArrowLeft, Calendar, ExternalLink, Tag } from"lucide-react";
import { getAllArticles, getArticleBySlug, getArticleSlugMap } from"@/services/articleService";

export async function generateStaticParams({
  params,
}: {
  params: { locale: string };
}) {
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

  // Hreflang: znajdź ekwiwalent w drugim języku przez id-mapę
  const slugMap = await getArticleSlugMap();
  const entry = slugMap[article.id];
  const languages: Record<string, string> = {};
  if (entry?.pl) languages.pl = `/pl/knowledge/${entry.pl}`;
  if (entry?.en) languages.en = `/en/knowledge/${entry.en}`;
  if (entry?.en) languages["x-default"] = `/en/knowledge/${entry.en}`;

  return {
    title: article.title,
    description: article.description,
    alternates: {
      canonical: `/${params.locale}/knowledge/${params.slug}`,
      languages,
    },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: { locale: string; slug: string };
}) {
  const [article, tCommon, tKnowledge] = await Promise.all([
    getArticleBySlug(params.slug, params.locale),
    getTranslations({ locale: params.locale, namespace:"common" }),
    getTranslations({ locale: params.locale, namespace:"knowledge" }),
  ]);

  if (!article) notFound();

  const formattedDate = article.date
    ? new Date(article.date).toLocaleDateString(
        params.locale ==="pl" ?"pl-PL" :"en-US",
        { year:"numeric", month:"long", day:"numeric" }
      )
    : null;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
      {/* Powrót */}
      <Link
        href={`/${params.locale}/knowledge`}
        className="inline-flex items-center gap-2 font-mono text-sm text-text-muted hover:text-accent-primary transition-colors mb-10"
      >
        <ArrowLeft size={14} />
        {tCommon("back")}
      </Link>

      {/* Nagłówek artykułu */}
      <header className="mb-10 pb-8 border-b border-border-subtle">
        {formattedDate && (
          <div className="flex items-center gap-1.5 text-text-muted font-mono text-xs mb-4">
            <Calendar size={12} />
            {formattedDate}
          </div>
        )}
        <h1 className="font-bold tracking-tight text-3xl sm:text-4xl text-text-primary mb-4 leading-tight">
          {article.title}
        </h1>
        <p className="text-text-muted text-base leading-relaxed mb-5">
          {article.description}
        </p>
        {article.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {article.tags.map((tag) => (
              <span
                key={tag}
                className="flex items-center gap-1 font-mono text-xs px-2 py-1 bg-surface-elevated/50 text-text-muted rounded"
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
        dangerouslySetInnerHTML={{ __html: article.content ??"" }}
      />

      {/* Źródła */}
      {article.references && article.references.length > 0 && (
        <footer className="mt-12 pt-8 border-t border-border-subtle">
          <h2 className="font-mono text-sm font-semibold text-text-muted uppercase tracking-wider mb-4">
            {tKnowledge("sources")}
          </h2>
          <ul className="space-y-2">
            {article.references.map((ref) => (
              <li key={ref.url}>
                <a
                  href={ref.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 font-mono text-sm text-accent-primary hover:text-text-primary transition-colors"
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
