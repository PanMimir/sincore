import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkHtml from "remark-html";

const ARTICLES_DIR = path.join(process.cwd(), "content/articles");

export interface Reference {
  title: string;
  url: string;
}

export interface Article {
  id: string;
  slug: string;
  title: string;
  /**
   * Skrócony tytuł na potrzeby wyniku wyszukiwania. Opcjonalny — używany tylko tam,
   * gdzie pełny tytuł (często z podtytułem po "albo:") nie zmieściłby się w ~60
   * znakach, jakie pokazuje Google. Nagłówek artykułu zawsze bierze `title`.
   */
  titleSeo?: string;
  description: string;
  date: string;
  tags: string[];
  featured: boolean;
  references?: Reference[];
  content?: string;
}

/**
 * Pobiera listę wszystkich artykułów dla danego języka.
 * Czyta pliki .md z folderu content/articles/{locale}/
 * Sortuje od najnowszego do najstarszego.
 */
export async function getAllArticles(locale: string): Promise<Article[]> {
  const dir = path.join(ARTICLES_DIR, locale);

  if (!fs.existsSync(dir)) return [];

  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".md"));

  const articles = files.map((filename) => {
    const slug = filename.replace(/\.md$/, "");
    const raw = fs.readFileSync(path.join(dir, filename), "utf-8");

    // gray-matter rozdziela frontmatter (YAML między ---) od treści artykułu
    const { data } = matter(raw);

    return {
      id: data.id ?? slug,
      slug,
      title: data.title ?? slug,
      titleSeo: data.titleSeo ?? undefined,
      description: data.description ?? "",
      date: data.date ?? "",
      tags: data.tags ?? [],
      featured: data.featured ?? false,
      references: data.references ?? [],
    } satisfies Article;
  });

  // Sortowanie po dacie malejąco (najnowszy na górze). localeCompare zwraca 0 przy
  // równych datach, więc kolejność takich artykułów jest powtarzalna między buildami.
  return articles.sort(
    (a, b) => b.date.localeCompare(a.date) || a.slug.localeCompare(b.slug)
  );
}

export async function getFeaturedArticles(locale: string): Promise<Article[]> {
  const all = await getAllArticles(locale);
  return all.filter((a) => a.featured);
}

/** Kilka najnowszych artykułów — na stronę główną. Lista jest już posortowana po dacie. */
export async function getLatestArticles(locale: string, count = 3): Promise<Article[]> {
  const all = await getAllArticles(locale);
  return all.slice(0, count);
}

/**
 * Pobiera jeden artykuł wraz z treścią przetworzoną do HTML.
 * remark: Markdown → AST → HTML (obsługa tabel, linków, kodu przez GFM)
 */
export async function getArticleBySlug(
  slug: string,
  locale: string
): Promise<Article | undefined> {
  const filepath = path.join(ARTICLES_DIR, locale, `${slug}.md`);

  if (!fs.existsSync(filepath)) return undefined;

  const raw = fs.readFileSync(filepath, "utf-8");
  const { data, content: markdown } = matter(raw);

  const processed = await remark()
    .use(remarkGfm) // GitHub Flavored Markdown: tabele, strikethrough, checkboxes
    .use(remarkHtml) // sanitize domyślnie ON (hast-util-sanitize, schema GitHub) — surowy HTML/<script> w md jest usuwany
    .process(markdown);

  // Owijamy tabele żeby na mobile dostały overflow-x zamiast wypychać layout
  const html = processed
    .toString()
    .replace(/<table>/g, '<div class="table-wrapper"><table>')
    .replace(/<\/table>/g, "</table></div>");

  return {
    id: data.id ?? slug,
    slug,
    titleSeo: data.titleSeo ?? undefined,
    title: data.title ?? slug,
    description: data.description ?? "",
    date: data.date ?? "",
    tags: data.tags ?? [],
    featured: data.featured ?? false,
    references: data.references ?? [],
    content: html,
  };
}

/**
 * Buduje mapę id → { pl?: slug, en?: slug } skanując oba foldery.
 * Używane przez LanguageSwitcher do znalezienia ekwiwalentu artykułu w drugim języku.
 */
export async function getArticleSlugMap(): Promise<
  Record<string, Record<string, string>>
> {
  const locales = ["pl", "en"];
  const map: Record<string, Record<string, string>> = {};

  for (const locale of locales) {
    const dir = path.join(ARTICLES_DIR, locale);
    if (!fs.existsSync(dir)) continue;

    const files = fs.readdirSync(dir).filter((f) => f.endsWith(".md"));
    for (const filename of files) {
      const slug = filename.replace(/\.md$/, "");
      const raw = fs.readFileSync(path.join(dir, filename), "utf-8");
      const { data } = matter(raw);
      const id = data.id ?? slug;
      if (!map[id]) map[id] = {};
      map[id][locale] = slug;
    }
  }

  return map;
}
