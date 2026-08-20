---
id: thermocouple-modules
title: "Moduły termoparowe — przetworniki temperatury z Modbus"
description: "Czym są moduły termoparowe, typy termopar, jak odczytywać temperatury przez Modbus RTU i co oznaczają rejestry w typowym module wielokanałowym."
date: "2026-05-14"
tags: ["temperature", "modbus"]
featured: false
references:
  - title: "F&F Filipowski — wyszukaj MB-TC-1"
    url: "https://www.fif.com.pl/pl/szukaj?q=mb-tc-1"
  - title: "IEC 60584 — termopary, typy i zakresy (Wikipedia)"
    url: "https://en.wikipedia.org/wiki/Thermocouple#Types"
---

## Czym jest moduł termoparowy

Moduł termoparowy (przetwornik temperatury) to urządzenie, które:

1. Podłącza termopary (czujniki temperatury)
2. Mierzy ich napięcie (mV)
3. Przelicza je na temperaturę z uwzględnieniem kompensacji zimnego końca
4. Udostępnia wyniki przez interfejs komunikacyjny — najczęściej Modbus RTU przez RS-485

Takie moduły produkuje m.in. F&F Filipowski (seria MB-TC), ADAM (Advantech), Wago, Phoenix Contact. Różnią się liczbą kanałów, obsługiwanymi typami termopar i rozdzielczością pomiaru.

## Typy termopar

Termopara to para przewodów z różnych stopów. Styk gorący mierzy temperaturę, styk zimny (cold junction) jest w module i wymaga kompensacji.

| Typ     | Materiały     | Zakres          | Czułość     |
| ------- | ------------- | --------------- | ----------- |
| K       | NiCr / NiAl   | −200 do +1350°C | ~41 μV/°C   |
| J       | Fe / CuNi     | −210 do +750°C  | ~52 μV/°C   |
| T       | Cu / CuNi     | −250 do +400°C  | ~43 μV/°C   |
| N       | NiCrSi / NiSi | −270 do +1300°C | ~39 μV/°C   |
| E       | NiCr / CuNi   | −270 do +1000°C | ~68 μV/°C   |
| R, S, B | Pt/Rh alloys  | 0 do +1700°C    | ~6–13 μV/°C |

**Typ K** jest najpopularniejszy w przemyśle — szeroki zakres, dobra czułość, tani. W laboratoriach często używa się T (niskie temperatury) lub R/S (wysokie, precyzyjne).

## Moduł wielokanałowy — schemat działania

```
[Termopara ch.1] ──┐
[Termopara ch.2] ──┤  [ADC]  [Cold junction] → [MCU] → [RS-485 / Modbus]
[Termopara ch.3] ──┤
[...          ] ──┘
```

Każdy kanał ma własne wejście ADC. Moduł mierzy jednocześnie napięcie termopary i temperaturę zimnego końca (zazwyczaj czujnik NTC lub PT100 wewnątrz obudowy), po czym stosuje krzywe korekcyjne dla wybranego typu termopary.

## Rejestry Modbus — typowy moduł 8-kanałowy

Rejestry Input (FC 04 lub FC 03 — zależy od producenta):

| Rejestr | Zawartość                                      |
| ------- | ---------------------------------------------- |
| 0–1     | Temperatura kanał 1 (float 32-bit, 2 rejestry) |
| 2–3     | Temperatura kanał 2                            |
| 4–5     | Temperatura kanał 3                            |
| ...     | ...                                            |
| 14–15   | Temperatura kanał 8                            |
| 16      | Status — bity błędów per kanał                 |
| 17      | Temperatura cold junction                      |

Wartości mogą być przechowywane jako:

- **Float IEEE 754** — 2 rejestry, bezpośrednio stopnie Celsjusza
- **Integer × 10** — 1 rejestr, np. `2356` = 235.6°C
- **Integer × 100** — 1 rejestr, np. `23560` = 235.60°C

Sprawdź dokumentację konkretnego modułu — producenci używają różnych reprezentacji.

## Odczyt w Pythonie

```python
from pymodbus.client import ModbusSerialClient
import struct

client = ModbusSerialClient(port="COM8", baudrate=9600, timeout=1)
client.connect()

# FC 04 — Read Input Registers, 16 rejestrów (8 kanałów × 2)
result = client.read_input_registers(address=0, count=16, slave=1)

if not result.isError():
    temps = []
    for i in range(0, 16, 2):
        # Składanie float z dwóch rejestrów (big-endian)
        raw = struct.pack(">HH", result.registers[i], result.registers[i+1])
        temp = struct.unpack(">f", raw)[0]
        temps.append(round(temp, 1))

    for ch, t in enumerate(temps, 1):
        print(f"Kanał {ch}: {t}°C")

client.close()
```

## Błąd kanału — jak go wykryć

Jeśli termopara jest odłączona, uszkodzona lub przekroczony zakres — moduł zwraca wartość błędu. Typowe sygnały:

- Wartość `-32768` lub `0x7FFF` (integer) — kanał w błędzie
- Wartość `NaN` lub `±Inf` (float) — kanał w błędzie
- Bit w rejestrze statusu — sprawdź dokumentację

Zawsze sprawdzaj te wartości przed wyświetleniem lub zapisem do bazy — brak termopary nie powinien zapisywać `-32768°C` do historii pomiarów.

## Pułapki

1. **Kolejność bajtów (endianness) float** — producenci używają różnych kombinacji: big-endian, little-endian, mixed-endian (swap words). Jeśli temperatura wychodzi nonsensowna, wypróbuj inne kombinacje.

2. **Typ termopary** — moduł musi być skonfigurowany na ten sam typ co podłączona termopara. Błędna konfiguracja daje wyniki bez błędu, ale z zupełnie złą wartością.

3. **Kompensacja zimnego końca** — dla precyzyjnych pomiarów w zmiennych warunkach otoczenia sprawdź, gdzie fizycznie mierzony jest cold junction i czy moduł nie jest w miejscu z dużymi wahaniami temperatury.

4. **Kabel termoparowy** — przedłużanie termopary zwykłym kablem miedzianym wprowadza błąd w miejscu połączenia. Używaj kabla kompensacyjnego odpowiedniego dla danego typu termopary.
