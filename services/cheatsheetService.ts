import cheatsheetData from "@/data/cheatsheet.json";
import { type Locale } from "@/lib/routing";

/** Tekst trzymany w danych w obu językach naraz. */
type Localized = Record<Locale, string>;

interface RawItem {
  code?: string;
  term?: Localized;
  desc: Localized;
}

interface RawSection {
  id: string;
  label: Localized;
  intro: Localized;
  items: RawItem[];
  note?: Localized;
}

/** Pozycja ściągi: albo komenda/skrót (`code`), albo nazwana zasada (`term`). */
export interface CheatItem {
  code?: string;
  term?: string;
  desc: string;
}

export interface CheatSection {
  id: string;
  label: string;
  intro: string;
  items: CheatItem[];
  note?: string;
}

export interface Cheatsheet {
  updated: string;
  sourceUrl: string;
  sections: CheatSection[];
}

function pick(value: Localized, locale: Locale): string {
  return value[locale] ?? value.pl;
}

/**
 * Spłaszcza dane ściągi do jednego języka.
 * Dane leżą w data/cheatsheet.json z obiema wersjami w jednym miejscu,
 * żeby przy dopisywaniu komendy nie dało się zapomnieć o drugim języku.
 */
export async function getCheatsheet(locale: string): Promise<Cheatsheet> {
  const lang = (locale === "en" ? "en" : "pl") as Locale;
  const data = cheatsheetData as unknown as {
    meta: { updated: string; sourceUrl: string };
    sections: RawSection[];
  };

  return {
    updated: data.meta.updated,
    sourceUrl: data.meta.sourceUrl,
    sections: data.sections.map((section) => ({
      id: section.id,
      label: pick(section.label, lang),
      intro: pick(section.intro, lang),
      note: section.note ? pick(section.note, lang) : undefined,
      items: section.items.map((item) => ({
        code: item.code,
        term: item.term ? pick(item.term, lang) : undefined,
        desc: pick(item.desc, lang),
      })),
    })),
  };
}
