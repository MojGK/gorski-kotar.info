/* Gorski Kotar Info – vrijeme objave i pretraga (bez vanjskih biblioteka) */
(function () {
  var BASE = window.SITE_BASE || '';
  var TZ = 'Europe/Zagreb';

  /* ---------- Datumi na karticama: „danas u 14:05”, „jučer u 20:25”, inače „21. 11.” ---------- */
  function ymd(d) {
    try {
      return new Intl.DateTimeFormat('en-CA', { timeZone: TZ, year: 'numeric', month: '2-digit', day: '2-digit' }).format(d);
    } catch (e) {
      var y = d.getFullYear(), m = d.getMonth() + 1, day = d.getDate();
      return y + '-' + ('0' + m).slice(-2) + '-' + ('0' + day).slice(-2);
    }
  }
  function hm(d) {
    try {
      var parts = new Intl.DateTimeFormat('en-GB', { timeZone: TZ, hour: '2-digit', minute: '2-digit', hour12: false }).formatToParts(d);
      var h = '00', m = '00';
      parts.forEach(function (p) { if (p.type === 'hour') h = p.value; if (p.type === 'minute') m = p.value; });
      return h + ':' + m;
    } catch (e) { return ''; }
  }
  function yesterdayYmd(todayStr) {
    var p = todayStr.split('-');
    var dt = new Date(Date.UTC(+p[0], +p[1] - 1, +p[2]));
    dt.setUTCDate(dt.getUTCDate() - 1);
    return dt.toISOString().slice(0, 10);
  }
  var today = ymd(new Date());
  var yest = yesterdayYmd(today);
  var thisYear = today.slice(0, 4);
  document.querySelectorAll('time[data-rel], time[data-short]').forEach(function (el) {
    var iso = el.getAttribute('datetime');
    if (!iso) return;
    var d = new Date(iso);
    if (isNaN(d)) return;
    var day = ymd(d);
    var year = day.slice(0, 4);
    var hasTime = el.getAttribute('data-rel-time') === '1';
    var timeBit = hasTime ? (' u ' + hm(d)) : '';
    var label;
    if (day === today) {
      label = 'danas' + timeBit;
      el.classList.add('today');
    } else if (day === yest) {
      label = 'jučer' + timeBit;
    } else {
      label = (+day.slice(8, 10)) + '. ' + (+day.slice(5, 7)) + '.';
      if (year !== thisYear) label += ' ' + year + '.';
    }
    el.textContent = label;
  });

  /* ---------- Izvori na dnu članka: sitni prigušeni redak ---------- */
  (function () {
    var root = document.querySelector('.post-content');
    if (!root) return;
    var nodes = root.querySelectorAll('p, h2, h3');
    for (var i = nodes.length - 1; i >= 0; i--) {
      var txt = (nodes[i].textContent || '').replace(/^\s+/, '');
      if (/^Izvori?\b/i.test(txt)) {
        nodes[i].classList.add('post-izvor');
        if (/^H[23]$/.test(nodes[i].tagName)) {
          var n = nodes[i].nextElementSibling;
          while (n) { n.classList.add('post-izvor'); n = n.nextElementSibling; }
        }
        break;
      }
    }
  })();

  /* ---------- Istekle stavke servisa (zagrebački datum, dan roka uključen) ---------- */
  document.querySelectorAll('.zivi-popis [data-rok], .zivi-popis [data-do], .aktualno-servisi [data-rok], .radar-iskljucenja [data-do], .promet-traka [data-do]').forEach(function (el) {
    var end = el.getAttribute('data-do') || el.getAttribute('data-rok');
    if (end && end < today) el.remove();
  });

  /* ---------- Pretraga ---------- */
  function norm(s) {
    return (s || '').toString().toLowerCase()
      .replace(/đ/g, 'd').replace(/dž/g, 'dz')
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }
  function esc(s) {
    return (s || '').replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  var indexPromise = null;
  function loadIndex() {
    if (!indexPromise) {
      indexPromise = fetch(BASE + '/search.json').then(function (r) { return r.json(); }).then(function (posts) {
        posts.forEach(function (p) {
          p._t = norm(p.title);
          p._all = norm([p.title, p.excerpt, p.location, p.type].concat(p.categories || []).join(' '));
        });
        return posts;
      }).catch(function () { indexPromise = null; return []; });
    }
    return indexPromise;
  }
  function search(posts, q) {
    var terms = norm(q).split(/\s+/).filter(Boolean);
    if (!terms.length) return [];
    var res = [];
    posts.forEach(function (p) {
      var score = 0;
      for (var i = 0; i < terms.length; i++) {
        if (p._all.indexOf(terms[i]) === -1) return;
        score += p._t.indexOf(terms[i]) !== -1 ? 3 : 1;
        if (norm(p.location) === terms[i] || norm(p.type) === terms[i]) score += 2;
      }
      res.push({ p: p, score: score });
    });
    res.sort(function (a, b) { return b.score - a.score || (a.p.date < b.p.date ? 1 : -1); });
    return res.map(function (r) { return r.p; });
  }
  // označi pogodak u izvornom tekstu, neovisno o dijakriticima
  function highlight(text, q) {
    var terms = norm(q).split(/\s+/).filter(Boolean);
    var n = norm(text);
    if (n.length !== text.length) return esc(text);
    var marks = new Array(text.length).fill(false);
    terms.forEach(function (t) {
      var i = n.indexOf(t);
      while (i !== -1) { for (var k = i; k < i + t.length; k++) marks[k] = true; i = n.indexOf(t, i + t.length); }
    });
    var out = '', open = false;
    for (var i = 0; i < text.length; i++) {
      if (marks[i] && !open) { out += '<mark>'; open = true; }
      if (!marks[i] && open) { out += '</mark>'; open = false; }
      out += esc(text[i]);
    }
    return out + (open ? '</mark>' : '');
  }
  function badges(p) {
    var h = '';
    if (p.location) h += '<span class="tag tag-location">📍 ' + esc(p.location) + '</span>';
    if (p.type) h += '<span class="tag tag-type">' + esc(p.type) + '</span>';
    return h ? '<span class="tags">' + h + '</span>' : '';
  }

  // padajući izbornik u zaglavlju
  var input = document.getElementById('search-input');
  var box = document.getElementById('search-results');
  if (input && box) {
    var sel = -1, timer = null;
    function close() { box.hidden = true; box.innerHTML = ''; sel = -1; }
    function render(q) {
      loadIndex().then(function (posts) {
        if (input.value !== q) return;
        if (!q.trim()) return close();
        var r = search(posts, q);
        var html = r.slice(0, 7).map(function (p) {
          return '<a class="sr-item" role="option" href="' + esc(p.url) + '">' +
            (p.image ? '<img src="' + esc(p.image) + '"' + (p.image_position ? ' style="object-position:' + esc(p.image_position) + '"' : '') + ' alt="" loading="lazy">' : '') +
            '<span class="sr-text"><span class="sr-title">' + highlight(p.title, q) + '</span>' +
            '<span class="sr-meta">' + esc(p.date_text) + (p.location ? ' · ' + esc(p.location) : '') + '</span></span></a>';
        }).join('');
        if (!r.length) html = '<div class="sr-empty">Nema rezultata za „' + esc(q) + '“</div>';
        html += '<a class="sr-all" href="' + BASE + '/pretraga/?q=' + encodeURIComponent(q) + '">Svi rezultati (' + r.length + ') →</a>';
        box.innerHTML = html; box.hidden = false; sel = -1;
      });
    }
    input.addEventListener('focus', loadIndex);
    input.addEventListener('input', function () {
      clearTimeout(timer);
      var q = input.value;
      timer = setTimeout(function () { render(q); }, 120);
    });
    input.addEventListener('keydown', function (e) {
      var items = box.querySelectorAll('a');
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        if (!items.length) return;
        e.preventDefault();
        sel = (sel + (e.key === 'ArrowDown' ? 1 : -1) + items.length) % items.length;
        items.forEach(function (a, i) { a.classList.toggle('sel', i === sel); });
      } else if (e.key === 'Enter' && sel >= 0 && items[sel]) {
        e.preventDefault(); location.href = items[sel].href;
      } else if (e.key === 'Escape') { close(); }
    });
    document.addEventListener('click', function (e) { if (!e.target.closest('.site-header .search')) close(); });
  }

  // stranica /pretraga/
  var list = document.getElementById('search-page-results');
  if (list) {
    var q = new URLSearchParams(location.search).get('q') || '';
    var pageInput = document.getElementById('search-page-input');
    var summary = document.getElementById('search-summary');
    if (pageInput) pageInput.value = q;
    if (input) input.value = q;
    if (!q.trim()) { summary.textContent = 'Upiši pojam za pretragu.'; return; }
    summary.textContent = 'Tražim…';
    loadIndex().then(function (posts) {
      var r = search(posts, q);
      summary.innerHTML = r.length
        ? 'Pronađeno članaka: <strong>' + r.length + '</strong> za „' + esc(q) + '“'
        : 'Nema rezultata za „' + esc(q) + '“. Pokušaj s drugim pojmom ili pregledaj <a href="' + BASE + '/kategorije/">kategorije</a>.';
      list.innerHTML = r.map(function (p) {
        return '<li class="search-hit">' +
          (p.image ? '<a href="' + esc(p.url) + '" class="hit-thumb"><img src="' + esc(p.image) + '"' + (p.image_position ? ' style="object-position:' + esc(p.image_position) + '"' : '') + ' alt="" loading="lazy"></a>' : '') +
          '<div class="hit-body">' + badges(p) +
          '<h3><a href="' + esc(p.url) + '">' + highlight(p.title, q) + '</a></h3>' +
          '<div class="meta">' + esc(p.date_text) + '</div>' +
          '<p>' + highlight(p.excerpt, q) + '</p></div></li>';
      }).join('');
    });
  }
})();

/* ---------- Najave događaja: skrivanje prošlih (stranica se gradi samo pri pushu) ---------- */
(function () {
  var now = Date.now() / 1000;
  document.querySelectorAll('[data-event-end]').forEach(function (el) {
    var past = Number(el.getAttribute('data-event-end')) < now;
    el.classList.toggle('is-past', past);
    if (past && el.hasAttribute('data-hide-when-past')) el.hidden = true;
    var note = el.querySelector('.event-past-note');
    if (note) note.hidden = !past;
  });
  document.querySelectorAll('[data-event-list]').forEach(function (list) {
    var left = list.querySelectorAll('[data-hide-when-past]:not([hidden])').length;
    if (list.hasAttribute('data-hide-if-empty')) list.hidden = left === 0;
    var emptyEl = list.parentNode.querySelector('[data-event-empty]');
    if (emptyEl) emptyEl.hidden = left > 0;
  });
})();
