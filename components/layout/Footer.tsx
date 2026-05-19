"use client";

import { useTranslations } from "next-intl";
import { GitBranch, Mail } from "lucide-react";
import Link from "next/link";
import SincoreSignet from "@/components/common/SincoreSignet";

export default function Footer() {
  const t = useTranslations("footer");
  const tHero = useTranslations("hero");
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border-subtle mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">

          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2.5 text-sm text-text-secondary">
              <SincoreSignet className="w-5 h-6 text-text-primary shrink-0" />
              <span>
                <span className="font-light">sin</span><span className="font-extrabold">core</span> © {year} — {t("rights")}
              </span>
            </div>
            <p className="text-xs text-text-muted italic pl-7">
              {tHero("motto")}
            </p>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="https://github.com/PanMimir"
              target="_blank"
              rel="noopener noreferrer"
              className="text-text-secondary hover:text-accent-primary transition-colors duration-fast"
              aria-label="GitHub"
            >
              <GitBranch size={22} />
            </Link>
            <Link
              href="https://www.linkedin.com/in/michal-panczyk-mp01/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-text-secondary hover:text-accent-primary transition-colors duration-fast"
              aria-label="LinkedIn"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.063 2.063 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </Link>
            <Link
              href="mailto:contact@sincore.io"
              className="text-text-secondary hover:text-accent-primary transition-colors duration-fast"
              aria-label="Email"
            >
              <Mail size={22} />
            </Link>
          </div>

          <p className="font-mono text-xs text-text-muted">
            {t("built_with")}{" "}
            <span className="text-accent-primary">Next.js</span> &{" "}
            <span className="text-accent-primary">TailwindCSS</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
