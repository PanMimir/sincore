---
id: rs485-physical
title: "RS-485 — Physical Layer from the Ground Up"
description: "What RS-485 is, what the bus looks like, termination, grounding, USB converters and common wiring mistakes."
date: "2026-05-14"
tags: ["rs485", "hardware"]
featured: false
references:
  - title: "TIA-485-A Standard (Wikipedia)"
    url: "https://en.wikipedia.org/wiki/RS-485"
  - title: "Texas Instruments — RS-485/RS-422 Circuit Implementation Guide"
    url: "https://www.ti.com/lit/an/slla272d/slla272d.pdf"
---

## What is RS-485

RS-485 (also known as EIA-485) is an electrical standard for serial transmission. It does not define a protocol — only what the signal looks like on the wire. Modbus RTU, Flowbus, PROFIBUS and many other industrial protocols all run over RS-485.

Key feature: **differential transmission**. Instead of one signal line referenced to ground, RS-485 uses a pair of wires, A and B. The receiver measures the voltage difference between them. This effectively rejects common-mode interference (from VFDs, motors, etc.).

## Bus topology

RS-485 is a linear bus — devices connected in series, one after another:

```
Master ──┬── Slave 1 ──┬── Slave 2 ──┬── [Terminator 120Ω]
         │             │             │
[Term.]  │             │             │
 120Ω    A/B          A/B           A/B
```

**Do not** create branches (star or tree topology) — signal reflections cause communication errors, especially at higher speeds.

## Termination

There must be a 120 Ω resistor between lines A and B at **both ends** of the bus. Missing termination is the most common cause of unstable communication — everything works on a short cable but falls apart on a longer one or with more devices.

Many devices have a built-in termination switch (jumper or DIP). Enable termination only at devices on the **ends** of the line, not in the middle.

## Bias resistors

When the bus is idle (no one is transmitting), lines A and B can float in an undefined state. Bias resistors force a defined state:

- Line A pulled to +5V through ~560–680 Ω
- Line B pulled to GND through ~560–680 Ω

Usually fitted only on the master or on one device on the bus. Too many bias resistors load down the line.

## Grounding — GND matters

RS-485 is differential, but the receiver needs a common reference potential with the transmitter. Without a common signal ground, the potential difference between device grounds can go outside the receiver's input range (±7V) and damage the circuitry.

In practice: **always run a third wire** as a common signal ground (not to be confused with PE — protective earth).

## USB–RS485 converters

To connect a computer to an RS-485 bus, you need a converter. Popular chips:

| Chip       | Notes                                                       |
| ---------- | ----------------------------------------------------------- |
| CH340      | Cheap, common, works on Windows without drivers (Win 10+)   |
| CP2102     | Stable, good Linux support                                  |
| FT232      | Best timing, more expensive, recommended at high baud rates |
| FTDI FT485 | Dedicated RS-485, automatic direction switching             |

Cheap converters with no chip markings can have problems with automatic TX/RX direction switching — they show up as a chopped first frame or echo.

## Transmission speeds

The standard doesn't mandate specific baud rates. In industrial practice you'll most often see:

- **9600 bps** — default for many Modbus devices
- **19200 bps**
- **38400 bps**
- **115200 bps** — maximum for most cheap USB converters

On long cables (>100 m) stick to lower speeds (9600–19200). General rule: baud rate × cable length [m] ≤ 10^8.

## Pitfalls

1. **A and B swapped** — the standard defines A as "−" and B as "+" in the Mark state (logic 1). Some manufacturers label it the opposite way. If communication doesn't work, swap A↔B.

2. **Common ground** — missing a third wire for common ground is the most common installation oversight.

3. **Branches** — every branch (stub) longer than a few centimeters causes reflections. If you must branch, use an RS-485 repeater/hub.

4. **Too many terminators** — if you enable termination on every device, the total resistance drops too low and loads the driver.
