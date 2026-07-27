---
id: screw-feeder-pyrolysis-calculator
title: "Excel jako podajnik ślimakowy, albo: jak liczyć nastawy pirolizera nie wstając od biurka"
description: "Plan był prosty — wolne od kodu, dzień przy pirolizerze. Skończyło się tysiącem linii Pythona, dopasowanym modelem kinetyki rozkładu biomasy i kalkulatorem nastaw na 16 paliw. O bilansie masy, dlaczego napełnienie ślimaka nie jest cechą sprzętu, i dlaczego nikt nie odpowie ci na maila o nastawy w tym tygodniu."
date: "2026-06-09"
tags: ["piroliza", "biomasa", "inżynieria-procesowa", "Excel", "kalkulator"]
featured: true
references:
  - title: "Bergman et al. (2005) — Torrefaction for biomass co-firing, ECN-C-05-013 (PDF)"
    url: "https://publications.tno.nl/ecn-report/report/2005/c05013.pdf"
  - title: "Bates & Ghoniem (2012) — Biomass torrefaction kinetics, Bioresour. Technol. 124"
    url: "https://www.sciencedirect.com/science/article/abs/pii/S0960852412013466"
  - title: "Vardon et al. (2013) — Spent coffee grounds biochar, ACS Sustainable Chem. Eng. 1(10)"
    url: "https://pubs.acs.org/doi/10.1021/sc400145w"
---

Plan na poniedziałek był taki: zrobię sobie dzień wolnego od kodu. Programowania mam w tygodniu pod dostatkiem, a jest ta instalacja, którą trzeba uruchomić. Pirolizer, ślimak, trzy strefy grzania, czarne ziarna na końcu. Spokojny, namacalny problem inżynierski. Idealny odpoczynek od klawiatury.

Pod koniec tygodnia bilans tego „odpoczynku" wyglądał następująco: tysiąc linii Pythona generującego arkusz kalkulacyjny, dopasowane wykładnicze modele kinetyki rozkładu biomasy, przekopana literatura przedmiotu, symulacja szesnastu paliw przy siedmiu temperaturach i stu jeden częstotliwościach falownika. Mniej-więcej dwa razy więcej pracy niż gdybym po prostu siedział na regularnym tasku w JIRA. Sam absurd jest opowieścią, ale po drodze wyszło coś sensownego, więc zanim wrócę do programowania — szybkie podsumowanie tego o czym **naprawdę** trzeba pomyśleć, żeby reaktor pirolityczny robił to czego się od niego oczekuje.

## 1. Dwóch nieznajomych w równaniu (bilans masy nie wybacza)

Zaczyna się niewinnie. Chcesz dwie rzeczy:

- żeby z reaktora wylatywała przyzwoita ilość karbonizatu (powiedzmy, kilogram na godzinę, im więcej tym lepiej, bo żmudność testów rośnie z każdym dniem siedzenia przy panelu),
- żeby paliwo siedziało w strefie grzanej dostatecznie długo, żeby się rozłożyło tak jak chcesz.

Brzmi rozsądnie. Wpisujesz na falowniku trochę Hz, na sterowniku podajnika 5 sekund pracy, 5 sekund przerwy. Patrzysz na karbonizat — albo wygląda jak pellet drzewny lekko opalony zapalniczką, albo jak węgiel aktywny prosto z laboratorium. Coś jest pomiędzy. Zmieniasz Hz. Karbonizat zmienia się troszkę. Zmieniasz przerwę. Karbonizat wygląda inaczej. Skąd to wiedzieć?

A wszystko dlatego, że tych dwóch parametrów — przerobu i czasu grzania — **nie da się ustawić niezależnie**. Wiąże je drobny szczegół z liceum technicznego, którego nikt nie pamięta o nazwie *bilans masy*:

> **Holdup = przepływ × czas przebywania**

