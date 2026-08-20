---
id: ai-assisted-ot-intrusion
title: "Napastnik bez wiedzy o automatyce, który i tak znalazł bramkę przemysłową"
titleSeo: "Włamanie do wodociągów z pomocą modeli językowych"
description: "Dragos opisał włamanie do meksykańskich wodociągów, w którym model językowy był narzędziem roboczym. Co maszyna zrobiła, czego nie zdołała i co z tego wynika."
date: "2026-08-19"
tags: ["security", "ot", "ai"]
featured: true
references:
  - title: "Dragos — AI in the Breach: How an Adversary Leveraged AI to Target a Water Utility's OT (6 maja 2026)"
    url: "https://www.dragos.com/blog/ai-assisted-ics-attack-water-utility"
---

## Dlaczego w ogóle o tym piszę

Zwykle omijam temat włamań szerokim łukiem, bo w tej branży za dużo się straszy, a za mało tłumaczy. Ten przypadek jest inny, bo dotyka rzeczy, którą powtarzam klientom od lat: **sieć sterowania jest bezpieczna głównie dlatego, że mało kto ją rozumie**. To założenie właśnie się zestarzało i warto wiedzieć dlaczego.

Materiał pochodzi z jednego opracowania firmy Dragos, opublikowanego 6 maja 2026 roku. Nie mam własnych danych z tej instalacji i nie weryfikowałem niczego samodzielnie — opisuję cudze ustalenia i zaznaczam na końcu, czego z tego opracowania nie da się wyczytać.

## Co się stało

Między grudniem 2025 a lutym 2026 ktoś włamał się do przedsiębiorstwa wodociągowo-kanalizacyjnego obsługującego aglomerację Monterrey w Meksyku. Sprawa wyszła na jaw dopiero **w kwietniu 2026**, i to nie przez samego poszkodowanego — badacze z zewnątrz odzyskali obszerny zbiór materiałów pozostawionych przez napastnika. Opracowanie nie mówi nic o tym, czy i kiedy zakład wykrył włamanie u siebie.

W trakcie tego włamania napastnik posługiwał się dwoma komercyjnymi modelami: Claude'em jako głównym wykonawcą technicznym oraz modelami GPT do analizy danych i przygotowywania opracowań po hiszpańsku. Nie chodzi o „AI, które napisało wirusa" — chodzi o kogoś, kto **traktował model jak narzędzie robocze przez cały czas trwania operacji**: do rozpoznania, do budowy narzędzi, do interpretowania tego, co znalazł.

Powstało w ten sposób oprogramowanie liczące około siedemnastu tysięcy linii kodu, z czterdziestoma dziewięcioma modułami do rozpoznawania sieci, zbierania danych uwierzytelniających i przemieszczania się między maszynami. Napastnik dopracowywał je w trakcie, w miarę jak orientował się w terenie.

## Fragment, który powinien zainteresować automatyka

Teraz najważniejsze zdanie z całego opracowania: **napastnik nie wykazał się żadną istotną wiedzą o automatyce ani o systemach sterowania.** Nie był specjalistą od OT. Nie musiał być.

Model, przeszukując sieć biurową, sam z siebie wskazał serwer z bramką przemysłową vNode oraz platformą zarządzania SCADA i urządzeniami przemysłowymi jako cel o wysokiej wartości. Nikt mu nie powiedział, czego szukać w tym kontekście. Rozpoznał, czym jest to, na co patrzy, i ocenił, że jest to strategicznie istotne.

To jest dokładnie ta warstwa ochrony, na której po cichu opiera się mnóstwo instalacji w Polsce. Napastnik, który nie wie, co to jest bramka protokołowa i po co komu rejestr Modbus, przechodzi obok takiego serwera obojętnie. Ten mechanizm właśnie przestał być pewny — nie dlatego, że napastnicy zmądrzeli, tylko dlatego, że wynajęli sobie kogoś, kto to rozumie, za kilkadziesiąt dolarów miesięcznie.

Druga rzecz, mniej efektowna, ale poważniejsza w skutkach: opracowanie szacuje, że budowa narzędzi, która normalnie zajęłaby **dni albo tygodnie, zamknęła się w godzinach**. Cała operacja, w normalnych warunkach żmudna, została przyspieszona na tyle, że okno na zauważenie czegokolwiek zrobiło się dużo węższe.

## Czego maszyna nie zdołała zrobić

I tu przychodzi część, którą warto czytać powoli, bo jest jedyną dobrą wiadomością w całej historii.

