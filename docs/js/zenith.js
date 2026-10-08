/* Le Zénith Hôtel & Spa — comportements partagés (header, menu, panneau de réservation, carrousels, spa, animations) */
(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- Header : transparent sur le hero, plein après le seuil ---- */
  var header = $('[data-header]');
  var solid = null;
  function tick() {
    if (!header) return;
    var t = parseFloat(header.getAttribute('data-solid-after'));
    var s = window.scrollY > window.innerHeight * (isNaN(t) ? 0.6 : t);
    if (s === solid) return;
    solid = s;
    header.style.background = s ? 'rgba(245,239,230,.94)' : 'transparent';
    header.style.backdropFilter = s ? 'blur(10px)' : 'none';
    header.style.webkitBackdropFilter = header.style.backdropFilter;
    header.style.boxShadow = s ? '0 1px 0 #d9cbb5' : 'none';
    header.style.paddingTop = header.style.paddingBottom = s ? '12px' : '18px';
    $$('[data-head-ink]', header).forEach(function (n) { n.style.color = s ? '#6e0d1c' : '#f5efe6'; });
  }
  window.addEventListener('scroll', tick, { passive: true });
  window.addEventListener('resize', tick);
  tick();

  /* ---- Menu plein écran (mobile) ---- */
  var menu = $('.z-menu');
  function setMenu(open) {
    if (!menu) return;
    menu.hidden = !open;
    document.body.style.overflow = open ? 'hidden' : '';
    if (open) { var b = $('button', menu); b && b.focus(); }
  }
  $$('[data-menu-toggle]').forEach(function (b) {
    b.addEventListener('click', function () { setMenu(menu.hidden); });
  });
  $$('a', menu || document.createElement('div')).forEach(function (a) {
    a.addEventListener('click', function () { setMenu(false); });
  });

  /* ---- Panneau de réservation ---- */
  var panel = $('aside[aria-label="Réservation"]');
  var overlay = $('div[data-close-book]');
  var opener = null;
  function setBooking(open) {
    if (!panel || !overlay) return;
    overlay.style.opacity = open ? 1 : 0;
    overlay.style.pointerEvents = open ? 'auto' : 'none';
    panel.style.transform = open ? 'translateX(0)' : 'translateX(105%)';
    panel.inert = !open;
    panel.setAttribute('aria-hidden', open ? 'false' : 'true');
    if (open) {
      setMenu(false);
      document.body.style.overflow = 'hidden';
      setTimeout(function () { var c = $('[data-close-book]', panel); c && c.focus(); }, 50);
    } else {
      document.body.style.overflow = '';
      opener && opener.focus && opener.focus();
    }
  }
  if (panel) { panel.inert = true; panel.setAttribute('aria-hidden', 'true'); }
  $$('[data-book]').forEach(function (b) {
    b.addEventListener('click', function (e) { e.preventDefault(); opener = b; setBooking(true); });
  });
  $$('[data-close-book]').forEach(function (b) {
    b.addEventListener('click', function () { setBooking(false); });
  });
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    if (panel && !panel.inert) setBooking(false);
    else if (menu && !menu.hidden) setMenu(false);
  });

  /* ---- Dates + compteurs (panneau et page Réservation) ---- */
  function iso(d) { return d.toISOString().slice(0, 10); }
  var today = new Date(), tomorrow = new Date(Date.now() + 864e5);
  $$('input[data-date="in"]').forEach(function (i) { i.value = iso(today); i.min = iso(today); });
  $$('input[data-date="out"]').forEach(function (i) { i.value = iso(tomorrow); i.min = iso(tomorrow); });
  $$('input[data-date="in"]').forEach(function (inp) {
    inp.addEventListener('change', function () {
      var group = inp.closest('form, aside, section, div[style*="grid"]') || document;
      var out = $('input[data-date="out"]', group) || $('input[data-date="out"]');
      if (!out || !inp.value) return;
      var next = new Date(new Date(inp.value).getTime() + 864e5);
      out.min = iso(next);
      if (!out.value || out.value < iso(next)) out.value = iso(next);
    });
  });
  var LIMITS = { rooms: [1, 5], adults: [1, 10], children: [0, 6] };
  $$('[data-counter]').forEach(function (b) {
    b.addEventListener('click', function () {
      var val = $('span', b.parentElement);
      var lim = LIMITS[b.getAttribute('data-counter')];
      var n = Math.max(lim[0], Math.min(lim[1], (parseInt(val.textContent, 10) || 0) + parseInt(b.getAttribute('data-step'), 10)));
      val.textContent = n;
    });
  });

  /* ---- Carrousels (flèches précédent / suivant) ---- */
  var rail = $('[data-rail]');
  var railMax = /seminaires/.test(location.pathname) ? 650 : 430;
  $$('[data-rail-step]').forEach(function (b) {
    b.addEventListener('click', function () {
      if (!rail) return;
      rail.scrollBy({ left: parseInt(b.getAttribute('data-rail-step'), 10) * Math.min(rail.clientWidth * 0.8, railMax), behavior: reduced ? 'auto' : 'smooth' });
    });
  });

  /* ---- Spa : sélecteur d'espaces ---- */
  var picks = $$('[data-pick]');
  var shots = $$('[data-space-img]');
  function pick(i) {
    picks.forEach(function (b, k) {
      var label = b.lastElementChild;
      label.style.opacity = k === i ? 1 : 0.45;
      label.style.transform = k === i ? 'translateX(12px)' : 'translateX(0)';
      b.setAttribute('aria-pressed', k === i ? 'true' : 'false');
    });
    shots.forEach(function (im, k) {
      im.style.opacity = k === i ? 1 : 0;
      im.style.transform = k === i ? 'scale(1)' : 'scale(1.08)';
    });
  }
  picks.forEach(function (b, i) {
    b.addEventListener('click', function () { pick(i); });
    b.addEventListener('mouseenter', function () { pick(i); });
    b.addEventListener('focus', function () { pick(i); });
  });

  /* ---- Animations (désactivées si prefers-reduced-motion) ---- */
  function startAnim() {
    if (window.ZenithAnim) window.ZenithAnim.init({ animations: !reduced, parallax: 1 });
  }
  if (document.readyState === 'complete') startAnim();
  else window.addEventListener('load', startAnim);
})();