Innymi słowy: ile masy siedzi jednocześnie w strefie grzanej = ile masy wpływa na godzinę razy ile minut tam siedzi. Geometrycznie banał. Operacyjnie znaczy, że jak chcesz dłuższy czas grzania przy tym samym kg karbonizatu na godzinę, musisz mieć **więcej masy w środku w danej chwili**. Jak chcesz przyspieszyć przerób, musisz albo skrócić czas grzania, albo upchnąć jeszcze więcej masy w rurze.

I tu zaczyna się zabawa. Bo „ile masy w rurze" to nie jest pokrętło w panelu. To **konsekwencja** innego pokrętła. Ale do tego zaraz.

## 2. Geometria robi robotę (i nie, to nie zwoje)

![Schemat HMI typowego procesu pirolitycznego z trzema strefami grzania i podajnikiem ślimakowym](/articles/excel-podajnik-hmi.png)

Pierwsza intuicja każdego ją zna: skoro ślimak ma zwoje, to „napełnienie" pewnie znaczy ile materiału jest w zwojach. Logiczne. Niewłaściwe.

Materiał w rurze ślimakowej nie siedzi grzecznie tylko w kieszeniach spirali. Siedzi we wszystkim co jest puste: w kieszeniach zwojów, w szczelinie między spiralą a ścianą rury, w przestrzeni dookoła trzpienia centralnego (chyba że ślimak jest bezosiowy, ale nie ten). Jak rura ma luz 1,5 cm między spiralą a ścianą — a tyle czasem ma, jak instalacja jest bardziej „reaktor do testowania nieprzewidywalnych wsadów" niż precyzyjny dozownik — to materiał spokojnie tam wchodzi i zalega.

Dlatego „napełnienie" liczymy w stosunku do **całego pierścienia** transportu. Pierścień = wnętrze rury MINUS trzpień. Jakby ktoś jeszcze pamiętał geometrię: pole pierścienia to π(D² − d²)/4, gdzie **D** to średnica wewnętrzna rury, a **d** — średnica trzpienia, na którym siedzą zwoje. Pojemność strefy grzanej to to pole razy długość izolowanego odcinka. Cała filozofia.

Co z tego wynika praktycznie: jeśli na panelu masz napełnienie 25%, to czwarta część pierścienia (czyli całej dostępnej przestrzeni między rurą a trzpieniem, na całej strefie grzanej) jest wypełniona paliwem. Reszta to powietrze, lekko podgrzane gazy z pirolizy i wciąż dyskusyjna ilość pary wodnej. Te 25% to dla typowego pirolizera lekki underfeed — bo można upchać do około 40-45% zanim ślimak zacznie się dławić, klinować i robić rzeczy o których w SOP-ie nie pisze.

Niskie napełnienie (powiedzmy 0,10) = ślimak jedzie pusty, paliwo szybciej przelatuje, krótsze grzanie, mniej karbonizatu. Wysokie (0,40) = ślimak upchany, długie grzanie, więcej karbonizatu, większy moment oporowy na silniku. Optymalne zwykle 0,20–0,30, zależnie od tego co się dzieje **na zewnątrz** reaktora — czyli jak szybko dozownik z góry podaje materiał.

I uwaga która sprawia że pierwsze trzy testy są nieporównywalne: **napełnienie to nie jest cecha sprzętu**. To **operacyjny stan**. Zależy od tego jak szybko dozownik podaje materiał z góry, jak gęsta i wilgotna jest aktualna partia, czy ktoś w międzyczasie nie zmienił T_on na podajniku wstępnym „żeby spróbować coś nowego". Dwa identyczne pomiary kalibracyjne — z tym samym Hz, tym samym T_on/T_off, tym samym paliwem — mogą dać dwie różne wartości napełnienia, bo trzy dni wcześniej padał deszcz i partia jest mokra. To nie błąd metody, to fizyka rolnictwa.

## 3. Y(T): trzy parametry zamiast tabeli pełnej liczb

