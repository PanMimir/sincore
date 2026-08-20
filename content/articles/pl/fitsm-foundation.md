---
id: fitsm-foundation
title: "FitSM — lekki standard zarządzania usługami IT dla małych zespołów"
titleSeo: "FitSM — lekki standard zarządzania usługami IT"
description: "ITIL ma kilkaset stron, ISO/IEC 20000 wymaga audytu. FitSM jest pomiędzy: darmowy standard ITSM, 17 wymagań ogólnych i 65 procesowych. Streszczenie."
date: "2026-05-29"
tags: ["standardy", "ITSM", "FitSM", "ISO20000", "ITIL"]
featured: true
references:
  - title: "FitSM Downloads — strona główna standardu"
    url: "https://www.fitsm.eu/downloads/"
  - title: "FitSM-1 Requirements v3.0.1 (PDF)"
    url: "https://www.fitsm.eu/download/1263/"
  - title: "FitSM-5 Identifying Services v3 (PDF)"
    url: "https://www.fitsm.eu/download/1707/"
  - title: "Creative Commons Attribution 4.0 — licencja FitSM"
    url: "https://creativecommons.org/licenses/by/4.0/"
---

ITIL ma kilkaset stron. ISO/IEC 20000 jest certyfikowalny, ale uruchomienie audytu w firmie 5-osobowej to żart. **FitSM jest pomiędzy** — darmowy standard ITSM ze szkoły europejskiej (projekt FP7 Komisji Europejskiej), w wersji 3.0.1 ma **17 wymagań ogólnych plus 65 procesowych** zamiast 200 stron narracji. Filozofia zapisana wprost w standardzie: _Keep it simple_ — zachowaj prostotę.

Ten artykuł to streszczenie szkolenia FitSM Foundation v3.0.6 — tyle, ile potrzeba do egzaminu certyfikacyjnego, plus pragmatyczna mapa „co robić, jeśli nie masz dedykowanego zespołu jakości i każdą procedurę musisz sam napisać i sam wykonać".

## Dlaczego w ogóle myśleć o standardzie

Materiał szkoleniowy FitSM cytuje znaną statystykę: **80% przyczyn awarii usług IT leży po stronie ludzi i procesów, nie technologii**. To znaczy: można mieć najlepsze serwery, najnowszy software, drogie monitorowanie — i tracić więcej czasu na nieskoordynowane reakcje na incydenty niż na samo ich rozwiązywanie.

Zarządzanie usługami IT (IT Service Management, **ITSM**) odpowiada na to pytanie nie technicznie, tylko organizacyjnie:

- _Kto_ jest odpowiedzialny za daną usługę?
- _Jak_ zgłaszamy incydenty i kto je obsługuje?
- _Co_ mówi umowa z klientem (SLA) i czy to mierzymy?
- _Gdzie_ zapisujemy zmiany w infrastrukturze?

Bez odpowiedzi na te pytania każdy projekt usługowy prędzej czy później wpada w chaos.

## Co to FitSM

FitSM (skrót od _Federated IT Service Management_) to rodzina darmowych dokumentów rozwijana od 2012 roku w ramach projektu Komisji Europejskiej FP7 „FedSM". Jest licencjonowany na **Creative Commons Attribution 4.0** — można pobrać, tłumaczyć, adaptować i używać komercyjnie z atrybucją źródła.

Cztery zasady projektowe FitSM:

| Zasada                             | Co oznacza w praktyce                                                        |
| ---------------------------------- | ---------------------------------------------------------------------------- |
| **Practicality** (praktyczność)    | Prosta, sprawdzona wskazówka, zamiast teoretycznych „najlepszych praktyk"    |
| **Consistency** (spójność)         | Powtarzalne wykonywanie, zanim spiszesz długą dokumentację                   |
| **Sufficiency** (wystarczalność)   | „Wystarczająco dobrze i działa" zamiast szukania doskonałości                |
| **Extendibility** (rozszerzalność) | Korzystanie z różnych źródeł wiedzy, a nie zamykanie się w jednym frameworku |

## Czym jest usługa — test FitSM

Podstawowe pytanie, które kosztuje najwięcej organizacji błędnych odpowiedzi: **co właściwie jest usługą, a co tylko jej elementem składowym?**

FitSM definiuje usługę krótko: _sposób dostarczania wartości użytkownikowi lub klientowi przez osiągnięcie wyniku, na którym mu zależy_.

Operacyjnie sprowadza się to do jednego testu (przykład z FitSM-5 Identifying Services):

> Wyobraź sobie hotel. Czy jest usługą zakwaterowanie? Tak. Restauracja? Tak. Sala konferencyjna? Tak. A winda? Telewizor w pokoju? Sztućce? Sprzątanie? **Nie** — są to elementy umożliwiające (enabling) lub wzbogacające (enhancing) usługi, ale nikt nie kupi w hotelu samej windy.

