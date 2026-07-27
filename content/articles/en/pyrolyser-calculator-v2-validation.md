---
id: screw-feeder-calculator-validation
title: "Pyrolyser calculator V2, or: what happens when a model meets sixteen days of commissioning trials"
description: "In June I shipped a spreadsheet that calculates pyrolyser settings. Then the plant ran for six weeks without me and came back with a log from 16 days of trials. The collision was instructive: the structure of the model held, one coefficient was off by a factor of two, and the OK ✓ gate turned out to be mathematically incapable of ever going green."
date: "2026-07-27"
tags: ["pyrolysis", "biomass", "process-engineering", "validation", "calculator"]
featured: true
references:
  - title: "Bergman et al. (2005) — Torrefaction for biomass co-firing, ECN-C-05-013 (PDF)"
    url: "https://publications.tno.nl/ecn-report/report/2005/c05013.pdf"
  - title: "Bates & Ghoniem (2012) — Biomass torrefaction kinetics, Bioresour. Technol. 124"
    url: "https://www.sciencedirect.com/science/article/abs/pii/S0960852412013466"
---

Last time I finished on the note that the spreadsheet exists, it works, and it might save somebody a week. I wrote that with the confidence of a man who had just fitted sixteen curves and verified exactly none of them against a machine.

Then the plant carried on without me. Six weeks, sixteen days of trials, three fuels — from wood pellet through coffee waste to RDF. What came back to me was several hundred rows of operator log: timestamps, tray weights, inverter settings, and comments along the lines of "nothing coming out, nothing happening". Which is precisely the thing the model had never laid eyes on.

So I sat down and put one against the other. Here is what came out, including the parts I would rather not be writing.

## 1. The good news: the structure of the equation survived

The flow model has a form you can derive on a napkin:

> **ṁ = ρ · ψ · A · S · n · DC**

Density times fill ratio times annulus area times flight pitch times revolutions times duty cycle. Nothing sophisticated. The question was whether that napkin describes **this** machine.

The way to check is brutally simple. For every trial I know how many kilograms went in and how many hours the feeding lasted — so I know the real ṁ. I also know the Hz and the duty cycle. Invert the formula and ask: what would ψ have to be for the model to agree? Do that fifteen times and look at the resulting column.

And that column is flat. ψ = 0.39–0.57, mean 0.49, spread ±18% — **even though the Hz varied from 4 to 6 and the duty cycle from 50% to 100%**.

That is the whole result, and it is worth pausing on, because it is easy to dismiss as boring. If the dependence of flow on revolutions were wrongly posed — if the screw failed to fill at higher speeds — ψ would drift systematically with Hz. If duty cycle worked in any way other than linearly, ψ would drift along that column instead. It drifts in neither direction. What is wrong is **one coefficient**, not the shape of the equation.

Residence time, `t_res = L / (S · n · DC)`, checked out independently. The marker was the moment an operator wrote down "first pellet audible". Four such points, error from −23% to +10%, and the model correctly distinguishes cases that differ by a factor of two (24.7 vs 49.5 min). It systematically underestimates by about 9%, which is healthy — the material's path to the drum is slightly longer than the insulated 1550 mm section alone.

That test is worth more than it looks, because `t_res` **depends on neither density nor ψ**. It is pure kinematics. So it confirms the gear ratio, the flight pitch and the drive completely independently of whatever is about to be revealed about the fill ratio.

## 2. The bad news: ψ was off by a factor of two

The spreadsheet shipped with a default fill ratio of 0.25. In the previous article I even wrote, believing it sincerely, that "you can pack in around 40–45% before the screw starts choking" and that "0.20–0.30 is usually optimal".

The machine spent six weeks running at about 0.49 and did not choke once.

The practical consequence was that the model **underestimated throughput by 36–56% on every single trial**. Not randomly — consistently, in the same direction, by roughly the same factor. Enter ψ = 0.50 and the mean absolute error drops to 9.7%; split it per fuel and it falls below 10% on all fifteen trials.

