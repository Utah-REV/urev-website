(function () {
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  // Header turns solid after scrolling past the top of the hero
  var header = $('.site-header');
  function onScroll() { header.classList.toggle('is-solid', window.scrollY > 40); }
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();

  // Mobile menu
  var menuBtn = $('.menu-btn'), nav = $('#site-nav');
  function setMenu(open) {
    menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    nav.classList.toggle('is-open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  }
  menuBtn.addEventListener('click', function () { setMenu(menuBtn.getAttribute('aria-expanded') !== 'true'); });
  $$('#site-nav a').forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });

  // Pause hero video for people who prefer reduced motion
  var heroVid = $('.hero-media');
  if (heroVid && window.matchMedia('(prefers-reduced-motion: reduce)').matches) { heroVid.removeAttribute('autoplay'); heroVid.pause(); }

  // Portfolio: show the first 12 photos, then a "Show all" button
  var tiles = $$('.tile'), gallery = $('.gallery'), moreBtn = $('.more-btn'), LIMIT = 12;
  function applyLimit() {
    var shown = 0;
    tiles.forEach(function (t) { t.classList.remove('is-extra'); if (!t.hidden) { shown++; if (shown > LIMIT) t.classList.add('is-extra'); } });
    if (moreBtn) moreBtn.hidden = shown <= LIMIT || gallery.classList.contains('is-expanded');
  }
  if (moreBtn) moreBtn.addEventListener('click', function () { gallery.classList.add('is-expanded'); moreBtn.hidden = true; });
  applyLimit();

  // Portfolio filters
  $$('.chip').forEach(function (chip) {
    chip.addEventListener('click', function () {
      var f = chip.getAttribute('data-filter');
      $$('.chip').forEach(function (c) {
        var on = c === chip;
        c.classList.toggle('is-active', on);
        c.setAttribute('aria-pressed', on ? 'true' : 'false');
      });
      tiles.forEach(function (t) { t.hidden = !(f === 'all' || t.getAttribute('data-cat') === f); });
      applyLimit();
    });
  });

  // Photo + video viewer
  var viewer = $('#viewer');
  if (viewer && typeof viewer.showModal === 'function') {
    var stage = $('.viewer-stage', viewer), prev = $('.v-prev', viewer), next = $('.v-next', viewer);
    var current = 0;
    var visible = function () { return tiles.filter(function (t) { return !t.hidden && (gallery.classList.contains('is-expanded') || !t.classList.contains('is-extra')); }); };

    function showPhoto(i) {
      var list = visible(); if (!list.length) return;
      current = (i + list.length) % list.length;
      var btn = $('.tile-btn', list[current]);
      stage.innerHTML = '';
      var img = new Image(); img.src = btn.getAttribute('data-full'); img.alt = $('img', btn).alt;
      stage.appendChild(img);
      prev.hidden = next.hidden = list.length < 2;
    }
    function showVideo(src) {
      stage.innerHTML = '';
      var v = document.createElement('video');
      v.src = src; v.controls = true; v.autoplay = true; v.playsInline = true;
      stage.appendChild(v);
      prev.hidden = next.hidden = true;
    }
    function close() { viewer.close(); }

    tiles.forEach(function (t) {
      $('.tile-btn', t).addEventListener('click', function () { showPhoto(visible().indexOf(t)); viewer.showModal(); });
    });
    $$('.vid').forEach(function (b) {
      b.addEventListener('click', function () { showVideo(b.getAttribute('data-video')); viewer.showModal(); });
    });
    viewer.addEventListener('close', function () { stage.innerHTML = ''; });
    $('.v-close', viewer).addEventListener('click', close);
    prev.addEventListener('click', function () { showPhoto(current - 1); });
    next.addEventListener('click', function () { showPhoto(current + 1); });
    viewer.addEventListener('click', function (e) { if (e.target === viewer) close(); });
    viewer.addEventListener('keydown', function (e) {
      if (next.hidden) return;
      if (e.key === 'ArrowRight') showPhoto(current + 1);
      if (e.key === 'ArrowLeft') showPhoto(current - 1);
    });
  }

  // Pricing buttons preselect the service in the form
  var form = $('#book-form');
  $$('[data-service]').forEach(function (a) {
    a.addEventListener('click', function () {
      var sel = form && form.elements.service;
      if (sel) sel.value = a.getAttribute('data-service');
    });
  });

  // Booking form: Formspree when configured, otherwise opens an email
  if (form) {
    var status = $('.form-status', form), submit = $('button[type="submit"]', form);
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!form.checkValidity()) { status.textContent = 'Please fill in your name, email, and the property address.'; form.reportValidity(); return; }
      var id = form.getAttribute('data-formspree');
      var data = new FormData(form);

      if (!id) {
        var body = ['name', 'phone', 'email', 'address', 'service', 'date', 'details']
          .map(function (k) { return k.charAt(0).toUpperCase() + k.slice(1) + ': ' + (data.get(k) || ''); }).join('\n');
        window.location.href = 'mailto:' + form.getAttribute('data-email') +
          '?subject=' + encodeURIComponent('Shoot request: ' + data.get('address')) + '&body=' + encodeURIComponent(body);
        status.textContent = 'Your email app should open with the request filled in.';
        return;
      }

      submit.disabled = true; status.textContent = 'Sending…';
      fetch('https://formspree.io/f/' + id, { method: 'POST', body: data, headers: { Accept: 'application/json' } })
        .then(function (r) {
          if (!r.ok) throw new Error();
          form.reset(); status.textContent = 'Request sent. We\'ll confirm your shoot within 24 hours.';
        })
        .catch(function () { status.textContent = 'That didn\'t send. Email ' + form.getAttribute('data-email') + ' and we\'ll get you booked.'; })
        .then(function () { submit.disabled = false; });
    });
  }
})();
