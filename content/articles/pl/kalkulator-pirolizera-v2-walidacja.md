---
id: screw-feeder-calculator-validation
title: "Kalkulator pirolizera V2, albo: co się dzieje, gdy model spotyka szesnaście dni prób ruchowych"
description: "W czerwcu wypuściłem arkusz liczący nastawy pirolizera. Potem instalacja jechała sześć tygodni bez mojego udziału i wróciła z logiem z 16 dni prób. Zderzenie było pouczające: struktura modelu przetrwała, jeden współczynnik był dwa razy za mały, a bramka OK ✓ okazała się matematycznie niezdolna do zapalenia się na zielono."
date: "2026-07-27"
tags: ["piroliza", "biomasa", "inżynieria-procesowa", "walidacja", "kalkulator"]
featured: true
references:
  - title: "Bergman et al. (2005) — Torrefaction for biomass co-firing, ECN-C-05-013 (PDF)"
    url: "https://publications.tno.nl/ecn-report/report/2005/c05013.pdf"
  - title: "Bates & Ghoniem (2012) — Biomass torrefaction kinetics, Bioresour. Technol. 124"
    url: "https://www.sciencedirect.com/science/article/abs/pii/S0960852412013466"
---

Poprzednim razem skończyłem na tym, że arkusz stoi, działa i może komuś zaoszczędzi tydzień. Napisałem to z pewnością siebie człowieka, który właśnie zafitował szesnaście krzywych i ani razu nie sprawdził żadnej z nich na maszynie.

Potem instalacja pojechała dalej beze mnie. Sześć tygodni, szesnaście dni prób, trzy paliwa, od pelletu przez odpad kawowy po RDF. Wróciło do mnie kilkaset wierszy logu operatorskiego — godziny, wagi tacek, nastawy falownika i komentarze w rodzaju „nic nie leci nic się nie dzieje". Czyli dokładnie to, czego model nigdy nie widział na oczy.

Usiadłem i skonfrontowałem jedno z drugim. Poniżej co z tego wyszło, łącznie z rzeczami, o których wolałbym nie pisać.

## 1. Dobra wiadomość: struktura wzoru się obroniła

Model przepływu ma postać, którą można wyprowadzić na serwetce:

> **ṁ = ρ · ψ · A · S · n · DC**

Gęstość razy napełnienie razy pole pierścienia razy skok zwoju razy obroty razy procent czasu pracy. Nic wyrafinowanego. Pytanie brzmiało: czy ta serwetka opisuje **tę** maszynę.

Metoda sprawdzenia jest brutalnie prosta. Dla każdej próby wiem, ile kilogramów wsypano i ile godzin trwało podawanie — czyli znam rzeczywiste ṁ. Znam też Hz i duty cycle. Odwracam wzór i pytam: jakie musiałoby być ψ, żeby model się zgodził? Robię tak piętnaście razy i patrzę na kolumnę wyników.

I ta kolumna jest płaska. ψ = 0,39–0,57, średnio 0,49, rozrzut ±18% — **mimo że Hz zmieniało się od 4 do 6, a duty cycle od 50% do 100%**.

To jest cały wynik i warto się chwilę nad nim zatrzymać, bo łatwo go zignorować jako nudny. Gdyby zależność przepływu od obrotów była postawiona źle — gdyby ślimak przy wyższych obrotach nie nadążał się napełniać — ψ spadałoby systematycznie wraz z Hz. Gdyby duty cycle działał inaczej niż liniowo, ψ rozjechałoby się wzdłuż tej kolumny. Nie rozjeżdża się w żadną stronę. Zły jest **jeden współczynnik**, a nie kształt równania.

Niezależnie potwierdził się też czas przebywania, `t_res = L / (S · n · DC)`. Znacznikiem był moment, w którym operator zapisywał „słychać pierwszy pelet". Cztery takie punkty, błąd od −23% do +10%, przy czym model rozróżnia przypadki różniące się dwukrotnie (24,7 vs 49,5 min) i robi to poprawnie. Systematycznie zaniża o jakieś 9%, co akurat jest zdrowe — droga materiału do beczki jest odrobinę dłuższa niż sam izolowany odcinek 1550 mm.

Ten test jest cenniejszy niż wygląda, bo `t_res` **nie zależy ani od gęstości, ani od ψ**. To czysta kinematyka. Więc potwierdza przełożenie, skok zwoju i napęd całkowicie niezależnie od tego, co się zaraz okaże o napełnieniu.

## 2. Zła wiadomość: ψ było dwa razy za małe

