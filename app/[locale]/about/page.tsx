import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import AboutContent from "./AboutContent";

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: "about" });
  return { title: t("title") };
}

export default async function AboutPage() {
  return <AboutContent />;
}
