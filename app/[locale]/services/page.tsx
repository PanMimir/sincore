import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import ServiceAccordion, { Service } from "@/components/common/ServiceAccordion";

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: "services" });
  return { title: t("title") };
}

const SERVICE_DEFS: { id: string; key: string; icon: Service["icon"] }[] = [
  { id: "s1", key: "service_1", icon: "deployment" },
  { id: "s2", key: "service_2", icon: "data-flow" },
  { id: "s3", key: "service_3", icon: "protocol" },
  { id: "s4", key: "service_4", icon: "monitoring" },
  { id: "s5", key: "service_5", icon: "community" },
];

export default async function ServicesPage({
  params,
}: {
  params: { locale: string };
}) {
  const t = await getTranslations({ locale: params.locale, namespace: "services" });

  const services: Service[] = SERVICE_DEFS.map(({ id, key, icon }) => ({
    id,
    icon,
    tag: t(`${key}_tag`),
    title: t(`${key}_title`),
    desc: t(`${key}_desc`),
    user: t(`${key}_user`),
    value: t.raw(`${key}_value`) as string[],
    includes: t.raw(`${key}_includes`) as string[],
    excludes: t.raw(`${key}_excludes`) as string[],
    status: t(`${key}_status`) as Service["status"],
    portfolio: t.raw(`${key}_portfolio`) as string[],
  }));

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
      <div className="mb-16">
        <h1 className="font-bold tracking-tight text-4xl text-text-primary mb-4">
          {t("title")}
        </h1>
        <p className="text-text-muted text-lg">{t("subtitle")}</p>
      </div>

      <ServiceAccordion
        services={services}
        labels={{
          user: t("user_label"),
          value: t("value_label"),
          includes: t("includes_label"),
          excludes: t("excludes_label"),
          status: t("status_label"),
          statusPresent: t("status_present"),
          statusFuture: t("status_future"),
          statusCommunity: t("status_community"),
          portfolio: t("portfolio_label"),
          cardCta: t("card_cta"),
          expandAria: t("expand_aria"),
          collapseAria: t("collapse_aria"),
        }}
        contactHref={`/${params.locale}/contact`}
      />

      <div className="border-l-2 border-accent-primary/40 pl-5 py-3 mb-12 bg-neutral-900/20">
        <h3 className="font-mono text-xs uppercase tracking-wider text-text-muted mb-2">
          {t("format_label")}
        </h3>
        <p className="text-sm text-text-secondary leading-relaxed">{t("format_text")}</p>
      </div>

      <div className="border border-accent-primary/30 rounded-sincore-xl p-8 bg-accent-primary/5 text-center">
        <h2 className="font-bold tracking-tight text-2xl text-text-primary mb-3">
          {t("cta_title")}
        </h2>
        <p className="text-text-secondary mb-6 max-w-lg mx-auto">{t("cta_subtitle")}</p>
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