W arkuszu domyślne napełnienie wynosiło 0,25. W poprzednim artykule napisałem nawet, w co wierzyłem szczerze, że „można upchać do około 40–45% zanim ślimak zacznie się dławić" i że „optymalne zwykle 0,20–0,30".

Maszyna pracowała przez sześć tygodni w okolicach 0,49 i nie zadławiła się ani razu.

Konsekwencja praktyczna była taka, że model **zaniżał przerób o 36–56% w każdej jednej próbie**. Nie losowo — konsekwentnie, w tę samą stronę, o mniej-więcej ten sam czynnik. Po wpisaniu ψ = 0,50 średni błąd bezwzględny spada do 9,7%, a po rozbiciu na paliwa poniżej 10% na wszystkich piętnastu próbach.

Jest przy tym subtelność, którą trzeba powiedzieć głośno, bo inaczej ta kalibracja zostanie źle użyta: **z prób da się wyznaczyć wyłącznie iloczyn ρ·ψ, nigdy ψ osobno.** Gęstość nasypowa i napełnienie wchodzą do wzoru jako iloczyn i nic ich nie rozdzieli poza zważeniem gęstości faktycznie użytej partii — czego w trakcie tych prób nikt nie zrobił. Jeśli więc w bazie gęstość jest nietrafiona (a przy „kawie" niemal na pewno jest, bo w bazie siedzi kawa ziarnista do picia, a testy wyglądają na odpad kawowy), to cały błąd wyląduje w ψ. Modelowi to nie przeszkadza, bo i tak liczy iloczyn. Przeszkadza za to każdemu, kto weźmie te 0,50 i uzna je za wielkość geometryczną.

A jest jeszcze hipoteza, której z danych nie da się rozstrzygnąć. Pole pierścienia liczę z wewnętrznej średnicy rury — 117 mm. W tabeli sprzętu figuruje jednak, opisana jako informacyjna, „średnica zewnętrzna spirali 90 mm". Pierścień 90/40 jest **1,86× mniejszy** od tego, którym liczę. Po przeliczeniu na pole zwoju ψ wychodzi 0,79–1,06, czyli zwoje pracują praktycznie pełne — co dla ślimaka zasypywanego pod korek z rury sterowanej kamertonem jest zupełnie sensowne.

Czyli albo ślimak Ø90 kręci się w rurze Ø117 i te 13,5 mm luzu promieniowego to strefa martwa, albo liczby w tabeli sprzętu nie opisują tej samej rury. Rozstrzyga to suwmiarka, nie arkusz. W nowej wersji jest na to przełącznik i zdanie napisane wersalikami.

## 3. Bramka, która nie mogła zapalić się na zielono

Tu robi się nieprzyjemnie.

Instrukcja w arkuszu, w KROKU 3, brzmiała: *„wybierz wiersz z OK = ✓"*. Tabela ma sto jeden wierszy, od 0 do 50 Hz, a kolumna „OK?" miała podpowiadać, które nastawy mają sens. Sprawdziłem, ile wierszy pokazuje ✓ na ustawieniach, z którymi plik był zapisany.

Zero.

Nie „mało". Zero. Osiemdziesiąt sześć wierszy „grzanie za długie", dziesięć „za wysoka Hz", cztery poza zakresem. Instrukcja była niewykonalna od momentu otwarcia pliku.

Powód jest algebraiczny i wymaga jednego zastrzeżenia, bo bez niego brzmi jak bzdura.

Intuicja mówi — całkiem słusznie — że więcej herców to szybciej kręcący się ślimak, więc materiał siedzi w rurze krócej. I dokładnie tak jest, **dopóki duty cycle zostaje ten sam**. Zakładka „Kalkulator", w której Hz oraz T_on i T_off wpisuje się z palca, pokazuje to wprost: 4 Hz przy pracy ciągłej daje 23,7 minuty, 8 Hz daje 11,8. Połowa obrotów, podwójny czas. Żadnej magii.

Tabela w Solverze pracuje jednak pod dodatkowym warunkiem, którego łatwo nie zauważyć: **wsad w kilogramach na godzinę jest w niej ustalony z góry**, bo wynika z tego, ile karbonizatu chcesz mieć na wyjściu. Duty cycle nie jest tam wpisywany — jest wyliczany tak, żeby przy danym Hz dowieźć dokładnie ten wsad:

```
DC = wsad / (ρ · ψ · A · S · n · 60)
```

A kolumna kontrolna liczy czas grzania:

```
t = L / (S · n · DC)
```

Podstaw jedno w drugie. **Obroty się skracają:**

```
t = ρ · ψ · V_strefy / wsad · 60
```

I na tym polega pułapka: **przy ustalonym wsadzie** czas przebywania przestaje zależeć od częstotliwości. Podnosząc Hz faktycznie przyspieszasz ślimak — ale arkusz w tej samej chwili proporcjonalnie skraca duty cycle, żeby przerób się zgadzał, i te dwie rzeczy znoszą się co do joty. Szybszy ślimak pracujący odpowiednio krócej przesuwa materiał dokładnie tak samo wolno. We wszystkich stu jeden wierszach tabeli stoi ta sama liczba: przy 4 Hz i przy 50 Hz identyczne 43,56 minuty.

Warto to sobie ułożyć w głowie w tej kolejności, bo pomylenie jednego z drugim kosztuje potem godziny przy panelu: **Hz sam z siebie zmienia czas przebywania. Hz przy trzymanym przerobie — nie.**

Więc bramka nie była „nieczuła" ani „źle wyskalowana". Była zero-jedynkowa dla całej tabeli naraz: albo wszystkie osiemdziesiąt osiem wierszy jest zielone, albo żaden. Przy domyślnych ustawieniach wypadło „żaden".

To nie jest błąd fizyki — fizyka jest poprawna. To **przeparametryzowanie interfejsu**. Napełnienie, cel czasu grzania i cel produkcji wyznaczają `t_res` jednoznacznie, a arkusz uprzejmie pozwalał wpisać wszystkie trzy niezależnie i potem dziwił się sprzecznością. Co gorsza, sam sobie to mówił: obok była komórka „trzeba mieć takie napełnienie", która pokazywała rozjazd. Tylko cicho, z boku, zamiast zablokować.

Morał, którego nie da się ładnie opakować: **arkusz przeszedł przegląd wzorów i nie przeszedł przeglądu tego, co widzi użytkownik po otwarciu pliku.** Sprawdziłem, czy każda formuła liczy to, co ma liczyć. Nie sprawdziłem, czy złożenie tych formuł potrafi kiedykolwiek dać odpowiedź „tak".

## 4. RDF, czyli gdzie model po prostu kłamie

Uzysk `Y(T)` opisuję krzywą z trzema parametrami — asymptota, zakres i tempo zaniku. Dla kawy sprawdziła się zaskakująco dobrze: model dawał 22,5% przy 600 °C wobec zmierzonych 23,7–27,8%. Myli się o 1–5 punktów procentowych i myli się **w bezpieczną stronę**, czyli obiecuje mniej produktu niż faktycznie wypada. Dla pelletu zaniża o 6–10 pp, ale z jasnego powodu: karmi się temperaturą grzałek, a materiał jest znacznie chłodniejszy. Grzałki 300 °C to termopara materiału na 215 °C, czyli realnie sama toryfikacja — i log to wprost potwierdza wpisem „z karbonizatu na toryfikat, z czarnego na brązowy".

Dla RDF model kłamie.

Parametry z bazy dawały krzywą praktycznie płaską: 50,6% przy 500 °C i 50,1% przy 550 °C. Rzeczywistość: 45–46% przy 500 °C, czyli nieźle, i **26–36% przy 550 °C**. Na pełnym bilansie z 15 lipca — zważony cały uzysk z beczek, nie tacka — wyszło 26,4% przy modelowych 50,1%. Prawie dwadzieścia cztery punkty procentowe pudła.

Przefitowałem te parametry do czterech prób i tu muszę powiedzieć rzecz, która psuje ładne zakończenie: **jednoeksponencjalna krzywa nie jest w stanie tego opisać.** Spadek z 45,7% do 30,6% na przestrzeni pięćdziesięciu stopni jest tak stromy, że każdy fit przechodzący dokładnie przez oba punkty daje przy 300 °C uzysk rzędu czterystu procent. Co jest, delikatnie mówiąc, niefizyczne.

Najlepszy kompromis, jaki wyciągnąłem przy sensownym zachowaniu na całym zakresie, ma błąd −6,4 pp przy 500 °C i +3,0 pp przy 550 °C. To wciąż trzy razy lepiej niż +23,7 pp, ale to jest łatka, nie rozwiązanie. Rozwiązaniem jest kinetyka dwustopniowa, którą obiecywałem sobie w poprzednim artykule i której dalej nie napisałem. Tym razem przynajmniej wiem, po co jest potrzebna.

W arkuszu wiersz RDF ma teraz notatkę o błędzie ±6 pp i o tym, że powyżej 600 °C to już ekstrapolacja. Bo drugą rzeczą, którą te próby pokazały, jest to, że RDF z jednego śmietnika naprawdę nie jest RDF z drugiego.

## 5. Czego model nadal nie wie

Trzy rzeczy, o których wolę uprzedzić, niż udawać, że ich nie ma.

**Czas przebywania wpływa na uzysk, a model tego nie widzi.** Pięć prób kawy przy identycznej temperaturze 600 °C, różniących się tylko czasem w strefie: 49,5 min → 24,8%, potem 32,1 min → 23,7%, aż do 16,5 min → 27,8%. Poniżej mniej-więcej dwudziestu pięciu minut uzysk zaczyna rosnąć, bo materiał zwyczajnie nie zdąża się przereagować. Efekt jest rzędu 3–4 pp, więc nie jest krytyczny — ale przy skracaniu czasu poniżej kwadransa model przestaje być wiarygodny i tyle jest teraz napisane w stopce.

**Czasu wygaszania instalacji nie umie liczyć w ogóle.** Od komendy „stop podawania" do pustej beczki mijało 86–121 minut przy modelowych 25–50. Rozjazd jest systematyczny i wynika z tego, że za strefą grzaną jest jeszcze chłodnica, rura zsypowa i sama beczka, których model nie zna. Do planowania końca zmiany się nie nadaje.

**Zwalidowane jest 4–6 Hz, a tabela idzie do 50.** Trzy paliwa z szesnastu w bazie. Pozostałe trzynaście wierszy to nadal czysta literatura, bez ani jednego punktu pomiarowego. Tryb B — cykl liczony z liczby obrotów — nie został użyty ani razu.

To ostatnie doprowadziło do jedynej zmiany w arkuszu, która komuś realnie popsuje humor: wiersze powyżej 10 Hz są teraz oznaczone jako „poza walidacją". Osiemdziesiąt wierszy ostrzeżenia na sto jeden. Wygląda paskudnie i taki jest zamiar — to jest uczciwy obraz tego, ile z tej tabeli faktycznie wiadomo.

## Co poszło do wersji drugiej

Skrótowo, dla porządku: napełnienie skalibrowane per paliwo (pellet 0,40, kawa 0,50, RDF 0,44) i wpisane do bazy paliw jako osobna kolumna; obroty silnika poprawione ze znamionowych na synchroniczne, bo przy tak lekkim obciążeniu poślizgu praktycznie nie ma; bramka „OK ✓" przebudowana tak, żeby odpowiadała na pytanie, na które tabela Hz **potrafi** odpowiedzieć — przy jakiej częstotliwości zmieszczę się z sensownym duty cycle — a czas grzania pokazywany jako jedna liczba nad tabelą, z adnotacją, że przy trzymanym wsadzie herców się nim nie ruszy; próg fałszywego alarmu przy kalibracji przesunięty z 0,45 na 0,75, bo w starej wersji dziesięć na piętnaście realnych prób wywoływałoby ostrzeżenie; przełącznik pola przekroju między rurą a obrysem spirali, czekający na suwmiarkę.

I domyślne wartości, z którymi plik się otwiera, to teraz nie wymyślony buk przy jednym kilogramie na godzinę, tylko odtworzona próba kawowa z czerwca. Otwierasz i widzisz nastawy, o których wiadomo, że działały.

## Tak więc

Z całej tej historii najbardziej zapadło mi w pamięć nie to, że ψ było dwa razy za małe. Współczynnik to współczynnik, od tego jest kalibracja i sam arkusz miał na nią osobną zakładkę.

Zapadła mi bramka, która nie mogła się zapalić. Bo tam nie było błędu w żadnej formule — każda z osobna liczyła dokładnie to, co miała liczyć. Błąd polegał na tym, że złożenie dwóch poprawnych formuł dawało tożsamość, a interfejs prosił użytkownika o trzy liczby, z których wystarczały dwie. Żaden przegląd wzorów tego nie łapie. Łapie to jedno pytanie, którego sobie nie zadałem: *czy przy ustawieniach, z jakimi ten plik komuś wyjdzie, da się w ogóle wykonać instrukcję, którą sam napisałem?*

Szesnaście dni czyjejś cierpliwości przy panelu, żeby się tego dowiedzieć. Warto było — ale wolę, żeby następnym razem wystarczyło pięć minut przed wysłaniem pliku.

*Poprzednia część: [Excel jako podajnik ślimakowy](/pl/knowledge/excel-jako-podajnik-slimakowy) — o tym, skąd się ten arkusz wziął i dlaczego napełnienie ślimaka nie jest cechą sprzętu.*
