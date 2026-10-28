---
layout: default
title: Vijesti
permalink: /vijesti/
sidebar: true
description: "Opće vijesti iz Gorskog kotara: društvo, kultura, promet i priroda."
---
{%- comment -%} Popis za blok VIJESTI na mobilnoj naslovnici: sve vrste koje nisu u drugim blokovima (naslovnica_blokovi s `vrste`) i nisu Zaposlenje. {%- endcomment -%}
{%- assign vj_pokrivene = "," -%}
{%- for b in site.data.kategorije.naslovnica_blokovi -%}{%- for v in b.vrste -%}{%- assign vj_pokrivene = vj_pokrivene | append: v | append: "," -%}{%- endfor -%}{%- endfor -%}
<div class="history-page">
<h1>Vijesti</h1>
<p class="intro">Opće vijesti iz Gorskog kotara – društvo, kultura, promet, priroda i ostalo. Općinske vijesti, zanimljivosti, događanja, sport, crna kronika i povijest imaju svoje rubrike na <a href="{{ '/kategorije/' | relative_url }}">stranici kategorija</a>.</p>
<div class="posts-grid" id="vijesti-popis">
{%- for post in site.posts -%}
  {%- if post.type == "Zaposlenje" -%}{%- continue -%}{%- endif -%}
  {%- assign vj_k = "," | append: post.type | append: "," -%}
  {%- if vj_pokrivene contains vj_k -%}{%- continue -%}{%- endif -%}
  {%- assign c_loc = site.data.kategorije.lokacije | where: "name", post.location | first -%}
  {%- assign c_type = site.data.kategorije.vrste | where: "name", post.type | first %}
  <article class="post-card">
    <a href="{{ post.url | relative_url }}" class="card-thumb{% unless post.image %} no-img{% endunless %}" tabindex="-1" aria-hidden="true">
      {% if post.image %}<img src="{{ post.image | relative_url }}" alt="" loading="lazy">{% else %}<span class="card-ph">🌲</span>{% endif %}
      <span class="card-badges">{% include prijelomna-oznaka.html post=post %}{% if c_type %}<span class="card-badge t-{{ c_type.slug }}">{{ c_type.name }}</span>{% endif %}</span>
    </a>
    <div class="content">
      <h3><a href="{{ post.url | relative_url }}">{{ post.title }}</a></h3>
      <div class="card-meta">
        {%- if c_loc %}<a class="card-loc" href="{{ '/kategorije/' | relative_url }}#{{ c_loc.slug }}">📍 {{ c_loc.name }}</a>{% endif -%}
        <span class="card-date">{% include datum.html date=post.date show_time=post.show_time %}</span>
      </div>
      <p>{{ post.excerpt | strip_html | strip | truncate: 120 }}</p>
    </div>
  </article>
{%- endfor %}
</div>
</div>
