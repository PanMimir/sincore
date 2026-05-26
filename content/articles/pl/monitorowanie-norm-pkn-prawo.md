---
id: monitoring-pkn-standards-law
title: "Monitoring norm PKN — co wolno scrapować, a gdzie zaczyna się naruszenie"
description: "Polskie Normy są chronione prawem autorskim, ale fakty o nich już nie. Studium decyzji prawnych przy budowie narzędzia do alertowania zmian norm PN-EN: scraping metadanych, dozwolony użytek dla diffu PDF i pułapka sui generis dla baz danych."
date: "2026-05-24"
tags: ["compliance", "scraping", "legal", "standards"]
featured: true
references:
  - title: "Ustawa o normalizacji (Dz.U. 2002 nr 169 poz. 1386)"
    url: "https://isap.sejm.gov.pl/isap.nsf/DocDetails.xsp?id=WDU20021691386"
  - title: "Ustawa o prawie autorskim i prawach pokrewnych (art. 4 — wyłączenia)"
    url: "https://isap.sejm.gov.pl/isap.nsf/DocDetails.xsp?id=WDU19940240083"
  - title: "Dyrektywa 96/9/WE o ochronie prawnej baz danych"
    url: "https://eur-lex.europa.eu/legal-content/PL/TXT/?uri=CELEX:31996L0009"
  - title: "Wyrok TSUE C-588/21 P (5.03.2024, Public.Resource.Org)"
    url: "https://curia.europa.eu/juris/liste.jsf?num=C-588/21"
---

## Punkt wyjścia: PKN jako monopolista bez API

Polskie Normy wydaje **Polski Komitet Normalizacyjny** i ma do nich monopol — sprzedaż, dystrybucję, reprodukcję. Dla audytora, akredytowanego laboratorium albo R&D w przemyśle praca na nieaktualnej normie to ryzyko zawodowe: stracona akredytacja, błędny audyt, fałszywa zgodność. A PKN nie udostępnia:

- żadnego REST API ani GraphQL,
- żadnego RSS-a (jego brak potwierdza brak nagłówków `application/rss+xml` w nagłówku stron),
- żadnego oficjalnego newslettera o zmianach norm,
- żadnego datasetu na `dane.gov.pl` ani `otwartedane.gov.pl`.

Pozostają strony produktowe w `sklep.pkn.pl` i dwa wykazy w `www.pkn.pl/polskie-normy/wykazy-pn/` (opublikowane / wycofane, rolling 60 dni). Wszystko renderowane server-side w czystym HTML — scrapowalne bez headless browsera.

I tu zaczyna się pytanie: **co wolno z tymi danymi zrobić?**

## Co jest chronione, a co nie

Trzeba rozdzielić trzy poziomy:

| Poziom | Przykład | Status prawny |
|---|---|---|
| Treść normy | „Pkt 5.3.2. Współczynnik bezpieczeństwa wynosi…" | Chroniona prawem autorskim, monopol PKN |
| Tytuł i scope | „Kotły grzewcze — Część 5: Kotły na paliwa stałe do 500 kW" | Sporna granica: tytuł zwykle nie osiąga progu twórczości; scope/abstrakt już może być utworem |
| Metadane / fakty | numer, data publikacji, data wycofania, ICS, KT, liczba stron, status | **Nie podlegają prawu autorskiemu** |

Podstawa prawna: **ustawa o normalizacji (Dz.U. 2002 nr 169 poz. 1386), art. 5 ust. 5** stwierdza wprost, że *„Polskie Normy są chronione prawem autorskim jak utwory literackie, a autorskie prawa majątkowe do nich przysługują Polskiemu Komitetowi Normalizacyjnemu."* — czyli treść tak, ale ochrona idzie tylko tam, gdzie sięga utwór. Fakty o utworze (że istnieje, kiedy powstał, jaki ma numer) są poza tym zakresem.

Wbrew częstemu argumentowi „normy to przepis, więc powinny być wolne" — **art. 4 ustawy o prawie autorskim** (wyłączenie dla aktów normatywnych i urzędowych dokumentów) **nie ma tu zastosowania**. PN to normy o stosowaniu dobrowolnym, w doktrynie i orzecznictwie traktowane jako utwory chronione. Argument „free access" w PL nie działa — przynajmniej do dziś.

**Wniosek praktyczny:** alerty typu *„PN-EN 303-5:2021-09 została wycofana 2023-05-04 i zastąpiona przez PN-EN 303-5+A1:2023-05"* to operacja na faktach. Każdy może je opublikować, nie tylko PKN.

