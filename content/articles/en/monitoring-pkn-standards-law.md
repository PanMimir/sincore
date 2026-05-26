---
id: monitoring-pkn-standards-law
title: "Monitoring PKN standards — what you can scrape and where infringement starts"
description: "Polish Standards are protected by copyright, but facts about them are not. A field study of legal decisions when building a tool that alerts on changes to PN-EN standards: metadata scraping, fair use for PDF diff, and the database sui generis trap."
date: "2026-05-24"
tags: ["compliance", "scraping", "legal", "standards"]
featured: true
references:
  - title: "Polish Standardisation Act (Dz.U. 2002 nr 169 poz. 1386)"
    url: "https://isap.sejm.gov.pl/isap.nsf/DocDetails.xsp?id=WDU20021691386"
  - title: "Polish Copyright Act (art. 4 — exclusions)"
    url: "https://isap.sejm.gov.pl/isap.nsf/DocDetails.xsp?id=WDU19940240083"
  - title: "Directive 96/9/EC on the legal protection of databases"
    url: "https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:31996L0009"
  - title: "CJEU C-588/21 P (5.03.2024, Public.Resource.Org)"
    url: "https://curia.europa.eu/juris/liste.jsf?num=C-588/21"
---

## Starting point: PKN as a monopolist with no API

Polish Standards are issued by the **Polish Committee for Standardisation (PKN)**, which holds a monopoly on selling, distributing and reproducing them. For an auditor, an accredited lab or industrial R&D, working on an outdated standard is a professional risk: lost accreditation, a faulty audit, a false conformity claim. And PKN provides:

- no REST API or GraphQL,
- no RSS (confirmed by the lack of `application/rss+xml` headers anywhere on the public sites),
- no official newsletter about standard changes,
- no datasets on `dane.gov.pl` or any EU open-data portal.

What's left: product pages on `sklep.pkn.pl` and two listings on `www.pkn.pl/polskie-normy/wykazy-pn/` (published / withdrawn, rolling 60 days). All server-rendered in plain HTML — scrapeable without a headless browser.

Which raises the question: **what can you actually do with that data?**

## What's protected, what isn't

Three layers need to be separated:

| Layer | Example | Legal status |
|---|---|---|
| Standard content | "Point 5.3.2. The safety coefficient shall be…" | Copyright-protected, PKN monopoly |
| Title and scope | "Heating boilers — Part 5: Solid fuel boilers up to 500 kW" | Borderline: titles rarely meet the originality threshold; scope/abstract may qualify as a work |
| Metadata / facts | number, publication date, withdrawal date, ICS, technical committee, page count, status | **Not subject to copyright** |

The legal basis: **Polish Standardisation Act (Dz.U. 2002 nr 169 poz. 1386), art. 5 sec. 5** states explicitly that *"Polish Standards are protected by copyright as literary works, and economic copyright belongs to the Polish Committee for Standardisation"* — i.e. the content yes, but protection only extends as far as the work itself. Facts about the work (that it exists, when it was issued, what number it has) are outside that scope.

Despite the common argument that "standards are law, so they should be free" — **art. 4 of the Copyright Act** (which excludes statutory and official documents) **does not apply here**. Polish Standards are voluntary; doctrine and case law treat them as protected works. The "free access" argument doesn't fly in PL — at least not yet.

**Practical conclusion:** alerts like *"PN-EN 303-5:2021-09 was withdrawn on 2023-05-04 and replaced by PN-EN 303-5+A1:2023-05"* are operations on facts. Anyone can publish them, not just PKN.

## The trap that's easy to miss: database sui generis

This is where most projects could derail. Independent of content copyright, **Directive 96/9/EC** (implemented in Poland by the 2001 Database Protection Act) introduces a separate protection for the database *itself* — regardless of whether the individual records are protected.

The construction: if someone has made a *"substantial investment in obtaining, verifying or presenting"* data, they have the right to forbid *"extraction and re-utilisation of all or a substantial part"* of the database's contents. This is **sui generis** — a database's own right, not copyright.

What that means in practice for a standards monitor:

- Scraping a single standard from the PKN catalogue, for a specific customer tracking it — safe.
- Daily pull of the 60-day listings (a few dozen records) — safe, it's a public information service.
- **Daily full crawl of the PKN catalogue, building your own copy of the standards database — very likely a sui generis violation.**

The architectural rule that follows: **the backend stores only the standards that a user is actively tracking.** No catalogue is indexed "just in case". The data is transient, used for change detection, not for building a competing catalogue.

## BYO-PDF: why local diff isn't infringement

The second feature users naturally want: *"compare the old and new PDF of this standard — show me what changed"*. PDFs from `sklep.pkn.pl` are sold single-user, perpetual, with a dynamic watermark (*"PKN License for [company name], date"*).

The natural question: is uploading that PDF to a cloud tool a license breach?

