import cheatsheetData from "@/data/cheatsheet.json";
import { type Locale } from "@/lib/routing";

/** Tekst trzymany w danych w obu językach naraz. */
type Localized = Record<Locale, string>;

interface RawItem {
  code?: string;
  term?: Localized;
  desc: Localized;
  how?: Localized;
  source?: { label: string; url: string };
}

interface RawSection {
  id: string;
  label: Localized;
  intro: Localized;
  items: RawItem[];
  note?: Localized;
}

interface RawTab {
  id: string;
  label: Localized;
  intro: Localized;
  sections: RawSection[];
}

/**
 * Pozycja ściągi. Trzy warianty, zależnie od tego, co jest wypełnione:
 * - `code` — komenda albo skrót do skopiowania,
 * - `term` — nazwana zasada,
 * - `term` + `how` + `source` — technika z cudzego źródła, z instrukcją odtworzenia.
 */
export interface CheatItem {
  code?: string;
  term?: string;
  desc: string;
  how?: string;
  source?: { label: string; url: string };
}

export interface CheatSection {
  id: string;
  label: string;
  intro: string;
  items: CheatItem[];
  note?: string;
}

export interface CheatTab {
  id: string;
  label: string;
  intro: string;
  sections: CheatSection[];
}

export interface Cheatsheet {
  updated: string;
  sourceUrl: string;
  tabs: CheatTab[];
}

function pick(value: Localized, locale: Locale): string {
  return value[locale] ?? value.pl;
}

/**
 * Spłaszcza dane ściągi do jednego języka.
 * Dane leżą w data/cheatsheet.json z obiema wersjami w jednym miejscu,
 * żeby przy dopisywaniu pozycji nie dało się zapomnieć o drugim języku.
 */
export async function getCheatsheet(locale: string): Promise<Cheatsheet> {
  const lang = (locale === "en" ? "en" : "pl") as Locale;
  const data = cheatsheetData as unknown as {
    meta: { updated: string; sourceUrl: string };
    tabs: RawTab[];
  };

  return {
    updated: data.meta.updated,
    sourceUrl: data.meta.sourceUrl,
    tabs: data.tabs.map((tab) => ({
      id: tab.id,
      label: pick(tab.label, lang),
      intro: pick(tab.intro, lang),
      sections: tab.sections.map((section) => ({
        id: section.id,
        label: pick(section.label, lang),
        intro: pick(section.intro, lang),
        note: section.note ? pick(section.note, lang) : undefined,
        items: section.items.map((item) => ({
          code: item.code,
          term: item.term ? pick(item.term, lang) : undefined,
          desc: pick(item.desc, lang),
          how: item.how ? pick(item.how, lang) : undefined,
          source: item.source,
        })),
      })),
    })),
  };
}
