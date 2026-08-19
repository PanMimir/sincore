import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { getCheatsheet } from "@/services/cheatsheetService";
import CheatsheetClient from "./CheatsheetClient";

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: "cheatsheet" });
  return {
    title: t("title"),
    description: t("subtitle"),
  };
}

export default async function CheatsheetPage({
  params,
}: {
  params: { locale: string };
}) {
  const cheatsheet = await getCheatsheet(params.locale);
  return <CheatsheetClient cheatsheet={cheatsheet} />;
}
