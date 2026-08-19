"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import LanguageSwitcher from "@/components/common/LanguageSwitcher";
import SincoreSignet from "@/components/common/SincoreSignet";

// Usługi tymczasowo poza nawigacją — strona /services dalej istnieje i działa,
// tylko nie prowadzi do niej żaden odnośnik. Żeby ją przywrócić, odkomentuj wpis
// poniżej i dopisz "/services" z powrotem do STATIC_ROUTES w app/sitemap.ts.
const NAV_LINKS = [
  { key: "home", href: "/" },
  // { key: "services", href: "/services" },
  { key: "projects", href: "/projects" },
  { key: "knowledge", href: "/knowledge" },
  { key: "cheatsheet", href: "/cheatsheet" },
  { key: "stack", href: "/stack" },
  { key: "about", href: "/about" },
  { key: "contact", href: "/contact" },
] as const;

interface NavbarProps {
  articleSlugMap?: Record<string, Record<string, string>>;
}

export default function Navbar({ articleSlugMap }: NavbarProps) {
  const t = useTranslations("nav");
  const locale = useLocale();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const isActive = (href: string) => {
    const fullPath = `/${locale}${href === "/" ? "" : href}`;
    return pathname === fullPath || pathname.startsWith(`/${locale}${href}/`);
  };

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-normal",
        scrolled
          ? "bg-background/90 backdrop-blur-md border-b border-border-subtle"
          : "bg-transparent"
      )}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[72px]">

          <Link
            href={`/${locale}`}
            className="flex items-center gap-2.5 group"
          >
            <SincoreSignet pulse className="w-7 h-8 text-text-primary group-hover:text-accent-primary transition-colors duration-fast" />
            <span className="text-lg tracking-tight text-text-primary">
              <span className="font-light">sin</span><span className="font-extrabold">core</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.key}
                href={`/${locale}${link.href === "/" ? "" : link.href}`}
                className={cn(
                  "px-3 py-2 rounded-sincore-sm text-sm font-medium transition-colors duration-fast",
                  isActive(link.href)
                    ? "text-accent-primary"
                    : "text-text-secondary hover:text-text-primary"
                )}
              >
                {t(link.key)}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <LanguageSwitcher articleSlugMap={articleSlugMap} />

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 text-text-secondary hover:text-text-primary transition-colors"
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {isOpen && (
          <div className="md:hidden border-t border-border-subtle py-3 bg-background/95 backdrop-blur-md">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.key}
                href={`/${locale}${link.href === "/" ? "" : link.href}`}
                className={cn(
                  "block px-4 py-3 text-base transition-colors",
                  isActive(link.href)
                    ? "text-accent-primary"
                    : "text-text-secondary hover:text-text-primary"
                )}
              >
                {t(link.key)}
              </Link>
            ))}
          </div>
        )}
      </nav>
    </header>
  );
}
