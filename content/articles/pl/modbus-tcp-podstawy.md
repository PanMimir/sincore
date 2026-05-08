---
title: "Modbus TCP — podstawy protokołu"
description: "Jak działa Modbus TCP, struktura ramki, typy rejestrów i pierwsze połączenie z urządzeniem przemysłowym."
date: "2026-05-01"
tags: ["modbus", "industrial", "networking", "python"]
featured: true
---

## Co to jest Modbus?

Modbus to protokół komunikacyjny opracowany w 1979 roku przez firmę Modicon. Mimo swojego wieku jest nadal **najszerzej stosowanym protokołem w automatyce przemysłowej** — znajdziesz go w PLC, falownikach, licznikach energii, czujnikach temperatury i dziesiątkach innych urządzeń.

Istnieją dwie główne wersje:
- **Modbus RTU** — komunikacja szeregowa (RS-485), bajty przesyłane binarnie
- **Modbus TCP** — Modbus opakowany w TCP/IP, port 502

## Struktura ramki Modbus TCP

Każda ramka Modbus TCP składa się z dwóch części:

### MBAP Header (7 bajtów)
```
[Transaction ID: 2B] [Protocol ID: 2B] [Length: 2B] [Unit ID: 1B]
```
- **Transaction ID** — para żądanie/odpowiedź, klient sam ustala
- **Protocol ID** — zawsze `0x0000` dla Modbus
- **Length** — liczba kolejnych bajtów
- **Unit ID** — adres urządzenia (jak adres w RTU)

### PDU — Protocol Data Unit
```
[Function Code: 1B] [Data: N bajtów]
```

## Typy rejestrów

| Typ | Adres | Rozmiar | Dostęp |
|-----|-------|---------|--------|
| Coil | 00001–09999 | 1 bit | R/W |
| Discrete Input | 10001–19999 | 1 bit | R |
| Input Register | 30001–39999 | 16 bit | R |
| Holding Register | 40001–49999 | 16 bit | R/W |

Holding Registers (FC 03) to najczęściej używany typ — tam urządzenia trzymają wartości procesowe.

## Najpopularniejsze Function Codes

- `0x01` — Read Coils
- `0x03` — Read Holding Registers ← najczęściej używany
- `0x06` — Write Single Register
- `0x10` — Write Multiple Registers

## Pierwsze połączenie w Pythonie

```python
from pymodbus.client import ModbusTcpClient

client = ModbusTcpClient(host="192.168.1.10", port=502)
client.connect()

# Odczyt 10 rejestrów od adresu 0, unit ID = 1
result = client.read_holding_registers(address=0, count=10, slave=1)

if not result.isError():
    print(result.registers)  # lista wartości int

client.close()
```

## Pułapki

1. **Adresowanie** — w dokumentacji urządzenia adres `40001` to rejestr `0` w FC03. Zawsze odejmuj 40001 (lub 30001 dla input).
2. **Endianness** — 32-bitowe wartości (float, dword) bywają składane z dwóch rejestrów w różnej kolejności. Sprawdź dokumentację.
3. **Timeout** — domyślnie pymodbus czeka 3s. Na wolnych sieciach przemysłowych warto zwiększyć.
