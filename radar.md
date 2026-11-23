---
layout: default
title: Goranski radar
permalink: /radar/
sidebar: true
description: Vrijeme, ceste i struja u Gorskom kotaru, uz službene poveznice i naše članke.
---
{%- comment -%}
Goranski radar: vrijeme (widget Delnice + DHMZ), ceste (HAK, HAC, članci promet),
struja (HEP ODS) i servisne obavijesti iz _data/radar.yml. Ništa se ne tvrdi kao „uživo”.
{%- endcomment -%}
{%- assign rd = site.data.radar -%}
{%- assign pr_data = site.data.promet -%}
{%- assign pr_posts = "" | split: "" -%}
{%- for p in site.posts -%}
  {%- if p.type == "Promet" or p.categories contains "Promet" or p.tags contains "promet" -%}
    {%- assign pr_posts = pr_posts | push: p -%}
  {%- endif -%}
{%- endfor -%}
{%- assign dhmz_upoz = "" | split: "" -%}
{%- for p in site.posts -%}
  {%- if p.title contains "DHMZ" and p.title contains "upozorenje" -%}
    {%- assign dhmz_upoz = dhmz_upoz | push: p -%}
  {%- endif -%}
{%- endfor -%}
{%- include zivi-popis.html lista=rd.iskljucenja polje="datum" -%}
{%- assign rd_isk = zp_lista -%}
{%- include zivi-popis.html lista=rd.obavijesti polje="datum" -%}
{%- assign rd_oba = zp_lista -%}
{%- assign rd_azur = rd.azurirano | default: rd.provjereno -%}
{%- if pr_posts.size > 0 -%}
  {%- assign pr_zadnji = pr_posts.first.azurirano | default: pr_posts.first.date -%}
{%- endif -%}
<div class="history-page zaposlenje-page radar-page">
  <h1>Goranski radar</h1>
  <p class="intro">Vrijeme, ceste i struja u Gorskom kotaru, uz službene poveznice i naše članke. Prognoza za Delnice dolazi iz Open-Meteo; stanje na cestama, upozorenja i isključenja pratite na povezanim službenim stranicama. Ova stranica nije prikaz uživo.</p>
  {% if rd_azur %}<p class="zivi-azurirano">Ažurirano: <time datetime="{{ rd_azur | date: '%Y-%m-%d' }}">{{ rd_azur | date: "%-d. %-m. %Y." }}</time></p>{% endif %}

  <aside class="zimska-traka radar-traka" aria-label="Ceste i vrijeme">
    <a class="zt-ceste" href="https://www.hak.hr/info/stanje-na-cestama/" target="_blank" rel="noopener">❄️ <strong>A6 / DC3</strong> <span class="zt-dugo">· stanje na cestama</span> <span class="zt-izvor">(HAK)</span> →</a>
    <a class="zt-vrijeme" href="#vrijeme-radar">🌡️ <strong>Delnice</strong> <span>prognoza</span></a>
  </aside>

  <h2 class="section-title" id="vrijeme">Vrijeme</h2>
  {% include vrijeme-delnice.html id="vrijeme-radar" %}
  <div class="post-content">
    <div class="job-highlights sluzbeni-okvir">
      <p class="job-hl-title">Službene prognoze i upozorenja</p>
      <ul>
        {%- for l in rd.poveznice_vrijeme %}
        <li><a href="{{ l.url }}" target="_blank" rel="noopener">{{ l.naziv }}</a></li>
        {%- endfor %}
      </ul>
    </div>
  </div>
  {% if dhmz_upoz.size > 0 %}
  <h3 class="radar-podnaslov">Naši članci o DHMZ-ovim upozorenjima</h3>
  <p class="radar-napomena">Popis naših objava, ne službeni popis upozorenja koja su trenutačno na snazi.</p>
  <ul class="zap-older">
    {%- for post in dhmz_upoz limit: 6 %}
    <li><a href="{{ post.url | relative_url }}">{{ post.title }}</a> <span class="meta">{% include datum.html date=post.date show_time=false short=true %}</span></li>
    {%- endfor %}
  </ul>
  {% endif %}

  <h2 class="section-title" id="ceste">Ceste i promet</h2>
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
  {% if pr_posts.size > 0 %}
  <h3 class="radar-podnaslov">Najnovije vijesti o prometu</h3>
  <ul class="zap-older">
    {%- for post in pr_posts %}
    <li><a href="{{ post.url | relative_url }}">{{ post.title }}</a> <span class="meta">{% include datum.html date=post.date show_time=false short=true %}</span></li>
    {%- endfor %}
  </ul>
  {% else %}
  <p class="zb-empty">Trenutno nema članaka u ovoj rubrici.</p>
  {% endif %}

  <h2 class="section-title" id="struja">Struja</h2>
  <div class="post-content">
    <div class="job-highlights sluzbeni-okvir">
      <p class="job-hl-title">Planirana isključenja</p>
      <ul>
        {%- for l in rd.poveznice_struja %}
        <li><a href="{{ l.url }}" target="_blank" rel="noopener">{{ l.naziv }}</a></li>
        {%- endfor %}
      </ul>
    </div>
  </div>
  {% if rd_isk.size > 0 %}
  <ul class="radar-iskljucenja" data-radar-lista data-prazno="Trenutno nema najavljenih isključenja.">
    {%- for i in rd_isk %}
    <li data-do="{{ i.datum_do | default: i.datum | date: '%Y-%m-%d' }}">
      <strong>{{ i.mjesto }}</strong>{% if i.opis %} — {{ i.opis }}{% endif %}
      <span class="meta">{% include datum.html date=i.datum show_time=false short=true %}{% if i.vrijeme %} · {{ i.vrijeme }}{% endif %}{% if i.vrsta %} · {{ i.vrsta }} radovi{% endif %}</span>
      {% if i.izvor %}<span class="radar-izvor">Izvor: {{ i.izvor }}</span>{% endif %}
    </li>
    {%- endfor %}
  </ul>
  {% else %}
  <p class="zb-empty">Trenutno nema najavljenih isključenja.{% if rd.provjereno %} Zadnja provjera: {{ rd.provjereno | date: "%-d. %-m. %Y." }}{% endif %}</p>
  {% endif %}
  <p class="radar-napomena">Popis se ažurira ručno prema HEP ODS-u; za trenutno stanje otvorite službenu stranicu.</p>

  <h2 class="section-title" id="obavijesti">Servisne obavijesti</h2>
  <p class="radar-napomena">Vodovod, zimska služba, odvoz otpada i slične obavijesti jedinica lokalne samouprave.</p>
  {% if rd_oba.size > 0 %}
  <ul class="radar-iskljucenja" data-radar-lista data-prazno="Trenutno nema najavljenih servisnih obavijesti.">
    {%- for i in rd_oba %}
    <li data-do="{{ i.datum_do | default: i.datum | date: '%Y-%m-%d' }}">
      <strong>{{ i.naslov | default: i.vrsta }}</strong>{% if i.mjesto %} — {{ i.mjesto }}{% endif %}
      {% if i.opis %}<span class="radar-opis">{{ i.opis }}</span>{% endif %}
      <span class="meta">{% if i.datum %}{% include datum.html date=i.datum show_time=false short=true %}{% endif %}{% if i.datum_do %} – {{ i.datum_do | date: "%-d. %-m. %Y." }}{% endif %}</span>
      {% if i.izvor %}<span class="radar-izvor">Izvor: {% if i.izvor_url %}<a href="{{ i.izvor_url }}" target="_blank" rel="noopener">{{ i.izvor }}</a>{% else %}{{ i.izvor }}{% endif %}</span>{% endif %}
    </li>
    {%- endfor %}
  </ul>
  {% else %}
  <p class="zb-empty">Trenutno nema najavljenih servisnih obavijesti.{% if rd.provjereno %} Zadnja provjera: {{ rd.provjereno | date: "%-d. %-m. %Y." }}{% endif %}</p>
  {% endif %}
</div>
<script>
(function () {
  var t = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Zagreb', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
  document.querySelectorAll('[data-radar-lista]').forEach(function (ul) {
    ul.querySelectorAll('[data-do]').forEach(function (li) {
      var end = li.getAttribute('data-do');
      if (end && end < t) li.remove();
    });
    var items = Array.prototype.slice.call(ul.children).filter(function (n) { return n.nodeType === 1; });
    items.sort(function (a, b) {
      var ka = a.getAttribute('data-do') || '9999-99-99';
      var kb = b.getAttribute('data-do') || '9999-99-99';
      return ka < kb ? -1 : ka > kb ? 1 : 0;
    });
    items.forEach(function (it) { ul.appendChild(it); });
    if (!ul.children.length) {
      var p = document.createElement('p');
      p.className = 'zb-empty';
      p.textContent = ul.getAttribute('data-prazno') || 'Trenutno nema najavljenih stavki.';
      ul.parentNode.replaceChild(p, ul);
    }
  });
})();
</script>
