---
id: serial-troubleshooting
title: "Real-world problems — RS-485 / COM serial communication"
description: "A collection of real problems I've hit while doing serial communication in industrial environments — what happens, why, and how to fix it."
date: "2026-05-14"
tags: ["rs485", "troubleshooting"]
featured: false
references:
  - title: "pymodbus — documentation"
    url: "https://pymodbus.readthedocs.io/en/latest/"
  - title: "pyserial — documentation"
    url: "https://pyserial.readthedocs.io/en/latest/"
---

## About this article

These are problems I actually ran into while working with industrial devices over RS-485 and COM ports. No theory — concrete situations, symptoms and fixes.

---

## COM port disappears after a reboot

**Symptom:** The USB-RS485 converter was on COM8; after a reboot Windows reassigned it to COM12.

**Cause:** Windows assigns COM numbers dynamically. With each connection to a different USB port, or after certain updates, the number can change.

**Fix:**
1. Device Manager → Ports (COM and LPT) → right-click the device → Properties → Port Settings → Advanced
2. Change "COM Port Number" to a fixed value (e.g. COM8) and tick "Use this COM port even if it's in use"
3. Alternatively: don't hardcode the port number in code — give the user a list of available ports to choose from

---

## Device doesn't respond — but it's definitely connected

**Symptom:** Port opens, request goes out, timeout — no response.

**Order of checks:**

1. **Baud rate** — check the device documentation. The default 9600 is not a rule. Try 19200, 38400, 115200.

2. **Parity and stop bits** — some devices use `8E1` (8 data bits, Even parity, 1 stop bit) or `8N2`. Wrong setting = no response.

3. **Slave address** — check the sticker or documentation. If unknown, scan (1–32 is a typical range).

4. **Termination** — a missing 120 Ω terminator often shows up as no response on a longer cable but works on a short one.

5. **A/B swapped** — swap the A and B wires.

6. **Converter without auto-DE** — some USB-RS485 converters require manual control of the DE (Driver Enable) pin via RTS. In Python: `rtscts=True` or `dsrdtr=True`.

---

## Response is cut off — only part of the frame arrives

**Symptom:** Modbus returns a CRC error or too few bytes.

**Causes and fixes:**

**Too short a read timeout:**
```python
# Too little — slow devices may not finish in time
client = ModbusSerialClient(port="COM8", baudrate=9600, timeout=0.5)

# Safer
client = ModbusSerialClient(port="COM8", baudrate=9600, timeout=2)
```

**Garbage at the start of the buffer (converter echo):**
```python
# Clear the buffer before sending the request
serial_port.reset_input_buffer()
serial_port.reset_output_buffer()
```

**Frame fragmentation on Windows:** Windows groups bytes in the buffer, which can cause `read()` to return only part of the frame. Fix: read in a loop until the expected number of bytes is collected, or implement an inter-byte timeout.

---

## Works on one machine, doesn't work on another

**Symptom:** Same code, same device — works on one PC, fails on another.

**Causes:**

1. **Converter drivers** — CH340 requires a driver on older Windows 10. Check Device Manager for a yellow exclamation mark.

2. **Different library version** — pymodbus 2.x and 3.x have different APIs. `pip show pymodbus` on both machines.

3. **Antivirus blocks the port** — some AV software (especially corporate) can block access to COM ports. Check AV logs or disable temporarily.

4. **Permissions** — on Linux: `sudo usermod -a -G dialout $USER` — without this a normal user can't access `/dev/ttyUSB*`.

---

## Communication works, but the values are wrong

**Symptom:** Connection is fine, registers read, but values make no sense (e.g. temperature -32768°C or flow 99999).

**Causes:**

1. **Float endianness** — a 32-bit float assembled from two Modbus registers can be in various orders:
   - Big-endian: register 0 = MSW, register 1 = LSW
   - Little-endian: register 0 = LSW, register 1 = MSW
   - Byte-swap: bytes within each register swapped

   ```python
   import struct
   r = result.registers
   # Try all combinations if the value is nonsensical:
   struct.unpack(">f", struct.pack(">HH", r[0], r[1]))[0]  # BE
   struct.unpack(">f", struct.pack(">HH", r[1], r[0]))[0]  # LE words
   ```

2. **Address offset** — the documentation lists address `40001`, but in FC03 you have to pass `0`. Always subtract 40001 (or 30001 for Input Registers).

3. **Scaling** — a value of `1234` may mean `12.34` (× 100) or `123.4` (× 10). Check the register documentation.

---

## Port held by another process

**Symptom:** `Serial Exception: [Errno 16] Device or resource busy` (Linux) or `Access is denied` (Windows).

**Windows — find which process took the port:**

Windows has no built-in way to show which process holds a COM port. Quickest fix — `handle.exe` from [Sysinternals](https://learn.microsoft.com/sysinternals/downloads/handle):

```powershell
# Device number = COM number minus 1
handle.exe \Device\Serial0    # COM1
handle.exe \Device\Serial7    # COM8

# Or all serial devices at once:
handle.exe -a Serial
```

The usual suspects: Modbus Poll, other Python instances, LOGO! Soft Comfort, printer drivers with a built-in COM port.

**Linux:**
```bash
fuser /dev/ttyUSB0    # shows the PID
lsof /dev/ttyUSB0     # more detail
```
