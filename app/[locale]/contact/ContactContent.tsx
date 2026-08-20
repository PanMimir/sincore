"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Mail, GitBranch, Link2, Copy, Check, ExternalLink } from "lucide-react";
import ScrollReveal from "@/components/common/ScrollReveal";

const EMAIL = "contact@sincore.io";
const GITHUB_URL = "https://github.com/PanMimir";
const LINKEDIN_URL = "https://www.linkedin.com/in/michal-panczyk-mp01/";

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
  const [copyFailed, setCopyFailed] = useState(false);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      // Reset po 2 sekundach
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Przeglądarka odmówiła dostępu do schowka — pokazujemy adres do zaznaczenia
      // ręcznie, zamiast zostawiać przycisk, który wygląda na zepsuty.
      setCopyFailed(true);
      setTimeout(() => setCopyFailed(false), 4000);
    }
  };

  const links: ContactLink[] = [
    {
      icon: Mail,
      labelKey: "email_label",
      value: EMAIL,
      href: `mailto:${EMAIL}`,
      copyable: true,
    },
    {
      icon: GitBranch,
      labelKey: "github_label",
      value: GITHUB_URL.replace("https://", ""),
      href: GITHUB_URL,
    },
    {
      icon: Link2,
      labelKey: "linkedin_label",
      value: LINKEDIN_URL.replace("https://www.", ""),
      href: LINKEDIN_URL,
    },
  ];

  return (
    <div className="mx-auto max-w-3xl px-4 py-24 sm:px-6 lg:px-8">
      <ScrollReveal>
        <h1 className="mb-4 text-4xl font-bold text-text-primary sm:text-5xl">
          {t("title")}
        </h1>
        <p className="mb-16 text-base text-text-muted">{t("subtitle")}</p>
      </ScrollReveal>

      {/* Karty kontaktowe */}
      <div className="space-y-4">
        {links.map((link, i) => {
          const Icon = link.icon;
          return (
            <ScrollReveal key={link.labelKey} delay={i * 0.1}>
              <div className="hover:border-accent-primary/50 group flex items-center justify-between gap-4 rounded-lg border border-border-subtle bg-surface p-6 transition-all duration-normal">
                <div className="flex items-center gap-4">
                  <div className="bg-accent-primary/10 border-accent-primary/20 group-hover:bg-accent-primary/20 flex h-10 w-10 items-center justify-center rounded-lg border transition-colors">
                    <Icon size={18} className="text-accent-primary" />
                  </div>
                  <div>
                    <p className="mb-0.5 font-mono text-xs text-text-muted">
                      {t(link.labelKey)}
                    </p>
                    <p
                      className={`font-mono text-sm ${link.placeholder ? "italic text-text-muted" : "text-text-primary"}`}
                    >
                      {link.value}
                    </p>
                  </div>
                </div>

                {/* Przyciski akcji po prawej */}
                <div className="flex shrink-0 items-center gap-2">
                  {link.copyable && (
                    <button
                      type="button"
                      onClick={copyEmail}
                      className="press hover:border-accent-primary/50 flex items-center gap-1.5 rounded border border-border-subtle px-3 py-1.5 font-mono text-xs text-text-muted transition-all hover:text-accent-primary"
                    >
                      {copied ? (
                        <>
                          <Check size={12} className="text-success-400" />
                          {t("copied")}
                        </>
                      ) : (
                        <>
                          <Copy size={12} />
                          {t("copy_email")}
                        </>
                      )}
                    </button>
                  )}
                  {link.href && !link.placeholder && (
                    <a
                      href={link.href}
                      target={link.href.startsWith("http") ? "_blank" : undefined}
                      rel="noopener noreferrer"
                      className="bg-accent-primary/20 border-accent-primary/50 hover:bg-accent-primary/30 flex items-center gap-1.5 rounded border px-3 py-1.5 font-mono text-xs text-accent-primary transition-all"
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

      {copyFailed && (
        <p role="status" className="mt-4 font-mono text-sm text-warning-400">
          {t("copy_failed")} <span className="text-text-primary">{EMAIL}</span>
        </p>
      )}

      <ScrollReveal delay={0.35} className="mt-16">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-lg border border-border-subtle bg-surface p-5">
            <p className="mb-1 text-xs uppercase tracking-wider text-text-muted">
              {t("response_time_label")}
            </p>
            <p className="text-lg text-text-primary">&lt; 24h</p>
          </div>
          <div className="rounded-lg border border-border-subtle bg-surface p-5">
            <p className="mb-1 text-xs uppercase tracking-wider text-text-muted">
              {t("languages_label")}
            </p>
            <p className="text-lg text-text-primary">PL · EN</p>
          </div>
        </div>
      </ScrollReveal>
    </div>
  );
}
