import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import ContactContent from "./ContactContent";

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: "contact" });
  return { title: t("title") };
}

export default async function ContactPage() {
  return <ContactContent />;
}