There is a subtlety here that has to be said out loud, or this calibration will be misused: **the trials can only ever identify the product ρ·ψ, never ψ on its own.** Bulk density and fill ratio enter the formula as a product, and nothing separates them short of weighing the bulk density of the batch actually used — which nobody did during these trials. So if the density in the database is off (and for "coffee" it almost certainly is, because the database holds roasted coffee beans while the tests look like coffee waste), the entire error lands in ψ. The model does not care, since it computes the product anyway. Anyone who takes that 0.50 and treats it as a geometric property very much should.

And then there is a hypothesis the data cannot settle. I compute the annulus area from the inner diameter of the tube — 117 mm. The equipment table, however, lists "outer diameter of the spiral, 90 mm", labelled as informational. The 90/40 annulus is **1.86× smaller** than the one I am using. Recomputed against the flight area, ψ comes out at 0.79–1.06 — the flights are running essentially full, which for a screw force-fed from a tube governed by a level fork is entirely plausible.

So either a Ø90 screw is turning inside a Ø117 tube and those 13.5 mm of radial clearance are dead space, or the numbers in the equipment table do not describe the same tube. That is settled by a caliper, not a spreadsheet. The new version has a switch for it and a sentence in capital letters.

## 3. The gate that could not go green

This is where it gets unpleasant.

The instruction in the spreadsheet, at STEP 3, read: *"pick the row with OK = ✓"*. The table has one hundred and one rows, from 0 to 50 Hz, and the "OK?" column was supposed to indicate which settings make sense. I checked how many rows show ✓ under the settings the file was saved with.

Zero.

Not "few". Zero. Eighty-six rows of "heating too long", ten of "Hz too high", four out of range. The instruction was impossible to follow from the moment you opened the file.

The reason is algebraic and needs one qualification, without which it sounds like nonsense.

Intuition says — quite correctly — that more hertz means a faster-turning screw, so the material spends less time in the tube. And that is exactly what happens, **as long as the duty cycle stays put**. The "Calculator" tab, where you type in Hz and T_on/T_off by hand, shows it directly: 4 Hz in continuous operation gives 23.7 minutes, 8 Hz gives 11.8. Double the speed, half the time. No magic.

The Solver table, however, operates under an extra condition that is easy to miss: **the feed rate in kg/h is fixed up front**, because it follows from how much biochar you want at the outlet. Duty cycle is not entered there — it is back-calculated so that the given Hz delivers exactly that feed rate:

```
DC = feed / (ρ · ψ · A · S · n · 60)
```

And the check column computes heating time:

```
t = L / (S · n · DC)
```

Substitute one into the other. **The revolutions cancel:**

```
t = ρ · ψ · V_zone / feed · 60
```

And that is the trap: **at a fixed feed rate**, residence time stops depending on frequency. Raising the Hz genuinely does speed the screw up — but in the same breath the sheet shortens the duty cycle proportionally to keep throughput on target, and the two cancel exactly. A faster screw running correspondingly briefer moves material at precisely the same speed. All one hundred and one rows of the table hold the same number: 4 Hz and 50 Hz alike give 43.56 minutes.

It is worth filing those two facts in this order, because confusing them costs hours at the control panel: **Hz on its own does change residence time. Hz at a held throughput does not.**

So the gate was not "insensitive" or "badly scaled". It was binary across the entire table at once: either all eighty-eight rows are green, or none are. Under the default settings it came out "none".

This is not a physics error — the physics is right. It is an **over-parameterised interface**. Fill ratio, target heating time and target production determine `t_res` uniquely, and the sheet politely allowed all three to be entered independently and then acted surprised at the contradiction. Worse, it was telling itself: right next to it sat a cell reading "required fill ratio", displaying the discrepancy. Quietly, off to the side, instead of blocking.

The moral does not package nicely: **the spreadsheet passed a review of its formulas and failed a review of what the user sees on opening the file.** I checked whether each formula computes what it is meant to compute. I did not check whether the composition of those formulas can ever return the answer "yes".

## 4. RDF, or where the model simply lies

I describe mass yield `Y(T)` with a three-parameter curve — asymptote, range, decay rate. For coffee it did surprisingly well: the model gave 22.5% at 600 °C against 23.7–27.8% measured. It is off by 1–5 percentage points and errs **on the safe side**, promising less product than actually comes out. For pellet it underestimates by 6–10 pp, but for a clear reason: it is fed the heater temperature, while the material is considerably colder. Heaters at 300 °C means a material thermocouple at 215 °C — torrefaction proper — and the log confirms it outright with "from char to torrefied, from black to brown".

