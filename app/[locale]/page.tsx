import HeroSection from "@/components/sections/HeroSection";
import StatsSection from "@/components/sections/StatsSection";
import FeaturedProjectsSection from "@/components/sections/FeaturedProjectsSection";
import AboutPreviewSection from "@/components/sections/AboutPreviewSection";
import CtaSection from "@/components/sections/CtaSection";
import { getAllProjects, getFeaturedProjects } from "@/services/projectService";

export default async function HomePage() {
  const [allProjects, featuredProjects] = await Promise.all([
    getAllProjects(),
    getFeaturedProjects(),
  ]);

  return (
    <>
      <HeroSection />
      <StatsSection projectCount={allProjects.length} />
      <FeaturedProjectsSection projects={featuredProjects} />
      <AboutPreviewSection />
      <CtaSection />
    </>
  );
}
