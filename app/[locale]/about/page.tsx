import type { Metadata } from "next";
import { pageMetadata } from "@/lib/metadata";
import { getTranslations, setRequestLocale } from "next-intl/server";
import AboutContent from "./AboutContent";

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: "about" });
  return pageMetadata({
    locale: params.locale,
    path: "about",
    title: t("title"),
    description: t("seo_description"),
  });
}

export default async function AboutPage({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale);

  return <AboutContent />;
}
