---
title: "Siemens S7 — komunikacja przez Snap7"
description: "Jak połączyć się z PLC Siemens S7-300/400/1200/1500 przez bibliotekę Snap7 w Pythonie. Odczyt i zapis bloków danych."
date: "2026-04-10"
tags: ["siemens", "plc", "snap7", "python", "industrial"]
featured: false
---

## Snap7 — co to jest

Snap7 to biblioteka C++ (z bindingami dla Pythona, .NET, Java) do komunikacji z PLC Siemens przez protokół S7comm. Działa bez Siemens TIA Portal i bez licencji.

Obsługuje:
- S7-300, S7-400 — klasyczne PLC
- S7-1200, S7-1500 — wymagają włączenia dostępu w konfiguracji

## Instalacja

```bash
pip install python-snap7
```

Na Linux wymagana jest biblioteka dynamiczna:
```bash
sudo apt install libsnap7-1 libsnap7-dev
```

## Pierwsze połączenie

```python
import snap7
from snap7.util import *

client = snap7.client.Client()

# rack i slot zależy od hardwaru — dla S7-300 zazwyczaj rack=0, slot=2
client.connect("192.168.1.5", rack=0, slot=2)

print(f"Połączono: {client.get_connected()}")
print(f"Info o CPU: {client.get_cpu_info()}")
```

## Odczyt bloku danych (DB)

```python
# Odczyt 10 bajtów z DB1, offset 0
data = client.db_read(db_number=1, start=0, size=10)

# Parsowanie typów ze snap7.util
real_val  = get_real(data, 0)   # float 32-bit na offset 0
int_val   = get_int(data, 4)    # int 16-bit na offset 4
bool_val  = get_bool(data, 6, 0) # bool na offset 6, bit 0
```

## Zapis do bloku danych

```python
data = bytearray(4)  # bufor 4 bajtów
set_real(data, 0, 23.5)  # zapisz float 23.5 na offset 0

client.db_write(db_number=1, start=0, data=data)
```

## Dostęp do S7-1200/1500

Nowsze PLC mają domyślnie wyłączony dostęp zewnętrzny. W TIA Portal:
1. Właściwości CPU → Protection & Security
2. Zaznacz **"Permit access with PUT/GET communication"**
3. Odznacz ochronę bloku danych (DB properties → "Optimized block access" = OFF)

Optymalizowane DB używają innego układu pamięci — Snap7 nie obsługuje offsetów z optymalizowanych DB.

## Pułapka: Big-Endian

Siemens używa Big-Endian (bajt starszy pierwszy). Snap7 obsługuje to automatycznie przez funkcje `get_*`/`set_*`, ale jeśli parsuje się ręcznie:

```python
import struct
# Big-endian float z bajtów
val = struct.unpack(">f", data[0:4])[0]
```
