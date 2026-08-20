import { notFound } from "next/navigation";

/**
 * Wyłapuje wszystkie adresy pod prefiksem języka, które nie pasują do żadnej strony,
 * i przekazuje je do app/[locale]/not-found.tsx.
 *
 * Bez tego pliku nietrafiony adres w rodzaju /pl/nieistnieje wypada poza segment
 * [locale] i ląduje na domyślnej stronie Next.js — białym "This page could not be
 * found", po angielsku, bez nawigacji i bez odnośnika powrotnego. Trasy konkretne
 * zawsze wygrywają z tą łapanką, więc nie zasłania niczego, co istnieje.
 *
 * Uwaga na przyszłość: własnego generateMetadata tu nie ma, bo Next go pomija —
 * po wywołaniu notFound() metadane bierze ze swojej wbudowanej strony 404. Stąd
 * tytuł w zakładce przeglądarki jest tytułem serwisu, a nie komunikatem 404.
 * Nagłówek 404 i noindex Next dokłada sam.
 */
export default function CatchAllNotFound() {
  notFound();
}
