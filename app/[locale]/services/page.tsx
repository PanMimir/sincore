import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import BrandIcon from "@/components/common/BrandIcon";

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: "services" });
  return { title: t("title") };
}

const SERVICE_ICONS = ["deployment", "data-flow", "protocol", "monitoring"] as const;
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
  const t = await getTranslations({ locale: params.locale, namespace: "services" });

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-24">

      <div className="mb-16">
        <h1 className="font-bold tracking-tight text-4xl text-text-primary mb-4">
          {t("title")}
        </h1>
        <p className="text-text-muted text-lg">{t("subtitle")}</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-20">
        {SERVICE_KEYS.map((key, i) => (
          <div
            key={key}
            className="flex flex-col bg-surface border border-border-subtle rounded-sincore-xl p-6 hover:border-border-strong transition-colors duration-normal"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 bg-accent-primary/10 border border-accent-primary/20 rounded-sincore-md">
                <BrandIcon name={SERVICE_ICONS[i]} className="text-accent-primary" />
              </div>
              <span className="font-mono text-xs text-accent-primary border border-accent-primary/30 px-2 py-0.5 rounded bg-accent-primary/5">
                {t(`${key}_tag`)}
              </span>
            </div>
            <h2 className="font-bold tracking-tight text-xl text-text-primary mb-3">
              {t(`${key}_title`)}
            </h2>
            <p className="text-sm text-text-secondary leading-relaxed flex-1">
              {t(`${key}_desc`)}
            </p>
          </div>
        ))}
      </div>

      <div className="border border-accent-primary/30 rounded-sincore-xl p-8 bg-accent-primary/5 text-center">
        <h2 className="font-bold tracking-tight text-2xl text-text-primary mb-3">
          {t("cta_title")}
        </h2>
        <p className="text-text-secondary mb-6 max-w-lg mx-auto">
          {t("cta_subtitle")}
        </p>
        <Link
          href={`/${params.locale}/contact`}
          className="inline-flex items-center gap-2 h-12 px-8 bg-accent-400 hover:bg-accent-300 active:bg-accent-500 text-neutral-950 font-mono font-bold text-sm rounded-sincore-md transition-all duration-fast ease-sincore-out hover:-translate-y-px"
        >
          {t("cta_button")}
          <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
}
