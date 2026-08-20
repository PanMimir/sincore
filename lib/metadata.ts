import type { Metadata } from "next";

// Wspólny budowniczy metadanych stron. Powstał, bo canonical ustawiony raz w layoucie
// językowym dziedziczył się na wszystkie podstrony i każda z nich mówiła wyszukiwarce
// "prawdziwa wersja mnie to strona główna". Teraz każda strona deklaruje własny adres.

export const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "https://sincore.io";

const SITE_NAME = "sincore";

/**
 * Ścieżka bez prefiksu języka, np. "projects" albo "knowledge/modbus-tcp-podstawy".
 * Pusty ciąg = strona główna.
 */
type PagePath = string;

interface AlternatesInput {
  locale: string;
  path?: PagePath;
  /** Gdy adresy w obu językach się różnią (artykuły mają różne sligi). */
  paths?: { pl: string; en: string };
}

/** Canonical + hreflang dla jednej strony. */
export function pageAlternates({ locale, path = "", paths }: AlternatesInput) {
  const withPrefix = (loc: string, p: string) => (p ? `/${loc}/${p}` : `/${loc}`);

  const pl = withPrefix("pl", paths ? paths.pl : path);
  const en = withPrefix("en", paths ? paths.en : path);

  return {
    canonical: withPrefix(locale, paths ? (paths[locale as "pl" | "en"] ?? path) : path),
    languages: { pl, en, "x-default": en },
  };
}

interface PageMetadataInput extends AlternatesInput {
  title: string;
  description: string;
  /** true = tytuł bez doklejanego "| sincore" (strona główna ma markę już w tytule). */
  absoluteTitle?: boolean;
  type?: "website" | "article";
  publishedTime?: string;
}

/**
 * Komplet metadanych strony: tytuł, opis, canonical, hreflang i Open Graph.
 *
 * Open Graph musi być tu w całości, bo Next nadpisuje to pole w całości, a nie
 * scala pole po polu — strona, która poda samo openGraph.title, straci resztę.
 */
export function pageMetadata({
  locale,
  path = "",
  paths,
  title,
  description,
  absoluteTitle = false,
  type = "website",
  publishedTime,
}: PageMetadataInput): Metadata {
  const alternates = pageAlternates({ locale, path, paths });

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates,
    openGraph: {
      title,
      description,
      siteName: SITE_NAME,
      url: alternates.canonical,
      locale: locale === "pl" ? "pl_PL" : "en_US",
      type,
      ...(publishedTime ? { publishedTime } : {}),
    },
  };
}
