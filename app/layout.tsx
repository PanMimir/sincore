import type { Metadata } from "next";
import { Manrope, JetBrains_Mono } from "next/font/google";
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
  description: "Naprawiam procesy i buduję oprogramowanie które działa. Dedykowane narzędzia, automatyzacja, systemy przemysłowe.",
  metadataBase: new URL(BASE_URL),
  openGraph: {
    type: "website",
    siteName: "sincore",
    images: [{ url: "/og-default.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
  },
  robots: process.env.NODE_ENV === "production" ? "index, follow" : "noindex, nofollow",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      suppressHydrationWarning
      data-theme="dark"
      className={`${manrope.variable} ${jetbrainsMono.variable}`}
    >
      <head>
        <JsonLd />
      </head>
      <body className="bg-background text-text-primary antialiased flex flex-col min-h-screen">
        {children}
      </body>
    </html>
  );
}
