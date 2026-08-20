# sincore — brand assets

## Pliki

| Plik                         | Tło              | Zastosowanie                                                             |
| ---------------------------- | ---------------- | ------------------------------------------------------------------------ |
| `sincore-wordmark-dark.svg`  | ciemne (#0a0a0f) | Strona sincore.io, banner social na ciemnym tle, prezentacje w dark mode |
| `sincore-wordmark-light.svg` | jasne (#ffffff)  | CV, sygnatura mailowa, dokumenty PDF, papier                             |

## Koncepcja

Wordmark `sincore` z kontrastem wagi fontu:

- **`sin`** — weight 300 (Light) — wizualnie "to co naprawiamy"
- **`core`** — weight 800 (ExtraBold) — wizualnie "rdzeń który działa"

Monochrome (czarny/biały). Kolor dodawany kontekstowo w UI strony, ale samo logo bez koloru — pasuje wszędzie, drukuje się bez problemu.

## Font

`Inter` (preferowany), z fallbackiem na system sans-serif: `-apple-system, BlinkMacSystemFont, 'Helvetica Neue', Arial`. Inter to OSS, dostępny na Google Fonts i [rsms.me/inter](https://rsms.me/inter).

Jeśli renderujesz SVG bez Inter w systemie, zostanie użyty pierwszy dostępny sans-serif — wygląd bardzo zbliżony.

## Favicon / monogram `sc`

Monogram `sc` (biały `s` + fioletowy `c` w fioletowej ramce) zostaje **tylko jako favicon i ikonka mobilna w navbar**. Nie używać jako głównego loga marki — main brand to wordmark.

## Eksport do PNG (gdy potrzeba bitmapy)

```bash
# rsvg-convert (z librsvg)
rsvg-convert -w 1280 sincore-wordmark-light.svg -o sincore-wordmark-light.png

# albo inkscape
inkscape sincore-wordmark-dark.svg --export-type=png --export-width=1280
```

W praktyce: otwórz SVG w przeglądarce, zrób screenshot, lub przeciągnij do Figma/Affinity Designer i eksportuj.
