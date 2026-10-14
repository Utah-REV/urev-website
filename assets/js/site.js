(function () {
  // Portfolio filters
  var chips = document.querySelectorAll('.chip');
  var tiles = Array.prototype.slice.call(document.querySelectorAll('.tile'));

  chips.forEach(function (chip) {
    chip.addEventListener('click', function () {
      var f = chip.getAttribute('data-filter');
      chips.forEach(function (c) {
        var on = c === chip;
        c.classList.toggle('is-active', on);
        c.setAttribute('aria-pressed', on ? 'true' : 'false');
      });
      tiles.forEach(function (t) {
        t.hidden = !(f === 'all' || t.getAttribute('data-cat') === f);
      });
    });
  });

  // Lightbox
  var lb = document.getElementById('lightbox');
  if (!lb || typeof lb.showModal !== 'function') return;
  var lbImg = lb.querySelector('img');
  var current = 0;

  function visible() { return tiles.filter(function (t) { return !t.hidden; }); }

  function show(i) {
    var list = visible();
    if (!list.length) return;
    current = (i + list.length) % list.length;
    var btn = list[current].querySelector('.tile-btn');
    lbImg.src = btn.getAttribute('data-full');
    lbImg.alt = btn.querySelector('img').alt;
  }

  tiles.forEach(function (t) {
    t.querySelector('.tile-btn').addEventListener('click', function () {
      show(visible().indexOf(t));
      lb.showModal();
    });
  });

  lb.querySelector('.lb-close').addEventListener('click', function () { lb.close(); });
  lb.querySelector('.lb-prev').addEventListener('click', function () { show(current - 1); });
  lb.querySelector('.lb-next').addEventListener('click', function () { show(current + 1); });
  lb.addEventListener('click', function (e) { if (e.target === lb) lb.close(); });
  lb.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight') show(current + 1);
    if (e.key === 'ArrowLeft') show(current - 1);
  });
})();
