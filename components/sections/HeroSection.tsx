"use client";

import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Mail } from "lucide-react";
import TerminalWindow from "@/components/common/TerminalWindow";

export default function HeroSection() {
  const t = useTranslations("hero");
  const locale = useLocale();

  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 pt-16">
      <div className="max-w-5xl mx-auto w-full z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">

          <div>
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-baseline gap-5 mb-4 flex-wrap"
            >
              <h1 className="font-mono font-bold text-4xl sm:text-5xl">
                <span className="text-text-secondary">sin</span><span className="text-accent-primary">core</span>
              </h1>
              <p className="font-mono text-accent-primary text-sm italic border-l border-accent-primary/60 pl-4">
                {t("motto")}
              </p>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="font-mono text-text-muted text-sm sm:text-base mb-6 leading-relaxed"
            >
              {t("tagline")}
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="font-mono text-text-primary/85 text-base mb-8 max-w-md leading-relaxed"
            >
              {t("description")}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-wrap gap-3"
            >
              <Link
                href={`/${locale}/services`}
                className="inline-flex items-center gap-2 h-12 px-6 bg-accent-400 hover:bg-accent-300 active:bg-accent-500 text-neutral-950 font-mono font-bold text-sm rounded-sincore-md transition-all duration-fast ease-sincore-out hover:-translate-y-px"
              >
                {t("cta_services")}
                <ArrowRight size={16} />
              </Link>

              <Link
                href={`/${locale}/contact`}
                className="inline-flex items-center gap-2 h-12 px-6 border border-border-strong hover:bg-surface-elevated text-text-primary font-mono font-semibold text-sm rounded-sincore-md transition-colors duration-fast"
              >
                <Mail size={16} />
                {t("cta_contact")}
              </Link>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
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
                { text: t("terminal_line7"), type: "output", href: "mailto:contact@sincore.io" },
              ]}
            />
          </motion.div>

        </div>
      </div>
    </section>
  );
}
