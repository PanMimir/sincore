import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import Link from "next/link";
import { Code2, Zap, Cpu, LayoutDashboard, ArrowRight } from "lucide-react";

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: "services" });
  return { title: t("title") };
}

const SERVICE_ICONS = [Code2, Zap, Cpu, LayoutDashboard];
const SERVICE_KEYS = [
  "service_1",
  "service_2",
  "service_3",
  "service_4",
] as const;

export default async function ServicesPage({
  params,
}: {
  params: { locale: string };
}) {
  const [t, tContact] = await Promise.all([
    getTranslations({ locale: params.locale, namespace: "services" }),
    getTranslations({ locale: params.locale, namespace: "contact" }),
  ]);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-24">

      {/* Header */}
      <div className="mb-16">
        <p className="font-mono text-cyber-purple text-sm mb-2">{"$ ./sincore --services"}</p>
        <h1 className="font-mono font-bold text-4xl text-cyber-text mb-4">
          {t("title")}
        </h1>
        <p className="font-mono text-cyber-muted text-lg">{t("subtitle")}</p>
      </div>

      {/* Service cards */}
      <div className="grid md:grid-cols-2 gap-6 mb-20">
        {SERVICE_KEYS.map((key, i) => {
          const Icon = SERVICE_ICONS[i];
          return (
            <div
              key={key}
              className="flex flex-col bg-cyber-dark border border-cyber-gray rounded-lg p-6 hover:border-cyber-purple/50 transition-all duration-300 hover:shadow-glow-purple-sm"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-cyber-purple/10 border border-cyber-purple/20 rounded">
                  <Icon size={18} className="text-cyber-purple" />
                </div>
                <span className="font-mono text-xs text-cyber-purple border border-cyber-purple/30 px-2 py-0.5 rounded bg-cyber-purple/5">
                  {t(`${key}_tag`)}
                </span>
              </div>
              <h2 className="font-mono font-bold text-xl text-cyber-text mb-3">
                {t(`${key}_title`)}
              </h2>
              <p className="font-mono text-sm text-cyber-muted leading-relaxed flex-1">
                {t(`${key}_desc`)}
              </p>
            </div>
          );
        })}
      </div>

      {/* CTA */}
      <div className="border border-cyber-purple/30 rounded-lg p-8 bg-cyber-purple/5 text-center">
        <h2 className="font-mono font-bold text-2xl text-cyber-text mb-3">
          {t("cta_title")}
        </h2>
        <p className="font-mono text-cyber-muted mb-6 max-w-lg mx-auto">
          {t("cta_subtitle")}
        </p>
        <Link
          href={`/${params.locale}/contact`}
          className="inline-flex items-center gap-2 px-6 py-3 bg-cyber-purple hover:bg-cyber-purple-bright text-white font-mono text-sm rounded transition-colors duration-200"
        >
          {t("cta_button")}
          <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
}
