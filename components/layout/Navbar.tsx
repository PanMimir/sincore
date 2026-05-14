"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import LanguageSwitcher from "@/components/common/LanguageSwitcher";

const NAV_LINKS = [
  { key: "home", href: "/" },
  { key: "services", href: "/services" },
  { key: "projects", href: "/projects" },
  { key: "knowledge", href: "/knowledge" },
  { key: "stack", href: "/stack" },
  { key: "about", href: "/about" },
  { key: "contact", href: "/contact" },
] as const;

export default function Navbar() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Dodaje efekt blur/border gdy użytkownik przewinie stronę
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Zamknij menu mobilne po zmianie ścieżki
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
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-cyber-black/90 backdrop-blur-md border-b border-cyber-gray"
          : "bg-transparent"
      )}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link
            href={`/${locale}`}
            className="flex items-center gap-2 group"
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 32 32"
              fill="none"
              className="shrink-0 transition-all duration-200 group-hover:[&_rect:last-of-type]:stroke-[#a78bfa]"
            >
              <rect width="32" height="32" rx="4" fill="#0a0a0f" />
              <rect x="1.5" y="1.5" width="29" height="29" rx="3" stroke="#8b5cf6" strokeWidth="1.5" />
              <text
                x="16"
                y="22"
                fontFamily="var(--font-mono), 'Courier New', monospace"
                fontSize="14"
                fontWeight="700"
                textAnchor="middle"
              >
                <tspan fill="#e2e8f0">s</tspan>
                <tspan fill="#8b5cf6">c</tspan>
              </text>
            </svg>
            <span className="font-mono font-bold text-lg text-cyber-text group-hover:text-cyber-purple transition-colors">
              sin<span className="text-cyber-purple">core</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.key}
                href={`/${locale}${link.href === "/" ? "" : link.href}`}
                className={cn(
                  "px-3 py-2 rounded font-mono text-sm transition-all duration-200",
                  isActive(link.href)
                    ? "text-cyber-purple bg-cyber-purple/10"
                    : "text-cyber-muted hover:text-cyber-text hover:bg-cyber-gray/50"
                )}
              >
                {t(link.key)}
              </Link>
            ))}
          </div>

          {/* Prawa strona: przełącznik języka + hamburger */}
          <div className="flex items-center gap-3">
            <LanguageSwitcher />

            {/* Przycisk menu mobilnego */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 text-cyber-muted hover:text-cyber-text transition-colors"
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="md:hidden border-t border-cyber-gray py-3 bg-cyber-black/95 backdrop-blur-md">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.key}
                href={`/${locale}${link.href === "/" ? "" : link.href}`}
                className={cn(
                  "block px-4 py-3 font-mono text-sm transition-colors",
                  isActive(link.href)
                    ? "text-cyber-purple"
                    : "text-cyber-muted hover:text-cyber-text"
                )}
              >
                <span className="text-cyber-purple mr-2">$</span>
                {t(link.key)}
              </Link>
            ))}
          </div>
        )}
      </nav>
    </header>
  );
}
