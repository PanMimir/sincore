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
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Escape zamyka menu — standardowe zachowanie każdego rozwijanego panelu.
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen]);

  const isActive = (href: string) => {
    const fullPath = `/${locale}${href === "/" ? "" : href}`;
    return pathname === fullPath || pathname.startsWith(`/${locale}${href}/`);
  };

  return (
    <header
      className={cn(
        "fixed left-0 right-0 top-0 z-50 transition-all duration-normal",
        scrolled
          ? "bg-background/90 border-b border-border-subtle backdrop-blur-md"
          : "bg-transparent"
      )}
    >
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-[72px] items-center justify-between">
          <Link href={`/${locale}`} className="group flex items-center gap-2.5">
            <SincoreSignet
              pulse
              className="h-8 w-7 text-text-primary transition-colors duration-fast group-hover:text-accent-primary"
            />
            <span className="text-lg tracking-tight text-text-primary">
              <span className="font-light">sin</span>
              <span className="font-extrabold">core</span>
            </span>
          </Link>

          <div className="hidden items-center gap-1 lg:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.key}
                href={`/${locale}${link.href === "/" ? "" : link.href}`}
                aria-current={isActive(link.href) ? "page" : undefined}
                className={cn(
                  "rounded-sincore-sm px-3 py-2 text-sm font-medium transition-colors duration-fast",
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
              className="p-2 text-text-secondary transition-colors hover:text-text-primary lg:hidden"
              aria-label={isOpen ? t("menu_close") : t("menu_open")}
              aria-expanded={isOpen}
              aria-controls="mobile-nav"
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {isOpen && (
          <div
            id="mobile-nav"
            className="bg-background/95 border-t border-border-subtle py-3 backdrop-blur-md lg:hidden"
          >
            {NAV_LINKS.map((link) => (
              <Link
                key={link.key}
                href={`/${locale}${link.href === "/" ? "" : link.href}`}
                aria-current={isActive(link.href) ? "page" : undefined}
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
