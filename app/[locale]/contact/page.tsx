import type { Metadata } from "next";
import { pageMetadata } from "@/lib/metadata";
import { getTranslations, setRequestLocale } from "next-intl/server";
import ContactContent from "./ContactContent";

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: "contact" });
  return pageMetadata({
    locale: params.locale,
    path: "contact",
    title: t("title"),
    description: t("seo_description"),
  });
}

export default async function ContactPage({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale);

  return <ContactContent />;
}
