import { defineRouting } from "next-intl/routing";

// Centralna definicja routingu – używana przez middleware i i18n.ts
export const routing = defineRouting({
  locales: ["pl", "en"],
  defaultLocale: "pl",
  // Zawsze pokazuj prefix języka w URL (/pl/, /en/)
  localePrefix: "always",
  // Trzy wyłączniki, wszystkie z tego samego powodu.
  //
  // localeCookie + localeDetection: middleware ustawiało ciasteczko NEXT_LOCALE przy
  // każdym żądaniu, a odpowiedź z ciasteczkiem dostaje Cache-Control: private,
  // no-store. Efekt: żadna z 66 gotowych stron nie trafiała do cache Vercela i każde
  // wejście uruchamiało funkcję (X-Vercel-Cache: MISS zawsze). Koszt wyłączenia:
  // wejście na goły adres zawsze prowadzi do wersji polskiej.
  //
  // alternateLinks: next-intl dokładał nagłówek HTTP Link z hreflangami, w którym
  // x-default prowadził na "/" (adres, który zaraz przekierowuje), a na podstronach
  // wskazywał strony główne — czyli przeczył znacznikom w HTML. Jedynym źródłem
  // prawdy o wersjach językowych jest teraz lib/metadata.ts.
  localeCookie: false,
  localeDetection: false,
  alternateLinks: false,
});

export type Locale = (typeof routing.locales)[number];
