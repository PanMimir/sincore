---
id: flowbus-bronkhorst
title: "Flowbus Protocol — Communicating with Bronkhorst Devices"
description: "How the Flowbus protocol works in Bronkhorst mass flow controllers, message structure, parameter addressing and your first connection."
date: "2026-05-14"
tags: ["flowbus", "bronkhorst"]
featured: true
references:
  - title: "bronkhorst-propar — Python library (GitHub)"
    url: "https://github.com/bronkhorst-developer/bronkhorst-propar"
  - title: "Bronkhorst — manuals and downloads"
    url: "https://www.bronkhorst.com/en-us/downloads-en/manuals/"
---

## What is Flowbus

Flowbus is a proprietary communication protocol from Bronkhorst High-Tech, used in their mass flow controllers and meters (MFC/MFM), pressure controllers and other precision instruments. It runs over RS-485 at **38400 bps**, with a frame format different from standard Modbus.

Newer Bronkhorst devices also support Modbus RTU or PROFIBUS, but Flowbus remains the native protocol with full access to all parameters.

## Parameter addressing — Node/Process/Parameter

In Flowbus, every device parameter is described by three numbers:

```
Node : Process : Parameter
  03 :    1    :    1      →  Setpoint
  03 :    1    :    0      →  Measure (current flow)
```

- **Node** — device address on the bus (1–255, default 3)
- **Process** — process number (usually 1 for the main channel)
- **Parameter** — parameter number within the process

Full parameter list in the Bronkhorst document "RS232 interface and Flowbus commands". Key parameters for an MFC:

| Process | Parameter | Description | Type |
|---------|-----------|-------------|------|
| 1 | 0 | Measure — current flow | float |
| 1 | 1 | Setpoint | float |
| 1 | 3 | Valve output | float |
| 1 | 8 | Capacity 100% — full range | float |
| 0 | 0 | Device type | string |
| 0 | 1 | Serial number | string |

Flow values in Flowbus are expressed as a percentage (0–32000 = 0–100%). Conversion to physical units requires knowing the full range (Capacity 100%).

## Flowbus frame structure

A Flowbus frame (simplified, ASCII mode):

```
: [Length] [Node] [Command] [Process] [Parameter] [Data] \r
```

Example — read Measure (Process 1, Parameter 0) from device Node 3:

```
:06 03 04 01 00 00\r
│   │  │  │  │
│   │  │  └──┴── Process:Parameter = 1:0
│   │  └── Command 04 = Get Parameter
│   └── Node = 3
└── Length = 6 bytes after the colon
```

The device responds with a value in a format that depends on the parameter (float as 4 hex bytes, string as ASCII).

## First connection in Python

Bronkhorst provides the `bronkhorst-propar` library for Python, which implements Flowbus:

```python
import propar

instrument = propar.instrument(
    "/dev/ttyUSB0",   # or "COM8" on Windows
    node=3
)

# Read current flow (Process 1, Param 0)
measure = instrument.readParameter(0)
print(f"Flow: {measure}")

# Set setpoint (Process 1, Param 1)
# Value in percent: 50.0 = 50% of range
instrument.writeParameter(1, 50.0)
```

Library available via pip:
```
pip install bronkhorst-propar
```

Without the library you can communicate directly via `pyserial`, but frame-parsing implementation is significantly more work.

## Device identification

Before actual communication, it's worth reading the device identification:

```python
device_type   = instrument.readParameter(propar.DEVICE_TYPE)
serial_number = instrument.readParameter(propar.SERIAL_NUMBER)
firmware      = instrument.readParameter(propar.FIRMWARE_VERSION)
print(f"{device_type} | S/N: {serial_number} | FW: {firmware}")
```

This lets you verify you connected to the right device and learn its type before reading process values.

## Pitfalls

1. **38400 bps speed** — Flowbus doesn't run at 9600. The device won't respond if you set the wrong baud rate.

2. **Termination** — RS-485 requires line termination. When testing with a single device connected directly to a USB converter, termination may still be needed.

3. **Percent values** — Flowbus operates on values 0–32000 corresponding to 0–100%. The `bronkhorst-propar` library converts to percent automatically, but with raw communication remember the conversion.

4. **Node address** — the default node address is 3, but devices can have different configurations. Check the sticker on the device or use discovery mode (broadcast to node 0x80).
