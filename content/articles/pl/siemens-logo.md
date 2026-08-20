---
id: siemens-logo
title: "Siemens LOGO! — mały PLC, komunikacja i programowanie"
description: "Czym jest LOGO!, jak się go programuje, jak komunikować się z nim przez Modbus TCP i sieć Ethernet oraz kiedy warto go użyć zamiast większego PLC."
date: "2026-05-14"
tags: ["siemens", "modbus"]
featured: false
references:
  - title: "Siemens LOGO! — strona produktu i dokumentacja"
    url: "https://www.siemens.com/global/en/products/automation/systems/industrial/plc/logo.html"
---

## Czym jest Siemens LOGO!

LOGO! to seria małych sterowników logicznych (mikro-PLC) firmy Siemens, przeznaczonych do prostych zadań automatyki: sterowanie oświetleniem, wentylacją, pompami, bramami, systemami nawadniania i podobnymi.

Nie jest to pełnoprawne PLC klasy S7-300/400 — brak modułów rozszerzających komunikację przemysłową, język programowania jest uproszczony. Ale w swojej klasie jest bardzo popularny ze względu na niską cenę, prostotę konfiguracji i możliwość pracy bez dodatkowego oprogramowania (wersje z wyświetlaczem).

Aktualna generacja to **LOGO! 8** — dodano Ethernet (port RJ-45), serwer webowy, komunikację Modbus TCP oraz możliwość tworzenia własnych stron HMI dostępnych przez przeglądarkę.

## Programowanie — LOGO! Soft Comfort

Narzędzie do programowania LOGO! to **LOGO! Soft Comfort** (Windows/Linux/Mac). Programowanie w:

- **FBD** (Function Block Diagram) — bloki logiczne, połączenia graficzne
- **LAD** (Ladder Diagram) — schemat drabinkowy

Program tworzysz na komputerze, transferujesz przez Ethernet lub kabel programujący (starsze wersje). LOGO! 8 pozwala też transferować program przez kartę microSD.

Dostępne bloki funkcyjne:

- Logika: AND, OR, NOT, XOR, NAND, NOR
- Czasowe: opóźnienie załączenia/wyłączenia, zegar tygodniowy, licznik godzin
- Zliczanie: licznik w górę/dół
- Analogowe: porównanie, skalowanie, PID (w wybranych wersjach)
- Komunikacja: wysyłanie wiadomości email, SMS (z modułem GSM)

## Komunikacja przez Modbus TCP (LOGO! 8)

LOGO! 8 obsługuje Modbus TCP jako slave. Klient (np. Python, SCADA, inny PLC) może odczytywać i zapisywać zasoby LOGO!.

### Mapowanie rejestrów

| Obszar LOGO!                 | Modbus              | FC          | Uwaga           |
| ---------------------------- | ------------------- | ----------- | --------------- |
| Wejścia cyfrowe I1–I24       | Coils 1–24          | 01 (R)      |                 |
| Wyjścia cyfrowe Q1–Q20       | Coils 8193–8212     | 01/05 (R/W) |                 |
| Znaczniki M1–M64             | Coils 8257–8320     | 01/05 (R/W) |                 |
| Wejścia analogowe AI1–AI8    | Holding Reg 1–8     | 03 (R)      | 0–10V → 0–27648 |
| Wyjścia analogowe AQ1–AQ8    | Holding Reg 513–520 | 03/06 (R/W) |                 |
| Znaczniki analogowe AM1–AM64 | Holding Reg 529–592 | 03/06 (R/W) |                 |

### Odczyt wyjść w Pythonie

```python
from pymodbus.client import ModbusTcpClient

client = ModbusTcpClient(host="192.168.1.100", port=502)
client.connect()

# Odczyt wyjść Q1–Q8 (Coils 8193–8200)
coils = client.read_coils(address=8192, count=8, slave=1)
if not coils.isError():
    for i, val in enumerate(coils.bits[:8], 1):
        print(f"Q{i}: {'ON' if val else 'OFF'}")

# Zapis wyjścia Q1 = ON
client.write_coil(address=8192, value=True, slave=1)

client.close()
```

**Uwaga:** Modbus TCP musi być włączony w konfiguracji LOGO! (domyślnie wyłączony). W LOGO! Soft Comfort: Narzędzia → Ustawienia Ethernet → Modbus TCP.

## Serwer webowy

LOGO! 8 ma wbudowany serwer HTTP dostępny na porcie 80. Po zalogowaniu (domyślnie admin/admin — zmień!) możesz:

- Monitorować wejścia i wyjścia w przeglądarce
- Tworzyć własne strony HMI w LOGO! Soft Comfort i uploadować je do sterownika
- Zdalnie zmieniać parametry (jeśli strona HMI to umożliwia)

Strony HMI to proste projekty HTML z elementami graficznymi powiązanymi z zasobami LOGO!. Nie potrzebujesz SCADA ani dodatkowego oprogramowania do prostego monitoringu.

## Kiedy LOGO! zamiast S7

|              | LOGO! 8                    | S7-1200                         |
| ------------ | -------------------------- | ------------------------------- |
| Cena         | ~300–500 PLN               | ~1500–3000 PLN                  |
| Języki       | FBD, LAD                   | FBD, LAD, STL, SCL              |
| Komunikacja  | Modbus TCP, Ethernet       | PROFINET, Modbus, AS-i, ...     |
| Rozbudowa    | Ograniczona                | Moduły sygnałowe, komunikacyjne |
| Zastosowanie | Proste sterowania, ≤20 I/O | Złożona automatyka, sieci       |

LOGO! to dobry wybór gdy: masz proste zadanie, budżet jest napięty, nie potrzebujesz sieci przemysłowej.

## Pułapki

1. **Adres slave Modbus** — LOGO! domyślnie odpowiada na slave ID 1, ale można zmienić. Jeśli nie dostajesz odpowiedzi, sprawdź Unit ID.

2. **Firewall** — Windows może blokować port 502. Dodaj wyjątek lub wyłącz firewall do testów.

3. **Brak retencji** — po zaniku zasilania LOGO! traci stan znaczników o ile nie użyjesz specjalnych bloków pamięci nieulotnej (R-marker).
