---
id: fitsm-foundation
title: "FitSM — a lightweight IT service management standard for small teams"
description: "ITIL runs hundreds of pages, ISO/IEC 20000 requires an audit. FitSM sits in between — a free European ITSM standard with 17 general requirements plus 65 process-specific ones, deployable without a dedicated quality team. A summary of FitSM Foundation 3.0.6."
date: "2026-05-29"
tags: ["standards", "ITSM", "FitSM", "ISO20000", "ITIL"]
featured: true
references:
  - title: "FitSM Downloads — official standard page"
    url: "https://www.fitsm.eu/downloads/"
  - title: "FitSM-1 Requirements v3.0.1 (PDF)"
    url: "https://www.fitsm.eu/download/1263/"
  - title: "FitSM-5 Identifying Services v3 (PDF)"
    url: "https://www.fitsm.eu/download/1707/"
  - title: "Creative Commons Attribution 4.0 — FitSM license"
    url: "https://creativecommons.org/licenses/by/4.0/"
---

ITIL runs hundreds of pages. ISO/IEC 20000 is certifiable, but running a formal audit in a 5-person company is a joke. **FitSM sits in between** — a free ITSM standard from the European school (a project funded under the European Commission's FP7), which in version 3.0.1 defines **17 general requirements plus 65 process-specific ones** instead of 200 pages of narrative. The philosophy is explicit in the standard itself: *keep it simple*.

This article is a summary of the FitSM Foundation v3.0.6 training material — enough to pass the certification exam, plus a pragmatic map of "what to actually do when you don't have a dedicated quality team and you have to write and execute every procedure yourself."

## Why bother with a standard at all

The FitSM training material cites a well-known statistic: **80% of IT service outages come from people and processes, not technology**. Which means you can run the best servers, the newest software and expensive monitoring — and still lose more time on uncoordinated incident response than on the actual fix.

IT Service Management (**ITSM**) answers this not technically, but organisationally:

- *Who* is responsible for a given service?
- *How* are incidents reported and who handles them?
- *What* does the customer agreement (SLA) say, and are we measuring it?
- *Where* do we record changes to the infrastructure?

Without answers to these questions, every service project eventually drifts into chaos.

## What FitSM is

FitSM (short for *Federated IT Service Management*) is a family of free documents developed since 2012 inside the European Commission's FP7 project "FedSM". It is licensed under **Creative Commons Attribution 4.0** — you can download, translate, adapt and use it commercially with attribution.

The four FitSM design principles:

| Principle | What it means in practice |
|---|---|
| **Practicality** | Apply simple, proven guidance instead of drowning in theoretical best practices |
| **Consistency** | Repeatable performance before detailed documentation |
| **Sufficiency** | "Good enough and working" beats chasing the perfect solution |
| **Extendibility** | Leverage many sources of knowledge instead of staying in a walled garden |

## What a service is — the FitSM test

The single question that costs most organisations the most wrong answers: **what actually is a service, and what is just a component of one?**

FitSM defines a service tersely: *a way to provide value to a user or customer by bringing about a result they want to achieve*.

Operationally it boils down to a single test (example from FitSM-5 Identifying Services):

> Picture a hotel. Is accommodation a service? Yes. The restaurant? Yes. A conference room? Yes. What about the elevator? The TV in the room? The cutlery? Housekeeping? **No** — these are enabling or enhancing components. Nobody buys an elevator ticket at a hotel.

**Decision rule:** would the customer pay for this on its own, independently of the rest?

Practical consequence: a service catalogue should be short and centred on value to the customer. **Three to five well-described services** beats thirty infrastructure items mistaken for services.

## The FitSM document family

The standard has 7 parts split into the **core** and **implementation aids**:

| Part | Content | Why read it |
|---|---|---|
| **FitSM-0** | Glossary of 80 terms (Service, Incident, Change, SLA, OLA, UA, CI, CMDB, KPI) | To speak the same language as an auditor or enterprise client |
| **FitSM-1** | 17 general + 65 process-specific requirements ("shall") | The checklist — what must exist before you can say *we have ITSM* |
| **FitSM-2** | Process activities and implementation | Step-by-step guidance |
| **FitSM-3** | Role model (who is accountable for what) | Map of who to assign |
| **FitSM-4** | Templates and samples (SLA, policy, service catalogue, procedure) | Pre-built documents to fill in |
| **FitSM-5** | Implementation guides (how to identify and specify services, ISO 20000 alignment) | Methodology |
| **FitSM-6** | Maturity assessment workbook (XLSX) | Diagnosis: "where we stand" |

The whole family is available with no login or subscription.

## 7 General Requirements

These are requirements on the **Service Management System** (SMS), independent of any specific process:

| Code | Name | What it covers |
|---|---|---|
| **GR1 MCA** | Top Management Commitment & Accountability | Someone at the top owns the system, there is a service management policy, management reviews happen |
| **GR2 DOC** | Documentation | Process definitions, document control, versioning |
| **GR3 SCS** | Scope & Stakeholders | Who is the customer, what are their expectations, where the system ends |
| **GR4 PLAN** | Planning | Service management plan (goals, roles, tools, training) |
| **GR5 DO** | Implementing | The plan is executed, processes happen |
| **GR6 CHECK** | Monitoring & Reviewing | KPIs, audits, maturity assessment |
| **GR7 ACT** | Continually Improving | Nonconformities → corrective actions → CSI (PR14) |

GR3-GR7 map exactly onto **PDCA** (Plan-Do-Check-Act, the Deming cycle). The same one you know from ISO 9001 or ISO 14001 — applied to IT services.

## 14 Process-specific Requirements

Processes are grouped into two areas:

### Plan & Deliver — PR1-PR8

| Code | Name | What it covers |
|---|---|---|
| **PR1 SPM** | Service Portfolio Management | Portfolio: all services across their lifecycle (idea / in preparation / live / retired) plus suppliers |
| **PR2 SLM** | Service Level Management | Public service catalogue, SLAs with customers, OLAs/UAs with suppliers, evaluation against targets |
| **PR3 SRM** | Service Reporting Management | Reports: what, to whom, how often, in what format |
| **PR4 SACM** | Service Availability & Continuity | Availability (regular operation) and continuity (operation in exceptional circumstances — BCP/DR) |
| **PR5 CAPM** | Capacity Management | Performance, resource planning (human, technical, financial) |
| **PR6 ISM** | Information Security Management | Confidentiality, integrity and availability of information, security policies, access control |
| **PR7 CRM** | Customer Relationship Management | Identifying customers, communication channels, service reviews, satisfaction, complaints |
| **PR8 SUPPM** | Supplier Relationship Management | Suppliers: contact, evaluation, escalation |

### Operate & Control — PR9-PR14

| Code | Name | What it covers |
|---|---|---|
| **PR9 ISRM** | Incident & Service Request Management | Ticketing: registration, classification, priority, escalation, closure. Plus a separate workflow for service requests (e.g. password reset ≠ incident) |
| **PR10 PM** | Problem Management | Identifying recurring incidents → finding the root cause → known error and workaround → eventual change |
| **PR11 CONFM** | Configuration Management | Tracking Configuration Items (CMDB): what exists, what attributes, how they connect |
| **PR12 CHM** | Change Management | Change control: RFC registration, classification (normal / major / emergency), assessment, approval, post-implementation review, change schedule |
| **PR13 RDM** | Release & Deployment Management | Pushing changes to production as releases: planning, acceptance testing, rollback plan |
| **PR14 CSI** | Continual Service Improvement | Improving services and processes — driven by reports, audits, internal feedback |

## Three agreement types: SLA, OLA, UA

Frequently confused. FitSM separates them cleanly:

| Agreement | Parties | Example |
|---|---|---|
| **SLA** — Service Level Agreement | Service provider ↔ External customer | "We deliver the application with 99% availability during business hours" |
| **OLA** — Operational Level Agreement | Service provider ↔ Internal supporting team | "The DB team commits to resolving critical incidents within 2 hours" |
| **UA** — Underpinning Agreement | Service provider ↔ External subcontractor | "The hosting provider guarantees 99.9% infrastructure availability" |

**Chain logic:** the customer only sees the SLA. To meet it, the provider has to coordinate OLAs with internal teams and UAs with external suppliers. Each layer supports the one above.

## Roles in the service management system

FitSM-3 defines five roles:

| Role | Accountability |
|---|---|
| **SMS Owner** | Overall accountability for the system. Usually someone in top management. Provides mandate and resources |
| **SMS Manager** | Operational effectiveness of the system. Maintains the service management plan |
| **Process Owner** | Accountability for a specific process (e.g. Change Management). Defines process goals, monitors KPIs |
| **Process Manager** | Operational effectiveness of the process. Reports to the Process Owner |
| **Process Staff** | Performs specific process activities (e.g. classifies service desk tickets) |

In a large organisation each role is a different person (sometimes a whole team). In a small team one person fills several roles — this is acceptable as long as it is documented. In a solo shop one person fills all roles, but recognising them as distinct *functions* helps with delegation as you scale.

## Critical distinction: Incident ≠ Service Request

A classic mistake in organisations without ITSM: everything a user reports lands in a single "ticket" queue. FitSM separates them:

| Incident | Service Request |
|---|---|
| Unplanned service disruption | Standard user request |
| Example: "the application won't start" | Example: "password reset", "add a user" |
| Goal: **restore** the service as fast as possible | Goal: **execute** a standard action |
| Can have critical priority | Usually handled in standard mode |

From this split, two more concepts follow: a **major incident** (large-scale incident) requires its own, more intensive handling; a **problem** (PR10) is what we find after analysing many similar incidents — we hunt the root cause instead of putting out the same fire over and over.

## What FitSM is not

| Misconception | The reality |
|---|---|
| FitSM tells you *how* to design architecture | No. FitSM is technology-neutral — it describes *management*, not *implementation* |
| FitSM replaces ITIL | No. FitSM is *compatible* with ITIL and ISO/IEC 20000 but targets organisations for which ITIL is too heavy |
| FitSM is certifiable for organisations | The standard itself — no. *People* can be certified (Foundation, Advanced, Expert). Organisations get certified via ISO/IEC 20000 |
| FitSM is only for IT | The definition of "service" is general enough to fit other domains. IT is the default context in FitSM, not the only one |

## Practical implementation in a small team

The Foundation material closes with **benefits and risks** of an ITSM rollout. The key takeaways:

**Real benefits:**

- Better understanding of your own organisation's structure
- Consistent delivery (the customer knows what to expect)
- Less silo fragmentation (teams actually talk)
- Easier scaling (processes exist when the next hire arrives)

**Real risks when rollout goes badly:**

- Processes turn bureaucratic — more paperwork than action
- People bypass processes they don't understand
- No commitment from top management = no mandate = no result

The guiding rule from the FitSM material itself:

> *Only write documents that someone is going to read.*

The same applies to processes — only roll out the ones that actually protect someone from chaos.

## Certification

FitSM has three certification tiers (exams paid, training material free):

| Level | Coverage |
|---|---|
| **Foundation** | Vocabulary, standard structure, main processes. Exam: 30 minutes, 20 questions, 65% to pass |
| **Advanced SPD** | Service Planning & Delivery specialisation (PR1-PR8) |
| **Advanced SOC** | Service Operation & Control specialisation (PR9-PR14) |
| **Expert and Auditor** | Requires both Advanced levels |

A Foundation certificate costs around 200-300 EUR (depending on the exam centre). The training material itself is free — FitSM doesn't monetise by locking knowledge, only certification.

## Worth remembering

- **A service = what the customer would pay for on its own.** The rest is components or supporting items
- **80% of IT service outages come from people and processes**, not technology
- FitSM = **17 general plus 65 process-specific requirements** across 14 processes
- **The customer only sees the SLA.** To meet it, the provider coordinates OLAs (internal teams) and UAs (external subcontractors)
- **Incident ≠ Service Request.** Incident = "something broke and isn't meeting the agreement". Service request = "please perform a standard action for me"
- A **problem** is the root cause behind recurring incidents — investigated separately, instead of putting out the same fire repeatedly
- In a solo shop one person fills every role. What matters is recognising them as separate *functions* — it makes delegation easier when scaling
- **PDCA** (Plan-Do-Check-Act) is the foundation of continual improvement, just like in ISO 9001
- *Only write documents that someone is going to read* — write only the documents someone will actually read

---

*This article summarises the FitSM Foundation v3.0.6 training material (Creative Commons Attribution 4.0, fitsm.eu).*
