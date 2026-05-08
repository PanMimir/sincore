import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { getAllArticles } from "@/services/articleService";
import KnowledgeClient from "./KnowledgeClient";

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: "knowledge" });
  return { title: t("title") };
}

export default async function KnowledgePage({
  params,
}: {
  params: { locale: string };
}) {
  const articles = await getAllArticles(params.locale);
  return <KnowledgeClient articles={articles} />;
}
