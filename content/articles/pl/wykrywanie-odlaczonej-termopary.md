---
id: thermocouple-disconnect-detection
title: "Wykrywanie odłączonej termopary, gdy urządzenie jej nie zgłasza"
description: "Nie każdy przetwornik temperatury sygnalizuje odłączoną termoparę. Studium przypadku F&F MB-TC-1: realne dane z rejestrów Modbus, trzy stany czujnika i granica tego, co da się wykryć programowo."
date: "2026-05-21"
tags: ["temperature", "modbus"]
featured: false
references:
  - title: "F&F Filipowski — MB-TC-1"
    url: "https://www.fif.com.pl/pl/szukaj?q=mb-tc-1"
  - title: "IEC 60584 — termopary, typy i zakresy (Wikipedia)"
    url: "https://en.wikipedia.org/wiki/Thermocouple#Types"
---

## Założenie, które okazało się błędne

Teoria mówi jasno: gdy termopara się odłączy, przetwornik temperatury powinien to zgłosić — wartością błędu (`-32768`, `NaN`) albo bitem w rejestrze statusu. Stąd typowa, słuszna rada: zawsze sprawdzaj flagę błędu, zanim zapiszesz pomiar.

Problem w tym, że **nie każde urządzenie tak działa**. Budując konfigurator do przetwornika temperatury **F&F MB-TC-1**, trafiliśmy na egzemplarz, który odłączonej termopary nie sygnalizuje **w żaden sposób**. Aplikacja w dobrej wierze pokazywała stabilne „21 °C", choć do wejścia nic nie było podłączone.

Ten artykuł to studium tego przypadku — z realnymi danymi z rejestrów Modbus i z uczciwą granicą tego, co da się, a czego nie da się wykryć programowo.

## Urządzenie: F&F MB-TC-1

Jednokanałowy przetwornik na termopary (K, J, T, N, S, E, B, R), Modbus RTU po RS-485. Istotne rejestry:

| Rejestr | Zawartość |
|---|---|
| `0x00` | temperatura bezwzględna — złącze gorące (×10) |
| `0x01` | temperatura względna — gorące minus zimne (×10) |
| `0x02` | temperatura złącza zimnego — wnętrze urządzenia (×10) |
| `0x05` | status — bity 0–3: alarmy, bit 4: pomiar poza zakresem |

Zależność jest prosta: `temp. bezwzględna = temp. złącza zimnego + napięcie termopary przeliczone na °C`. Gdy wejście jest otwarte, napięcie termopary znika — i zostaje samo złącze zimne.

## Co robi MB-TC-1 bez termopary