## Pułapka, której łatwo nie zauważyć: sui generis dla baz danych

Tu jest miejsce, w którym najwięcej projektów potencjalnie się wykolei. Niezależnie od prawa autorskiego do treści, **dyrektywa 96/9/WE** (implementowana w PL ustawą o ochronie baz danych z 2001) wprowadza osobną ochronę bazy danych jako *takiej* — niezależnie od tego, czy poszczególne wpisy są chronione.

Konstrukcja: jeśli ktoś poniósł *„istotną inwestycję w pozyskanie, weryfikację lub prezentację"* danych, ma prawo zakazać *„pobierania i wtórnego wykorzystania całej lub istotnej części"* zawartości bazy. To jest **sui generis** — własne prawo bazy danych, nie copyright.

Co to oznacza praktycznie dla monitora norm:

- Scrapowanie pojedynczej normy z katalogu PKN, dla konkretnego klienta który ją śledzi — bezpieczne.
- Codzienne pobieranie wykazów 60-dniowych (kilkadziesiąt rekordów) — bezpieczne, to publiczny serwis informacyjny.
- **Codzienny pełny crawl katalogu PKN i zbudowanie z tego naszej kopii bazy norm — bardzo prawdopodobne naruszenie sui generis.**

Architektoniczna reguła która z tego wynika: **backend trzyma tylko te normy, które ktoś z użytkowników faktycznie śledzi.** Nie indeksujemy całego katalogu „na zapas". Dane są tymczasowe, używane do detekcji zmian, nie do budowania konkurencyjnej bazy katalogowej.

## BYO-PDF: dlaczego diff lokalny nie jest naruszeniem

Druga funkcja, której naturalnie chce użytkownik: *„porównaj mi PDF starej i nowej wersji normy — pokaż, co się zmieniło"*. PDF z `sklep.pkn.pl` kupuje się single-user, perpetual, z dynamicznym watermarkiem (*„Licencja PKN dla [nazwa firmy], data"*).

Naturalne pytanie: czy wgranie tego PDF-a do narzędzia w chmurze jest naruszeniem licencji?

Tak — jeśli narzędzie hostuje plik, indeksuje go, udostępnia innym, używa do treningu modelu. To wszystko to *„wprowadzanie do obrotu"* i *„sublicencjonowanie"* z licencji PKN.

Nie — w modelu **BYO-PDF** (Bring Your Own PDF):

- Klient ma legalnie kupioną normę.
- Wgrywa SWÓJ plik. Analiza jest efemeryczna (auto-delete 24-72h, brak długoterminowego storage).
- Wynik wraca tylko do tego konta.
- Brak treningu LLM na tych plikach.
- ToS deklaruje wymóg legalnego dostępu.

To dokładnie ten sam model, na którym od lat działają **Adobe Acrobat Compare, Draftable, Diffchecker** — dla dokumentów chronionych prawem autorskim, w tym norm. Nie wprowadzono żadnych pozwów, mimo że ten model jest stosowany od wielu lat na dziesiątkach milionów dokumentów.

Granica jest prosta: **plik nie staje się elementem naszego produktu — jest tylko czasowo przetwarzany dla właściciela**.

W projekcie który stoi za tym artykułem doszliśmy nawet dalej i diff robimy **w pełni lokalnie** (PyMuPDF w aplikacji desktopowej). PDF nigdy nie opuszcza komputera klienta. Backend dostaje tylko listę numerów norm które ten klient śledzi. To rozwiązuje wszystkie wątpliwości — i jest najczystszą architektonicznie odpowiedzią na ograniczenia prawne.

Jest jedna techniczna granica, którą warto wprost zaznaczyć: nie każdy PDF z normą da się otworzyć do porównania. Najczęstszy przypadek to **skany** — zwłaszcza starsze wydania PKN są zapisane jako obrazy stron, a nie jako tekst. Aplikacja widzi wtedy "zdjęcie" strony i nie ma jak porównać jej z nowszą wersją. Zdarzają się też normy zapisane jako PDF z tekstem, ale w nietypowym układzie, którego aplikacja jeszcze nie rozpoznaje. To ograniczenia produktu, nie obejście prawa — wolimy je nazwać wprost, niż udawać, że obsługujemy wszystko.

## Wyrok TSUE C-588/21 P — ciekawostka która (jeszcze) nic nie zmienia

5 marca 2024 TSUE rozstrzygnął sprawę **Public.Resource.Org v. Komisja Europejska**. Skarżący żądał dostępu do norm zharmonizowanych (te, które dają domniemanie zgodności z dyrektywami UE) na podstawie rozporządzenia 1049/2001 o dostępie do dokumentów.