**Kryterium decyzyjne:** czy klient kupiłby to osobno, niezależnie od reszty?

Konsekwencja praktyczna: katalog usług powinien być krótki i skoncentrowany na wartości dla klienta. **3-5 dobrze opisanych usług** jest lepsze niż 30 elementów infrastrukturalnych pomylonych z usługami.

## Rodzina dokumentów FitSM

Standard składa się z 7 części, podzielonych na **rdzeń** i **pomoce wdrożeniowe**:

| Część       | Treść                                                                         | Po co to czytać                                                |
| ----------- | ----------------------------------------------------------------------------- | -------------------------------------------------------------- |
| **FitSM-0** | Słownik 80 pojęć (Service, Incident, Change, SLA, OLA, UA, CI, CMDB, KPI)     | Żeby gadać tym samym językiem co audytor lub klient enterprise |
| **FitSM-1** | 17 wymagań ogólnych + 65 procesowych                                          | Lista kontrolna — co musi być, by mówić _mamy ITSM_            |
| **FitSM-2** | Działania i wdrożenie wymagań                                                 | Instrukcja krok po kroku                                       |
| **FitSM-3** | Model ról (kto za co odpowiada)                                               | Mapa, kogo wyznaczyć                                           |
| **FitSM-4** | Szablony i przykłady (SLA, polityka, katalog usług, procedura)                | Gotowce do wypełnienia                                         |
| **FitSM-5** | Przewodniki wdrożeniowe (jak rozpoznać i opisać usługę, zgodność z ISO 20000) | Metodyka                                                       |
| **FitSM-6** | Arkusz oceny dojrzałości (XLSX)                                               | Diagnoza „gdzie jesteśmy"                                      |

Cała rodzina jest dostępna bez logowania i bez subskrypcji.

## 7 wymagań ogólnych (General Requirements)

To są wymagania na **system zarządzania usługami** (SMS — _Service Management System_), niezależne od konkretnych procesów:

| Kod           | Nazwa                   | O czym                                                                             |
| ------------- | ----------------------- | ---------------------------------------------------------------------------------- |
| **GR1 MCA**   | Zaangażowanie zarządu   | Ktoś z góry jest właścicielem systemu, jest polityka usług, są przeglądy zarządcze |
| **GR2 DOC**   | Dokumentacja            | Definicje procesów, kontrola dokumentów, wersjonowanie                             |
| **GR3 SCS**   | Zakres i interesariusze | Kto jest klientem, jakie ma oczekiwania, gdzie kończy się system                   |
| **GR4 PLAN**  | Planowanie              | Plan zarządzania usługami (cele, role, narzędzia, szkolenia)                       |
| **GR5 DO**    | Wdrożenie               | Plan jest wykonywany, procesy się dzieją                                           |
| **GR6 CHECK** | Monitorowanie           | KPI, audyty, ocena dojrzałości                                                     |
| **GR7 ACT**   | Doskonalenie            | Niezgodności → działania korygujące → CSI (PR14)                                   |

GR3-GR7 to klasyczne **PDCA** (Plan-Do-Check-Act Deminga). To samo, co znamy z ISO 9001 czy ISO 14001 — tyle że stosowane do usług IT.

## 14 procesów (Process-specific Requirements)

Procesy są pogrupowane w dwa obszary:

### Planowanie i dostarczanie (Plan and Deliver) — PR1-PR8

| Kod           | Nazwa                               | O czym                                                                                                 |
| ------------- | ----------------------------------- | ------------------------------------------------------------------------------------------------------ |
| **PR1 SPM**   | Service Portfolio Management        | Portfolio: wszystkie usługi w cyklu życia (idea / w przygotowaniu / produkcyjna / wycofana) i dostawcy |
| **PR2 SLM**   | Service Level Management            | Publiczny katalog usług, umowy SLA z klientami, OLA/UA z dostawcami, ocena spełnienia celów            |
| **PR3 SRM**   | Service Reporting Management        | Raporty: co, dla kogo, jak często, w jakim formacie                                                    |
| **PR4 SACM**  | Service Availability and Continuity | Dostępność (regularne działanie) oraz ciągłość (działanie w sytuacjach wyjątkowych — BCP/DR)           |
| **PR5 CAPM**  | Capacity Management                 | Wydajność, planowanie zasobów (ludzkich, technicznych, finansowych)                                    |
| **PR6 ISM**   | Information Security Management     | Poufność, integralność i dostępność informacji, polityki bezpieczeństwa, kontrola dostępu              |
| **PR7 CRM**   | Customer Relationship Management    | Identyfikacja klientów, kanały komunikacji, przeglądy usług, satysfakcja, skargi                       |
| **PR8 SUPPM** | Supplier Relationship Management    | Dostawcy: kontakt, ocena, eskalacja                                                                    |

