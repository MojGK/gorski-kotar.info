---
layout: default
title: Gorski Kotar Info – vijesti iz Gorskog kotara
description: "Vijesti iz Gorskog kotara: Delnice, Čabar, Vrbovsko, Fužine, Lokve, Mrkopalj, Ravna Gora, Skrad i Brod Moravice. Događanja, sport, promet, priroda i povijest."
image: /assets/images/og-gorski-kotar-info.png
sidebar: true
---

{% include zimska-traka.html %}

{%- comment -%} Zaposlenje je zasebna rubrika: ne ide u hero, Izdvojeno ni u mrežu bez filtera (ima svoj blok ispod) {%- endcomment -%}
{%- assign vijesti = site.posts | where_exp: "p", "p.type != 'Zaposlenje'" -%}
{%- assign featured = vijesti | where: "featured", true | first -%}
{%- if featured -%}{%- assign lead = featured -%}{%- else -%}{%- assign lead = vijesti.first -%}{%- endif -%}
{%- assign lead_loc = site.data.kategorije.lokacije | where: "name", lead.location | first -%}
{%- assign lead_type = site.data.kategorije.vrste | where: "name", lead.type | first -%}

<section class="lead hero" id="lead" data-location="{{ lead_loc.slug }}" data-type="{{ lead_type.slug }}" data-cats="{% include kat-slugovi.html post=lead %}">
  <a href="{{ lead.url | relative_url }}" class="lead-link{% unless lead.image %} no-img{% endunless %}">
    {% if lead.image %}<img src="{{ lead.image | relative_url }}"{% if lead.image_position %} style="object-position: {{ lead.image_position }}"{% endif %} alt="{{ lead.image_alt | default: lead.title | escape }}" fetchpriority="high">{% endif %}
    <div class="lead-overlay">
      <span class="lead-badges">{% include prijelomna-oznaka.html post=lead %}<span class="lead-kicker">{% if featured %}Glavna vijest{% else %}Najnovije{% endif %}</span>{% if lead_type %}<span class="card-badge t-{{ lead_type.slug }}">{{ lead_type.name }}</span>{% endif %}</span>
      <h1>{{ lead.title }}</h1>
      {%- assign lead_ex = lead.excerpt | strip_html | strip -%}
      {% if lead_ex != "" %}<p class="lead-excerpt">{{ lead_ex | truncate: 230 }}</p>{% endif %}
      <span class="lead-cta">Pročitaj članak <span aria-hidden="true">→</span></span>
    </div>
  </a>
  <div class="lead-body">
    <div class="lead-meta">{% include oznake.html post=lead %}<span class="meta">{% include datum.html date=lead.date show_time=lead.show_time short=true %}</span></div>
    {% if lead.image_credit %}<p class="lead-credit">{{ lead.image_credit | markdownify | remove: '<p>' | remove: '</p>' | strip }}</p>{% endif %}
  </div>
</section>

{% include servisi-gradani.html %}

{%- comment -%} Izdvojeno se izračuna prije mreže (izd_urls za de-duplikaciju), a iscrtava se ispod Najnovijeg. {%- endcomment -%}
{% capture izdvojeno_html %}{% include izdvojeno.html lead=lead %}{% endcapture %}

