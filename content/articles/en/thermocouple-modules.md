---
id: thermocouple-modules
title: "Thermocouple Modules — Temperature Transmitters over Modbus"
description: "What thermocouple modules are, types of thermocouples, how to read temperatures over Modbus RTU and what the registers in a typical multi-channel module mean."
date: "2026-05-14"
tags: ["temperature", "modbus"]
featured: false
references:
  - title: "F&F Filipowski — MB-TC module (documentation)"
    url: "https://www.fif.com.pl/termometry/mb-tc-1"
  - title: "IEC 60584 — thermocouples, types and ranges (Wikipedia)"
    url: "https://en.wikipedia.org/wiki/Thermocouple#Types"
---

## What is a thermocouple module

A thermocouple module (temperature transmitter) is a device that:
1. Accepts thermocouple inputs (temperature sensors)
2. Measures their voltage (mV)
3. Converts it to temperature with cold-junction compensation
4. Exposes the results through a communication interface — most often Modbus RTU over RS-485

Such modules are made by F&F Filipowski (MB-TC series), ADAM (Advantech), Wago, Phoenix Contact and others. They differ in channel count, supported thermocouple types and measurement resolution.

## Thermocouple types

A thermocouple is a pair of wires made from different alloys. The hot junction measures the temperature; the cold junction sits inside the module and requires compensation.

| Type | Materials | Range | Sensitivity |
|------|-----------|-------|-------------|
| K | NiCr / NiAl | −200 to +1350°C | ~41 μV/°C |
| J | Fe / CuNi | −210 to +750°C | ~52 μV/°C |
| T | Cu / CuNi | −250 to +400°C | ~43 μV/°C |
| N | NiCrSi / NiSi | −270 to +1300°C | ~39 μV/°C |
| E | NiCr / CuNi | −270 to +1000°C | ~68 μV/°C |
| R, S, B | Pt/Rh alloys | 0 to +1700°C | ~6–13 μV/°C |

**Type K** is the most popular in industry — wide range, decent sensitivity, cheap. Laboratories often use T (low temperatures) or R/S (high, precise).

## Multi-channel module — how it works

```
[Thermocouple ch.1] ──┐
[Thermocouple ch.2] ──┤  [ADC]  [Cold junction] → [MCU] → [RS-485 / Modbus]
[Thermocouple ch.3] ──┤
[...             ] ──┘
```

Each channel has its own ADC input. The module simultaneously measures the thermocouple voltage and the cold-junction temperature (usually an NTC or PT100 sensor inside the enclosure), then applies correction curves for the selected thermocouple type.

## Modbus registers — typical 8-channel module

Input registers (FC 04 or FC 03 — depends on the manufacturer):

| Register | Content |
|----------|---------|
| 0–1 | Channel 1 temperature (float 32-bit, 2 registers) |
| 2–3 | Channel 2 temperature |
| 4–5 | Channel 3 temperature |
| ... | ... |
| 14–15 | Channel 8 temperature |
| 16 | Status — error bits per channel |
| 17 | Cold-junction temperature |

Values may be stored as:
- **IEEE 754 float** — 2 registers, directly in degrees Celsius
- **Integer × 10** — 1 register, e.g. `2356` = 235.6°C
- **Integer × 100** — 1 register, e.g. `23560` = 235.60°C

Check the module documentation — manufacturers use different representations.

## Reading in Python

```python
from pymodbus.client import ModbusSerialClient
import struct

client = ModbusSerialClient(port="COM8", baudrate=9600, timeout=1)
client.connect()

# FC 04 — Read Input Registers, 16 registers (8 channels × 2)
result = client.read_input_registers(address=0, count=16, slave=1)

if not result.isError():
    temps = []
    for i in range(0, 16, 2):
        # Compose float from two registers (big-endian)
        raw = struct.pack(">HH", result.registers[i], result.registers[i+1])
        temp = struct.unpack(">f", raw)[0]
        temps.append(round(temp, 1))

    for ch, t in enumerate(temps, 1):
        print(f"Channel {ch}: {t}°C")

client.close()
```

## Channel error — how to detect it

If a thermocouple is disconnected, damaged or out of range — the module returns an error value. Typical signals:
- Value `-32768` or `0x7FFF` (integer) — channel in error
- Value `NaN` or `±Inf` (float) — channel in error
- Bit in the status register — check the documentation

Always check these values before displaying or writing to a database — a disconnected thermocouple shouldn't write `-32768°C` to the measurement history.

## Pitfalls

1. **Byte order (endianness) for float** — manufacturers use various combinations: big-endian, little-endian, mixed-endian (swap words). If the temperature comes out nonsensical, try other combinations.

2. **Thermocouple type** — the module must be configured for the same type as the connected thermocouple. Wrong configuration gives results with no error flag but a completely wrong value.

3. **Cold-junction compensation** — for precise measurements in changing ambient conditions, check where the cold junction is physically measured and whether the module isn't in a location with large temperature swings.

4. **Thermocouple cable** — extending a thermocouple with ordinary copper wire introduces an error at the joint. Use compensation cable matched to the thermocouple type.