### Operacje i kontrola (Operate and Control) — PR9-PR14

| Kod            | Nazwa                                   | O czym                                                                                                                                          |
| -------------- | --------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| **PR9 ISRM**   | Incident and Service Request Management | Ticketing: rejestracja, klasyfikacja, priorytety, eskalacja, zamknięcie. Plus odrębna obsługa zgłoszeń serwisowych (np. reset hasła ≠ incydent) |
| **PR10 PM**    | Problem Management                      | Identyfikacja powtarzających się incydentów → znalezienie przyczyny źródłowej → known error i workaround → docelowa zmiana (change)             |
| **PR11 CONFM** | Configuration Management                | Ewidencja elementów konfiguracji (CMDB): co jest, jakie ma atrybuty, jak się łączy z innymi                                                     |
| **PR12 CHM**   | Change Management                       | Zarządzanie zmianą: rejestracja RFC, klasyfikacja (zwykła, istotna, awaryjna), ocena, zatwierdzenie, przegląd po wdrożeniu, harmonogram zmian   |
| **PR13 RDM**   | Release and Deployment Management       | Wprowadzanie zmian do produkcji jako wydania (release): planowanie, testy akceptacyjne, plan rollback                                           |
| **PR14 CSI**   | Continual Service Improvement           | Doskonalenie usług i procesów — z raportów, audytów, opinii zgłaszanych wewnętrznie                                                             |

## Trzy typy umów: SLA, OLA, UA

Często mylone. FitSM rozdziela je jasno:

| Typ umowy                             | Strony                                          | Przykład                                                             |
| ------------------------------------- | ----------------------------------------------- | -------------------------------------------------------------------- |
| **SLA** — Service Level Agreement     | Dostawca usługi ↔ Klient zewnętrzny             | „Dostarczamy aplikację z dostępnością 99% w godzinach pracy"         |
| **OLA** — Operational Level Agreement | Dostawca usługi ↔ Wewnętrzny zespół wspierający | „Zespół DB gwarantuje rozwiązanie krytycznego incydentu w 2 godziny" |
| **UA** — Underpinning Agreement       | Dostawca usługi ↔ Zewnętrzny podwykonawca       | „Hosting gwarantuje dostępność infrastruktury 99,9%"                 |

**Logika łańcuchowa:** klient widzi tylko SLA. Żeby je spełnić, dostawca musi mieć skoordynowane OLA z zespołami wewnętrznymi i UA z zewnętrznymi podwykonawcami. Każdy poziom wspiera kolejny.

## Role w systemie zarządzania usługami

FitSM-3 definiuje pięć ról:

| Rola                | Odpowiedzialność                                                                              |
| ------------------- | --------------------------------------------------------------------------------------------- |
| **SMS Owner**       | Całkowita odpowiedzialność za system. Zwykle ktoś z zarządu. Zapewnia mandat i zasoby         |
| **SMS Manager**     | Odpowiada za skuteczność operacyjną systemu. Utrzymuje plan zarządzania usługami              |
| **Process Owner**   | Odpowiada za konkretny proces (np. Change Management). Definiuje cele procesu, monitoruje KPI |
| **Process Manager** | Odpowiada za skuteczność operacyjną procesu. Raportuje do Process Owner                       |
| **Process Staff**   | Wykonuje konkretną aktywność procesu (np. klasyfikuje zgłoszenia w service desku)             |

W dużej organizacji każda rola to inny człowiek (czasem cały zespół). W małym zespole jedna osoba pełni wiele ról — to dopuszczalne, byle było udokumentowane. W solo-shopie wszystkie role pełni ta sama osoba, ale fakt, że są rozpoznane jako różne _funkcje_, pomaga w przyszłości delegować je przy skalowaniu.

## Kluczowe rozróżnienie: Incydent nie równa się Zgłoszenie serwisowe

Klasyczny błąd w organizacjach bez ITSM: wszystko, co użytkownik zgłasza, wpada do jednej kolejki „zgłoszenia". FitSM rozróżnia:

| Incydent (Incident)                        | Zgłoszenie serwisowe (Service Request)         |
| ------------------------------------------ | ---------------------------------------------- |
| Nieplanowane zakłócenie usługi             | Standardowa prośba użytkownika                 |
| Przykład: „aplikacja nie startuje"         | Przykład: „reset hasła", „dodanie użytkownika" |
| Cel: jak najszybciej **przywrócić** usługę | Cel: **wykonać** standardową czynność          |
| Może mieć priorytet krytyczny              | Zwykle obsługiwany w trybie standardowym       |