Nie zgłasza nic. Przy otwartym wejściu napięcie termopary ≈ 0, więc urządzenie liczy `temp. bezwzględną ≈ temp. złącza zimnego` i podaje ją jako **w pełni prawidłowy pomiar**. Bit 4 rejestru `0x05` („pomiar poza zakresem") pozostaje wyzerowany — bo ~20 °C mieści się w zakresie każdego typu termopary.

Z punktu widzenia Modbusa wszystko jest w porządku. Z punktu widzenia rzeczywistości — mierzymy nieistniejący czujnik.

## Diagnostyka: trzy stany, nie dwa

Żeby zobaczyć, co się naprawdę dzieje, zrzuciliśmy rejestry w serii ~30 odczytów dla każdego stanu czujnika. Stany okazały się **trzy**, nie dwa:

| Stan | temp. bezwzględna | rejestr `0x05` | charakter |
|---|---|---|---|
| Termopara podłączona | realny pomiar | `0x000F` | stabilny, gładki |
| **Czyste rozłączenie** | stabilne ~temp. otoczenia | `0x000F` | stabilny, gładki |
| **Luźny / przerywany styk** | rozrzut kilka °C | `0x000F` | chaotyczny szum |

Rejestr statusu `0x05` ma **identyczną wartość `0x000F`** we wszystkich trzech przypadkach. Prześledziliśmy każdy bit — żaden, udokumentowany czy nie, nie reaguje na odłączenie. Flagi po prostu nie ma.

Realne liczby z dwóch wariantów rozłączenia:

```
Rozłączone na zaciskach:  temp. bezwzgl. 18.7°C | złącze zimne 20.8°C | stabilne
Rozłączone na wtyczce:    temp. bezwzgl. 15.0°C | złącze zimne 20.8°C | stabilne
Luźny styk:               temp. bezwzgl. skacze 14.3 ↔ 19.0°C         | szum
```

Ciekawostka: punkt spoczynkowy otwartego wejścia **zależy od miejsca rozłączenia** (zwisający kabel działa jak antena) — nie ma więc nawet jednej, stałej „wartości rozłączenia" do rozpoznania.

## Dlaczego czystego rozłączenia nie da się wykryć

Tu jest sedno. Czyste, całkowite rozłączenie daje odczyt:

- **stabilny** — nie do odróżnienia od dobrego pomiaru po samej stabilności,
- **wiarygodny** — ~15–19 °C to zupełnie normalna temperatura,
- **bez flagi** — `0x05` się nie zmienia.

Co gorsza, przetwornik w szafce sam się grzeje, więc jego złącze zimne jest o kilka °C powyżej temperatury powietrza w pomieszczeniu. Odłączona termopara pokazuje zatem wartość bliską **temperaturze otoczenia** — czyli dokładnie to, co pokazałaby termopara realnie mierząca powietrze w tym pomieszczeniu.

Z poziomu rejestrów Modbus te dwa przypadki są **nieodróżnialne**. Żaden algorytm tego nie rozdzieli, bo urządzenie dostarcza identycznych danych. To ograniczenie fizyki i sprzętu, nie kwestia sprytu w kodzie.

## Co DA się wykryć: luźny styk

Trzeci stan — luźny lub przerywany styk — jest inny. Przerywany kontakt sprawia, że wejście raz „widzi" termoparę, raz jest otwarte. Odczyt **skacze chaotycznie** o kilka °C między kolejnymi próbkami, podczas gdy złącze zimne (czujnik wewnętrzny) pozostaje idealnie stabilne.

I to jest wykrywalne. Realna, podłączona termopara — dzięki bezwładności cieplnej — zmienia się **gładko**: nawet szybki, prawdziwy wzrost temperatury to małe kroki między próbkami. Pływające, przerywane wejście **zmienia się skokowo**.

W praktyce luźny styk to również najczęstsza realna awaria w terenie — wibracje obluzowują przewód w zacisku. Wykrywamy więc ten przypadek, który zdarza się najczęściej.

## Detekcja niestabilności w praktyce

Pobieramy krótką serię odczytów i oceniamy dwie rzeczy: **rozrzut** (max − min) oraz **największy skok** między sąsiednimi próbkami.

```python
import time

def reading_unstable(read_temp, samples=8, interval=0.4,
                     spread_limit=2.0, jump_limit=1.0):
    """Wykrywa luźny styk termopary po niestabilności serii odczytów.

    read_temp() -> temperatura bezwzględna [°C]
    """
    s = []
    for i in range(samples):
        s.append(read_temp())
        if i < samples - 1:
            time.sleep(interval)

    spread = max(s) - min(s)
    max_jump = max(abs(s[i + 1] - s[i]) for i in range(len(s) - 1))

    # Niestabilny = duży rozrzut ORAZ duże skoki. Sam rozrzut mógłby
    # wynikać z szybkiej, ale GŁADKIEJ zmiany realnej temperatury —
    # warunek skoku odsiewa ten przypadek.
    return spread > spread_limit and max_jump > jump_limit
```

Warunek jest celowo podwójny. Sam rozrzut nie wystarczy — szybko nagrzewający się obiekt też da duży rozrzut, ale **gładki**. Dopiero rozrzut **i** duży skok między sąsiednimi próbkami jednoznacznie wskazują na pływające wejście.

Progi (2 °C rozrzutu, 1 °C skoku) wynikają wprost z pomiarów: stan stabilny mieścił się w ~0,1–0,3 °C, luźny styk dawał ~4–5 °C. Margines jest kilkukrotny w obie strony.

## Wnioski

1. **Nie zakładaj, że „odłączona = flaga błędu".** To zależy od konkretnego urządzenia — sprawdź na sprzęcie, nie w założeniach.
2. **Czystego rozłączenia bywa nie da się wykryć.** Jeśli urządzenie podstawia wiarygodną wartość i nie podnosi flagi, software jest bezsilny. Uczciwie to udokumentuj, zamiast udawać detekcję.
3. **Wykrywaj to, co się da.** Luźny styk — najczęstszą realną awarię — rozpoznaje się po niestabilności odczytu.
4. **Alternatywa: próg zakresu.** Jeśli proces pracuje z dala od temperatury otoczenia (np. zawsze powyżej 100 °C), to odczyt nagle bliski temperaturze pokojowej sam w sobie jest sygnałem awarii. Detekcja zależna od aplikacji, ale pewna.

Sprzęt potrafi zaskoczyć. Zamiast ufać teorii, zrzuć rejestry w różnych stanach i zobacz, co urządzenie naprawdę robi — dopiero realne dane mówią, co da się wykryć.
