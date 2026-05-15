import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing, type Locale } from "@/lib/routing";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AnimatedBackground from "@/components/common/AnimatedBackground";
import HtmlLang from "@/components/common/HtmlLang";
import { getArticleSlugMap } from "@/services/articleService";

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: "hero" });
  return {
    title: { template: `%s | ${t("name")}`, default: t("name") },
    description: t("description"),
    alternates: {
      canonical: `/${params.locale}`,
      languages: {
        pl: "/pl",
        en: "/en",
        "x-default": "/en",
      },
    },
    openGraph: {
      title: t("name"),
      description: t("description"),
      type: "website",
      locale: params.locale,
    },
  };
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  if (!routing.locales.includes(params.locale as Locale)) {
    notFound();
  }

  const messages = await getMessages();
  const articleSlugMap = await getArticleSlugMap();

  return (
    <NextIntlClientProvider messages={messages}>
      <HtmlLang />
      <AnimatedBackground />
      <Navbar articleSlugMap={articleSlugMap} />
      <main className="flex-1 relative z-10">{children}</main>
      <Footer />
    </NextIntlClientProvider>
  );
}
