# Moj Gorski Kotar

Osobni blog o ljepoti, životu i događajima u Gorskom kotaru.

## Kako objaviti na GitHub Pages

1. Napravi novi public repozitorij na GitHubu (npr. `moj-gorski-kotar`).
2. Uploadaj sve datoteke iz ove mape u root repozitorija.
3. U Settings → Pages odaberi branch `main` i folder `/ (root)`.
4. Stranica će biti dostupna na `https://tvoje-ime.github.io/moj-gorski-kotar`.

## Kako botovi dodaju članke

Novi članci se dodaju kao Markdown datoteke u mapu `_posts/` u formatu:

```
YYYY-MM-DD-naslov-clanka.md
```

Primjer:

```markdown
---
layout: post
title: Naslov članka
date: 2026-10-22 11:40:00 +0200
location: Delnice
type: Događanja
categories: [Delnice, Događanja]
excerpt: Kratki opis...
image: /assets/images/naziv-slike.jpg
image_alt: "Opis slike"
image_credit: "Fotografija: Autor / [Izvor](https://...), licenca"
source: "[Naziv izvora](https://...)"
---

Tekst članka...
```

### Datum i vrijeme

- Za svaki novi članak **uvijek upiši stvarno vrijeme objave** sa zonom: `date: YYYY-MM-DD HH:MM:SS +0200` (ljeti, CEST) ili `+0100` (zimi, CET). Dan mora odgovarati datumu u nazivu datoteke. Ne izmišljaj vrijeme.
- Prikazuje se kao „22. 10. 2026. u 11:40“, a u traci „Najnovije“ samo „11:40“ ako je objavljeno danas.
- Stariji članci bez poznatog vremena imaju samo datum (`date: YYYY-MM-DD`) i `show_time: false` – za njih se prikazuje samo „18. 10. 2026.“ (u traci „18. 10.“). Isto vrijedi za svaki datum s vremenom 00:00:00.
- Vrijeme ne smije biti u budućnosti – Jekyll inače preskače članak dok to vrijeme ne prođe.
- Glavni članak na naslovnici je najnoviji; za ručni odabir dodaj `featured: true` (samo jednom članku).

### Kategorije

- `location` – jedno mjesto: Delnice, Fužine, Lokve, Mrkopalj, Čabar, Skrad, Ravna Gora, Vrbovsko ili Gorski kotar (za cijelu regiju).
- `type` – jedna vrsta: Događanja, Crna kronika, Sport, Priroda, Promet, Kultura ili Zanimljivosti.
- `categories` – uvijek `[location, type]`, istim redom i istim nazivima.
- Nazivi moraju točno odgovarati popisu u `_data/kategorije.yml` (s dijakriticima). Novo mjesto ili vrstu dodaj u tu datoteku (`name` + `slug` bez dijakritika) i odmah će se pojaviti u filterima, bočnoj traci i na stranici `/kategorije/`.

Nakon pusha na GitHub, stranica se automatski ažurira.
