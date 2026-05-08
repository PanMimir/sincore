"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Terminal, Shield, Cpu, Network, Code2 } from "lucide-react";
import ScrollReveal from "@/components/common/ScrollReveal";
import TerminalWindow from "@/components/common/TerminalWindow";

// Ikony per specjalizacja — kolejność odpowiada tablicy skills w tłumaczeniach
const SKILL_ICONS = [Code2, Cpu, Shield, Network, Terminal];

export default function AboutContent() {
  const t = useTranslations("about");

  // Tłumaczenia zwracają tablicę jako string z przecinkami w next-intl
  // Używamy rawu żeby dostać tablicę
  const skills = t.raw("skills") as string[];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
      {/* Nagłówek */}
      <ScrollReveal>
        <p className="font-mono text-cyber-purple text-sm mb-2">{"$ ./whoami --verbose"}</p>
        <h1 className="font-mono font-bold text-4xl sm:text-5xl text-cyber-text mb-16">
          {t("title")}
        </h1>
      </ScrollReveal>

      <div className="grid lg:grid-cols-2 gap-16 items-start">
        {/* Lewa — terminal + bio */}
        <div>
          <ScrollReveal delay={0.1}>
            <TerminalWindow
              title="nullsec@workstation:~"
              lines={[
                { text: "cat about.txt", type: "command" },
                { text: t("bio_1"), type: "output" },
                { text: "", type: "output" },
                { text: "echo $FOCUS", type: "command" },
                { text: "OT/ICS Security + Backend Architecture", type: "output" },
              ]}
            />
          </ScrollReveal>

          <ScrollReveal delay={0.2} className="mt-8 space-y-4">
            <p className="text-cyber-muted leading-relaxed">{t("bio_2")}</p>
            <p className="text-cyber-muted leading-relaxed">{t("bio_3")}</p>
          </ScrollReveal>
        </div>

        {/* Prawa — specjalizacje + podejście */}
        <div className="space-y-10">
          <ScrollReveal delay={0.15}>
            <h2 className="font-mono font-bold text-xl text-cyber-text mb-6">
              <span className="text-cyber-purple mr-2">{">"}</span>
              {t("skills_title")}
            </h2>
            <ul className="space-y-3">
              {skills.map((skill, i) => {
                const Icon = SKILL_ICONS[i] ?? Terminal;
                return (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.35, delay: i * 0.07 }}
                    className="flex items-start gap-3 p-3 bg-cyber-dark border border-cyber-gray rounded-lg hover:border-cyber-purple/40 transition-colors"
                  >
                    <Icon size={16} className="text-cyber-purple mt-0.5 shrink-0" />
                    <span className="text-cyber-text text-sm">{skill}</span>
                  </motion.li>
                );
              })}
            </ul>
          </ScrollReveal>

          <ScrollReveal delay={0.25}>
            <div className="border-l-2 border-cyber-purple pl-5">
              <h3 className="font-mono text-sm text-cyber-purple mb-3">
                {"// "}{t("approach_title")}
              </h3>
              <p className="text-cyber-muted text-sm leading-relaxed italic">
                {t("approach")}
              </p>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </div>
  );
}
