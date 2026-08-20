import HeroSection from "@/components/sections/HeroSection";
import StatsSection from "@/components/sections/StatsSection";
import FeaturedProjectsSection from "@/components/sections/FeaturedProjectsSection";
import LatestArticlesSection from "@/components/sections/LatestArticlesSection";
// Sekcja "Co robimy" zdjęta razem z Usługami — to była oferta usługowa, a strona
// /services nie ma odnośnika w nawigacji. Żeby ją przywrócić, odkomentuj import
// i wpis w drzewie niżej.
// import AboutPreviewSection from "@/components/sections/AboutPreviewSection";
import CtaSection from "@/components/sections/CtaSection";
import { getAllProjects, getFeaturedProjects } from "@/services/projectService";
import { getAllArticles, getLatestArticles } from "@/services/articleService";
import { hasDownload } from "@/lib/releases";
import { pageMetadata } from "@/lib/metadata";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

// Zatrudnienie w Instytucie Technologii Paliw i Energii — lipiec 2015.
// Liczba lat liczy sie sama, zeby nie trzeba bylo raz w roku poprawiac jej w kodzie.
const CAREER_START = { year: 2015, month: 7 };

function yearsSince({ year, month }: { year: number; month: number }): number {
  const now = new Date();
  const elapsed = (now.getFullYear() - year) * 12 + (now.getMonth() + 1 - month);
  return Math.floor(elapsed / 12);
}

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: "hero" });
  return pageMetadata({
    locale: params.locale,
    title: t("seo_home_title"),
    description: t("description"),
    // Marka jest już w tytule, więc bez doklejanego "| sincore".
    absoluteTitle: true,
  });
}

export default async function HomePage({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale);

  const [allProjects, featuredProjects, allArticles, latestArticles] = await Promise.all([
    getAllProjects(),
    getFeaturedProjects(),
    getAllArticles(params.locale),
    getLatestArticles(params.locale),
  ]);

  // Badge "do pobrania" dla wybranych projektów na stronie głównej.
  const checks = await Promise.all(
    featuredProjects.map(async (p) => ({
      slug: p.slug,
      ok: p.apkDownload === true || (await hasDownload(p.githubUrl)),
    }))
  );
  const downloadableSlugs = checks.filter((c) => c.ok).map((c) => c.slug);

  return (
    <>
      <HeroSection />
      <StatsSection
        projectCount={allProjects.length}
        articleCount={allArticles.length}
        experienceYears={yearsSince(CAREER_START)}
      />
      <FeaturedProjectsSection
        projects={featuredProjects}
        downloadableSlugs={downloadableSlugs}
      />
      <LatestArticlesSection articles={latestArticles} />
      {/* <AboutPreviewSection /> */}
      <CtaSection />
    </>
  );
}