Następny problem. Trzeba wiedzieć ile karbonizatu wyleci. Po pirolizie z każdego kilograma wsadu zostaje jakiś ułamek, zwykle nazywany **uzyskiem masowym Y**. Drewno w 300°C — zostaje 80%. To samo drewno w 600°C — zostaje 22%. Słoma reaguje inaczej niż drewno. RDF reaguje całkowicie inaczej niż RDF z innego śmietnika.

Pierwsza pokusa: tabela. Dla każdego paliwa wypisać Y dla T=300, 350, 400, ..., 650°C. Po osiem wartości na materiał. Przy piętnastu materiałach to 120 liczb wpisywanych z palca. Z literatury jak się da, ze sufitu jak się nie da. Każda jedna do indywidualnego klepnięcia jak ktoś zmieni temperaturę z 450 na 425 i pojawia się niewinne pytanie „ile teraz?". Skończony absurd, klasyczna pułapka inżynierska „zrobimy tymczasowo".

Lepsze rozwiązanie pochodzi z chemii rozkładu termicznego — krzywa Y(T) ma kształt eksponencjalnego zaniku do asymptoty. Nie jest to magia, tylko bezpośrednia konsekwencja tego że hemiceluloza degraduje pierwsza (200-280°C), celuloza idzie w 280-380°C, lignina trzyma się do końca i część jej zostaje jako char. Trzy reżimy w jednej krzywej, ale jak nie chcesz pisać artykułu o dwustopniowej kinetyce (a dziś nie chcesz), wystarczy:

> **Y(T) = Y∞ + A · exp(−k · (T − 300))**

Trzy parametry na paliwo — a że symbole nie mówią same za siebie:

| Symbol | Co to jest | Jednostka |
|---|---|---|
| **Y(T)** | uzysk masowy w temperaturze T: jaki ułamek wsadu wychodzi jako karbonizat | % |
| **T** | temperatura w strefie grzanej | °C |
| **Y∞** | asymptota — ile char zostanie zawsze, choćbyś grzał w nieskończoność | % |
| **A** | ile masy jest „do rozłożenia" ponad asymptotą | % |
| **k** | jak szybko uzysk spada wraz z temperaturą | 1/°C |
| **300** | nie stała fizyczna, tylko punkt zaczepienia krzywej: dolny kraniec zakresu | °C |

Wszystko zafitowane do pomiarów z literatury (jak są) albo własnych (jak nie ma). Krzywa wychodzi w ciągu trzydziestu sekund w arkuszu.

Korzyść operacyjna: zmieniasz materiał z drewna na kawę prażoną (tak, kawę, do tego dojdziemy) — trzy liczby się aktualizują, krzywa się przeskala, kalkulator nastaw automatycznie liczy nowe Hz i T_on/T_off. Zamiast ośmiu lookupów na materiał masz trzy stałe. I, co ważniejsze: dla **dowolnej** T (433°C? 521°C?) dostajesz Y bez interpolacji ręcznej.

Przy okazji: jak ktoś jednak woli tabelę z lookupem, da się to wpisać kilkoma kliknięciami. Ale po co.

## 4. Kalibracja jest jednorazowa per próba

Z całego procesu opisanego do tej pory wynika jedna konsekwencja, którą operatorzy przyjmują z zakłopotaniem: **napełnienie trzeba mierzyć po każdej próbie od nowa**. To nie metafora.

Kalibracja jest prosta — włączasz ślimak na trzydzieści minut z konkretnymi nastawami, zważasz co wyleciało, kalkulator zwraca napełnienie z bilansu. Pierwsza próba: 0,255. Druga z dokładnie tymi samymi nastawami: 0,13. Nastawy się nie zmieniły, ale zbiornik wsadowy między próbami się opróżnił do połowy i resztki przez noc zlepiły się w grudkę. Materiał inaczej szedł do dozownika. Inne napełnienie. Inny operacyjny stan.

