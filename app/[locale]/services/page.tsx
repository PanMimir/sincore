import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { pageMetadata } from "@/lib/metadata";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import ServiceAccordion, { Service } from "@/components/common/ServiceAccordion";

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: "services" });
  return pageMetadata({
    locale: params.locale,
    path: "services",
    title: t("title"),
    description: t("seo_description"),
  });
}

const SERVICE_DEFS: { id: string; key: string; icon: Service["icon"] }[] = [
  { id: "s1", key: "service_1", icon: "deployment" },
  { id: "s2", key: "service_2", icon: "data-flow" },
  { id: "s3", key: "service_3", icon: "protocol" },
  { id: "s4", key: "service_4", icon: "monitoring" },
  { id: "s5", key: "service_5", icon: "community" },
];

export default async function ServicesPage({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale);

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
    <div className="mx-auto max-w-5xl px-4 py-24 sm:px-6 lg:px-8">
      <div className="mb-16">
        <h1 className="mb-4 text-4xl font-bold tracking-tight text-text-primary">
          {t("title")}
        </h1>
        <p className="text-lg text-text-muted">{t("subtitle")}</p>
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

      <div className="border-accent-primary/40 mb-12 border-l-2 bg-neutral-900/20 py-3 pl-5">
        <h3 className="mb-2 font-mono text-xs uppercase tracking-wider text-text-muted">
          {t("format_label")}
        </h3>
        <p className="text-sm leading-relaxed text-text-secondary">{t("format_text")}</p>
      </div>

      <div className="border-accent-primary/30 bg-accent-primary/5 rounded-sincore-xl border p-8 text-center">
        <h2 className="mb-3 text-2xl font-bold tracking-tight text-text-primary">
          {t("cta_title")}
        </h2>
        <p className="mx-auto mb-6 max-w-lg text-text-secondary">{t("cta_subtitle")}</p>
        <Link
          href={`/${params.locale}/contact`}
          className="inline-flex h-12 items-center gap-2 rounded-sincore-md bg-accent-400 px-8 font-mono text-sm font-bold text-neutral-950 transition-all duration-fast ease-sincore-out hover:-translate-y-px hover:bg-accent-300 active:bg-accent-500"
        >
          {t("cta_button")}
          <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
}
