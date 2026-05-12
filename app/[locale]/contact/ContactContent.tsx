"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Mail, GitBranch, Link2, Copy, Check, ExternalLink } from "lucide-react";
import ScrollReveal from "@/components/common/ScrollReveal";

const EMAIL = "contact@sincore.io";
const GITHUB_URL = "https://github.com/PanMimir";

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
  const locale = useLocale();
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const [accessInput, setAccessInput] = useState("");
  const [accessDenied, setAccessDenied] = useState(false);

  const handleAccess = (e: React.FormEvent) => {
    e.preventDefault();
    if (accessInput === "sin") {
      sessionStorage.setItem("sincore_special_access", "1");
      router.push(`/${locale}/special`);
    } else {
      setAccessDenied(true);
      setAccessInput("");
      setTimeout(() => setAccessDenied(false), 1500);
    }
  };

  const copyEmail = async () => {
    await navigator.clipboard.writeText(EMAIL);
    setCopied(true);
    // Reset po 2 sekundach
    setTimeout(() => setCopied(false), 2000);
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
      value: t("linkedin_placeholder"),
      href: null,
      placeholder: true,
    },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
      {/* Nagłówek */}
      <ScrollReveal>
        <p className="font-mono text-cyber-purple text-sm mb-2">{"$ ping sincore"}</p>
        <h1 className="font-mono font-bold text-4xl sm:text-5xl text-cyber-text mb-4">
          {t("title")}
        </h1>
        <p className="text-cyber-muted text-base mb-16">{t("subtitle")}</p>
      </ScrollReveal>

      {/* Karty kontaktowe */}
      <div className="space-y-4">
        {links.map((link, i) => {
          const Icon = link.icon;
          return (
            <ScrollReveal key={link.labelKey} delay={i * 0.1}>
              <div className="flex items-center justify-between gap-4 p-6 bg-cyber-dark border border-cyber-gray rounded-lg hover:border-cyber-purple/50 transition-all duration-300 group">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-cyber-purple/10 border border-cyber-purple/20 group-hover:bg-cyber-purple/20 transition-colors">
                    <Icon size={18} className="text-cyber-purple" />
                  </div>
                  <div>
                    <p className="font-mono text-xs text-cyber-muted mb-0.5">
                      {t(link.labelKey)}
                    </p>
                    <p className={`font-mono text-sm ${link.placeholder ? "text-cyber-muted italic" : "text-cyber-text"}`}>
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
                      className="flex items-center gap-1.5 px-3 py-1.5 font-mono text-xs border border-cyber-gray hover:border-cyber-purple/50 text-cyber-muted hover:text-cyber-purple rounded transition-all"
                    >
                      {copied ? (
                        <><Check size={12} className="text-cyber-green" />{t("copied")}</>
                      ) : (
                        <><Copy size={12} />{t("copy_email")}</>
                      )}
                    </motion.button>
                  )}
                  {link.href && !link.placeholder && (
                    <a
                      href={link.href}
                      target={link.href.startsWith("http") ? "_blank" : undefined}
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-3 py-1.5 font-mono text-xs bg-cyber-purple/20 border border-cyber-purple/50 text-cyber-purple hover:bg-cyber-purple/30 rounded transition-all"
                    >
                      <ExternalLink size={12} />
                      {link.href.startsWith("mailto") ? t("email_label") : t("github_label")}
                    </a>
                  )}
                </div>
              </div>
            </ScrollReveal>
          );
        })}
      </div>

      {/* Terminal-style outro */}
      <ScrollReveal delay={0.35} className="mt-16">
        <div className="p-5 bg-cyber-dark border border-cyber-gray rounded-lg font-mono text-sm space-y-2">
          <p className="text-cyber-muted">
            <span className="text-cyber-purple">❯ </span>
            {"echo $RESPONSE_TIME"}
          </p>
          <p className="text-cyber-text pl-4">{"< 24h"}</p>
          <p className="text-cyber-muted">
            <span className="text-cyber-purple">❯ </span>
            {"echo $PREFERRED_LANG"}
          </p>
          <p className="text-cyber-text pl-4">{"PL | EN"}</p>
        </div>
      </ScrollReveal>

      {/* Private access */}
      <ScrollReveal delay={0.5} className="mt-16">
        <form onSubmit={handleAccess}>
          <div className={`p-4 border rounded-lg font-mono text-sm transition-colors ${accessDenied ? "border-red-800/60 bg-red-950/20" : "border-cyber-gray/40 bg-cyber-dark/50"}`}>
            <p className="text-cyber-muted/50 text-xs mb-3">
              <span className="text-cyber-purple/50">{"// "}</span>
              private access
            </p>
            <div className="flex items-center gap-3">
              <span className={accessDenied ? "text-red-600" : "text-cyber-purple/60"}>$</span>
              <input
                type="password"
                value={accessInput}
                onChange={(e) => setAccessInput(e.target.value)}
                placeholder="access --private"
                className={`bg-transparent outline-none border-none flex-1 placeholder-cyber-muted/30 transition-colors ${accessDenied ? "text-red-500" : "text-cyber-muted"}`}
                autoComplete="off"
                spellCheck={false}
              />
              {accessDenied && (
                <span className="text-red-600 text-xs">access denied</span>
              )}
            </div>
          </div>
        </form>
      </ScrollReveal>
    </div>
  );
}
