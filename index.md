---
layout: default
title: Početna
sidebar: true
---

{% assign hero = site.posts.first %}
<div class="hero">
  <div class="hero-inner">
  <div class="hero-content">
    <h1>{{ hero.title }}</h1>
    <p>{{ hero.excerpt | strip_html }}</p>
    <a href="{{ hero.url | relative_url }}" class="btn">Pročitaj više →</a>
  </div>
  {% if hero.image %}
  <figure class="hero-figure">
    <img src="{{ hero.image | relative_url }}" alt="{{ hero.image_alt | default: hero.title | escape }}">
    {% if hero.image_credit %}<figcaption>{{ hero.image_credit | markdownify | remove: '<p>' | remove: '</p>' | strip }}</figcaption>{% endif %}
  </figure>
  {% endif %}
  </div>
</div>

<h2>Najnoviji članci</h2>

<div class="filters" id="filteri">
  <div class="filter-row">
    <span class="filter-label">Mjesto:</span>
    <button type="button" class="filter-btn active" data-reset>Sve</button>
    {%- for k in site.data.kategorije.lokacije %}
    {%- assign n = site.posts | where: "location", k.name | size %}
    <button type="button" class="filter-btn{% if n == 0 %} empty{% endif %}" data-group="location" data-filter="{{ k.slug }}">{{ k.name }} <span class="count">{{ n }}</span></button>
    {%- endfor %}
  </div>
  <div class="filter-row">
    <span class="filter-label">Vrsta:</span>
    {%- for k in site.data.kategorije.vrste %}
    {%- assign n = site.posts | where: "type", k.name | size %}
    <button type="button" class="filter-btn{% if n == 0 %} empty{% endif %}" data-group="type" data-filter="{{ k.slug }}">{{ k.name }} <span class="count">{{ n }}</span></button>
    {%- endfor %}
  </div>
</div>

<div class="posts-grid" id="clanci">
  {% for post in site.posts %}
  {%- assign c_loc = site.data.kategorije.lokacije | where: "name", post.location | first -%}
  {%- assign c_type = site.data.kategorije.vrste | where: "name", post.type | first -%}
  <article class="post-card" data-location="{{ c_loc.slug }}" data-type="{{ c_type.slug }}">
    {% if post.image %}
      <a href="{{ post.url | relative_url }}" class="card-thumb"><img src="{{ post.image | relative_url }}" alt="{{ post.image_alt | default: post.title | escape }}" loading="lazy"></a>
    {% endif %}
    <div class="content">
      <div class="meta">{{ post.date | date: "%d. %m. %Y." }}</div>
      <h3><a href="{{ post.url | relative_url }}">{{ post.title }}</a></h3>
      <p>{{ post.excerpt | strip_html | truncate: 110 }}</p>
      {% include oznake.html post=post %}
    </div>
  </article>
  {% endfor %}
</div>
<p class="no-results" id="nema-clanaka" hidden>Još nema članaka za odabrani filter. <button type="button" class="link-btn" data-reset>Prikaži sve</button></p>

<script>
(function () {
  var state = { location: null, type: null };
  var buttons = document.querySelectorAll('.filter-btn[data-filter]');
  var resets = document.querySelectorAll('[data-reset]');
  var cards = document.querySelectorAll('#clanci .post-card');
  var empty = document.getElementById('nema-clanaka');
  var groupOf = {};
  buttons.forEach(function (b) { groupOf[b.dataset.filter] = b.dataset.group; });

  function apply(updateUrl) {
    var shown = 0;
    cards.forEach(function (c) {
      var ok = (!state.location || c.dataset.location === state.location) &&
               (!state.type || c.dataset.type === state.type);
      c.hidden = !ok;
      if (ok) shown++;
    });
    buttons.forEach(function (b) {
      b.classList.toggle('active', state[b.dataset.group] === b.dataset.filter);
    });
    var none = !state.location && !state.type;
    resets.forEach(function (r) { if (r.classList.contains('filter-btn')) r.classList.toggle('active', none); });
    empty.hidden = shown > 0;
    if (updateUrl && window.history && history.replaceState) {
      var p = [];
      if (state.location) p.push(state.location);
      if (state.type) p.push(state.type);
      var url = location.pathname + (p.length ? '?kategorija=' + p.join(',') : '');
      history.replaceState(null, '', url);
    }
  }

  buttons.forEach(function (b) {
    b.addEventListener('click', function () {
      var g = b.dataset.group, f = b.dataset.filter;
      state[g] = state[g] === f ? null : f;
      apply(true);
    });
  });
  resets.forEach(function (r) {
    r.addEventListener('click', function () { state.location = null; state.type = null; apply(true); });
  });

  function fromUrl() {
    var q = new URLSearchParams(location.search).get('kategorija') || '';
    var h = decodeURIComponent(location.hash.replace(/^#/, ''));
    var vals = (q ? q.split(',') : []).concat(h ? [h] : []);
    var found = false;
    vals.forEach(function (v) {
      v = v.trim().toLowerCase();
      if (groupOf[v]) { state[groupOf[v]] = v; found = true; }
    });
    apply(false);
    if (found) document.getElementById('filteri').scrollIntoView();
  }
  window.addEventListener('hashchange', fromUrl);
  fromUrl();
})();
</script>