Wniosek brutalny i niepopularny w środowiskach, które lubią procedury: **napełnienie ślimaka nie jest cechą sprzętu, jest cechą próby**. Trzeba je mierzyć dla każdej partii paliwa, dla każdej zmiany pogody, dla każdego „a sprawdźmy jak będzie z mokrą biomasą". Można żyć z tym albo nie żyć z tym, ale ignorowanie tego nie sprawi że zniknie.

Dobra wiadomość: kalibracja zajmuje trzy minuty kalkulatorem i trzydzieści minut czasu reaktora. Mniej niż większość rzeczy które dział R&D każe robić.

## 5. Tryb A vs Tryb B (dwie szkoły patrzenia na cykl)

Pierwszy operator pyta: „jakiej długości ma być cykl pracy?". I tu okazuje się, że są dwie szkoły odpowiedzi, dające ten sam **średni przepływ**, ale inny charakter pracy.

**Tryb A — wpisujesz długość cyklu, dostajesz pracę i przerwę.** Mówisz arkuszowi „cykl ma trwać dziesięć sekund". Dzieli to na pracę (np. 2,6 s) i przerwę (7,4 s) zgodnie z wyliczonym procentem pracy. Cykl jest **stały**. Krótkie szarpnięcie i długa cisza, w równym rytmie. Przewidywalne, łatwe do zaprogramowania na sterowniku.

**Tryb B — wpisujesz minimum obrotów ślimaka na impuls, dostajesz cykl.** Mówisz arkuszowi „chcę żeby ślimak zrobił jeden pełny obrót w każdym impulsie". Arkusz liczy ile sekund musi pracować silnik żeby się to udało, dolicza przerwę z procentu pracy. **Cykl jest różny dla każdego Hz** — przy 4 Hz cykl ma 53 sekundy, przy 25 Hz ma 9 sekund. Powtarzalność porcji jest betonowa.

Co wybrać? W Trybie A kontrolujesz rytm, w Trybie B kontrolujesz porcje. Tryb A jest dobry do regularnej pracy — masz materiał o przewidywalnej gęstości i wiesz jaki cykl chcesz. Tryb B jest dobry do pracy przy niskich Hz, gdzie pojedyncze obroty robią różnicę i nie chcesz żeby któryś impuls minął bez nabrania materiału.

## Tak więc

Cała ta historia wygląda jakby ją żywcem wyjęto z podręcznika inżynierii procesowej. W praktyce wzięła się z tego że w środę o jedenastej zero zero ktoś rzucił „no to jakie są dobre nastawy?", a nikt nie miał gotowej odpowiedzi.

Tak, można to było załatwić jednym mailem do producenta podajnika. Ale spróbuj dostać odpowiedź jeszcze w tym tygodniu. Tak, można było wziąć tabelę z artykułu Bergmana z 2005 i czytać interpolacje suwakiem. Ale jakoś trudno wytłumaczyć technologowi, że „tak, dla buka mamy dane, dla świerka mamy dane, ale jak chcesz dorzucić kawę to musisz poczekać do przyszłej dekady".

Po tej krótkiej przerwie wracam więc do programowania — z lekkim niedosytem co do całej kinetyki dwustopniowej Batesa, którą obiecywałem sobie zaimplementować „jak będzie czas". Czas, jak wiadomo, nigdy nie będzie. Ale arkusz stoi, działa, można go otworzyć w Google Sheets albo Excelu, i jeśli ktoś kiedyś będzie miał ślimak, rurę, trzpień i biomasę której nie wiadomo jak ugrać — może mu zaoszczędzi tydzień siedzenia przed monitorem.

Albo i dwa, jeśli też zechce dorzucić kawę.

---

*Ciąg dalszy: [Kalkulator pirolizera V2](/pl/knowledge/kalkulator-pirolizera-v2-walidacja) — sześć tygodni później arkusz zderzył się z szesnastoma dniami prób ruchowych. Napełnienie, o którym pisałem wyżej, że wynosi zwykle 0,20–0,30, okazało się wynosić 0,49.*
