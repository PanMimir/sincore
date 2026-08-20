---
id: modbus-tcp
title: "Modbus TCP — Protocol Basics"
description: "How Modbus TCP works, frame structure, register types and your first connection to an industrial device."
date: "2026-05-01"
tags: ["modbus", "industrial", "networking", "python"]
featured: true
---

## What is Modbus?

Modbus is a communication protocol developed in 1979 by Modicon. Despite its age, it remains the **most widely used protocol in industrial automation** — you'll find it in PLCs, drives, energy meters, temperature sensors and dozens of other devices.

Two main variants exist:

- **Modbus RTU** — serial communication (RS-485), binary encoding
- **Modbus TCP** — Modbus wrapped in TCP/IP, port 502

## Modbus TCP Frame Structure

Each Modbus TCP frame consists of two parts:

### MBAP Header (7 bytes)

```
[Transaction ID: 2B] [Protocol ID: 2B] [Length: 2B] [Unit ID: 1B]
```

- **Transaction ID** — request/response pair, set by client
- **Protocol ID** — always `0x0000` for Modbus
- **Length** — number of following bytes
- **Unit ID** — device address (like address in RTU)

### PDU — Protocol Data Unit

```
[Function Code: 1B] [Data: N bytes]
```

## Register Types

| Type             | Address     | Size   | Access |
| ---------------- | ----------- | ------ | ------ |
| Coil             | 00001–09999 | 1 bit  | R/W    |
| Discrete Input   | 10001–19999 | 1 bit  | R      |
| Input Register   | 30001–39999 | 16 bit | R      |
| Holding Register | 40001–49999 | 16 bit | R/W    |

Holding Registers (FC 03) are the most commonly used — devices store process values there.

## First Connection in Python

```python
from pymodbus.client import ModbusTcpClient

client = ModbusTcpClient(host="192.168.1.10", port=502)
client.connect()

# Read 10 registers from address 0, unit ID = 1
result = client.read_holding_registers(address=0, count=10, slave=1)

if not result.isError():
    print(result.registers)  # list of int values

client.close()
```

## Common Pitfalls

1. **Addressing** — in device docs, address `40001` is register `0` in FC03. Always subtract 40001.
2. **Endianness** — 32-bit values (float, dword) are composed of two registers, byte order varies. Check the manual.
3. **Timeout** — pymodbus default is 3s. Increase for slow industrial networks.