Yes — if the tool hosts the file, indexes it, exposes it to others, or uses it for model training. All of that is *"placing on the market"* and *"sublicensing"* under the PKN license.

No — under the **BYO-PDF** (Bring Your Own PDF) model:

- The customer has a legally purchased standard.
- They upload THEIR file. Analysis is ephemeral (auto-delete 24-72h, no long-term storage).
- Results return only to that account.
- No LLM training on those files.
- ToS declares legal-access requirement.

This is exactly the model on which **Adobe Acrobat Compare, Draftable, and Diffchecker** have operated for years — on copyright-protected documents, including standards. No litigation, despite many years of use on tens of millions of documents.

The line is simple: **the file does not become part of our product — it's only temporarily processed for its owner**.

In the project behind this article we went a step further and run diff **fully locally** (PyMuPDF in a desktop app). The PDF never leaves the customer's machine. The backend only sees the list of standard numbers that customer tracks. That dissolves every doubt — and is the architecturally cleanest answer to the legal constraints.

There's one technical limitation worth naming explicitly: not every standard PDF can be opened for comparison. The most common case is **scans** — older PKN editions in particular are saved as page images rather than as text. The app sees a "picture" of the page and has no way to compare it to a newer version. Some standards are saved as text-based PDFs but in an unusual layout the app doesn't yet recognise. These are product limitations, not legal workarounds — we'd rather name them than pretend we handle everything.

## CJEU C-588/21 P — an interesting case that (so far) changes nothing

On 5 March 2024 the CJEU ruled on **Public.Resource.Org v. European Commission**. The applicant demanded access to harmonised standards (those that grant presumption of conformity with EU directives) under Regulation 1049/2001 on document access.

The ruling is strong:

- Harmonised standards form **part of EU law** by virtue of their legal effects.
- There is an **overriding public interest in free access** to those standards.
- The ruling does not undermine CEN/CENELEC's copyright — it recognises it, but holds that the public interest prevails.

Practical effects, as of May 2026:

- The Commission and CEN-CENELEC launched a read-only portal for 34 national bodies.
- The portal exposes... **exactly the 4 standards the ruling concerned** (toy safety: EN 71-4, EN 71-5, EN 71-12, EN 12472+A1).
- *"without any right to especially download, print, commercialize, reproduce, make available or distribute the documents"* — text mining excluded.
- **PKN still sells harmonised standards unchanged** — no policy statement of any kind.

What that means for monitoring tools: the legal trend leans toward openness, but in practice nothing has changed. The model *"PKN sells + we monitor facts + diff is BYO"* is not threatened by free alternatives. **If that day ever comes — it'll be good news, not bad** (lower barriers for users).

## Practice: what's OK, what isn't

| Operation | OK? | Reason |
|---|---|---|
| Scraping number, date, status of a single standard from `sklep.pkn.pl` | YES | Facts aren't subject to copyright |
| Daily scrape of 60-day listings | YES | Public information service |
| Full crawl of the PKN catalogue into your own copy | NO | Database sui generis (Dir. 96/9/EC) |
| Publishing full scopes of standards 1:1 | NO | Scope may qualify as a protected work |
| Summary of a scope in your own words + link to `sklep.pkn.pl` | YES | No reproduction of the work |
| Uploading your own PDF for cloud diff (ephemeral) | YES | BYO-PDF model, no hosting, single-user analysis |
| Hosting a standards PDF library for many customers | NO | Single-user license breach, "placing on the market" |
| Training an LLM on full standard texts | NO | Reproduction of the whole work |

## Operational rules for the scraper

Independent of the law — this is also about **not getting blocked technically**, because then the project dies regardless of who's right legally.

- **Rate limit:** 1 request per second. 60-day listings pulled once a day off-peak.
- **Identifying User-Agent:** `sincore.io-monitor/1.0 (+https://sincore.io/about)`. If PKN ever wants to escalate, they know who and have a contact page. An anonymous bot is a red flag.
- **`robots.txt`:** `www.pkn.pl/robots.txt` blocks `/admin/`, `/user/login/`, `/search/`, `/node/add/` — none of which we want. `sklep.pkn.pl/robots.txt` returns 404, no explicit prohibition.
- **Cache at the metadata layer:** if a field value hasn't changed since the last crawl — we don't touch the database, don't send an alert. Cuts traffic both ways.
- **Sitemap before crawl:** `www.pkn.pl/sitemap.xml` can serve as a lightweight signal source for new URLs. Cheaper than a full crawl.

## Red lines worth memorising

- Don't host full standard contents.
- Don't build a "free PN library" — that's an obvious lawsuit.
- Don't share one customer's diff results with another.
- Don't build a "similar standards" recommendation system based on full text.
- Don't cache standard abstracts — summarise in your own words or link out.

If the model stays within these lines — alerts operate on facts, PDFs don't leave the customer's PC, the database contains only actively-tracked standards — it's defensible both against PKN and under Directive 96/9/EC.
