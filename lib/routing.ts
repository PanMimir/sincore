import { defineRouting } from "next-intl/routing";

// Centralna definicja routingu – używana przez middleware i i18n.ts
export const routing = defineRouting({
  locales: ["pl", "en"],
  defaultLocale: "pl",
  // Zawsze pokazuj prefix języka w URL (/pl/, /en/)
  localePrefix: "always",
});

export type Locale = (typeof routing.locales)[number];
