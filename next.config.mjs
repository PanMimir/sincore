import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./lib/i18n.ts");

const isDev = process.env.NODE_ENV === "development";

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Standalone pakuje tylko pliki potrzebne do uruchomienia — potrzebne przy
  // budowaniu obrazu Dockera, zbędne na Vercelu, gdzie wydłużało build i dublowało
  // wyjście w .next/standalone. Docker ustawia DOCKER_BUILD=1.
  output: process.env.DOCKER_BUILD ? "standalone" : undefined,

  // Nie ogłaszaj frameworka w nagłówku X-Powered-By.
  poweredByHeader: false,

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
          // Blokuje ładowanie strony w iframe (clickjacking). Zgodne z dyrektywą
          // frame-ancestors w CSP niżej — starsze przeglądarki znają tylko ten nagłówek.
          { key: "X-Frame-Options", value: "DENY" },
          // Blokuje MIME-type sniffing
          { key: "X-Content-Type-Options", value: "nosniff" },
          // Kontroluje ile informacji o referrerze wysyła przeglądarka
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          // Wymusza HTTPS na rok do przodu, razem z subdomenami
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains; preload",
          },
          // Ogranicza dostęp do funkcji przeglądarki
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          // Content Security Policy — określa skąd można ładować zasoby
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              // 'unsafe-eval' jest potrzebne wyłącznie trybowi deweloperskiemu Next.js
              // (hot reload), więc na produkcji go nie ma. 'unsafe-inline' zostaje do
              // czasu podpisywania skryptów Next jednorazowym nonce w middleware.
              isDev
                ? "script-src 'self' 'unsafe-inline' 'unsafe-eval'"
                : "script-src 'self' 'unsafe-inline'",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' data: https://github.com https://avatars.githubusercontent.com",
              "connect-src 'self'",
              "frame-ancestors 'none'",
              // Trzy tanie dyrektywy, każda zamyka jedną znaną drogę przejęcia strony:
              // wtyczki, podmianę adresu bazowego linków i wysyłkę formularza na obcy host.
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'",
            ].join("; "),
          },
        ],
      },
    ];
  },
};

export default withNextIntl(nextConfig);
