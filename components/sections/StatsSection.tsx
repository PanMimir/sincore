"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

interface StatsSectionProps {
  projectCount: number;
}

export default function StatsSection({ projectCount }: StatsSectionProps) {
  const t = useTranslations("home");

  const stats = [
    { value: String(projectCount), label: t("stats_projects") },
    { value: "10", label: t("stats_experience") },
    { value: t("stats_sep_label"), label: t("stats_sep_sub") },
  ];

  return (
    <section className="py-16 border-y border-cyber-gray">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-3 gap-8 text-center">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
            >
              <p className="font-mono font-bold text-3xl sm:text-4xl text-cyber-purple mb-1">
                {stat.value}
              </p>
              <p className="font-mono text-xs sm:text-sm text-cyber-muted">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
