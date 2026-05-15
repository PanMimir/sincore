---
id: modbus-rtu
title: "Modbus RTU — RS-485 and Differences from TCP"
description: "How Modbus RTU works over RS-485, frame structure with CRC, device addressing and common timing issues."
date: "2026-05-14"
tags: ["modbus", "rs485"]
featured: true
references:
  - title: "Modbus over Serial Line Specification v1.02"
    url: "https://modbus.org/docs/Modbus_over_serial_line_V1_02.pdf"
  - title: "pymodbus — ModbusSerialClient"
    url: "https://pymodbus.readthedocs.io/en/latest/source/client.html"
---

## Modbus RTU vs TCP — what's what

Modbus TCP is Modbus wrapped in Ethernet and TCP/IP. Modbus RTU is the original version — serial communication over RS-485 or RS-232, bytes transmitted in binary with no network header.

In industrial practice, RTU still dominates field devices — sensors, transducers, meters, I/O modules. TCP shows up mainly where Ethernet is already present: controllers, HMI panels, SCADA systems.

## RTU frame structure

Unlike TCP, the RTU frame has no MBAP header. Frame start and end are identified by **silence on the line** (minimum 3.5 character times).

```
[Address: 1B] [Function Code: 1B] [Data: N bytes] [CRC: 2B]
```

- **Address** — slave address (1–247). Address 0 is broadcast (no response).
- **CRC** — CRC-16/IBM, calculated from Address through the last Data byte. Transmitted **little-endian** (LSB first).

### Frame example — read 2 registers from address 0, slave 1

Request:
```
01 03 00 00 00 02 C4 0B
│  │  │     │     └─ CRC (little-endian: C4, 0B)
│  │  └─────┴── start address 0x0000, count 0x0002
│  └── FC 03 = Read Holding Registers
└── slave address = 1
```

Response (2 registers = 4 bytes of data):
```
01 03 04 01 F4 00 00 F3 B0
│  │  │  └──────────┘  └─ CRC
│  │  └── Byte Count = 4
│  └── FC 03
└── slave address = 1
```

## RS-485 — physical layer basics

RS-485 is a differential standard: two lines, A and B. Logic state "1" when A > B by at least 200 mV, "0" when B > A.

Key characteristics:
- Half-duplex — cannot transmit and receive at the same time
- Up to 32 devices on one bus (more with repeaters)
- Maximum 1200 m at 100 kbps (shorter at higher speeds)
- Requires 120 Ω termination at **both ends** of the bus

## First connection in Python

```python
from pymodbus.client import ModbusSerialClient

client = ModbusSerialClient(
    port="COM8",          # or "/dev/ttyUSB0" on Linux
    baudrate=9600,
    bytesize=8,
    parity="N",           # None — most common
    stopbits=1,
    timeout=1
)

client.connect()

result = client.read_holding_registers(address=0, count=10, slave=1)

if not result.isError():
    print(result.registers)

client.close()
```

Parameters (baudrate, parity, stopbits) must be identical on both sides. Check the device documentation — some manufacturers use Even parity or 2 stop bits.

## Pitfalls

1. **Missing termination** — the most common problem. Without 120 Ω at the bus ends, signal reflections appear and communication works unstably or only on short cables.

2. **Transmit direction** — USB-to-RS485 converters require switching direction (RTS). Cheap converters do this automatically with a delay — if a frame gets cut off, try `rtscts=True` or a different converter.

3. **Address 0** — broadcast, the slave doesn't respond. If you get a timeout at address 0, check whether you're sending a broadcast instead of a read.

4. **Inter-byte gap** — RTU requires silence between bytes no longer than 1.5 character times. Slow PCs can struggle to maintain timing at high baud rates.
