---
layout: default
title: Promet i ceste
permalink: /promet/
sidebar: true
description: Vijesti o cestama, zimskoj službi, zatvorenim dionicama i autobusnim linijama u Gorskom kotaru, uz službene poveznice.
---
{%- comment -%}
Popis članaka označenih vrstom, kategorijom ili oznakom Promet / promet.
{%- endcomment -%}
{%- assign pr_posts = "" | split: "" -%}
{%- for p in site.posts -%}
  {%- if p.type == "Promet" or p.categories contains "Promet" or p.tags contains "promet" -%}
    {%- assign pr_posts = pr_posts | push: p -%}
  {%- endif -%}
{%- endfor -%}
<div class="history-page promet-page">
  <h1>Promet i ceste</h1>
  <p class="intro">Vijesti o cestama, zimskoj službi, zatvorenim dionicama i autobusnim linijama u Gorskom kotaru. Ispod su službene poveznice za trenutno stanje na cestama, zatim naši članci, najnoviji prvi.</p>
  <div class="sluzbeni-okvir">
    <h2>Službene informacije</h2>
    <ul>
      <li><a href="https://www.hak.hr/info/stanje-na-cestama/" target="_blank" rel="noopener">HAK – stanje na cestama</a></li>
      <li><a href="https://www.hac.hr/hr/servisne-informacije/stanje-na-autocestama" target="_blank" rel="noopener">HAC – stanje na autocestama</a></li>
      <li><a href="https://meteo.hr/naslovnica-upozorenja-zupanije.php" target="_blank" rel="noopener">DHMZ – upozorenja po županijama</a></li>
      <li><a href="https://www.autotrans.hr/" target="_blank" rel="noopener">Autotrans / Arriva – vozni redovi</a></li>
    </ul>
  </div>
  {% if pr_posts.size > 0 %}
  {% include clanci-lista.html posts=pr_posts id="pr" po=10 %}
  {% else %}
  <p>Trenutno nema članaka u ovoj rubrici.</p>
  {% endif %}
</div>
