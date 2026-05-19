"use client";

import { useState } from"react";
import { useTranslations } from"next-intl";
import { motion } from"framer-motion";
import { Mail, GitBranch, Link2, Copy, Check, ExternalLink } from"lucide-react";
import ScrollReveal from"@/components/common/ScrollReveal";

const EMAIL ="contact@sincore.io";
const GITHUB_URL ="https://github.com/PanMimir";
const LINKEDIN_URL ="https://www.linkedin.com/in/michal-panczyk-mp01/";

interface ContactLink {
  icon: React.ElementType;
  labelKey: string;
  value: string;
  href: string | null;
  copyable?: boolean;
  placeholder?: boolean;
}

export default function ContactContent() {
  const t = useTranslations("contact");
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    await navigator.clipboard.writeText(EMAIL);
    setCopied(true);
    // Reset po 2 sekundach
    setTimeout(() => setCopied(false), 2000);
  };

  const links: ContactLink[] = [
    {
      icon: Mail,
      labelKey:"email_label",
      value: EMAIL,
      href: `mailto:${EMAIL}`,
      copyable: true,
    },
    {
      icon: GitBranch,
      labelKey:"github_label",
      value: GITHUB_URL.replace("https://",""),
      href: GITHUB_URL,
    },
    {
      icon: Link2,
      labelKey:"linkedin_label",
      value: LINKEDIN_URL.replace("https://www.",""),
      href: LINKEDIN_URL,
    },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
      <ScrollReveal>
        <h1 className="font-bold text-4xl sm:text-5xl text-text-primary mb-4">
          {t("title")}
        </h1>
        <p className="text-text-muted text-base mb-16">{t("subtitle")}</p>
      </ScrollReveal>

      {/* Karty kontaktowe */}
      <div className="space-y-4">
        {links.map((link, i) => {
          const Icon = link.icon;
          return (
            <ScrollReveal key={link.labelKey} delay={i * 0.1}>
              <div className="flex items-center justify-between gap-4 p-6 bg-surface border border-border-subtle rounded-lg hover:border-accent-primary/50 transition-all duration-normal group">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-accent-primary/10 border border-accent-primary/20 group-hover:bg-accent-primary/20 transition-colors">
                    <Icon size={18} className="text-accent-primary" />
                  </div>
                  <div>
                    <p className="font-mono text-xs text-text-muted mb-0.5">
                      {t(link.labelKey)}
                    </p>
                    <p className={`font-mono text-sm ${link.placeholder ?"text-text-muted italic" :"text-text-primary"}`}>
                      {link.value}
                    </p>
                  </div>
                </div>

                {/* Przyciski akcji po prawej */}
                <div className="flex items-center gap-2 shrink-0">
                  {link.copyable && (
                    <motion.button
                      onClick={copyEmail}
                      whileTap={{ scale: 0.92 }}
                      className="flex items-center gap-1.5 px-3 py-1.5 font-mono text-xs border border-border-subtle hover:border-accent-primary/50 text-text-muted hover:text-accent-primary rounded transition-all"
                    >
                      {copied ? (
                        <><Check size={12} className="text-success-400" />{t("copied")}</>
                      ) : (
                        <><Copy size={12} />{t("copy_email")}</>
                      )}
                    </motion.button>
                  )}
                  {link.href && !link.placeholder && (
                    <a
                      href={link.href}
                      target={link.href.startsWith("http") ?"_blank" : undefined}
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-3 py-1.5 font-mono text-xs bg-accent-primary/20 border border-accent-primary/50 text-accent-primary hover:bg-accent-primary/30 rounded transition-all"
                    >
                      <ExternalLink size={12} />
                      {t(link.labelKey)}
                    </a>
                  )}
                </div>
              </div>
            </ScrollReveal>
          );
        })}
      </div>

      <ScrollReveal delay={0.35} className="mt-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-5 bg-surface border border-border-subtle rounded-lg">
            <p className="text-xs uppercase tracking-wider text-text-muted mb-1">{t("response_time_label")}</p>
            <p className="text-text-primary text-lg">&lt; 24h</p>
          </div>
          <div className="p-5 bg-surface border border-border-subtle rounded-lg">
            <p className="text-xs uppercase tracking-wider text-text-muted mb-1">{t("languages_label")}</p>
            <p className="text-text-primary text-lg">PL · EN</p>
          </div>
        </div>
      </ScrollReveal>

    </div>
  );
}
