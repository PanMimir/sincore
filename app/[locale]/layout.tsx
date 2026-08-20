import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing, type Locale } from "@/lib/routing";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AnimatedBackground from "@/components/common/AnimatedBackground";
import { getArticleSlugMap } from "@/services/articleService";

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: "hero" });

  // Tu zostaje wyłącznie szablon tytułu i opis awaryjny. Canonical, hreflang i Open
  // Graph MUSZĄ być deklarowane przez każdą stronę osobno (lib/metadata.ts) — pola
  // ustawione w layoucie dziedziczą się w dół i wcześniej wszystkie podstrony
  // podawały adres strony głównej jako swój własny.
  return {
    title: { template: `%s | ${t("name")}`, default: t("seo_home_title") },
    description: t("description"),
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
  // Deklaruje język dla tego renderu. Bez tego next-intl sięga po nagłówki żądania,
  // co wypycha stronę z renderowania statycznego na renderowanie na żądanie —
  // i cała witryna omija cache CDN.
  setRequestLocale(params.locale);

  if (!routing.locales.includes(params.locale as Locale)) {
    notFound();
  }

  const messages = await getMessages();
  const articleSlugMap = await getArticleSlugMap();
  const tCommon = await getTranslations({ locale: params.locale, namespace: "common" });

  return (
    <NextIntlClientProvider messages={messages}>
      {/* Skok do treści — pierwszy element w kolejności tabulacji. Niewidoczny, dopóki
          nie dostanie fokusu z klawiatury. Bez niego przejście do treści na każdej
          podstronie wymaga przeklikania całej nawigacji. */}
      <a
        href="#content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-sincore-md focus:bg-accent-primary focus:px-4 focus:py-2 focus:font-mono focus:text-sm focus:font-semibold focus:text-neutral-950"
      >
        {tCommon("skip_to_content")}
      </a>
      <AnimatedBackground />
      <Navbar articleSlugMap={articleSlugMap} />
      <main id="content" className="relative z-10 flex-1">
        {children}
      </main>
      <Footer />
    </NextIntlClientProvider>
  );
}
