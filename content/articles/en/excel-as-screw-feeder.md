---
id: screw-feeder-pyrolysis-calculator
title: "Excel as a screw feeder, or: how to calculate pyrolyser settings without leaving your desk"
titleSeo: "Pyrolyser settings calculator — Excel to Python"
description: "A day off from code ended in a biomass decomposition model and a settings calculator for 16 fuels. On mass balance and what screw fill ratio really is."
date: "2026-06-09"
tags: ["pyrolysis", "biomass", "process-engineering", "Excel", "calculator"]
featured: true
references:
  - title: "Bergman et al. (2005) — Torrefaction for biomass co-firing, ECN-C-05-013 (PDF)"
    url: "https://publications.tno.nl/ecn-report/report/2005/c05013.pdf"
  - title: "Bates & Ghoniem (2012) — Biomass torrefaction kinetics, Bioresour. Technol. 124"
    url: "https://www.sciencedirect.com/science/article/abs/pii/S0960852412013466"
  - title: "Vardon et al. (2013) — Spent coffee grounds biochar, ACS Sustainable Chem. Eng. 1(10)"
    url: "https://pubs.acs.org/doi/10.1021/sc400145w"
---

The Monday plan was this: I'm taking a day off from code. There's plenty of programming during the week, and there's this installation that needs commissioning. A pyrolyser, a screw, three heating zones, black pellets at the end. A calm, tangible engineering problem. The perfect break from the keyboard.

By the end of the week, the actual bill for this "break" looked like: a thousand lines of Python generating a spreadsheet, fitted exponential models of biomass decomposition kinetics, a dig through the literature, and a simulation of sixteen fuels across seven temperatures and one hundred and one inverter frequencies. Roughly twice the workload of staying on a regular JIRA ticket. The absurdity is the story, but something useful came out along the way — so before I go back to programming, a quick summary of what you **actually** need to think about if you want a pyrolytic reactor to do what you're asking of it.

## 1. Two unknowns in one equation (mass balance does not forgive)

It starts innocently enough. You want two things:

- a decent kilogram or so of biochar per hour coming out of the reactor (the more the better, because test fatigue scales linearly with the time you've spent staring at a control panel),
- the fuel to spend long enough in the heated zone to actually decompose the way you want.

Sounds reasonable. You enter some Hz on the inverter, 5 seconds on / 5 seconds off on the feeder controller. You look at the biochar — it either looks like wood pellet lightly singed with a lighter, or like activated carbon straight from a lab. Somewhere in between. You change the Hz. The biochar changes a bit. You change the off-time. The biochar looks different. How are you supposed to know?

And all of this is because those two parameters — throughput and residence time — **cannot be set independently**. They are tied together by a small detail from technical high school, which nobody remembers is called the _mass balance_:

> **Holdup = throughput × residence time**

In other words: how much mass is sitting in the heated zone at any given moment = how much mass enters per hour times how many minutes it spends there. Geometrically trivial. Operationally it means: if you want longer residence at the same kg/h of biochar, you need **more mass inside at any moment**. If you want a faster throughput, you either shorten the residence or stuff even more mass into the tube.

And here the fun starts. Because "how much mass is in the tube" isn't a knob on the panel. It's a **consequence** of another knob. But we'll get to that.

## 2. Geometry does the heavy lifting (and no, it's not the flights)

![Generic HMI of a pyrolytic process with three heating zones and a screw feeder](/articles/excel-podajnik-hmi.png)

Everyone's first intuition is the same: if the screw has flights, then "fill ratio" surely means how much material sits in the flight pockets. Logical. Wrong.

Material inside a screw conveyor tube does not politely sit only in the flight pockets. It sits in everything that's empty: in the pockets between the flights, in the gap between the spiral and the tube wall, in the space around the central shaft (unless the screw is shaftless, but this one isn't). If the tube has a 1.5 cm gap between the spiral and the wall — which it sometimes does, when your installation is more "a reactor for testing unpredictable feedstocks" than a precision dosing unit — then the material happily moves in there and stays.

That's why we compute "fill" against the **whole annulus** of transport. Annulus = the tube interior MINUS the shaft. If anyone still remembers geometry: the cross-section is π(D² − d²)/4, where **D** is the inner diameter of the tube and **d** the diameter of the shaft the flights sit on. The volume of the heated zone is that area times the length of the insulated section. The whole philosophy.

What it means in practice: if the panel says fill ratio 25%, then one quarter of the annulus (i.e. the entire available space between the tube and the shaft, across the whole heated zone) is filled with fuel. The rest is air, lightly heated pyrolysis gases and a still-debatable amount of water vapour. That 25% is mild underfeed for a typical pyrolyser — you can push it to around 40-45% before the screw starts choking, jamming, and doing things the SOP doesn't mention.

Low fill (say 0.10) = empty screw, fuel runs through faster, shorter heating, less biochar. High fill (0.40) = packed screw, long heating, more biochar, higher torque on the motor. Optimum is usually 0.20–0.30, depending on what's happening **outside** the reactor — namely, how fast the upstream feeder is delivering material.

And here's the disclaimer that makes the first three tests incomparable: **fill ratio is not an equipment property**. It's an **operational state**. It depends on how fast the dosing unit upstream is feeding, how dense and wet the current batch is, whether someone changed the T_on on the pre-feeder "just to try something". Two identical calibration runs — same Hz, same T_on/T_off, same fuel — can give two different fill ratios, because three days ago it rained and the batch is wet. That's not a measurement error, it's the physics of agriculture.

## 3. Y(T): three parameters instead of a full lookup table

