import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./lib/i18n.ts");

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Standalone output pakuje tylko pliki potrzebne do uruchomienia.
  // To właśnie ten tryb jest używany w Dockerfile (kopiujemy .next/standalone).
  output: "standalone",

  images: {
    remotePatterns: [
      { protocol: "https", hostname: "github.com" },
      { protocol: "https", hostname: "avatars.githubusercontent.com" },
    ],
  },

  /**
   * Nagłówki bezpieczeństwa HTTP — dodawane do każdej odpowiedzi.
   * Bez nich Lighthouse i security skanery będą narzekać.
   */
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          // Blokuje ładowanie strony w iframe (clickjacking)
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          // Blokuje MIME-type sniffing
          { key: "X-Content-Type-Options", value: "nosniff" },
          // Kontroluje ile informacji o referrerze wysyła przeglądarka
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          // Wymusza HTTPS na rok do przodu
          { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
          // Ogranicza dostęp do funkcji przeglądarki
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          // Content Security Policy — określa skąd można ładować zasoby
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              // Next.js potrzebuje 'unsafe-inline' i 'unsafe-eval' w dev, ale w prod możemy być bardziej restrykcyjni
              "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' data: https://github.com https://avatars.githubusercontent.com",
              "connect-src 'self'",
              "frame-ancestors 'none'",
            ].join("; "),
          },
        ],
      },
    ];
  },
};

export default withNextIntl(nextConfig);
