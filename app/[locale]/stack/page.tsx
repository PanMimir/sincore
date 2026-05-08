import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import rawData from "@/data/techstack.json";
import TechStackContent, { type TechCategory } from "./TechStackContent";

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: "stack" });
  return { title: t("title") };
}

export default async function StackPage({
  params,
}: {
  params: { locale: string };
}) {
  return <TechStackContent locale={params.locale} data={rawData as TechCategory[]} />;
}