{%- comment -%} Najnovije: 12 kartica vidljivo; u DOM-u do 30 najnovijih (za Index-filter). Glavna vijest, Izdvojeno i Zaposlenje ne idu u mrežu. {%- endcomment %}
{% include index-filter.html %}
<h2 class="section-title" id="naslov-clanaka">Najnoviji članci</h2>
<div class="posts-grid" id="clanci">
  {%- comment -%} Redoslijed po efektivnom vremenu (azurirano ili date), vidi _includes/sortirani-postovi.html {%- endcomment -%}
  {%- include sortirani-postovi.html -%}
  {%- assign shown_m = 0 -%}
  {% for post in sortirani %}
  {%- if post.url == lead.url or post.type == "Zaposlenje" -%}{%- continue -%}{%- endif -%}
  {%- assign c_key = "|" | append: post.url | append: "|" -%}
  {%- if izd_urls contains c_key -%}{%- continue -%}{%- endif -%}
  {%- assign shown_m = shown_m | plus: 1 -%}
  {%- if shown_m > 30 -%}{%- break -%}{%- endif -%}
  {%- assign c_fold = false -%}
  {%- if shown_m > 12 -%}{%- assign c_fold = true -%}{%- endif -%}
  {%- assign c_narrow = false -%}
  {%- if shown_m <= 5 -%}{%- assign c_narrow = true -%}{%- endif -%}
  {%- assign c_loc = site.data.kategorije.lokacije | where: "name", post.location | first -%}
  {%- assign c_type = site.data.kategorije.vrste | where: "name", post.type | first -%}
  <article class="post-card{% if c_fold %} m-fold{% endif %}{% if c_narrow %} is-narrow{% endif %}" data-location="{{ c_loc.slug }}" data-type="{{ c_type.slug }}" data-cats="{% include kat-slugovi.html post=post %}">
    {%- assign c_ser = nil -%}
    {%- for c_s in site.data.kategorije.serijali -%}{%- if post.categories contains c_s.name -%}{%- assign c_ser = c_s -%}{%- endif -%}{%- endfor %}
    <a href="{{ post.url | relative_url }}" class="card-thumb{% unless post.image %} no-img{% endunless %}" tabindex="-1" aria-hidden="true">
      {% if post.image %}<img {% include thumb.html img=post.image %}{% if post.image_position %} style="object-position: {{ post.image_position }}"{% endif %} alt="{{ post.image_alt | default: post.title | escape }}" loading="lazy">{% else %}<span class="card-ph">🌲</span>{% endif %}
      <span class="card-badges">{% include prijelomna-oznaka.html post=post %}{% if c_type %}<span class="card-badge t-{{ c_type.slug }}">{{ c_type.name }}</span>{% endif %}{%- assign c_ser_lab = c_ser.label | default: c_ser.name -%}{% if c_ser and c_ser_lab != c_type.name %}<span class="card-badge series">{{ c_ser_lab }}</span>{% endif %}</span>
    </a>
    <div class="content">
      <h3><a href="{{ post.url | relative_url }}">{{ post.title }}</a></h3>
      <div class="card-meta">
        {%- if c_loc %}<a class="card-loc" href="{{ '/kategorije/' | relative_url }}#{{ c_loc.slug }}">📍 {{ c_loc.name }}</a>{% endif -%}
        <span class="card-date">{% include datum.html date=post.date show_time=post.show_time short=true %}</span>{% include azurirano-oznaka.html post=post %}
      </div>
      <p>{{ post.excerpt | strip_html | strip | truncate: 120 }}</p>
    </div>
  </article>
  {% endfor %}
</div>
<p class="m-svi m-only" id="m-svi"><button type="button" class="m-svi-btn" id="m-svi-btn" aria-controls="clanci" aria-expanded="false">Prikaži sve članke ↓</button></p>
<p class="ix-prazno" id="ix-prazno" hidden>Nema novijih članaka u ovom filtru.</p>
<p class="ix-starije" id="ix-starije" hidden><a href="#"></a></p>
<p class="starije-vijesti"><a href="{{ '/arhiva/' | relative_url }}">Starije vijesti <span aria-hidden="true">→</span></a></p>

{{ izdvojeno_html }}

{% include mjesta-red.html %}

{% include aktualno-servisi.html %}

{% include dogadjanja-blok.html %}

{% include promet-traka.html %}

{% include tiktok-podrska.html %}

<script>
(function () {
  var base = (window.SITE_BASE || '').replace(/\/$/, '');
  var slugs = {
    {%- for k in site.data.kategorije.lokacije %}{{ k.slug | jsonify }}: 1,{% endfor %}
    {%- for k in site.data.kategorije.vrste %}{{ k.slug | jsonify }}: 1,{% endfor %}
    {%- if site.data.kategorije.serijali %}{%- for k in site.data.kategorije.serijali %}{{ k.slug | jsonify }}: 1,{% endfor %}{%- endif %}
  };
  function hash() {
    try { return decodeURIComponent(location.hash.replace(/^#/, '')); } catch (e) { return location.hash.replace(/^#/, ''); }
  }
  function goKat(slug) {
    if (!slug || !slugs[slug]) return false;
    location.replace(base + '/kategorije/' + slug + '/');
    return true;
  }
  (function fromUrl() {
    var q = new URLSearchParams(location.search).get('kategorija') || '';
    var h = hash();
    if (/^blok-/.test(h) || h === 'm-najnovije') {
      var t = document.getElementById('naslov-clanaka');
      if (t) t.scrollIntoView();
      return;
    }
    var first = (q.split(',')[0] || '').trim().toLowerCase();
    if (goKat(first)) return;
    if (h && goKat(h.trim().toLowerCase())) return;
  })();
  var sviBtn = document.getElementById('m-svi-btn');
  if (sviBtn) sviBtn.addEventListener('click', function () {
    var on = !document.body.classList.contains('m-show-all');
    document.body.classList.toggle('m-show-all', on);
    sviBtn.setAttribute('aria-expanded', on ? 'true' : 'false');
    sviBtn.textContent = on ? 'Sakrij popis članaka ↑' : 'Prikaži sve članke ↓';
  });
})();
</script>