Po zidentyfikowaniu bramki napastnik przypuścił na jej interfejs uwierzytelniania atak polegający na masowym przymierzaniu haseł. **Nie udało się.** Dragos nie znalazł żadnych śladów wskazujących, że sieć sterowania została w ogóle naruszona. Po tej porażce napastnik po prostu odpuścił stronę przemysłową i wrócił do wynoszenia danych z sieci biurowej.

Model potrafił rozpoznać cel, ocenić jego wartość i zbudować narzędzia. **Nie potrafił natomiast samodzielnie sforsować systemu przemysłowego.** Do tego trzeba by było opracować coś nowego pod konkretne urządzenie albo pójść drogą socjotechniki — a to wciąż jest robota dla człowieka. Planowanie i nadzór nad operacją też najprawdopodobniej zostały po stronie ludzkiej.

Innymi słowy: podniosła się poprzeczka rozpoznania, nie poprzeczka włamania do sterowania. Zwykłe, nudne zabezpieczenie po stronie uwierzytelniania wystarczyło.

## Co z tego wynika dla instalacji

Nie mam ambicji pisać poradnika bezpieczeństwa — nie jestem od tego i nie chcę udawać, że jestem. Ale trzy wnioski z tego opracowania są na tyle proste, że przekazałbym je każdemu utrzymaniu ruchu:

**Po pierwsze, przestań liczyć na to, że nikt nie zrozumie twojej instalacji.** Nazwy urządzeń, nagłówki interfejsów webowych, otwarte porty typowe dla bramek protokołowych — to wszystko jest dziś czytelne dla maszyny, która nie potrzebuje ani doświadczenia, ani cierpliwości. Zabezpieczenie przez niezrozumiałość skończyło się.

**Po drugie, to hasło do bramki uratowało tę instalację.** Nie zapora, nie segmentacja, nie żaden kosztowny system — nieudane przymierzanie haseł na interfejsie uwierzytelniania. Rzeczy, które od lat wszyscy odkładają na później: zmienione hasła domyślne, mocne dane logowania do panelu bramki, ograniczony zdalny dostęp.

**Po trzecie, wykrywanie ma znaczenie większe niż zwykle.** To włamanie wyszło na jaw dopiero po miesiącach i za sprawą kogoś z zewnątrz. Dragos kładzie nacisk na widoczność ruchu wewnątrz sieci i na odejście od strategii opartej wyłącznie na zapobieganiu — argument prosty: skoro operacja trwa godziny zamiast tygodni, to zdolność zauważenia czegoś staje się ważniejsza niż zdolność powstrzymania wszystkiego z góry. Zalecenia opracowania są w tym miejscu zgodne z pięcioma podstawowymi zabezpieczeniami dla systemów sterowania w ujęciu SANS: architektura dająca się bronić, kontrolowany zdalny dostęp, mocne uwierzytelnianie, widoczność sieci i zdolność reagowania.

## Czego z tego opracowania nie wiadomo

Uczciwie, bo to jest jedno źródło i warto znać jego granice.

Nie wiadomo, **kto to zrobił** — Dragos wprost pisze, że napastnik pozostaje nieznany i nie pasuje do żadnej znanej im wcześniej działalności. Nie wiadomo, jak napastnik dostał się do sieci biurowej na samym początku. Nie wiadomo, czy i kiedy zakład wykrył cokolwiek własnymi siłami. Nie wiadomo wreszcie, ile z pozostawionych materiałów jest przechwałkami napastnika, a ile realnym zapisem przebiegu — opracowanie opiera się na zbiorze odzyskanym przez osoby trzecie.

Świadomie nie opisuję tu, jak przebiegały poszczególne kroki tej operacji ani czym dokładnie napastnik się posługiwał. Interesuje mnie wniosek dla strony broniącej, a nie instrukcja dla ciekawskich. Kto chce szczegółów technicznych, znajdzie pełne opracowanie pod odnośnikiem poniżej.

## Zdanie na koniec

Ta historia nie jest o tym, że sztuczna inteligencja włamuje się do wodociągów. Jest o tym, że **wiedza dziedzinowa przestała być barierą wejścia** — a akurat na tej barierze, świadomie albo nie, opiera się bezpieczeństwo bardzo wielu małych instalacji. Reszta wniosków jest nudna i znana od dwudziestu lat: hasła, dostęp zdalny, widoczność. Tyle że teraz nudne wnioski trzeba wdrożyć szybciej.
