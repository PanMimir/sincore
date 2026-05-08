# nullSec

Publiczne portfolio technologiczne — projekty, baza wiedzy, narzędzia.

**Stack:** Next.js 14 · TypeScript · TailwindCSS · Framer Motion · next-intl

---

## Uruchomienie lokalne

```bash
# 1. Sklonuj repozytorium
git clone https://github.com/yourusername/nullsec.git
cd nullsec

# 2. Zainstaluj zależności
npm install

# 3. Skopiuj zmienne środowiskowe
cp .env.example .env.local
# i uzupełnij NEXT_PUBLIC_BASE_URL

# 4. Uruchom serwer deweloperski
npm run dev
```

Otwórz [http://localhost:3000](http://localhost:3000) — przekieruje automatycznie na `/pl`.

---

## Struktura projektu

```
app/                    # Routing Next.js (App Router)
  layout.tsx            # Root layout (html/body, czcionki, JSON-LD)
  [locale]/             # Podstrony per język (pl, en)
    page.tsx            # Strona główna
    projects/           # Listing + strony projektów
    knowledge/          # Baza wiedzy (artykuły Markdown)
    stack/              # Tech stack
    about/              # O mnie
    contact/            # Kontakt

components/
  layout/               # Navbar, Footer
  sections/             # HeroSection
  common/               # ProjectCard, KnowledgeCard, TerminalWindow...

content/
  articles/
    pl/                 # Artykuły po polsku (.md)
    en/                 # Artykuły po angielsku (.md)

data/
  projects.json         # Dane projektów
  techstack.json        # Stack technologiczny

services/
  projectService.ts     # Adapter danych projektów (gotowy pod REST API)
  articleService.ts     # Parser Markdown

translations/
  pl/index.json         # Tłumaczenia PL
  en/index.json         # Tłumaczenia EN
```

---

## Dodawanie treści

### Nowy projekt
Edytuj `data/projects.json` — dodaj obiekt z polami `slug`, `title`, `description` (per język), `stack`, `tags`, `status`, linki, `featured`.

### Nowy artykuł
Utwórz plik `.md` w `content/articles/pl/` z frontmatterem:

```markdown
---
title: "Tytuł artykułu"
description: "Krótki opis"
date: "2026-05-06"
tags: ["tag1", "tag2"]
featured: false
---

Treść w Markdown...
```

Plik pojawi się automatycznie na `/pl/knowledge` — zero zmian w kodzie.

---

## Deployment

### Vercel (zalecane)
1. Push repozytorium na GitHub
2. Połącz z [vercel.com](https://vercel.com)
3. Ustaw `NEXT_PUBLIC_BASE_URL` na swoją domenę
4. Deploy automatyczny przy każdym push do `main`

### Docker
```bash
docker build -t nullsec .
docker run -p 3000:3000 -e NEXT_PUBLIC_BASE_URL=https://twoja-domena.pl nullsec
```

### VPS bez Dockera
```bash
npm run build
npm run start
```

---

## Skrypty

| Komenda | Opis |
|---------|------|
| `npm run dev` | Serwer deweloperski |
| `npm run build` | Build produkcyjny |
| `npm run start` | Uruchom build produkcyjny |
| `npm run lint` | ESLint |
| `npm run format` | Prettier — formatowanie |
| `npm run typecheck` | Sprawdzenie typów TypeScript |
