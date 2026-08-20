import type { Metadata } from "next";
import { pageMetadata } from "@/lib/metadata";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getCheatsheet } from "@/services/cheatsheetService";
import CheatsheetClient from "./CheatsheetClient";

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: "cheatsheet" });
  return pageMetadata({
    locale: params.locale,
    path: "cheatsheet",
    title: t("title"),
    description: t("seo_description"),
  });
}

export default async function CheatsheetPage({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale);

  const cheatsheet = await getCheatsheet(params.locale);
  return <CheatsheetClient cheatsheet={cheatsheet} />;
}
