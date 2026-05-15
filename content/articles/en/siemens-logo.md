---
id: siemens-logo
title: "Siemens LOGO! — Small PLC, Communication and Programming"
description: "What LOGO! is, how to program it, how to talk to it over Modbus TCP and Ethernet, and when it's the right choice instead of a bigger PLC."
date: "2026-05-14"
tags: ["siemens", "modbus"]
featured: false
references:
  - title: "Siemens LOGO! 8 — System Manual (Siemens Industry Support)"
    url: "https://support.industry.siemens.com/cs/document/109741041"
  - title: "LOGO! Soft Comfort — product page"
    url: "https://www.siemens.com/global/en/products/automation/systems/industrial/plc/logo.html"
---

## What is Siemens LOGO!

LOGO! is a line of small logic controllers (micro-PLCs) from Siemens, aimed at simple automation tasks: lighting, ventilation, pumps, gates, irrigation systems and the like.

It's not a full-fledged PLC of the S7-300/400 class — no industrial communication expansion modules, and the programming language is simplified. But in its class it's very popular thanks to low price, simple configuration and the ability to work without extra software (versions with a built-in display).

The current generation is **LOGO! 8** — Ethernet (RJ-45 port) was added, along with a web server, Modbus TCP communication and the ability to create custom HMI pages accessible through a browser.

## Programming — LOGO! Soft Comfort

The programming tool for LOGO! is **LOGO! Soft Comfort** (Windows/Linux/Mac). Programming in:
- **FBD** (Function Block Diagram) — logic blocks with graphical connections
- **LAD** (Ladder Diagram) — ladder logic

You build the program on a computer, then transfer it over Ethernet or a programming cable (older models). LOGO! 8 also lets you transfer programs via microSD.

Available function blocks:
- Logic: AND, OR, NOT, XOR, NAND, NOR
- Timing: on/off delay, weekly clock, hours counter
- Counting: up/down counter
- Analog: comparison, scaling, PID (in selected versions)
- Communication: send email, SMS (with GSM module)

## Communication via Modbus TCP (LOGO! 8)

LOGO! 8 supports Modbus TCP as a slave. A client (Python, SCADA, another PLC) can read and write LOGO! resources.

### Register mapping

| LOGO! area | Modbus | FC | Note |
|------------|--------|----|------|
| Digital inputs I1–I24 | Coils 1–24 | 01 (R) | |
| Digital outputs Q1–Q20 | Coils 8193–8212 | 01/05 (R/W) | |
| Markers M1–M64 | Coils 8257–8320 | 01/05 (R/W) | |
| Analog inputs AI1–AI8 | Holding Reg 1–8 | 03 (R) | 0–10V → 0–27648 |
| Analog outputs AQ1–AQ8 | Holding Reg 513–520 | 03/06 (R/W) | |
| Analog markers AM1–AM64 | Holding Reg 529–592 | 03/06 (R/W) | |

### Reading outputs in Python

```python
from pymodbus.client import ModbusTcpClient

client = ModbusTcpClient(host="192.168.1.100", port=502)
client.connect()

# Read outputs Q1–Q8 (Coils 8193–8200)
coils = client.read_coils(address=8192, count=8, slave=1)
if not coils.isError():
    for i, val in enumerate(coils.bits[:8], 1):
        print(f"Q{i}: {'ON' if val else 'OFF'}")

# Write output Q1 = ON
client.write_coil(address=8192, value=True, slave=1)

client.close()
```

**Note:** Modbus TCP must be enabled in the LOGO! configuration (off by default). In LOGO! Soft Comfort: Tools → Ethernet Settings → Modbus TCP.

## Web server

LOGO! 8 has a built-in HTTP server on port 80. After logging in (default admin/admin — change it!) you can:
- Monitor inputs and outputs in a browser
- Create custom HMI pages in LOGO! Soft Comfort and upload them to the controller
- Remotely change parameters (if the HMI page allows it)

HMI pages are simple HTML projects with graphical elements bound to LOGO! resources. You don't need SCADA or extra software for basic monitoring.

## When LOGO! instead of S7

| | LOGO! 8 | S7-1200 |
|--|---------|---------|
| Price | ~70–120 EUR | ~350–700 EUR |
| Languages | FBD, LAD | FBD, LAD, STL, SCL |
| Communication | Modbus TCP, Ethernet | PROFINET, Modbus, AS-i, ... |
| Expansion | Limited | Signal and communication modules |
| Use case | Simple control, ≤20 I/O | Complex automation, networks |

LOGO! is a good choice when: the task is simple, the budget is tight, you don't need an industrial network.

## Pitfalls

1. **Modbus slave address** — LOGO! responds to slave ID 1 by default, but it can be changed. If you're not getting a response, check the Unit ID.

2. **Firewall** — Windows can block port 502. Add an exception or disable the firewall for testing.

3. **No retention** — after a power loss LOGO! loses the marker state unless you use special non-volatile memory blocks (R-markers).
