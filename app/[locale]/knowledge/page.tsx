import type { Metadata } from "next";
import { pageMetadata } from "@/lib/metadata";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getAllArticles } from "@/services/articleService";
import KnowledgeClient from "./KnowledgeClient";

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: "knowledge" });
  return pageMetadata({
    locale: params.locale,
    path: "knowledge",
    title: t("title"),
    description: t("seo_description"),
  });
}

export default async function KnowledgePage({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale);

  const articles = await getAllArticles(params.locale);
  return <KnowledgeClient articles={articles} />;
}
