# Zaposlenje i Događanja – živi popisi (upute za Novinara)

Stranice **/zaposlenje/** i **/dogadaji/**, blokovi na naslovnici i **/kalendar/** pune se iz `_data/poslovi.yml` i `_data/dogadjanja.yml`. Stranica **/natjecaji/** puni se iz `_data/natjecaji.yml`.

- `_data/poslovi.yml` – oglasi za posao
- `_data/dogadjanja.yml` – najave događaja
- `_data/natjecaji.yml` – otvoreni natječaji, stipendije i potpore
- `_data/promet.yml` – službene poveznice za ceste (HAK, HAC, DHMZ, Autotrans), sada na /radar/
- `_data/radar.yml` – poveznice, isključenja i servisne obavijesti za /radar/

Za novi oglas ili događaj **ne pišeš članak**: dodaš stavku u datoteku, promijeniš `azurirano:` na današnji datum i objaviš (commit + push).
Stranica se uz to sama ponovno izgradi svaki dan u 05:00 (GitHub Actions „Dnevna izrada stranice”), pa istekli oglasi i prošli događaji nestanu i bez objave.

## Pravila za oba popisa

- Datumi uvijek kao `GGGG-MM-DD` (npr. `2026-11-15`).
- Tekst s dvotočkom, navodnicima ili `#` stavi u navodnike: `vrijeme: "17:00"`.
- Uvlačenje razmacima (2 razmaka), nikad tabulatorom. Svaka stavka počinje s `- `.
- Redoslijed u datoteci nije bitan – stranica sama slaže po roku/datumu.
- Istekle stavke **ne moraš** brisati odmah (same se skrivaju), ali jednom tjedno počisti sve starije od tjedan dana da datoteka ostane pregledna.
- Promo pravila vrijede i ovdje: bez cijena i privatnih kontakata u opisu; izvor uvijek kao poveznica.

## Oglas za posao (`_data/poslovi.yml`, pod `oglasi:`)

```yaml
- poslodavac: "Lokve d.o.o."               # obavezno
  pozicija: "Radnik / radnica u pilani"     # obavezno
  mjesto: "Lokve"                           # obavezno – kako piše u oglasu
  grad: "Lokve"                             # neobavezno – općina/grad za filter, ako `mjesto` ima dodatke
                                            #   (npr. mjesto "Plešce (Čabar)" → grad "Čabar")
  rok: 2026-11-15                           # GGGG-MM-DD ili tekst u navodnicima ("do popune")
  broj: 1                                   # neobavezno – broj radnika
  vrsta: "određeno, puno radno vrijeme"     # neobavezno – ugovor / uvjeti
  opis: "Kratka rečenica."                  # neobavezno
  izdvojeno: true                           # neobavezno – ide u blok na naslovnici (najviše 2 se vide)
  izvori:                                   # barem jedan; prvi je gumb „Više / prijava”
    - naziv: "HZZ"
      url: "https://burzarada.hzz.hr/..."
```

- Oglas nestaje dan nakon roka. Oglas s rokom "do popune" ostaje dok ga ne obrišeš – provjeri ga svaki tjedan.

## Događaj (`_data/dogadjanja.yml`, pod `dogadjaji:`)

```yaml
- naziv: "Noć špilja u Lokvama"             # obavezno
  datum: 2026-11-07                         # obavezno – prvi dan
  datum_do: 2026-11-08                      # neobavezno – zadnji dan višednevnog događaja
  vrijeme: "17:00"                          # neobavezno – "17:00", "16–22 h"; prazno = „nije objavljeno”
  mjesto: "DKC „Žaba”, Lokve"               # obavezno
  grad: "Lokve"                             # neobavezno – za filter, ako `mjesto` ima adresu ili dodatke
  organizator: "Općina Lokve"               # neobavezno
  opis: "Kratka rečenica."                  # neobavezno
  link: /noc-spilja-lokve-2026/             # neobavezno – naš članak (/slug/) ili vanjski URL (https://...)
```

- Događaj nestaje s /dogadaji/ i naslovnice dan nakon `datum_do` (ili `datum`). U kalendaru ostaje pod „Prikaži prošla događanja” dok ga ne obrišeš.
- Kad za veći događaj pišeš i **članak** (s `event_date`), dodaj ga i ovdje s `link: /slug-clanka/` – kalendar neće prikazati duplikat.

## Tjedni pregled (neobavezno)

Kratki tjedni članak (npr. ponedjeljkom) s 3–5 izdvojenih stavki i poveznicom na /zaposlenje/ ili /dogadaji/ i dalje je dobrodošao za Facebook, RSS i arhivu. Stari tjedni pregledi ostaju na istim adresama kao arhiva.


## Natječaj ili potpora (`_data/natjecaji.yml`, pod `natjecaji:`)

```yaml
- naziv: "Natječaj za stipendije 2026./2027."  # obavezno
  raspisivac: "Primorsko-goranska županija"    # obavezno
  za_koga: "Učenici i studenti"                # obavezno
  iznos: "250 eura mjesečno"                   # neobavezno – ako je poznat
  rok: 2026-12-01                              # obavezno – GGGG-MM-DD
  rok_napomena: "do 23:59"                     # neobavezno – sat ili način predaje
  grad: "PGŽ"                                  # neobavezno – za filter po mjestu
  opis: "Kratka napomena."                     # neobavezno
  clanak: /slug-naseg-clanka/                  # obavezno – permalink našeg članka
  izvor:                                       # obavezno – službena stranica
    naziv: "PGŽ"
    url: "https://www.pgz.hr/..."
```

- Stavka nestaje s /natjecaji/ dan nakon roka (ista logika kao oglasi: `site.time`, skriva se ako je `rok` strogo prije dana izrade). Dnevna izrada u 05:00 to odradi i bez nove objave.
- U popis ide samo **otvoreni** natječaj ili potpora s provjerenim rokom iz članka. Savjetovanja, već dodijeljene stipendije i natječaji na koje se javlja jedinica, a ne čitatelj, ne idu ovdje.
- Članak ostaje na postojećoj adresi; u front matter dodaj `tags: [natjecaji]` (bez promjene `date`, URL-a ili `type`), da se pojavi i pod „Povezani članci”.
- Jednom tjedno počisti stavke starije od tjedan dana.

## Promet i Goranski radar (`/radar/`, stara adresa `/promet/` preusmjerava ovamo)

Stranica **/radar/** (Goranski radar) okuplja vrijeme, ceste, struju i servisne obavijesti. Članci o cestama i dalje se prepoznaju po `type: Promet`, kategoriji Promet ili oznaci `tags: [promet]`. Službene poveznice za ceste ostaju u `_data/promet.yml`; isključenja, poveznice za DHMZ/HEP i servisne obavijesti idu u `_data/radar.yml`.

- Novi članak o cestama, zimskoj službi, zatvorenim dionicama ili autobusnim linijama označi s `type: Promet` i/ili `tags: [promet]`. Ako članak mora ostati u drugoj vrsti (npr. Aktualno), dodaj samo `tags: [promet]` i po potrebi Promet u `categories`, bez promjene datuma i URL-a.
- Oznaka vrste Promet u članku vodi na `/radar/`, a ne na stranicu kategorije.
- Najavljena isključenja (`iskljucenja:`): `mjesto`, `opis`, `datum` (GGGG-MM-DD), `vrijeme`, `vrsta`, `izvor`. Stavka se skriva dan nakon `datum`. Ako je popis prazan (ili su svi datumi prošli), ispisuje se „Trenutno nema najavljenih isključenja” i datum zadnje provjere (`provjereno`).
- Servisne obavijesti (`obavijesti:`): vodovod, zimska služba, otpad i sl. (`naslov`/`vrsta`, `mjesto`, `opis`, `datum`, `datum_do`, `izvor`, `izvor_url`). Ista logika skrivanja i ista napomena kad je prazno. Ništa se ne tvrdi kao „uživo”.

Na naslovnici, odmah ispod glavne vijesti, stoji blok **Servisi za građane** (kartice Događanja, Poslovi, Natječaji, Goranski radar). Ispod kartica ostaje blok Događanja (nadolazeće stavke, poveznica **Sve →**). Blokovi Zaposlenje, Natječaji i Promet s naslovnice su uklonjeni; stranice /zaposlenje/, /natjecaji/ i /radar/ i pripadajuće YAML datoteke ostaju.

Ispod zaglavlja idu dvije trake (na desktopu i na mobitelu, svaka se na uskom zaslonu pomiče vodoravno): vijesti (blokovi naslovnice) i mjesta. Smeđa servisna traka uklonjena je jer iste rubrike sada otvaraju kartice Servisi za građane. Stranica /kategorije/ i stavka Kategorije u izborniku ostaju. U izborniku je Goranski radar (/radar/); /promet/ preusmjerava na /radar/.
