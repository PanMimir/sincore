import { BASE_URL } from "@/lib/metadata";

interface ArticleJsonLdProps {
  locale: string;
  slug: string;
  title: string;
  description: string;
  date?: string;
  tags?: string[];
  /** Etykieta sekcji nadrzędnej w okruszkach — przetłumaczony tytuł bazy wiedzy. */
  sectionLabel: string;
}

/**
 * Dane strukturalne artykułu: BlogPosting + okruszki nawigacji.
 *
 * Bez tego wyszukiwarka wie o artykule tyle, co z samego HTML-a — nie dostaje daty
 * publikacji, autora ani ścieżki, w której tekst siedzi. Autor wskazywany jest przez
 * @id na wpis Person z globalnego JsonLd, więc opis osoby jest w serwisie jeden.
 */
export default function ArticleJsonLd({
  locale,
  slug,
  title,
  description,
  date,
  tags,
  sectionLabel,
}: ArticleJsonLdProps) {
  const url = `${BASE_URL}/${locale}/knowledge/${slug}`;

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        "@id": `${url}#article`,
        headline: title,
        description,
        url,
        mainEntityOfPage: url,
        inLanguage: locale,
        ...(date ? { datePublished: date, dateModified: date } : {}),
        ...(tags && tags.length > 0 ? { keywords: tags.join(", ") } : {}),
        author: { "@id": `${BASE_URL}/#author` },
        publisher: { "@id": `${BASE_URL}/#author` },
        isPartOf: { "@id": `${BASE_URL}/#website` },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${url}#breadcrumbs`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "sincore",
            item: `${BASE_URL}/${locale}`,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: sectionLabel,
            item: `${BASE_URL}/${locale}/knowledge`,
          },
          { "@type": "ListItem", position: 3, name: title },
        ],
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      // Escapujemy "<", żeby dane nie mogły wyjść ze <script> przez "</script>"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema).replace(/</g, "\\u003c"),
      }}
    />
  );
}