For RDF the model lies.

The database parameters produced a nearly flat curve: 50.6% at 500 °C and 50.1% at 550 °C. Reality: 45–46% at 500 °C, which is fine, and **26–36% at 550 °C**. On the closed balance from 15 July — the entire yield weighed out of the drums, not a tray sample — it came to 26.4% against a modelled 50.1%. Nearly twenty-four percentage points of miss.

I refitted those parameters against the four trials, and here I have to say something that ruins a tidy ending: **a single-exponential curve is incapable of describing this.** The drop from 45.7% to 30.6% across fifty degrees is so steep that any fit passing exactly through both points yields something on the order of four hundred percent at 300 °C. Which is, to put it gently, unphysical.

The best compromise I could extract while keeping the curve sane across the full range has an error of −6.4 pp at 500 °C and +3.0 pp at 550 °C. Still three times better than +23.7 pp, but it is a patch, not a solution. The solution is the two-step kinetics I promised myself in the previous article and still have not written. At least this time I know what it is for.

The RDF row now carries a note about the ±6 pp error and about everything above 600 °C being extrapolation. Because the second thing these trials demonstrated is that RDF from one waste stream really is not RDF from another.

## 5. What the model still does not know

Three things I would rather flag than pretend away.

**Residence time affects yield, and the model cannot see it.** Five coffee trials at an identical 600 °C, differing only in time in the zone: 49.5 min → 24.8%, then 32.1 min → 23.7%, down to 16.5 min → 27.8%. Below roughly twenty-five minutes the yield starts climbing, because the material simply does not have time to react. The effect is on the order of 3–4 pp, so it is not critical — but shorten the time below a quarter of an hour and the model stops being trustworthy, which is now written in the footer.

**Shutdown time it cannot compute at all.** From "stop feeding" to an empty drum took 86–121 minutes against a modelled 25–50. The discrepancy is systematic and comes from the cooler, the discharge pipe and the drum sitting downstream of the heated zone, none of which the model knows about. Do not use it to plan the end of a shift.

**What is validated is 4–6 Hz, and the table runs to 50.** Three fuels out of sixteen in the database. The remaining thirteen rows are still pure literature, without a single measured point. Mode B — cycle derived from a revolution count — was never used once.

That last one drove the only change in the spreadsheet that will genuinely annoy somebody: rows above 10 Hz are now flagged "outside validation". Eighty warning rows out of one hundred and one. It looks awful, and that is the intent — it is an honest picture of how much of that table is actually known.

## What made it into version two

Briefly, for the record: fill ratio calibrated per fuel (pellet 0.40, coffee 0.50, RDF 0.44) and written into the fuel database as its own column; motor speed corrected from rated to synchronous, because at this load there is effectively no slip; the "OK ✓" gate rebuilt to answer the question the Hz table **can** answer — at which frequency do I land on a sensible duty cycle — with heating time shown as a single number above the table, annotated that at a held feed rate hertz will not move it; the false-alarm threshold in calibration pushed from 0.45 to 0.75, because in the old version ten of fifteen real trials would have tripped a warning; and a switch for the cross-section area between tube bore and spiral envelope, waiting on a caliper.

And the defaults the file opens with are no longer an invented beech run at one kilogram an hour, but a reconstructed coffee trial from June. You open it and you are looking at settings known to have worked.

## So then

What stayed with me out of all this is not that ψ was off by a factor of two. A coefficient is a coefficient; that is what calibration is for, and the sheet had a dedicated tab for it.

What stayed with me is the gate that could not light up. Because there was no error in any formula — each one computed exactly what it was supposed to. The error was that composing two correct formulas produced an identity, and the interface asked the user for three numbers when two were sufficient. No amount of reviewing formulas catches that. What catches it is one question I never asked myself: *with the settings this file will reach somebody in, is the instruction I wrote even executable?*

Sixteen days of somebody else's patience at a control panel to find that out. Worth it — but next time I would rather it took five minutes before sending the file.

*Part one: [Excel as a screw feeder](/en/knowledge/excel-as-screw-feeder) — where this spreadsheet came from, and why screw fill ratio is not a property of the equipment.*
