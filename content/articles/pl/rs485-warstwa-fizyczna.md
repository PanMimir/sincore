---
id: rs485-physical
title: "RS-485 — warstwa fizyczna od podstaw"
description: "Czym jest RS-485, jak wygląda magistrala, terminator, uziemienie, konwertery USB i typowe błędy okablowania."
date: "2026-05-14"
tags: ["rs485", "hardware"]
featured: false
references:
  - title: "TIA-485-A Standard (Wikipedia)"
    url: "https://en.wikipedia.org/wiki/RS-485"
  - title: "Texas Instruments — RS-485/RS-422 Circuit Implementation Guide"
    url: "https://www.ti.com/lit/an/slla272d/slla272d.pdf"
---

## Czym jest RS-485

RS-485 (znany też jako EIA-485) to standard elektryczny dla transmisji szeregowej. Sam w sobie nie definiuje protokołu — definiuje tylko, jak sygnał wygląda na przewodzie. Po RS-485 jeździ Modbus RTU, Flowbus, PROFIBUS i wiele innych protokołów przemysłowych.

Kluczowa cecha: **transmisja różnicowa**. Zamiast jednej linii sygnałowej względem masy, RS-485 używa pary przewodów A i B. Odbiornik mierzy różnicę napięć między nimi. To sprawia, że zakłócenia wspólne (np. od falowników, silników) są skutecznie tłumione.

## Topologia magistrali

RS-485 to magistrala liniowa — urządzenia dołączone szeregowo, jedno za drugim:

```
Master ──┬── Slave 1 ──┬── Slave 2 ──┬── [Terminator 120Ω]
         │             │             │
[Term.]  │             │             │
 120Ω    A/B          A/B           A/B
```

**Nie wolno** robić rozgałęzień (topologia gwiazdy lub drzewa) — refleksje sygnału powodują błędy komunikacji, szczególnie przy wyższych prędkościach.

## Terminator

Na **obu końcach** magistrali musi być rezystor 120 Ω między liniami A i B. Brak terminatora to najczęstszy powód niestabilnej komunikacji — wszystko działa na krótkim kablu, ale sypie się przy dłuższym lub większej liczbie urządzeń.

Wiele urządzeń ma wbudowany przełącznik terminatora (jumper lub DIP switch). Terminator włącz tylko w urządzeniach na **końcach** linii, nie w środku.

## Bias resistors (rezystory podciągające)

Gdy magistrala jest w stanie idle (nikt nie nadaje), linie A i B mogą "pływać" w niezdefiniowanym stanie. Rezystory bias wymuszają zdefiniowany stan:
- Linia A podciągnięta do +5V przez ~560–680 Ω
- Linia B podciągnięta do GND przez ~560–680 Ω

Zazwyczaj montowane tylko na masterze lub na jednym urządzeniu w magistrali. Zbyt wiele rezystorów bias obciąża linię.

## Uziemienie — GND ma znaczenie

RS-485 jest różnicowy, ale odbiornik potrzebuje wspólnego potencjału odniesienia z nadajnikiem. Bez wspólnej masy sygnałowej różnica potencjałów między masami urządzeń może wyjść poza zakres wejścia odbiornika (±7V) i uszkodzić układy.

W praktyce: **zawsze prowadź trzecią żyłę** jako wspólną masę sygnałową (nie mylić z PE — uziemieniem ochronnym).

## Konwertery USB–RS485

Do podłączenia komputera do magistrali RS-485 potrzebny jest konwerter. Popularne układy:

| Układ | Uwagi |
|-------|-------|
| CH340 | Tani, powszechny, działa w Windows bez sterowników (Win 10+) |
| CP2102 | Stabilny, dobra obsługa w Linux |
| FT232 | Najlepszy timing, droższy, polecany przy wysokich baudrate |
| FTDI FT485 | Dedykowany RS-485, automatyczne przełączanie kierunku |

Tanie konwertery bez oznaczenia układu mogą mieć problemy z automatycznym przełączaniem kierunku TX/RX — objawiają się urywaną pierwszą ramką lub echem.

## Prędkości transmisji

Standard nie narzuca konkretnych baudrate. W praktyce przemysłowej najczęściej spotkasz:
- **9600 bps** — domyślne dla wielu urządzeń Modbus
- **19200 bps**
- **38400 bps**
- **115200 bps** — maksimum dla większości tanich konwerterów USB

Przy długich kablach (>100 m) trzymaj się niskich prędkości (9600–19200). Ogólna zasada: baudrate × długość kabla [m] ≤ 10^8.

## Pułapki

1. **Zamienione A i B** — standard definiuje A jako "−" i B jako "+" w stanie Mark (logiczne 1). Część producentów oznaczyła to odwrotnie. Jeśli komunikacja nie działa, zamień A↔B.

2. **Wspólna masa** — brak trzeciej żyły do wspólnej masy to najczęstsze przeoczenie przy instalacji.

3. **Rozgałęzienia** — każde rozgałęzienie (stub) powyżej kilku centymetrów powoduje refleksje. Jeśli musisz rozgałęzić, użyj repeatera/hubów RS-485.

4. **Zbyt wiele terminatorów** — jeśli włączysz terminator w każdym urządzeniu, sumaryczna rezystancja będzie za niska i obciąży driver.