Next problem. You need to know how much biochar comes out. After pyrolysis, every kilogram of feedstock leaves behind some fraction — typically called **mass yield Y**. Wood at 300°C — 80% remains. The same wood at 600°C — 22% remains. Straw reacts differently from wood. RDF reacts completely differently from RDF out of a different bin.

First temptation: a table. For each fuel, write out Y for T=300, 350, 400, ..., 650°C. Eight values per material. With fifteen materials, that's 120 numbers typed in by hand. From the literature where it exists, from the ceiling where it doesn't. Each one needing individual sanity-checking, each one needing individual re-typing when somebody changes the temperature from 450 to 425 and an innocent question pops up: "what about now?". Pure absurdity, the classic engineering trap of "let's do this temporarily."

A better solution comes from thermal decomposition chemistry — the Y(T) curve has the shape of exponential decay to an asymptote. It's not magic, just the direct consequence of hemicellulose decomposing first (200-280°C), cellulose going next (280-380°C), and lignin holding out till the end, with part of it ending up as char. Three regimes in one curve, but if you don't want to write a paper on two-step kinetics (and today you don't), this is enough:

> **Y(T) = Y∞ + A · exp(−k · (T − 300))**

Three parameters per fuel — and since the symbols don't speak for themselves:

| Symbol   | What it is                                                                         | Unit |
| -------- | ---------------------------------------------------------------------------------- | ---- |
| **Y(T)** | mass yield at temperature T: what fraction of the feed comes out as biochar        | %    |
| **T**    | temperature in the heated zone                                                     | °C   |
| **Y∞**   | the asymptote — how much char always remains, however long you heat it             | %    |
| **A**    | how much mass is "available to decompose" above the asymptote                      | %    |
| **k**    | how fast the yield falls with temperature                                          | 1/°C |
| **300**  | not a physical constant, just where the curve is anchored: the bottom of the range | °C   |

Everything fitted to measurements from the literature (where they exist) or to your own (where they don't). The curve appears in the spreadsheet in thirty seconds.

The operational benefit: you swap material from wood to roasted coffee (yes, coffee, we'll get to that) — three numbers refresh, the curve rescales, the settings calculator automatically picks new Hz and T_on/T_off. Instead of eight lookups per material you have three constants. And, more importantly: for **any** T (433°C? 521°C?) you get Y with no manual interpolation.

By the way: if anyone still prefers a lookup table, it's a few clicks to put one in. But why would you.

## 4. Calibration is a per-run thing

Out of everything described so far, one consequence drops out that operators receive with mild discomfort: **fill ratio has to be measured anew for every run**. That's not a metaphor.

Calibration is simple — you run the screw for thirty minutes at known settings, weigh what came out, and the calculator returns the fill ratio from the mass balance. First run: 0.255. Second run with **exactly the same settings**: 0.13. Nothing changed about the settings, but the upstream hopper emptied halfway between the two runs, and the residue clumped together overnight. The material moved through the feeder differently. Different fill. Different operational state.

The brutal and unpopular conclusion in environments that like procedures: **the screw's fill ratio is not a property of the equipment, it's a property of the run**. It needs to be measured for every batch, every weather change, every "let's try with wet biomass". You can live with that or not live with that, but ignoring it won't make it disappear.

Good news: calibration takes three minutes of calculator work and thirty minutes of reactor time. Less than most things R&D asks for.

## 5. Mode A vs Mode B (two schools of looking at the duty cycle)

The first operator asks: "how long should the duty cycle be?". And here it turns out there are two schools of answers, giving the same **average throughput** but a different character of operation.

**Mode A — you set the cycle length, you get work and pause.** You tell the spreadsheet "the cycle is ten seconds". It splits this into work (e.g. 2.6 s) and pause (7.4 s) according to the calculated duty cycle. The cycle is **fixed**. A short pulse and a long silence, in a steady rhythm. Predictable, easy to program on a controller.

**Mode B — you set the minimum number of screw revolutions per pulse, you get the cycle.** You tell the spreadsheet "I want the screw to make at least one full revolution per pulse". It computes how many seconds the motor needs to run for that to happen, and derives the pause from the duty cycle. **The cycle is different for every Hz** — at 4 Hz the cycle is 53 seconds, at 25 Hz it's 9 seconds. Repeatability of portions is concrete.

Which to pick? In Mode A you control the rhythm, in Mode B you control the portions. Mode A is good for steady operation — you have a fuel of predictable density and you know what cycle you want. Mode B is good for low-Hz work, where individual revolutions make a difference and you don't want a pulse going by without grabbing any material.

## So that's that

The whole story reads like it came straight out of a process engineering textbook. In practice, it came from someone asking "so what are good settings?" on a Wednesday at eleven sharp, and nobody having a ready answer.

Yes, this could have been a single email to the feeder manufacturer. But try getting a reply this week. Yes, you could have grabbed a table from Bergman 2005 and read interpolations with a ruler. But it's somehow hard to tell the process engineer that "yes, we have data for beech, we have data for spruce, but if you want to throw in coffee you'll have to wait until the next decade."

After this little break I'm heading back to programming — with a slight regret about Bates's two-step kinetics, which I promised myself I'd implement "when there's time". Time, as we know, will never be there. But the spreadsheet stands, it works, you can open it in Google Sheets or Excel, and if somebody ever has a screw, a tube, a shaft and a piece of biomass they can't quite figure out — it might save them a week of staring at a monitor.

Or two, if they also want to throw in coffee.

---

_Part two: [Pyrolyser calculator V2](/en/knowledge/pyrolyser-calculator-v2-validation) — six weeks later the spreadsheet collided with sixteen days of commissioning trials. The fill ratio I described above as "usually 0.20–0.30" turned out to be 0.49._
