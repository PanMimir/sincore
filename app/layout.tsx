import type { Metadata } from "next";
import { Manrope, JetBrains_Mono } from "next/font/google";
import { getLocale } from "next-intl/server";
import JsonLd from "@/components/common/JsonLd";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "https://sincore.io";

export const metadata: Metadata = {
  title: { template: "%s | sincore", default: "sincore" },
  description:
    "Naprawiam procesy i buduję oprogramowanie które działa. Dedykowane narzędzia, automatyzacja, systemy przemysłowe.",
  metadataBase: new URL(BASE_URL),
  openGraph: {
    type: "website",
    siteName: "sincore",
    // Bez images — obrazek generuje trasa app/[locale]/opengraph-image.tsx.
    // Wcześniej stał tu /og-default.png, plik, którego nigdy nie było w repo.
  },
  twitter: {
    card: "summary_large_image",
  },
  robots: process.env.NODE_ENV === "production" ? "index, follow" : "noindex, nofollow",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // Język musi być w HTML wychodzącym z serwera: czytnik ekranu wybiera wymowę
  // zanim uruchomi się JavaScript, a wyszukiwarka czyta źródło, nie stan po hydracji.
  const locale = await getLocale();

  return (
    <html
      lang={locale}
      suppressHydrationWarning
      data-theme="dark"
      className={`${manrope.variable} ${jetbrainsMono.variable}`}
    >
      <head>
        <JsonLd />
      </head>
      <body className="flex min-h-screen flex-col bg-background text-text-primary antialiased">
        {children}
      </body>
    </html>
  );
}
