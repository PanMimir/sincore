import HeroSection from "@/components/sections/HeroSection";
import StatsSection from "@/components/sections/StatsSection";
import FeaturedProjectsSection from "@/components/sections/FeaturedProjectsSection";
import LatestArticlesSection from "@/components/sections/LatestArticlesSection";
import AboutPreviewSection from "@/components/sections/AboutPreviewSection";
import CtaSection from "@/components/sections/CtaSection";
import { getAllProjects, getFeaturedProjects } from "@/services/projectService";
import { getLatestArticles } from "@/services/articleService";
import { hasDownload } from "@/lib/releases";

export default async function HomePage({
  params,
}: {
  params: { locale: string };
}) {
  const [allProjects, featuredProjects, latestArticles] = await Promise.all([
    getAllProjects(),
    getFeaturedProjects(),
    getLatestArticles(params.locale),
  ]);

  // Badge "do pobrania" dla wybranych projektów na stronie głównej.
  const checks = await Promise.all(
    featuredProjects.map(async (p) => ({
      slug: p.slug,
      ok: p.apkDownload === true || (await hasDownload(p.githubUrl)),
    })),
  );
  const downloadableSlugs = checks.filter((c) => c.ok).map((c) => c.slug);

  return (
    <>
      <HeroSection />
      <StatsSection projectCount={allProjects.length} />
      <FeaturedProjectsSection
        projects={featuredProjects}
        downloadableSlugs={downloadableSlugs}
      />
      <LatestArticlesSection articles={latestArticles} />
      <AboutPreviewSection />
      <CtaSection />
    </>
  );
}
