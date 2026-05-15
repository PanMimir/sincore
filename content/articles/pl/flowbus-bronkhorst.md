---
id: flowbus-bronkhorst
title: "Protokół Flowbus — komunikacja z urządzeniami Bronkhorst"
description: "Jak działa protokół Flowbus używany przez kontrolery przepływu masy Bronkhorst, struktura wiadomości, adresowanie parametrów i pierwsze połączenie."
date: "2026-05-14"
tags: ["flowbus", "bronkhorst"]
featured: true
references:
  - title: "bronkhorst-propar — biblioteka Python (GitHub)"
    url: "https://github.com/bronkhorst-developer/bronkhorst-propar"
  - title: "Bronkhorst — RS232 Interface and Flowbus Commands (dokumentacja)"
    url: "https://www.bronkhorst.com/getmedia/7b3cce19-2fd1-4734-b2d4-a28ec0c38f5f/917027-manual-rs232-interface-and-flowbus-commands.pdf"
---

## Czym jest Flowbus

Flowbus to zastrzeżony protokół komunikacyjny firmy Bronkhorst High-Tech, używany w ich kontrolerach i miernikach przepływu masy (MFC/MFM), ciśnienia i innych urządzeniach precyzyjnych. Działa po RS-485 z prędkością **38400 bps**, format ramki jest różny od standardowego Modbus.

Nowsze urządzenia Bronkhorst obsługują również Modbus RTU lub PROFIBUS, ale Flowbus pozostaje natywnym protokołem z pełnym dostępem do wszystkich parametrów.

## Adresowanie parametrów — Node/Process/Parameter

W Flowbus każdy parametr urządzenia opisany jest trzema liczbami:

```
Node : Process : Parameter
  03 :    1    :    1      →  Setpoint (wartość zadana)
  03 :    1    :    0      →  Measure (aktualny przepływ)
```

- **Node** — adres urządzenia na magistrali (1–255, domyślnie 3)
- **Process** — numer procesu (zwykle 1 dla głównego kanału)
- **Parameter** — numer parametru w procesie

Pełna lista parametrów w dokumentacji Bronkhorst "RS232 interface and Flowbus commands". Kluczowe parametry dla MFC:

| Process | Parameter | Opis | Typ |
|---------|-----------|------|-----|
| 1 | 0 | Measure — aktualny przepływ | float |
| 1 | 1 | Setpoint — wartość zadana | float |
| 1 | 3 | Valve output — wyjście zaworu | float |
| 1 | 8 | Capacity 100% — zakres pełny | float |
| 0 | 0 | Device type — typ urządzenia | string |
| 0 | 1 | Serial number | string |

Wartości przepływu w Flowbus wyrażone są procentowo (0–32000 = 0–100%). Przeliczenie na jednostki fizyczne wymaga znajomości zakresu pełnego (Capacity 100%).

## Struktura ramki Flowbus

Ramka Flowbus (uproszczona, tryb ASCII):

```
: [Length] [Node] [Command] [Process] [Parameter] [Data] \r
```

Przykład — odczyt Measure (Process 1, Parameter 0) z urządzenia Node 3:

```
:06 03 04 01 00 00\r
│   │  │  │  │
│   │  │  └──┴── Process:Parameter = 1:0
│   │  └── Command 04 = Get Parameter
│   └── Node = 3
└── Length = 6 bajtów po dwukropku
```

Urządzenie odpowiada wartością w formacie zależnym od parametru (float jako 4 bajty hex, string jako ASCII).

## Pierwsze połączenie w Pythonie

Bronkhorst dostarcza bibliotekę `bronkhorst-propar` dla Python, która implementuje Flowbus:

```python
import bronkhorst.propar as propar

instrument = propar.instrument(
    "/dev/ttyUSB0",   # lub "COM8" na Windows
    node=3
)

# Odczyt aktualnego przepływu (Process 1, Param 0)
measure = instrument.readParameter(0)
print(f"Przepływ: {measure}")

# Ustawienie wartości zadanej (Process 1, Param 1)
# Wartość w procentach: 50.0 = 50% zakresu
instrument.writeParameter(1, 50.0)
```

Biblioteka dostępna przez pip:
```
pip install bronkhorst-propar
```

Bez biblioteki można komunikować się bezpośrednio przez `pyserial`, ale implementacja parsowania ramek jest bardziej pracochłonna.

## Identyfikacja urządzenia

Przed właściwą komunikacją warto odczytać identyfikację urządzenia:

```python
device_type   = instrument.readParameter(propar.DEVICE_TYPE)
serial_number = instrument.readParameter(propar.SERIAL_NUMBER)
firmware      = instrument.readParameter(propar.FIRMWARE_VERSION)
print(f"{device_type} | S/N: {serial_number} | FW: {firmware}")
```

Pozwala to zweryfikować czy podłączyłeś się do właściwego urządzenia i poznać jego typ przed odczytem wartości procesowych.

## Pułapki

1. **Prędkość 38400 bps** — Flowbus nie działa na 9600. Urządzenie nie odpowie jeśli ustawisz złe baudrate.

2. **Terminator** — RS-485 wymaga terminatora na końcach linii. Przy testach z jednym urządzeniem podłączonym bezpośrednio do konwertera USB, terminator może być potrzebny.

3. **Wartości procentowe** — Flowbus operuje na wartościach 0–32000 odpowiadających 0–100%. Biblioteka `bronkhorst-propar` automatycznie konwertuje do procent, ale przy komunikacji surowej pamiętaj o przeliczeniu.

4. **Node address** — domyślny adres węzła to 3, ale urządzenia mogą mieć różne konfiguracje. Sprawdź naklejkę na urządzeniu lub użyj trybu discovery (broadcast do node 0x80).
