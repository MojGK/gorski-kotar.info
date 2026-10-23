---
layout: default
title: Početna
---

<div class="hero">
  <div class="hero-content">
    <h1>Jesen na Bajeru – mir koji ostaje</h1>
    <p>Jezero Bajer jedno je od onih mjesta koja me uvijek iznova podsjete zašto volim Gorski kotar. Jesen ovdje nije samo boja – ona je osjećaj.</p>
    <p><a href="{{ '/jesen-na-bajeru/' | relative_url }}" style="color: var(--green); font-weight: 600;">Pročitaj više →</a></p>
  </div>
  <img src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80" alt="Jezero Bajer">
</div>

<h2>Nedavni objavi</h2>
<div class="posts-grid">
  {% for post in site.posts limit: 12 %}
  <article class="post-card">
    {% if post.image %}
      <img src="{{ post.image }}" alt="{{ post.title }}">
    {% endif %}
    <div class="content">
      <div class="meta">{{ post.date | date: "%d. %B %Y." }} · {{ post.category | default: "Događaji" }}</div>
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