Sentencja jest mocna:

- Normy zharmonizowane stanowią **część prawa UE** ze względu na ich skutki prawne.
- Istnieje **nadrzędny interes publiczny w bezpłatnym dostępie** do tych norm.
- Wyrok nie podważa praw autorskich CEN/CENELEC — uznaje je, ale stwierdza, że interes publiczny przeważa.

Praktyczne skutki, stan na maj 2026:

- Komisja + CEN-CENELEC uruchomili read-only portal dla 34 krajowych organów.
- Portal udostępnia... **dokładnie te 4 normy, których dotyczył wyrok** (bezpieczeństwo zabawek: EN 71-4, EN 71-5, EN 71-12, EN 12472+A1).
- *„without any right to especially download, print, commercialize, reproduce, make available or distribute the documents"* — wykluczony tekst mining.
- **PKN nadal sprzedaje normy zharmonizowane bez zmian** — brak jakiegokolwiek komunikatu o zmianie polityki.

Co z tego wynika dla narzędzi monitorujących: trend prawny idzie w stronę otwartości, ale praktycznie nic się nie zmieniło. Model *„PKN sprzedaje + my monitorujemy fakty + diff jest BYO"* nie jest zagrożony przez darmowe alternatywy. **Jeśli kiedyś tak się stanie — będzie to dobra wiadomość, nie zła** (mniej barier wejścia dla użytkowników).

## Praktyka: co wolno, czego nie

| Operacja | OK? | Powód |
|---|---|---|
| Scrape numeru, daty, statusu pojedynczej normy z `sklep.pkn.pl` | TAK | Fakty nie podlegają copyright |
| Codzienny scrape wykazów 60-dniowych | TAK | Publiczny serwis informacyjny |
| Pełny crawl katalogu PKN do własnej kopii | NIE | Sui generis baz danych (dyr. 96/9/WE) |
| Publikacja pełnych scope'ów norm 1:1 | NIE | Scope może być utworem |
| Streszczenie scope własnymi słowami + link do `sklep.pkn.pl` | TAK | Brak reprodukcji utworu |
| Wgranie własnego PDF do diffu w chmurze (efemerycznie) | TAK | Model BYO-PDF, brak hostingu, single-user analysis |
| Hosting biblioteki PDF norm dla wielu klientów | NIE | Naruszenie licencji single-user, „wprowadzanie do obrotu" |
| Trening LLM na pełnych treściach norm | NIE | Reprodukcja całości utworu |

## Reguły operacyjne dla scrapera

Niezależnie od prawa — chodzi też o to, żeby **PKN nie zablokował techniczne**, bo wtedy projekt umiera niezależnie od tego, kto ma rację prawnie.

- **Rate limit:** 1 request na sekundę. Wykazy 60-dniowe ciągnięte raz dziennie poza godzinami szczytu.
- **Identyfikujący User-Agent:** `sincore.io-monitor/1.0 (+https://sincore.io/about)`. Jeśli kiedykolwiek PKN będzie chciał coś zgłosić, wiedzą do kogo i mają stronę kontaktu. Anonimowy bot to czerwona flaga.
- **`robots.txt`:** `www.pkn.pl/robots.txt` blokuje `/admin/`, `/user/login/`, `/search/`, `/node/add/` — nic z tego nas nie interesuje. `sklep.pkn.pl/robots.txt` zwraca 404, brak jawnego zakazu.
- **Cache na poziomie metadanych:** jeśli wartość pola się nie zmieniła od ostatniego crawla — nie aktualizujemy bazy, nie wysyłamy alertu. Zmniejsza ruch w obie strony.
- **Sitemap zamiast crawl:** `www.pkn.pl/sitemap.xml` może służyć jako lekkie źródło sygnałów o nowych URL-ach. Tańsze niż full crawl.

## Czerwone linie do zapamiętania

- Nie hostować pełnych treści norm.
- Nie budować „darmowej biblioteki PN" — to oczywisty pozew.
- Nie udostępniać wyników diff jednego klienta drugiemu.
- Nie tworzyć systemu rekomendacji „podobne normy" na bazie pełnych treści.
- Nie tworzyć cache abstraktów norm — streszczać własnymi słowami albo linkować.

Jeśli model trzyma się tej granicy — alerty operują na faktach, PDF nie wychodzi z PC klienta, baza zawiera tylko normy aktywnie śledzone — to jest do obrony zarówno przed PKN, jak i przed dyrektywą 96/9/WE.
