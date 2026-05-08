import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkHtml from "remark-html";

const ARTICLES_DIR = path.join(process.cwd(), "content/articles");

export interface Article {
  slug: string;
  title: string;
  description: string;
  date: string;
  tags: string[];
  featured: boolean;
  content?: string; // HTML – tylko gdy pobieramy pełny artykuł
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
      slug,
      title: data.title ?? slug,
      description: data.description ?? "",
      date: data.date ?? "",
      tags: data.tags ?? [],
      featured: data.featured ?? false,
    } satisfies Article;
  });

  // Sortowanie po dacie malejąco (najnowszy na górze)
  return articles.sort((a, b) => (a.date > b.date ? -1 : 1));
}

export async function getFeaturedArticles(locale: string): Promise<Article[]> {
  const all = await getAllArticles(locale);
  return all.filter((a) => a.featured);
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
    .use(remarkGfm)      // GitHub Flavored Markdown: tabele, strikethrough, checkboxes
    .use(remarkHtml, { sanitize: false }) // sanitize: false = zezwól na własne HTML tagi w md
    .process(markdown);

  return {
    slug,
    title: data.title ?? slug,
    description: data.description ?? "",
    date: data.date ?? "",
    tags: data.tags ?? [],
    featured: data.featured ?? false,
    content: processed.toString(),
  };
}
