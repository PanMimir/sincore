"use client";

import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import { ArrowRight, Mail } from "lucide-react";
import TerminalWindow from "@/components/common/TerminalWindow";

export default function HeroSection() {
  const t = useTranslations("hero");
  const locale = useLocale();

  return (
    <section className="relative flex min-h-screen items-center justify-center px-4 pt-24">
      <div className="z-10 mx-auto w-full max-w-5xl">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <div className="rise mb-4 flex flex-wrap items-baseline gap-5">
              <h1 className="font-mono text-4xl font-bold sm:text-5xl">
                <span className="text-text-secondary">sin</span>
                <span className="text-accent-primary">core</span>
              </h1>
              <p className="border-accent-primary/60 border-l pl-4 font-mono text-sm italic text-accent-primary">
                {t("motto")}
              </p>
            </div>

            <p
              className="rise mb-6 font-mono text-sm leading-relaxed text-text-muted sm:text-base"
              style={{ animationDelay: "80ms" }}
            >
              {t("tagline")}
            </p>

            <p
              className="rise text-text-primary/85 mb-8 max-w-md font-mono text-base leading-relaxed"
              style={{ animationDelay: "160ms" }}
            >
              {t("description")}
            </p>

            <div
              className="rise flex flex-wrap gap-3"
              style={{ animationDelay: "240ms" }}
            >
              <Link
                href={`/${locale}/projects`}
                className="inline-flex h-12 items-center gap-2 rounded-sincore-md bg-accent-400 px-6 font-mono text-sm font-bold text-neutral-950 transition-all duration-fast ease-sincore-out hover:-translate-y-px hover:bg-accent-300 active:bg-accent-500"
              >
                {t("cta_projects")}
                <ArrowRight size={16} />
              </Link>

              <Link
                href={`/${locale}/contact`}
                className="inline-flex h-12 items-center gap-2 rounded-sincore-md border border-border-strong px-6 font-mono text-sm font-semibold text-text-primary transition-colors duration-fast hover:bg-surface-elevated"
              >
                <Mail size={16} />
                {t("cta_contact")}
              </Link>
            </div>
          </div>

          <div className="fade-rise" style={{ animationDelay: "200ms" }}>
            <TerminalWindow
              lines={[
                { text: t("terminal_line1"), type: "command" },
                { text: t("terminal_line2"), type: "output" },
                { text: "", type: "output" },
                { text: t("terminal_line3"), type: "command" },
                { text: t("terminal_line_services"), type: "output" },
                { text: "", type: "output" },
                { text: t("terminal_line4"), type: "command" },
                { text: t("terminal_line5"), type: "output" },
                { text: "", type: "output" },
                { text: t("terminal_line6"), type: "command" },
                {
                  text: t("terminal_line7"),
                  type: "output",
                  href: "mailto:contact@sincore.io",
                },
              ]}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
