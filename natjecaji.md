---
layout: default
title: Natječaji i potpore
permalink: /natjecaji/
sidebar: true
description: Otvoreni natječaji, stipendije i potpore važni za Gorski kotar – rokovi, iznosi i poveznice na službene izvore.
---
{%- comment -%}
Živi popis iz _data/natjecaji.yml (upute: _data/README-zaposlenje-dogadjanja.md).
Istekle stavke se ne prikazuju (pri izradi stranice prema site.time, a u pregledniku i JS-om).
Povezani članci biraju se oznakom (tag) natjecaji.
{%- endcomment -%}
{%- assign nj_data = site.data.natjecaji -%}
{%- assign nj_posts = "" | split: "" -%}
{%- for p in site.posts -%}{%- if p.tags contains "natjecaji" -%}{%- assign nj_posts = nj_posts | push: p -%}{%- endif -%}{%- endfor -%}
<div class="history-page natjecaji-page">
  <h1>Natječaji i potpore</h1>
  <p class="intro">Otvoreni natječaji, stipendije i potpore važni za Gorski kotar, poredani po roku. Svaka kartica vodi na naš članak i na službeni izvor. Stavke kojima je rok prošao automatski nestaju s popisa.</p>
  {% if nj_data.azurirano %}<p class="zivi-azurirano">Ažurirano: <time datetime="{{ nj_data.azurirano | date: '%Y-%m-%d' }}">{{ nj_data.azurirano | date: "%-d. %-m. %Y." }}</time></p>{% endif %}
  <div class="post-content zivi-wrap">{% include natjecaji-lista.html stavke=nj_data.natjecaji zivo=true prazno="Trenutno nema otvorenih natječaja i potpora." %}</div>
  <p class="zivi-napomena">Imate otvoreni natječaj, stipendiju ili potporu za Gorski kotar? Javite nam se.</p>
  {% if nj_posts.size > 0 %}
  <h2 class="section-title">Povezani članci</h2>
  {% include clanci-lista.html posts=nj_posts id="nj" po=10 %}
  {% endif %}
</div>
{% include zivi-filter-js.html %}
