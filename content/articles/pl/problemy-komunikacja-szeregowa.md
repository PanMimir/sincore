---
id: serial-troubleshooting
title: "Napotkane problemy — komunikacja szeregowa RS-485 / COM"
description: "Zbiór realnych problemów z komunikacją szeregową w środowisku przemysłowym — co się dzieje, dlaczego i jak to naprawić."
date: "2026-05-14"
tags: ["rs485", "troubleshooting"]
featured: false
references:
  - title: "pymodbus — dokumentacja"
    url: "https://pymodbus.readthedocs.io/en/latest/"
  - title: "pyserial — dokumentacja"
    url: "https://pyserial.readthedocs.io/en/latest/"
---

## O tym artykule

Zebrałem tutaj problemy, które faktycznie napotkałem przy pracy z urządzeniami przemysłowymi przez RS-485 i porty COM. Nie teoria — konkretne sytuacje, objawy i rozwiązania.

---

## Port COM znika po restarcie

**Objaw:** Konwerter USB-RS485 był na COM8, po restarcie Windows przypisał mu COM12.

**Przyczyna:** Windows przypisuje numery COM dynamicznie. Przy każdym podłączeniu do innego portu USB lub po pewnych aktualizacjach numer może się zmienić.

**Rozwiązanie:**

1. Menedżer urządzeń → Porty (COM i LPT) → prawy klik na urządzenie → Właściwości → Ustawienia portu → Zaawansowane
2. Zmień "Numer portu COM" na stały (np. COM8) i zaznacz "Użyj tego portu COM, nawet jeśli jest zajęty"
3. Alternatywnie: w kodzie nie hardcoduj numeru portu — daj użytkownikowi wybór z listy dostępnych portów

---

## Urządzenie nie odpowiada — ale na pewno jest podłączone

**Objaw:** Port otwiera się, żądanie wysyłane, timeout — zero odpowiedzi.

**Kolejność sprawdzania:**

1. **Baudrate** — sprawdź w dokumentacji urządzenia. Domyślne 9600 to nie reguła. Spróbuj 19200, 38400, 115200.

2. **Parity i stop bits** — część urządzeń używa `8E1` (8 data bits, Even parity, 1 stop bit) lub `8N2`. Złe ustawienie = brak odpowiedzi.

3. **Adres slave** — sprawdź naklejkę lub dokumentację. Jeśli nieznany, zrób skan (1–32 to typowy zakres).

4. **Terminator** — brak terminatora 120Ω często objawia się brakiem odpowiedzi przy dłuższym kablu ale działaniem przy krótkim.

5. **A/B zamienione** — zamień przewody A i B między sobą.

6. **Konwerter bez auto-DE** — przy niektórych konwerterach USB-RS485 trzeba ręcznie sterować pinem DE (Driver Enable) przez RTS. W Pythonie: `rtscts=True` lub `dsrdtr=True`.

---

## Odpowiedź urywana — dostaje część ramki

**Objaw:** Modbus zwraca błąd CRC albo za mało bajtów.

**Przyczyny i rozwiązania:**

**Zbyt krótki timeout read:**

```python
# Za mało — przy wolnych urządzeniach może nie zdążyć
client = ModbusSerialClient(port="COM8", baudrate=9600, timeout=0.5)

# Bezpieczniej
client = ModbusSerialClient(port="COM8", baudrate=9600, timeout=2)
```

**Garbage na początku bufora (echo konwertera):**

```python
# Przed wysłaniem żądania wyczyść bufor
serial_port.reset_input_buffer()
serial_port.reset_output_buffer()
```

**Fragmentacja ramki na Windows:** Windows grupuje bajty w buforze, co może powodować, że `read()` zwraca nie całą ramkę. Rozwiązanie: czytaj w pętli do momentu zebrania oczekiwanej liczby bajtów lub implementuj timeout między bajtami.

---

## Działa na jednym komputerze, nie działa na drugim

**Objaw:** Ten sam kod, to samo urządzenie — na jednym PC działa, na drugim nie.

**Przyczyny:**

1. **Sterowniki konwertera** — CH340 wymaga sterownika na starszych Windows 10. Sprawdź czy w Menedżerze urządzeń nie ma żółtego wykrzyknika.

2. **Inna wersja biblioteki** — pymodbus 2.x i 3.x mają inny API. `pip show pymodbus` na obu komputerach.

3. **Antywirus blokuje port** — niektóre AV (szczególnie korporacyjne) mogą blokować dostęp do portów COM. Sprawdź logi AV lub wyłącz tymczasowo.

4. **Uprawnienia** — na Linux: `sudo usermod -a -G dialout $USER` — bez tego normalny użytkownik nie ma dostępu do `/dev/ttyUSB*`.

---

## Komunikacja działa, ale wartości są błędne

**Objaw:** Połączenie OK, rejestry odczytane, ale wartości nie mają sensu (np. temperatura -32768°C albo przepływ 99999).

**Przyczyny:**

1. **Endianness float** — 32-bitowy float składany z dwóch rejestrów Modbus może być w różnej kolejności:
   - Big-endian: rejestr 0 = MSW, rejestr 1 = LSW
   - Little-endian: rejestr 0 = LSW, rejestr 1 = MSW
   - Byte-swap: bajty wewnątrz każdego rejestru zamienione

   ```python
   import struct
   r = result.registers
   # Wypróbuj wszystkie kombinacje jeśli wartość jest nonsensowna:
   struct.unpack(">f", struct.pack(">HH", r[0], r[1]))[0]  # BE
   struct.unpack(">f", struct.pack(">HH", r[1], r[0]))[0]  # LE words
   ```

2. **Offset adresów** — dokumentacja podaje adres `40001`, a w FC03 trzeba podać `0`. Zawsze odejmij 40001 (lub 30001 dla Input Registers).

3. **Skalowanie** — wartość `1234` może oznaczać `12.34` (× 100) albo `123.4` (× 10). Sprawdź dokumentację rejestru.

---

## Port otwarty przez inny proces

**Objaw:** `Serial Exception: [Errno 16] Device or resource busy` (Linux) lub `Access is denied` (Windows).

**Windows — znajdź który proces zajął port:**

Windows nie ma wbudowanego sposobu na pokazanie który proces trzyma port COM. Najszybciej — `handle.exe` z pakietu [Sysinternals](https://learn.microsoft.com/sysinternals/downloads/handle):

```powershell
# Numer urządzenia = numer portu COM minus 1
handle.exe \Device\Serial0    # COM1
handle.exe \Device\Serial7    # COM8

# Albo zbiorczo wszystkie porty:
handle.exe -a Serial
```

Najczęstsi sprawcy: Modbus Poll, inne instancje Python, LOGO! Soft Comfort, sterowniki drukarek z wbudowanym portem COM.

**Linux:**

```bash
fuser /dev/ttyUSB0    # pokaże PID procesu
lsof /dev/ttyUSB0     # więcej szczegółów
```
