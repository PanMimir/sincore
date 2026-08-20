import type { Metadata } from "next";
import { pageMetadata } from "@/lib/metadata";
import { getTranslations, setRequestLocale } from "next-intl/server";
import rawData from "@/data/techstack.json";
import { getAllProjects } from "@/services/projectService";
import { getArticleSlugMap, getAllArticles } from "@/services/articleService";
import TechStackContent, {
  type ResolvedCategory,
  type ResolvedEvidence,
} from "./TechStackContent";

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: "stack" });
  return pageMetadata({
    locale: params.locale,
    path: "stack",
    title: t("title"),
    description: t("seo_description"),
  });
}

// ── Kształt danych w data/techstack.json ─────────────────────────────────────
type Localized = Record<string, string>;

interface RawEvidence {
  kind: "project" | "article" | "note";
  slug?: string;
  id?: string;
  label?: Localized;
}

interface RawItem {
  name: Localized;
  evidence: RawEvidence[];
}

interface RawCategory {
  category: string;
  featured?: boolean;
  label: Localized;
  note?: Localized;
  items: RawItem[];
}

export default async function StackPage({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale);

  const locale = params.locale;
  const pick = (l: Localized | undefined) => (l ? (l[locale] ?? l.en ?? "") : "");

  // Dowody rozwiązujemy na serwerze: tu są pod ręką tytuły projektów i mapa
  // id → slug artykułu w danym języku. Komponent niżej dostaje gotowe odnośniki
  // i nie musi nic wiedzieć o źródłach danych.
  const [projects, slugMap, articles] = await Promise.all([
    getAllProjects(),
    getArticleSlugMap(),
    getAllArticles(locale),
  ]);

  const articleTitleBySlug = new Map(articles.map((a) => [a.slug, a.title]));

  const resolve = (e: RawEvidence): ResolvedEvidence | null => {
    if (e.kind === "note") {
      return { kind: "note", label: pick(e.label) };
    }

    if (e.kind === "project") {
      const project = projects.find((p) => p.slug === e.slug);
      if (!project) return null;
      return {
        kind: "project",
        label: project.title,
        href: `/${locale}/projects/${project.slug}`,
      };
    }

    // Artykuł: ten sam tekst ma inny slug w każdym języku, stąd mapa po id.
    const slug = e.id ? slugMap[e.id]?.[locale] : undefined;
    if (!slug) return null;
    return {
      kind: "article",
      label: articleTitleBySlug.get(slug) ?? slug,
      href: `/${locale}/knowledge/${slug}`,
    };
  };

  const data: ResolvedCategory[] = (rawData as RawCategory[]).map((cat) => ({
    category: cat.category,
    featured: cat.featured ?? false,
    label: pick(cat.label),
    note: cat.note ? pick(cat.note) : undefined,
    items: cat.items.map((item) => ({
      name: pick(item.name),
      evidence: item.evidence
        .map(resolve)
        .filter((e): e is ResolvedEvidence => e !== null),
    })),
  }));

  return <TechStackContent data={data} />;
}
