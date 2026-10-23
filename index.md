---
layout: default
title: Početna
---

{% assign hero = site.posts.first %}
<div class="hero">
  <div class="hero-content">
    <h1>{{ hero.title }}</h1>
    <p>{{ hero.excerpt | strip_html }}</p>
    <p><a href="{{ hero.url | relative_url }}" style="color: var(--green); font-weight: 600;">Pročitaj više →</a></p>
  </div>
  {% if hero.image %}
  <figure class="hero-figure">
    <img src="{{ hero.image | relative_url }}" alt="{{ hero.image_alt | default: hero.title | escape }}">
    {% if hero.image_credit %}<figcaption>{{ hero.image_credit | markdownify | remove: '<p>' | remove: '</p>' | strip }}</figcaption>{% endif %}
  </figure>
  {% endif %}
</div>

<h2>Nedavni objavi</h2>
<div class="posts-grid">
  {% for post in site.posts limit: 12 %}
  <article class="post-card">
    {% if post.image %}
      <a href="{{ post.url | relative_url }}" class="card-thumb"><img src="{{ post.image | relative_url }}" alt="{{ post.image_alt | default: post.title | escape }}" loading="lazy"></a>
    {% endif %}
    <div class="content">
      <div class="meta">{{ post.date | date: "%d. %m. %Y." }} · {{ post.category | default: "Događaji" }}</div>
      <h3><a href="{{ post.url | relative_url }}">{{ post.title }}</a></h3>
      <p>{{ post.excerpt | strip_html | truncate: 120 }}</p>
    </div>
  </article>
  {% endfor %}
</div>

<div class="sidebar">
  <h3>O blogu</h3>
  <p>Osobni blog o ljepoti, životu i događajima u Gorskom kotaru. Pišem o onome što vidim, čujem i doživim u našem kraju.</p>
  <div class="ad-placeholder">Prostor za oglas</div>
  <div class="ad-placeholder">Prostor za oglas</div>
</div>
