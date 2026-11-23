/* Guardería Amelín — interacciones de la web */
(function () {
  'use strict';
  var M = window.Magic;
  var reduce = M.reduce;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var clamp = function (v, a, b) { return Math.max(a, Math.min(b, v)); };

  $('#year').textContent = new Date().getFullYear();

  /* ======================================================
     Posición de la cola de la escoba (para las chispas)
     En la ilustración, las ramas quedan abajo a la derecha.
     ====================================================== */
  var BRISTLE = { x: 0.86, y: 0.86 };
  function bristlePoint(el, flipped) {
    var r = el.getBoundingClientRect();
    var bx = flipped ? 1 - BRISTLE.x : BRISTLE.x;
    return { x: r.left + r.width * bx, y: r.top + r.height * BRISTLE.y };
  }

  /* ======================================================
     CIELOS
     ====================================================== */
  M.sky($('#heroSky'), { density: 4200, height: .8 });
  M.sky($('#daySky'), { density: 7000 });

  /* ======================================================
     INTRO: la bruja cruza la pantalla
     ====================================================== */
  var intro = $('#intro');
  var flyer = $('#flyer');
  var forceIntro = /[?&]intro/.test(location.search);
  var seen = false;
  try { seen = sessionStorage.getItem('amelin-intro') === '1'; } catch (e) {}

  function ready() {
    document.body.classList.add('is-ready');
    heroArrive();
  }

  function endIntro(fast) {
    if (intro.classList.contains('is-leaving')) return;
    try { sessionStorage.setItem('amelin-intro', '1'); } catch (e) {}
    flyer.hidden = true;
    var w = $('#heroWitch').getBoundingClientRect();
    intro.style.clipPath = '';
    intro.style.setProperty('--cx', (w.left + w.width / 2) + 'px');
    intro.classList.add('is-leaving');
    intro.style.clipPath = 'circle(0% at ' + (w.left + w.width / 2) + 'px ' + (w.top + w.height / 2) + 'px)';
    setTimeout(function () { intro.classList.add('is-gone'); }, fast ? 500 : 1100);
    setTimeout(ready, fast ? 50 : 250);
  }

  function runIntro() {
    document.documentElement.style.overflow = 'hidden';
    M.sky($('#introStars'), { density: 3000 });
    var letters = $$('#introWord span');
    var W = innerWidth, H = innerHeight;
    var fw = clamp(W * 0.26, 180, 340);
    var fh = fw * (777 / 821);
    flyer.hidden = false;
    var dur = 2600, t0 = null;
    var xs = letters.map(function (l) { var r = l.getBoundingClientRect(); return r.left + r.width / 2; });

    function pos(t) {
      // curva suave: entra por la derecha, ondula y sale por la izquierda
      var e = t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
      var x = (W + fw * .2) - e * (W + fw * 1.4);
      var y = H * 0.42 + Math.sin(t * Math.PI * 2.2) * H * 0.13 - fh / 2;
      return { x: x, y: y };
    }
    var done = false;
    function frame(ts) {
      if (done) return;
      if (!t0) t0 = ts;
      var t = clamp((ts - t0) / dur, 0, 1);
      var p = pos(t), q = pos(clamp(t + .01, 0, 1));
      var rot = -Math.atan2(q.y - p.y, Math.abs(q.x - p.x) || 1) * 0.6;
      flyer.style.transform = 'translate(' + p.x + 'px,' + p.y + 'px) rotate(' + rot + 'rad)';
      var b = bristlePoint(flyer);
      M.emit(b.x, b.y, { count: 4, angle: 0, spread: 1.4, speed: 2, life: 70, size: 8 });
      var cx = p.x + fw * .3;
      letters.forEach(function (l, i) { if (cx < xs[i] && !l.classList.contains('is-in')) { l.classList.add('is-in'); M.emit(xs[i], H / 2, { count: 12, speed: 3, size: 7 }); } });
      if (t < 1) requestAnimationFrame(frame);
      else {
        done = true;
        letters.forEach(function (l) { l.classList.add('is-in'); });
        intro.classList.add('show-sub');
        setTimeout(function () { document.documentElement.style.overflow = ''; endIntro(); }, 700);
      }
    }
    flyer.style.width = fw + 'px';
    requestAnimationFrame(frame);
    function skip() { done = true; document.documentElement.style.overflow = ''; endIntro(true); }
    $('#introSkip').addEventListener('click', skip);
    intro.addEventListener('click', function (e) { if (e.target !== $('#introSkip')) skip(); });
    addEventListener('keydown', function k(e) { if (e.key === 'Escape') { skip(); removeEventListener('keydown', k); } });
  }

  if (reduce || (seen && !forceIntro)) {
    intro.classList.add('is-gone');
    requestAnimationFrame(ready);
  } else {
    runIntro();
  }

  /* ======================================================
     HERO: llegada de la bruja + vuelta al hacer clic
     ====================================================== */
  var heroWitch = $('#heroWitch');
  var heroImg = $('#heroWitchImg');
  var flying = false;

  function trail(el, ms) {
    if (reduce) return;
    var end = performance.now() + ms;
    (function f(t) {
      var b = bristlePoint(el);
      M.emit(b.x, b.y, { count: 3, angle: 0, spread: 1.6, speed: 1.6, life: 60, size: 7 });
      if (t < end) requestAnimationFrame(f);
    })(performance.now());
  }

  function heroArrive() {
    if (reduce || !heroWitch.animate) return;
    flying = true;
    var a = heroWitch.animate([
      { transform: 'translate(70vw,-12vh) rotate(-14deg) scale(.7)', opacity: 0 },
      { transform: 'translate(30vw,-4vh) rotate(-8deg) scale(.85)', opacity: 1, offset: .35 },
      { transform: 'translate(-3vw,3vh) rotate(4deg) scale(1.02)', offset: .8 },
      { transform: 'none' }
    ], { duration: 1600, easing: 'cubic-bezier(.2,.7,.2,1)' });
    trail(heroImg, 1300);
    a.onfinish = function () {
      flying = false;
      var r = heroImg.getBoundingClientRect();
      M.burst(r.left + r.width * .5, r.top + r.height * .45, 30);
    };
  }

  function heroLoop() {
    if (flying) return;
    var r = heroImg.getBoundingClientRect();
    M.burst(r.left + r.width / 2, r.top + r.height / 2, 46);
    if (reduce || !heroWitch.animate) return;
    flying = true;
    var a = heroWitch.animate([
      { transform: 'none' },
      { transform: 'translate(-12vw,-10vh) rotate(-18deg)', offset: .18 },
      { transform: 'translate(-30vw,-34vh) rotate(-60deg) scale(.8)', offset: .36 },
      { transform: 'translate(-8vw,-46vh) rotate(-170deg) scale(.7)', offset: .5 },
      { transform: 'translate(12vw,-28vh) rotate(-290deg) scale(.8)', offset: .66 },
      { transform: 'translate(6vw,-6vh) rotate(-350deg) scale(.95)', offset: .84 },
      { transform: 'rotate(-360deg)' }
    ], { duration: 2200, easing: 'cubic-bezier(.45,.05,.35,1)' });
    trail(heroImg, 2100);
    a.onfinish = function () { flying = false; };
  }
  heroWitch.addEventListener('click', heroLoop);
  heroWitch.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); heroLoop(); } });

  // ratón: la bruja te sigue ligeramente + estela de varita en el hero
  var hero = $('.hero');
  var lastEmit = 0;
  if (!reduce && matchMedia('(pointer:fine)').matches) {
    hero.addEventListener('pointermove', function (e) {
      var r = hero.getBoundingClientRect();
      var dx = (e.clientX - r.left) / r.width - .5, dy = (e.clientY - r.top) / r.height - .5;
      heroWitch.style.translate = (dx * 24) + 'px ' + (dy * 18) + 'px';
      var now = performance.now();
      if (now - lastEmit > 40) { lastEmit = now; M.emit(e.clientX, e.clientY, { count: 1, speed: .6, life: 45, size: 5, gravity: .03 }); }
    });
  }

  /* ======================================================
     CABECERA, MENÚ, SCROLL
     ====================================================== */
  var header = $('#header');
  var guide = $('#guide'), quick = $('#quick');
  var lastY = scrollY, vel = 0, guideTilt = 0;
  var moon = $('.hero__moon');
  var tlSection = $('#dia'), tlFill = $('#tlFill'), tlBroom = $('#tlBroom'), tlItems = $$('.tl');

  function onScroll() {
    var y = scrollY;
    var heroH = hero.offsetHeight;
    header.classList.toggle('is-solid', y > heroH - 90);
    header.classList.toggle('is-hidden', y > heroH && y > lastY + 2 && !document.body.classList.contains('menu-open'));
    if (y < lastY - 2) header.classList.remove('is-hidden');
    vel = y - lastY;
    lastY = y;

    if (moon && !reduce) moon.style.translate = '0 ' + (y * .25) + 'px';

    // bruja guía
    var fam = document.getElementById('familias').getBoundingClientRect();
    var overDemo = innerWidth < 960 && fam.top < innerHeight * .6 && fam.bottom > innerHeight * .4;
    var on = y > heroH * .7 && !overDemo;
    guide.classList.toggle('is-on', on);
    if (!on) closeQuick();

    // línea del tiempo
    if (tlSection) {
      var r = tlSection.getBoundingClientRect();
      var p = clamp((innerHeight * .7 - r.top) / (r.height * .75), 0, 1);
      tlFill.style.width = (p * 100) + '%';
      tlBroom.style.left = (p * 100) + '%';
      tlItems.forEach(function (li, i) { li.classList.toggle('is-on', p >= i / (tlItems.length - 1) - .02); });
    }
  }
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // la bruja guía se inclina con la velocidad de scroll y suelta chispas
  (function guideLoop() {
    guideTilt += (clamp(vel * 1.2, -25, 25) - guideTilt) * .12;
    vel *= .85;
    var img = guide.firstElementChild;
    img.style.transform = 'rotate(' + guideTilt + 'deg) translateY(' + (-Math.abs(guideTilt) * .6) + 'px)';
    if (Math.abs(guideTilt) > 3 && guide.classList.contains('is-on')) {
      var b = bristlePoint(img);
      M.emit(b.x, b.y, { count: 1, angle: Math.PI / 3, spread: 1, speed: 1.2, life: 50, size: 5 });
    }
    requestAnimationFrame(guideLoop);
  })();

  function closeQuick() { quick.classList.remove('is-open'); guide.setAttribute('aria-expanded', 'false'); }
  guide.addEventListener('click', function () {
    var open = !quick.classList.contains('is-open');
    quick.classList.toggle('is-open', open);
    guide.setAttribute('aria-expanded', String(open));
    var r = guide.getBoundingClientRect();
    if (open) M.burst(r.left + r.width / 2, r.top + r.height / 2, 24);
  });
  $$('a', quick).forEach(function (a) { a.addEventListener('click', closeQuick); });
  document.addEventListener('click', function (e) { if (!quick.contains(e.target) && !guide.contains(e.target)) closeQuick(); });

  // menú móvil
  var burger = $('#burger');
  function setMenu(open) {
    document.body.classList.toggle('menu-open', open);
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    document.documentElement.style.overflow = open ? 'hidden' : '';
  }
  burger.addEventListener('click', function () { setMenu(!document.body.classList.contains('menu-open')); });
  $$('#drawer a').forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });
  addEventListener('keydown', function (e) { if (e.key === 'Escape') { setMenu(false); closeQuick(); } });

  // enlace activo en el menú
  var navLinks = $$('.nav a');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        navLinks.forEach(function (a) { a.classList.toggle('is-active', a.getAttribute('href') === '#' + en.target.id); });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    ['escuela', 'grupos', 'horarios', 'comedor', 'familias', 'visita'].forEach(function (id) { var s = document.getElementById(id); if (s) io.observe(s); });
  }

  /* ======================================================
     APARICIONES AL HACER SCROLL
     ====================================================== */
  var revs = $$('.reveal');
  if ('IntersectionObserver' in window && !reduce) {
    var ro = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('is-in'); ro.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -8% 0px' });
    revs.forEach(function (el) { ro.observe(el); });
  } else revs.forEach(function (el) { el.classList.add('is-in'); });

  /* tarjetas con inclinación 3D */
  if (!reduce && matchMedia('(pointer:fine)').matches) {
    $$('[data-tilt]').forEach(function (card) {
      card.addEventListener('pointermove', function (e) {
        var r = card.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
        card.style.transform = 'perspective(900px) rotateY(' + (x * 10) + 'deg) rotateX(' + (-y * 10) + 'deg) translateY(-6px)';
      });
      card.addEventListener('pointerleave', function () { card.style.transform = ''; });
    });
  }

  /* ======================================================
     HORARIOS: pestañas + barra del día
     ====================================================== */
  var START = 7.5, END = 17;
  function pct(h) { return ((h - START) / (END - START)) * 100; }
  function fmt(h) { var m = Math.round((h % 1) * 60); return Math.floor(h) + ':' + (m < 10 ? '0' : '') + m; }
  function ranges(s) { return (s || '').split(',').filter(Boolean).map(function (r) { return r.split('-').map(Number); }); }

  function renderDayline(el) {
    var html = '<div class="dayline__legend"><span><i class="soft"></i>Franja de entrada</span><span><i></i>En Amelín</span></div><div class="dayline__bar">';
    ranges(el.dataset.stay).forEach(function (r) {
      html += '<div class="dayline__seg" style="left:' + pct(r[0]) + '%;width:' + (pct(r[1]) - pct(r[0])) + '%">' + (pct(r[1]) - pct(r[0]) > 18 ? fmt(r[0]) + ' – ' + fmt(r[1]) : '') + '</div>';
    });
    ranges(el.dataset.in).forEach(function (r) {
      html += '<div class="dayline__seg dayline__seg--soft" style="left:' + pct(r[0]) + '%;width:' + Math.max(pct(r[1]) - pct(r[0]), 1.5) + '%"></div>';
    });
    html += '</div><div class="dayline__ticks">';
    for (var h = START; h <= END; h += 1) html += '<span>' + fmt(h) + '</span>';
    html += '</div>';
    el.innerHTML = html;
  }

  var tabs = $$('[role="tab"]');
  function selectTab(tab, focus) {
    tabs.forEach(function (t) {
      var on = t === tab;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
      var p = document.getElementById(t.getAttribute('aria-controls'));
      p.hidden = !on;
      if (on) renderDayline($('.dayline', p));
    });
    if (focus) tab.focus();
    var r = tab.getBoundingClientRect();
    M.emit(r.left + 30, r.top + r.height / 2, { count: 10, speed: 2.5, size: 6 });
  }
  tabs.forEach(function (t, i) {
    t.addEventListener('click', function () { selectTab(t); });
    t.addEventListener('keydown', function (e) {
      var k = e.key, n = null;
      if (k === 'ArrowDown' || k === 'ArrowRight') n = tabs[(i + 1) % tabs.length];
      if (k === 'ArrowUp' || k === 'ArrowLeft') n = tabs[(i - 1 + tabs.length) % tabs.length];
      if (n) { e.preventDefault(); selectTab(n, true); }
    });
  });
  renderDayline($('#p-temp .dayline'));

  /* ======================================================
     MENÚ DE HOY (ejemplo — se alimentaría desde el panel)
     ====================================================== */
  var MENUS = [
    ['Crema de calabacín', 'Merluza al horno con patata', 'Pera'],
    ['Lentejas estofadas con verduras', 'Tortilla francesa con tomate', 'Yogur natural'],
    ['Arroz con tomate', 'Pollo asado con zanahoria', 'Plátano'],
    ['Puré de verduras de temporada', 'Albóndigas caseras en salsa', 'Manzana asada'],
    ['Macarrones con verduras', 'Lenguado a la plancha', 'Mandarina']
  ];
  var d = new Date(), wd = d.getDay();
  var idx = wd >= 1 && wd <= 5 ? wd - 1 : 0;
  var mn = MENUS[idx];
  $('#m1').textContent = mn[0]; $('#m2').textContent = mn[1]; $('#m3').textContent = mn[2];
  $('#todayDate').textContent = wd >= 1 && wd <= 5
    ? d.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })
    : 'Próximo lunes';

  /* ======================================================
     DEMO DEL RINCÓN DE FAMILIAS: cambiar de vista sin salir
     ====================================================== */
  var demoFrame = $('#demoFrame'), demoScreen = $('#demoScreen');
  function fitDemo() {
    var w = demoScreen.clientWidth, h = demoScreen.clientHeight;
    if (!w) return;
    var k = w / 390;
    demoFrame.style.transform = 'scale(' + k + ')';
    demoFrame.style.height = (h / k) + 'px';
  }
  fitDemo();
  if ('ResizeObserver' in window) new ResizeObserver(fitDemo).observe(demoScreen);
  else addEventListener('resize', fitDemo);
  $$('[data-demo-role]').forEach(function (b) {
    b.addEventListener('click', function () {
      $$('[data-demo-role]').forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
      demoFrame.src = 'familias.html?embed=1&rol=' + b.dataset.demoRole;
      var rc = b.getBoundingClientRect();
      M.emit(rc.left + rc.width / 2, rc.top + rc.height / 2, { count: 14, speed: 2.5, size: 6 });
    });
  });

  /* ======================================================
     FORMULARIO DE VISITA
     ====================================================== */
  var box = $('#visitForm'), form = $('form', box);
  $$('[data-topic]').forEach(function (a) {
    a.addEventListener('click', function () {
      $$('input[name="interes"]', form).forEach(function (c) { c.checked = c.value === a.dataset.topic; });
    });
  });
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var ok = true;
    ['#f-name', '#f-tel'].forEach(function (s) {
      var f = $(s, form), bad = !f.value.trim() || (s === '#f-tel' && f.value.replace(/\D/g, '').length < 9);
      f.style.borderColor = bad ? 'var(--c-n)' : '';
      f.setAttribute('aria-invalid', String(bad));
      if (bad && ok) { f.focus(); ok = false; }
    });
    if (!ok) return;
    // En producción: envío a un servicio de formularios / email de la guardería.
    $('#okName').textContent = $('#f-name').value.trim().split(' ')[0];
    var r = box.getBoundingClientRect();
    box.classList.add('is-sent');
    M.burst(r.left + r.width / 2, r.top + 120, 70);
  });
})();
