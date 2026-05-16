"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import ScrollReveal from "@/components/common/ScrollReveal";

export interface TechItem {
  name: string;
  level: "expert" | "advanced" | "intermediate" | "basic";
}

export interface TechCategory {
  category: string;
  label: Record<string, string>;
  items: TechItem[];
}

// Kolor paska poziomu zależy od wartości level
const LEVEL_COLORS = {
  expert:       "bg-cyber-purple border-cyber-purple/50",
  advanced:     "bg-cyber-cyan border-cyber-cyan/50",
  intermediate: "bg-cyber-muted border-cyber-muted/30",
  basic:        "bg-cyber-muted/50 border-cyber-muted/20",
} as const;

export default function TechStackContent({
  locale,
  data,
}: {
  locale: string;
  data: TechCategory[];
}) {
  const t = useTranslations("stack");

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
      <ScrollReveal>
        <h1 className="font-bold text-4xl sm:text-5xl text-cyber-text mb-4">
          {t("title")}
        </h1>
        <p className="text-cyber-muted text-base mb-16">{t("subtitle")}</p>
      </ScrollReveal>

      {/* Kategorie */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {data.map((category, catIndex) => (
          <ScrollReveal key={category.category} delay={catIndex * 0.08}>
            <div className="bg-cyber-dark border border-cyber-gray rounded-lg p-6 h-full">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-cyber-gray">
                <h2 className="font-bold text-lg text-cyber-text">
                  {category.label[locale] ?? category.label["en"]}
                </h2>
              </div>

              {/* Lista technologii */}
              <div className="space-y-4">
                {category.items.map((item, itemIndex) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, x: -16 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: catIndex * 0.05 + itemIndex * 0.05 }}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-mono text-sm text-cyber-text">{item.name}</span>
                      <span className="font-mono text-xs text-cyber-muted">
                        {t(`level_${item.level}`)}
                      </span>
                    </div>
                    {/* Pasek postępu */}
                    <div className="h-1 bg-cyber-gray rounded-full overflow-hidden">
                      <motion.div
                        className={cn("h-full rounded-full", LEVEL_COLORS[item.level].split(" ")[0])}
                        initial={{ width: 0 }}
                        whileInView={{ width: undefined }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: catIndex * 0.05 + itemIndex * 0.06, ease: "easeOut" }}
                        style={{
                          width:
                            item.level === "expert" ? "100%"
                            : item.level === "advanced" ? "75%"
                            : item.level === "intermediate" ? "50%"
                            : "25%",
                        }}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </ScrollReveal>
        ))}
      </div>

      {/* Legenda */}
      <ScrollReveal delay={0.3} className="mt-12 pt-8 border-t border-cyber-gray">
        <div className="flex flex-wrap gap-6 justify-center">
          {(["expert", "advanced", "intermediate", "basic"] as const).map((level) => (
            <div key={level} className="flex items-center gap-2">
              <div className={cn("w-8 h-1 rounded-full", LEVEL_COLORS[level].split(" ")[0])} />
              <span className="font-mono text-xs text-cyber-muted">{t(`level_${level}`)}</span>
            </div>
          ))}
        </div>
      </ScrollReveal>
    </div>
  );
}
