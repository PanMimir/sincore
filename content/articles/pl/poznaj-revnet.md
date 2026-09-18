---
id: revnet-intro
title: "Poznaj REVnet — diagnostyka Windows, sieci i urządzeń przemysłowych"
titleSeo: "Poznaj REVnet — diagnostyka Windows, sieci i OT"
description: "Czym jest REVnet? Pierwsza prezentacja aplikacji do diagnostyki Windows, sieci i urządzeń przemysłowych, z trzema zrzutami ekranu."
date: "2026-09-18"
tags: ["revnet", "security", "audyt", "modbus", "ot", "windows"]
featured: true
---

**REVnet to rozwijana przeze mnie aplikacja na Windows do sprawdzania konfiguracji komputera oraz diagnostyki sieci i urządzeń przemysłowych.** Łączy lokalny audyt, narzędzia sieciowe i moduł odczytów Modbus. Buduję ją z myślą o technikach, automatykach i ludziach od IT, którzy potrzebują zebrać wyniki i przygotować materiał do raportu. Całość projektuję do pracy lokalnej, również bez internetu.

Powód jest przyziemny. Przy szukaniu usterki łatwo skończyć z kilkoma oknami, wynikiem polecenia w terminalu i folderem nazwanym „test2_final". A potem zgaduj, co sprawdzałeś, na której maszynie i skąd wziął się ten plik. Chcę mieć narzędzie, które pomaga ogarnąć tę robotę od sprawdzenia do opisania wyniku.

| Część aplikacji | Do czego służy |
|---|---|
| **Core Audit** | Sprawdzenie lokalnego komputera z Windows: m.in. ustawień kont, haseł i dostępu zdalnego. Wyniki trafiają do ustaleń i raportu. |
| **Construct** | Narzędzia diagnostyczne, m.in. rozpoznawanie urządzeń i portów w sieci. Miejsce na plan pomiaru, log oraz pliki z wynikami. |
| **OT Diagnostics** | Diagnostyka urządzeń przemysłowych, czyli OT. Pokazana wersja zawiera konfigurację odczytu rejestrów przez Modbus TCP. |

**Zacznijmy od zwykłego komputera.** W Core Audit wybierasz obszary do sprawdzenia i uruchamiasz pomiar. Na ekranie poniżej widać już ustalenia: aplikacja wskazuje m.in. brak blokady kont po nieudanych logowaniach, brak automatycznej blokady ekranu i ustawienia usług sieciowych. Przy każdym wpisie pokazuje wagę, obszar oraz stopień pewności.

![Core Audit: lista ustaleń dotyczących kont, blokady ekranu i usług sieciowych.](/articles/revnet-core-audit-ustalenia.png)

*Core Audit — przykładowa lista ustaleń. Wpisy mają osobno oznaczoną wagę i pewność.*

Przy części pozycji widnieje „Potwierdzone", przy innych „Wskazanie". To rozróżnienie ma znaczenie: wskazanie wymaga ręcznej weryfikacji. Dostaję konkretny punkt do sprawdzenia, z którym mogę usiąść do dalszej diagnostyki. Na tym ekranie cały pomiar ma też status częściowy — tę informację trzeba zachować przy opisywaniu wyników.

**Dalej jest raport.** W pokazanym podglądzie ustalenia trafiają do dokumentu z opisami i propozycjami działań. Widać też pola do uzupełnienia przez osobę prowadzącą sprawdzenie: dane klienta, autora i ocenę ogólną. Program porządkuje materiał, a ja dopisuję kontekst: do czego służy komputer, jakie ma ograniczenia i co rzeczywiście da się na nim zmienić.

![Podgląd raportu Core Audit z ustaleniami i polami do uzupełnienia przez autora.](/articles/revnet-core-audit-raport.png)

*Raport — podgląd dokumentu z przykładowego pomiaru. Żółte oznaczenia pokazują miejsca wymagające uzupełnienia.*

**Przy urządzeniach przemysłowych pojawia się inny zestaw pytań.** Z jakim urządzeniem się łączę? Które rejestry chcę odczytać? Ile zapytań wykonać? W module OT widać te parametry w formularzu: adres urządzenia, port, Unit ID, adres i liczbę rejestrów oraz limit zapytań. Pokazany ekran dotyczy odczytu Modbus TCP, funkcją 3.

![OT Diagnostics: konfiguracja odczytu Modbus TCP z adresem urządzenia, rejestrami i limitem zapytań.](/articles/revnet-ot-modbus-tcp.png)

*OT Diagnostics — przygotowanie odczytu Modbus TCP. Ten moduł w pokazanej wersji jest oznaczony jako laboratoryjny.*

To dobry punkt wyjścia do kolejnego, już praktycznego materiału: podłączyć konkretne urządzenie, pokazać jego mapę rejestrów, wykonać odczyt i wyjaśnić otrzymane wartości. Wtedy można zobaczyć, co narzędzie faktycznie daje podczas pracy.

**REVnet nadal rozwijam.** Na początek pokazuję, czym jest i jak wygląda praca w aplikacji. Kolejne wpisy chcę oprzeć na konkretnych przypadkach: jedno pytanie, wykonany pomiar, wynik i wniosek. Tak będzie najłatwiej ocenić, gdzie REVnet pomaga, a gdzie jeszcze trzeba go dopracować.

*Zrzuty ekranu przedstawiają wersję rozwojową REVnet 0.9.0-rc1 z 2 września 2026 r. Wygląd i zakres funkcji mogą zmieniać się w kolejnych wersjach.*
