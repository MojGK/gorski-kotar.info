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
date: 2026-10-22
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

### Kategorije

- `location` – jedno mjesto: Delnice, Fužine, Lokve, Mrkopalj, Čabar, Skrad, Ravna Gora, Vrbovsko ili Gorski kotar (za cijelu regiju).
- `type` – jedna vrsta: Događanja, Crna kronika, Sport, Priroda, Promet, Kultura ili Zanimljivosti.
- `categories` – uvijek `[location, type]`, istim redom i istim nazivima.
- Nazivi moraju točno odgovarati popisu u `_data/kategorije.yml` (s dijakriticima). Novo mjesto ili vrstu dodaj u tu datoteku (`name` + `slug` bez dijakritika) i odmah će se pojaviti u filterima, bočnoj traci i na stranici `/kategorije/`.

Nakon pusha na GitHub, stranica se automatski ažurira.
