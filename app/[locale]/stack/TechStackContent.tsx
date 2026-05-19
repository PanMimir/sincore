"use client";

import { useTranslations } from"next-intl";
import { motion } from"framer-motion";
import { cn } from"@/lib/utils";
import ScrollReveal from"@/components/common/ScrollReveal";

export interface TechItem {
  name: string;
  level:"expert" |"advanced" |"intermediate" |"basic";
}

export interface TechCategory {
  category: string;
  label: Record<string, string>;
  items: TechItem[];
}

// Kolor paska poziomu zależy od wartości level
const LEVEL_COLORS = {
  expert:"bg-accent-primary border-accent-primary/50",
  advanced:"bg-accent-500 border-accent-500/50",
  intermediate:"bg-text-muted border-text-muted/30",
  basic:"bg-text-muted/50 border-text-muted/20",
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
        <h1 className="font-bold text-4xl sm:text-5xl text-text-primary mb-4">
          {t("title")}
        </h1>
        <p className="text-text-muted text-base mb-16">{t("subtitle")}</p>
      </ScrollReveal>

      {/* Kategorie */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {data.map((category, catIndex) => (
          <ScrollReveal key={category.category} delay={catIndex * 0.08}>
            <div className="bg-surface border border-border-subtle rounded-lg p-6 h-full">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border-subtle">
                <h2 className="font-bold text-lg text-text-primary">
                  {category.label[locale] ?? category.label["en"]}
                </h2>
              </div>

              {/* Lista technologii */}
              <div className="space-y-4">
                {category.items.map((item, itemIndex) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: catIndex * 0.05 + itemIndex * 0.05 }}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-mono text-sm text-text-primary">{item.name}</span>
                      <span className="font-mono text-xs text-text-muted">
                        {t(`level_${item.level}`)}
                      </span>
                    </div>
                    {/* Pasek postępu */}
                    <div className="h-1 bg-surface-elevated rounded-full overflow-hidden">
                      <motion.div
                        className={cn("h-full rounded-full", LEVEL_COLORS[item.level].split("")[0])}
                        initial={{ width: 0 }}
                        animate={{ width: undefined }}
                        transition={{ duration: 0.8, delay: catIndex * 0.05 + itemIndex * 0.06, ease:"easeOut" }}
                        style={{
                          width:
                            item.level ==="expert" ?"100%"
                            : item.level ==="advanced" ?"75%"
                            : item.level ==="intermediate" ?"50%"
                            :"25%",
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
    </div>
  );
}
