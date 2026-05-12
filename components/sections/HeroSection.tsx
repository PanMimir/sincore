"use client";

import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, BookOpen } from "lucide-react";
import TerminalWindow from "@/components/common/TerminalWindow";

export default function HeroSection() {
  const t = useTranslations("hero");
  const locale = useLocale();

  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 pt-16">
      <div className="max-w-5xl mx-auto w-full z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">

          {/* Lewa strona – tekst */}
          <div>
            {/* Animacja fadeIn z opóźnieniem – każdy element pojawia się po kolei */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="font-mono font-bold text-cyber-text text-lg mb-3"
            >
              {t("greeting")}
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="font-mono font-bold text-4xl sm:text-5xl mb-4 text-cyber-purple"
            >
              Mimir
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="font-mono text-cyber-muted text-sm sm:text-base mb-6 leading-relaxed"
            >
              {t("tagline")}
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="font-mono text-cyber-text/80 text-base mb-6 max-w-md leading-relaxed"
            >
              {t("description")}
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.38 }}
              className="font-mono text-cyber-purple/70 text-sm mb-8 italic"
            >
              {t("motto")}
            </motion.p>

            {/* CTA buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex flex-wrap gap-4"
            >
              <Link
                href={`/${locale}/projects`}
                className="flex items-center gap-2 px-6 py-3 bg-cyber-purple hover:bg-cyber-purple-bright text-white font-mono text-sm rounded transition-all duration-200 shadow-glow-purple-sm hover:shadow-glow-purple"
              >
                {t("cta_projects")}
                <ArrowRight size={16} />
              </Link>

              <Link
                href={`/${locale}/knowledge`}
                className="flex items-center gap-2 px-6 py-3 border border-cyber-purple/50 hover:border-cyber-purple text-cyber-purple hover:bg-cyber-purple/10 font-mono text-sm rounded transition-all duration-200"
              >
                <BookOpen size={16} />
                {t("cta_knowledge")}
              </Link>
            </motion.div>
          </div>

          {/* Prawa strona – okno terminala */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
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

      {/* Gradient przejście na dół strony */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-cyber-black to-transparent pointer-events-none" />
    </section>
  );
}
