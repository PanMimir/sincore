---
id: thermocouple-disconnect-detection
title: "Detecting a Disconnected Thermocouple When the Device Won't Tell You"
description: "Not every temperature transmitter flags a disconnected thermocouple. An F&F MB-TC-1 case study: real Modbus register data, three sensor states, and the limit of what software can actually detect."
date: "2026-05-21"
tags: ["temperature", "modbus"]
featured: false
references:
  - title: "F&F Filipowski — MB-TC-1"
    url: "https://www.fif.com.pl/pl/szukaj?q=mb-tc-1"
  - title: "IEC 60584 — thermocouples, types and ranges (Wikipedia)"
    url: "https://en.wikipedia.org/wiki/Thermocouple#Types"
---

## An assumption that turned out wrong

The theory is clear: when a thermocouple disconnects, the temperature transmitter should report it — with an error value (`-32768`, `NaN`) or a bit in the status register. Hence the standard, sensible advice: always check the error flag before recording a measurement.

The catch is that **not every device behaves this way**. While building a configurator for the **F&F MB-TC-1** temperature transmitter, we hit a unit that does not signal a disconnected thermocouple **in any way**. The app, in good faith, showed a steady "21 °C" while nothing was wired to the input.

This article is a study of that case — with real Modbus register data, and an honest line between what software can and cannot detect.

## The device: F&F MB-TC-1

A single-channel thermocouple transmitter (K, J, T, N, S, E, B, R), Modbus RTU over RS-485. The relevant registers:

| Register | Content |
|---|---|
| `0x00` | absolute temperature — hot junction (×10) |
| `0x01` | relative temperature — hot minus cold (×10) |
| `0x02` | cold-junction temperature — inside the device (×10) |
| `0x05` | status — bits 0–3: alarms, bit 4: measurement out of range |

The relationship is simple: `absolute temp = cold-junction temp + thermocouple voltage converted to °C`. When the input is open, the thermocouple voltage vanishes — and only the cold junction is left.

## What MB-TC-1 does with no thermocouple

It reports nothing. With an open input the thermocouple voltage ≈ 0, so the device computes `absolute temp ≈ cold-junction temp` and presents it as a **perfectly valid measurement**. Bit 4 of register `0x05` ("measurement out of range") stays clear — because ~20 °C is within the range of every thermocouple type.

From Modbus's point of view everything is fine. From reality's point of view — we're measuring a sensor that isn't there.

## Diagnostics: three states, not two

To see what actually happens, we dumped the registers across a series of ~30 reads for each sensor state. The states turned out to be **three**, not two:

| State | absolute temp | register `0x05` | character |
|---|---|---|---|
| Thermocouple connected | real measurement | `0x000F` | stable, smooth |
| **Clean disconnect** | stable ~ambient temp | `0x000F` | stable, smooth |
| **Loose / intermittent contact** | several °C of scatter | `0x000F` | chaotic noise |

Status register `0x05` holds the **identical value `0x000F`** in all three cases. We traced every bit — none, documented or not, reacts to a disconnection. There simply is no flag.

Real numbers from two disconnection variants:

```
Disconnected at terminals:  absolute 18.7°C | cold junction 20.8°C | stable
Disconnected at the plug:   absolute 15.0°C | cold junction 20.8°C | stable
Loose contact:              absolute jumps 14.3 ↔ 19.0°C            | noise
```

A side note: the resting point of an open input **depends on where the break is** (the dangling cable acts as an antenna) — so there isn't even a single fixed "disconnected value" to recognize.

## Why a clean disconnect can't be detected

This is the core of it. A clean, complete disconnect produces a reading that is:

- **stable** — indistinguishable from a good measurement by stability alone,
- **plausible** — ~15–19 °C is a perfectly normal temperature,
- **flag-free** — `0x05` does not change.

Worse: a transmitter in a cabinet self-heats, so its cold junction sits a few °C above the room air temperature. A disconnected thermocouple therefore reports a value close to **ambient temperature** — exactly what a thermocouple genuinely measuring the room air would report.

At the Modbus register level, the two cases are **indistinguishable**. No algorithm can separate them, because the device delivers identical data. That's a limit of physics and hardware, not a matter of cleverness in code.

## What CAN be detected: a loose contact

The third state — a loose or intermittent contact — is different. Intermittent contact makes the input alternately "see" the thermocouple and go open. The reading **jumps chaotically** by several °C between consecutive samples, while the cold junction (the internal sensor) stays perfectly stable.

And that is detectable. A real, connected thermocouple — thanks to thermal inertia — changes **smoothly**: even a fast, genuine temperature rise is small steps between samples. A floating, intermittent input **changes in jumps**.

In practice a loose contact is also the most common real-world field failure — vibration works a wire loose in a terminal. So we catch the case that happens most often.

## Instability detection in practice

We take a short series of readings and evaluate two things: the **spread** (max − min) and the **largest jump** between adjacent samples.

```python
import time

def reading_unstable(read_temp, samples=8, interval=0.4,
                     spread_limit=2.0, jump_limit=1.0):
    """Detects a loose thermocouple contact from reading instability.

    read_temp() -> absolute temperature [°C]
    """
    s = []
    for i in range(samples):
        s.append(read_temp())
        if i < samples - 1:
            time.sleep(interval)

    spread = max(s) - min(s)
    max_jump = max(abs(s[i + 1] - s[i]) for i in range(len(s) - 1))

    # Unstable = large spread AND large jumps. Spread alone could come
    # from a fast but SMOOTH change of a real temperature — the jump
    # condition filters that case out.
    return spread > spread_limit and max_jump > jump_limit
```

The condition is deliberately twofold. Spread alone is not enough — a fast-heating object also produces a large spread, but a **smooth** one. Only a large spread **and** a large jump between adjacent samples unambiguously point to a floating input.

The thresholds (2 °C spread, 1 °C jump) come straight from the measurements: the stable state stayed within ~0.1–0.3 °C, a loose contact gave ~4–5 °C. The margin is several-fold in both directions.

## Takeaways

1. **Don't assume "disconnected = error flag".** It depends on the specific device — verify on hardware, not in assumptions.
2. **A clean disconnect sometimes cannot be detected.** If the device substitutes a plausible value and raises no flag, software is powerless. Document that honestly instead of faking detection.
3. **Detect what you can.** A loose contact — the most common real failure — is recognizable from reading instability.
4. **Alternative: a range threshold.** If the process runs far from ambient (e.g. always above 100 °C), then a reading suddenly close to room temperature is itself a fault signal. Application-specific detection, but a reliable one.

Hardware can surprise you. Instead of trusting the theory, dump the registers in different states and see what the device actually does — only real data tells you what can be detected.
