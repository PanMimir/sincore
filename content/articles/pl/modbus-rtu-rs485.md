---
id: modbus-rtu
title: "Modbus RTU — RS-485 i różnice względem TCP"
description: "Jak działa Modbus RTU przez RS-485, struktura ramki z CRC, adresowanie urządzeń i typowe problemy z timing."
date: "2026-05-14"
tags: ["modbus", "rs485"]
featured: true
references:
  - title: "Simply Modbus — opis protokołu (FAQ)"
    url: "https://www.simplymodbus.ca/FAQ.htm"
  - title: "pymodbus — ModbusSerialClient"
    url: "https://pymodbus.readthedocs.io/en/latest/source/client.html"
---

## Modbus RTU vs TCP — co jest co

Modbus TCP to Modbus opakowany w Ethernet i TCP/IP. Modbus RTU to oryginalna wersja — komunikacja szeregowa po RS-485 lub RS-232, bajty przesyłane binarnie bez żadnego nagłówka sieciowego.

W praktyce przemysłowej RTU nadal dominuje w urządzeniach polowych — czujniki, przetworniki, liczniki, moduły I/O. TCP znajdziesz głównie tam, gdzie jest już sieć Ethernet: sterowniki, panele HMI, systemy SCADA.

## Struktura ramki RTU

W odróżnieniu od TCP, ramka RTU nie ma nagłówka MBAP. Identyfikacja początku i końca ramki odbywa się przez **ciszę na linii** (minimum 3.5 czasu trwania jednego znaku).

```
[Address: 1B] [Function Code: 1B] [Data: N bajtów] [CRC: 2B]
```

- **Address** — adres slave (1–247). Adres 0 to broadcast (bez odpowiedzi).
- **CRC** — CRC-16/IBM, liczony od Address do ostatniego bajtu Data. Przesyłany **little-endian** (LSB pierwszy).

### Przykład ramki — odczyt 2 rejestrów od adresu 0, slave 1

Żądanie:
```
01 03 00 00 00 02 C4 0B
│  │  │     │     └─ CRC (little-endian: C4, 0B)
│  │  └─────┴── adres startowy 0x0000, ilość 0x0002
│  └── FC 03 = Read Holding Registers
└── adres slave = 1
```

Odpowiedź (2 rejestry = 4 bajty danych):
```
01 03 04 01 F4 00 00 F3 B0
│  │  │  └──────────┘  └─ CRC
│  │  └── Byte Count = 4
│  └── FC 03
└── adres slave = 1
```

## RS-485 — podstawy warstwy fizycznej

RS-485 to standard różnicowy: dwie linie A i B. Stan logiczny "1" gdy A > B o co najmniej 200 mV, "0" gdy B > A.

Kluczowe cechy:
- Półdupleks — nadawanie i odbieranie nie jednocześnie
- Do 32 urządzeń na jednej magistrali (ze wzmacniaczami więcej)
- Maksymalnie 1200 m przy 100 kb/s (krócej przy wyższych prędkościach)
- Wymaga terminatora 120 Ω na **obu końcach** magistrali

## Pierwsze połączenie w Pythonie

```python
from pymodbus.client import ModbusSerialClient

client = ModbusSerialClient(
    port="COM8",          # lub "/dev/ttyUSB0" na Linux
    baudrate=9600,
    bytesize=8,
    parity="N",           # None — najczęściej
    stopbits=1,
    timeout=1
)

client.connect()

result = client.read_holding_registers(address=0, count=10, slave=1)

if not result.isError():
    print(result.registers)

client.close()
```

Parametry (baudrate, parity, stopbits) muszą być identyczne po obu stronach. Sprawdź dokumentację urządzenia — część producentów używa parity Even lub 2 stop bits.

## Pułapki

1. **Brak terminatora** — najczęstszy problem. Bez 120 Ω na końcach magistrali pojawiają się refleksje sygnału, komunikacja działa niestabilnie lub tylko na krótkich kablach.

2. **Kierunek transmisji** — konwertery USB-RS485 wymagają przełączenia kierunku (RTS). Tanie konwertery robią to automatycznie z opóźnieniem — jeśli ramka się urywa, wypróbuj `rtscts=True` lub inny konwerter.

3. **Adres 0** — broadcast, slave nie odpowiada. Jeśli dostajesz timeout przy adresie 0, sprawdź, czy nie wysyłasz broadcastu zamiast odczytu.

4. **Interbajt gap** — RTU wymaga ciszy między bajtami nie dłuższej niż 1.5 czasu znaku. Wolne systemy PC mogą mieć problem z zachowaniem timingu przy wysokich baudrate.
