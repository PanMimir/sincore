"use client";

import { useTranslations } from "next-intl";
import { GitBranch, Mail } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  const t = useTranslations("footer");
  const tHero = useTranslations("hero");
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-cyber-gray mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">

          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 text-sm text-cyber-muted">
              <svg width="20" height="20" viewBox="0 0 32 32" fill="none" className="shrink-0">
                <rect width="32" height="32" rx="4" fill="#0a0a0f" />
                <rect x="1.5" y="1.5" width="29" height="29" rx="3" stroke="#8b5cf6" strokeWidth="1.5" />
                <text x="16" y="22" fontFamily="var(--font-mono), 'Courier New', monospace" fontSize="14" fontWeight="700" textAnchor="middle">
                  <tspan fill="#e2e8f0">s</tspan>
                  <tspan fill="#8b5cf6">c</tspan>
                </text>
              </svg>
              <span>
                sincore © {year} — {t("rights")}
              </span>
            </div>
            <p className="text-xs text-cyber-purple/50 italic pl-7">
              {tHero("motto")}
            </p>
          </div>

          {/* Linki społecznościowe */}
          <div className="flex items-center gap-4">
            <Link
              href="https://github.com/PanMimir"
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyber-muted hover:text-cyber-purple transition-colors"
              aria-label="GitHub"
            >
              <GitBranch size={22} />
            </Link>
            <Link
              href="mailto:contact@sincore.io"
              className="text-cyber-muted hover:text-cyber-purple transition-colors"
              aria-label="Email"
            >
              <Mail size={22} />
            </Link>
          </div>

          {/* Stack info */}
          <p className="font-mono text-xs text-cyber-muted">
            {t("built_with")}{" "}
            <span className="text-cyber-purple">Next.js</span> &{" "}
            <span className="text-cyber-purple">TailwindCSS</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
