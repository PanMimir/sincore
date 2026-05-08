import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import JsonLd from "@/components/common/JsonLd";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "https://nullsec.dev";

export const metadata: Metadata = {
  title: { template: "%s | nullSec", default: "nullSec" },
  description: "Publiczne portfolio technologiczne – projekty, baza wiedzy, narzędzia.",
  metadataBase: new URL(BASE_URL),
  openGraph: {
    type: "website",
    siteName: "nullSec",
    images: [{ url: "/og-default.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
  },
  // Wyłącz indeksowanie w środowisku lokalnym/staging
  robots: process.env.NODE_ENV === "production" ? "index, follow" : "noindex, nofollow",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html suppressHydrationWarning className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <head>
        <JsonLd />
      </head>
      <body className="bg-cyber-black text-cyber-text antialiased flex flex-col min-h-screen">
        {children}
      </body>
    </html>
  );
}