Z tego rozróżnienia wynika dalej: **major incident** (incydent o dużym zasięgu) wymaga osobnej, bardziej intensywnej obsługi. **Problem** (PR10) to to, co znajdujemy po przeanalizowaniu wielu podobnych incydentów — szukamy przyczyny źródłowej, a nie tylko gasimy pożary.

## Co FitSM-em nie jest

| Mylne założenie                           | Co naprawdę                                                                                                                             |
| ----------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| FitSM mówi _jak_ projektować architekturę | Nie. FitSM jest neutralny technologicznie — opisuje _zarządzanie_, nie _implementację_                                                  |
| FitSM zastępuje ITIL                      | Nie. FitSM jest _kompatybilny_ z ITIL i ISO/IEC 20000, ale celuje w organizacje, dla których ITIL jest za duży                          |
| FitSM jest certyfikowalny dla organizacji | Sam standard — nie. Można certyfikować _ludzi_ (Foundation, Advanced, Expert). Organizacje certyfikują się przez ISO/IEC 20000          |
| FitSM jest tylko dla IT                   | Definicja „usługi" jest na tyle ogólna, że nadaje się też do innych obszarów. W FitSM „IT" jest domyślnym kontekstem, ale nie wyłącznym |

## Praktyczne wdrożenie w małym zespole

Materiał Foundation kończy się obszarem **korzyści i ryzyk** wdrożenia ITSM. Najważniejsze rzeczy do zapamiętania:

**Realne korzyści:**

- Lepsze zrozumienie struktury własnej organizacji
- Spójność dostarczania (klient wie, czego oczekiwać)
- Mniejsza fragmentacja silosów (zespoły rozmawiają)
- Łatwiejsze skalowanie (procesy istnieją, gdy przychodzi nowy człowiek)

**Realne ryzyka, jeśli wdrożenie pójdzie źle:**

- Procesy stają się biurokratyczne — więcej papierów niż działania
- Ludzie omijają procesy, jeśli ich nie rozumieją
- Brak zaangażowania zarządu = brak mandatu = brak skutku

Zasada przewodnia z materiału FitSM (cytat):

> _Only write documents that someone is going to read._

Pisz tylko te dokumenty, które ktoś rzeczywiście przeczyta. To samo dotyczy procesów — wdrażaj tylko te, w których realnie kogoś chronisz przed chaosem.

## Certyfikacja

FitSM ma trzy poziomy certyfikatów (egzaminy płatne, ale szkolenia darmowe):

| Poziom                 | Co obejmuje                                                                                 |
| ---------------------- | ------------------------------------------------------------------------------------------- |
| **Foundation**         | Słownictwo, struktura standardu, główne procesy. Egzamin: 30 minut, 20 pytań, 65% do zdania |
| **Advanced SPD**       | Specjalizacja w usługach planowanych i dostarczanych (PR1-PR8)                              |
| **Advanced SOC**       | Specjalizacja w operacjach i kontroli (PR9-PR14)                                            |
| **Expert and Auditor** | Wymaga obu Advanced                                                                         |

Certyfikat Foundation kosztuje rzędu 200-300 EUR (zależnie od ośrodka egzaminacyjnego). Sam materiał szkoleniowy jest darmowy — FitSM nie zarabia na blokowaniu wiedzy, tylko na certyfikacji.

## Do zapamiętania

- **Usługa = to, za co klient zapłaciłby osobno.** Reszta to elementy składowe lub wspierające
- **80% awarii usług IT to ludzie i procesy**, nie technologia
- FitSM = **17 wymagań ogólnych plus 65 procesowych** w 14 procesach
- **Klient widzi SLA.** Dostawca, żeby spełnić SLA, koordynuje OLA (zespoły wewnętrzne) i UA (podwykonawców zewnętrznych)
- **Incydent nie równa się Zgłoszenie serwisowe.** Incydent = „coś się popsuło i nie działa zgodnie z umową". Zgłoszenie serwisowe = „wykonajcie mi standardową czynność"
- **Problem** to przyczyna źródłowa powtarzających się incydentów — szukamy jej osobno, zamiast w kółko gasić pożary
- W solo-shopie jedna osoba pełni wiele ról. Ważne, by rozpoznać je jako _różne funkcje_ — to ułatwia delegowanie przy skalowaniu
- **PDCA** (Plan-Do-Check-Act) jest fundamentem ciągłego doskonalenia, tak samo jak w ISO 9001
- _Only write documents that someone is going to read_ — pisz tylko te dokumenty, które ktoś rzeczywiście przeczyta

---

_Niniejszy artykuł jest streszczeniem materiału szkoleniowego FitSM Foundation v3.0.6 (licencja Creative Commons Attribution 4.0, fitsm.eu)._
