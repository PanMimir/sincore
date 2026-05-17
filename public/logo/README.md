# sincore — brand assets

Pliki SVG do użycia w materiałach marketingowych, mailach, CV, social mediach.

## Pliki

| Plik | Wymiary | Zastosowanie |
|---|---|---|
| `sincore-lockup.svg` | 320×80 (skalowalne) | Sygnatura mailowa, stopka CV, banery poziome, presskit |
| `sincore-lockup-stacked.svg` | 200×220 (skalowalne) | Banner pionowy, headery sekcji, materiały drukowane |
| `sincore-avatar.svg` | 1024×1024 (kwadrat) | Avatar LinkedIn / GitHub / Twitter / Discord. Eksportuj do PNG przed wgrywaniem. |
| `linkedin-banner.svg` | 1584×396 (LinkedIn cover) | Banner profilu LinkedIn. Lewa strona (~520px) celowo pusta — tam ląduje avatar. |

## Paleta

| Kolor | Hex | Użycie |
|---|---|---|
| Cyber Black | `#0a0a0f` | Tło |
| Cyber Purple | `#8b5cf6` | Border, accent `c`, `core` |
| Cyber Purple bright | `#7c3aed` | URL, sub-akcenty |
| Cyber Purple light | `#a78bfa` | Tagline italic |
| Cyber Text | `#e2e8f0` | `s`, `sin`, główny tekst |
| Cyber Muted | `#64748b` | Drobny tagline |

## Font

`Courier New` / monospace. Wszystkie litery przez `tspan` z osobnymi kolorami dla `s` (white) + `c` (purple).

## Eksport do PNG

W przeglądarce lub VS Code z preview SVG → screenshot. Alternatywnie:
```bash
# Wymaga zainstalowanego rsvg-convert lub inkscape
rsvg-convert -w 1024 -h 1024 sincore-avatar.svg -o sincore-avatar.png
```
