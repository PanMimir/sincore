"use client";

import { useEffect } from "react";
import { useLocale } from "next-intl";

// Ustawia atrybut lang na <html> dynamicznie po stronie klienta.
// Potrzebne bo root layout nie ma dostępu do parametru [locale].
export default function HtmlLang() {
  const locale = useLocale();

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  return null;
}
