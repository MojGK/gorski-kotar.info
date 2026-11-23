---
layout: default
title: Promet i ceste
permalink: /promet/
sidebar: true
description: Vijesti o cestama, zimskoj službi, zatvorenim dionicama i autobusnim linijama u Gorskom kotaru, uz službene poveznice.
---
{%- comment -%}
Popis članaka označenih vrstom, kategorijom ili oznakom Promet / promet.
Službene poveznice dolaze iz _data/promet.yml.
{%- endcomment -%}
{%- assign pr_data = site.data.promet -%}
{%- assign pr_posts = "" | split: "" -%}
{%- for p in site.posts -%}
  {%- if p.type == "Promet" or p.categories contains "Promet" or p.tags contains "promet" -%}
    {%- assign pr_posts = pr_posts | push: p -%}
  {%- endif -%}
{%- endfor -%}
{%- assign pr_azur = pr_data.azurirano -%}
{%- if pr_posts.size > 0 -%}
  {%- assign pr_zadnji = pr_posts.first.azurirano | default: pr_posts.first.date -%}
  {%- assign pr_azur = pr_zadnji -%}
{%- endif -%}
<div class="history-page zaposlenje-page promet-page">
  <h1><span aria-hidden="true">🚗</span> Promet i ceste</h1>
  <p class="intro">Vijesti o cestama, zimskoj službi, zatvorenim dionicama i autobusnim linijama u Gorskom kotaru. Ispod su službene poveznice za trenutno stanje na cestama, zatim naši članci, najnoviji prvi.</p>
  {% if pr_azur %}<p class="zivi-azurirano">Ažurirano: <time datetime="{{ pr_azur | date: '%Y-%m-%d' }}">{{ pr_azur | date: "%-d. %-m. %Y." }}</time></p>{% endif %}
  {%- if pr_data.poveznice %}
  <div class="post-content">
    <div class="job-highlights sluzbeni-okvir">
      <p class="job-hl-title">Službene informacije</p>
      <ul>
        {%- for l in pr_data.poveznice %}
        <li><a href="{{ l.url }}" target="_blank" rel="noopener">{{ l.naziv }}</a></li>
        {%- endfor %}
      </ul>
    </div>
  </div>
  {%- endif %}
  {% if pr_posts.size > 0 %}
  <h2 class="section-title">Najnovije vijesti</h2>
  <ul class="zap-older">
    {%- for post in pr_posts %}
    <li><a href="{{ post.url | relative_url }}">{{ post.title }}</a> <span class="meta">{% include datum.html date=post.date show_time=false %}</span></li>
    {%- endfor %}
  </ul>
  {% else %}
  <p class="zb-empty">Trenutno nema članaka u ovoj rubrici.</p>
  {% endif %}
</div>
