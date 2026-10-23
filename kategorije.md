---
layout: default
title: Kategorije
permalink: /kategorije/
---

<div class="categories-page">
  <h1>Kategorije</h1>
  <p class="intro">Članci su razvrstani po mjestu i po vrsti. Klikni na kategoriju za brzi skok ili
  <a href="{{ '/' | relative_url }}">filtriraj članke na naslovnici</a>.</p>

  <nav class="cat-jump">
    <strong>Mjesta:</strong>
    {% for k in site.data.kategorije.lokacije %}<a href="#{{ k.slug }}">{{ k.name }}</a>{% endfor %}
    <br>
    <strong>Vrste:</strong>
    {% for k in site.data.kategorije.vrste %}<a href="#{{ k.slug }}">{{ k.name }}</a>{% endfor %}
  </nav>

  {% assign grupe = "lokacije,vrste" | split: "," %}
  {% for g in grupe %}
    {% if g == "lokacije" %}{% assign field = "location" %}<h2>Po mjestima</h2>{% else %}{% assign field = "type" %}<h2>Po vrsti</h2>{% endif %}
    {% for k in site.data.kategorije[g] %}
      {% assign posts = site.posts | where: field, k.name %}
      <section class="cat-section" id="{{ k.slug }}">
        <h3>{{ k.name }} <span class="count">{{ posts | size }}</span>
          {% if posts.size > 0 %}<a class="cat-filter-link" href="{{ '/' | relative_url }}?kategorija={{ k.slug }}">filtriraj na naslovnici →</a>{% endif %}</h3>
        {% if posts.size > 0 %}
        <ul>
          {% for post in posts %}
          <li><span class="meta">{{ post.date | date: "%d. %m. %Y." }}</span>
            <a href="{{ post.url | relative_url }}">{{ post.title }}</a>
            {% include oznake.html post=post %}</li>
          {% endfor %}
        </ul>
        {% else %}
        <p class="empty-cat">Još nema članaka.</p>
        {% endif %}
      </section>
    {% endfor %}
  {% endfor %}
</div>
