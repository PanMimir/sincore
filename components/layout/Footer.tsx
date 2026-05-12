"use client";

import { useTranslations } from "next-intl";
import { Terminal, GitBranch, Mail } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  const t = useTranslations("footer");
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-cyber-gray mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">

          {/* Logo + copyright */}
          <div className="flex items-center gap-2 font-mono text-sm text-cyber-muted">
            <Terminal size={16} className="text-cyber-purple" />
            <span>
              sincore © {year} — {t("rights")}
            </span>
          </div>

          {/* Linki społecznościowe */}
          <div className="flex items-center gap-4">
            <Link
              href="https://github.com/yourusername"
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyber-muted hover:text-cyber-purple transition-colors"
              aria-label="GitHub"
            >
              <GitBranch size={18} />
            </Link>
            <Link
              href="mailto:ace.panczyk@gmail.com"
              className="text-cyber-muted hover:text-cyber-purple transition-colors"
              aria-label="Email"
            >
              <Mail size={18} />
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
