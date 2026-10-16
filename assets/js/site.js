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

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var canHover = window.matchMedia('(hover: hover) and (min-width: 821px)').matches;

  // Intro: the logo draws itself, footage plays inside the ridge and the UREV letters,
  // and scrolling flies the camera into the main peak until the video fills the screen.
  var intro = $('.intro'), heroVid = $('.intro-video');
  if (reduce && heroVid) { heroVid.removeAttribute('autoplay'); heroVid.pause(); }
  if (intro && document.documentElement.classList.contains('fx')) {
    var root = document.documentElement;
    var mask = $('.intro-mask', intro), mSvg = $('.lockup--mask', intro), oSvg = $('.lockup--over', intro);
    var letters = $('.lk-letters', intro), tag = $('.lk-tag', intro), outline = $('.lk-outline', intro);
    var done = false, ticking = false, settled = false;
    var clamp = function (v) { return Math.min(Math.max(v, 0), 1); };
    // A point inside the thickest part of the main peak (logo viewBox is 1000 x 637)
    var PEAK_X = 531.8 / 1000, PEAK_Y = 90.3 / 637;
    var setOrigin = function () {
      var o = (PEAK_X * 100) + '% ' + (PEAK_Y * 100) + '%';
      mSvg.style.transformOrigin = o; oSvg.style.transformOrigin = o;
    };
    // Snap the load animation to its end state so scroll can take over
    var settle = function () { if (!settled) { settled = true; intro.classList.add('lk-done'); } };
    tag.addEventListener('animationend', settle);
    setTimeout(settle, 3400);

    // Once the peak has fully opened, the intro is removed for good: the tall scroll
    // section collapses to a normal hero and the scroll position is shifted by the same
    // amount, so nothing moves on screen and scrolling back up never replays it.
    var finish = function () {
      if (done) return;
      done = true;
      window.removeEventListener('scroll', onScrollIntro);
      window.removeEventListener('resize', init);
      var before = intro.offsetHeight, y = window.scrollY;
      root.classList.remove('fx');
      intro.classList.add('is-open');
      if (heroVid) heroVid.style.transform = '';
      var removed = before - intro.offsetHeight;
      if (y > 0) window.scrollTo(0, Math.max(0, y - removed));
    };
    var update = function () {
      ticking = false;
      if (done) return;
      var r = intro.getBoundingClientRect(), span = intro.offsetHeight - window.innerHeight;
      var p = clamp(-r.top / span);
      if (p > 0) settle();
      var z = clamp(p / 0.72);
      var sc = 'scale(' + (1 + Math.pow(z, 2.5) * 60) + ')';
      mSvg.style.transform = sc; oSvg.style.transform = sc;
      if (settled) {
        letters.style.opacity = 1 - clamp((p - 0.04) / 0.22);
        tag.style.opacity = 1 - clamp(p / 0.12);
        outline.style.opacity = 1 - clamp((p - 0.08) / 0.3);
      }
      if (heroVid) heroVid.style.transform = 'scale(' + (1.18 - 0.18 * z) + ')';
      mask.style.opacity = p < 0.55 ? 1 : Math.max(0, 1 - (p - 0.55) / 0.15);
      intro.classList.toggle('is-open', p > 0.66);
      if (p >= 1) finish();
    };
    var onScrollIntro = function () { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
    var init = function () { if (done) return; setOrigin(); update(); };
    init();
    window.addEventListener('scroll', onScrollIntro, { passive: true });
    window.addEventListener('resize', init);
    window.urevFinishIntro = finish;
  }

  // Links to sections on this page scroll there without adding "#work" etc. to the
  // address, so a reload always starts at the top (and replays the intro).
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href*="#"]');
    if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey) return;
    if (a.pathname !== location.pathname || a.host !== location.host || !a.hash || a.hash === '#main') return;
    var target = document.getElementById(a.hash.slice(1));
    if (!target) return;
    e.preventDefault();
    if (window.urevFinishIntro) window.urevFinishIntro();
    target.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
  });

  // Mobile quick-contact bar appears after the first screen, hides over the booking form
  var quick = $('.quick-bar'), bookSec = $('#book');
  if (quick) {
    var qUpdate = function () {
      var past = window.scrollY > window.innerHeight * 0.9;
      var atBook = bookSec && bookSec.getBoundingClientRect().top < window.innerHeight * 0.6 && bookSec.getBoundingClientRect().bottom > 0;
      quick.classList.toggle('is-on', past && !atBook);
    };
    window.addEventListener('scroll', qUpdate, { passive: true }); qUpdate();
  }

  // Services: a photo preview follows the cursor on desktop
  var preview = $('.svc-preview');
  if (preview && canHover && !reduce) {
    var pImg = $('img', preview), px = 0, py = 0, cx = 0, cy = 0, raf = null;
    var follow = function () {
      cx += (px - cx) * 0.18; cy += (py - cy) * 0.18;
      preview.style.transform = 'translate(' + (cx + 28) + 'px,' + (cy - 120) + 'px)';
      raf = Math.abs(px - cx) + Math.abs(py - cy) > 0.5 ? requestAnimationFrame(follow) : null;
    };
    $$('.svc li').forEach(function (li) {
      li.addEventListener('mouseenter', function (e) {
        pImg.src = li.getAttribute('data-img');
        if (!preview.classList.contains('is-on')) { cx = px = e.clientX; cy = py = e.clientY; follow(); }
        preview.classList.add('is-on');
      });
      li.addEventListener('mousemove', function (e) { px = e.clientX; py = e.clientY; if (!raf) raf = requestAnimationFrame(follow); });
      li.addEventListener('mouseleave', function () { preview.classList.remove('is-on'); });
    });
  }

  // Videos preview silently on hover (desktop)
  if (canHover && !reduce) {
    $$('.vid').forEach(function (b) {
      var v = null;
      b.addEventListener('mouseenter', function () {
        v = document.createElement('video');
        v.muted = true; v.loop = true; v.playsInline = true; v.preload = 'auto';
        v.src = b.getAttribute('data-video');
        v.style.opacity = '0';
        v.addEventListener('playing', function () { v.style.opacity = '1'; });
        b.insertBefore(v, b.firstChild.nextSibling);
        v.play().catch(function () {});
      });
      b.addEventListener('mouseleave', function () { if (v) { v.pause(); v.remove(); v = null; } });
    });
  }

  // Portfolio: show the first 12 photos, then a "Show all" button
  var gallery = $('.gallery'), moreBtn = $('.more-btn'), LIMIT = 12;

  // Mix categories so the "All" view alternates between shoots instead of
  // running one property at a time: each folder's photos are spread evenly.
  if (gallery) {
    var groups = {};
    $$('.tile', gallery).forEach(function (t) { var c = t.getAttribute('data-cat'); (groups[c] = groups[c] || []).push(t); });
    // Always take from the folder with the most photos left, never the same folder twice in a row
    var cats = Object.keys(groups), last = null, out = [];
    for (;;) {
      var pick = null;
      cats.forEach(function (c) {
        if (!groups[c].length || c === last) return;
        if (!pick || groups[c].length > groups[pick].length) pick = c;
      });
      if (!pick) { pick = cats.filter(function (c) { return groups[c].length; })[0]; if (!pick) break; }
      out.push(groups[pick].shift()); last = pick;
    }
    out.forEach(function (t) { gallery.appendChild(t); });
  }
  var tiles = $$('.tile');
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
