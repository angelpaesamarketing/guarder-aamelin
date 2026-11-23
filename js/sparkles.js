/* Partículas mágicas y cielos estrellados — sin dependencias */
(function () {
  'use strict';
  var COLORS = ['#ffc83a', '#fff1b8', '#e2489e', '#ff8a3d', '#c8a6e6', '#ffffff', '#1f9d63'];
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var DPR = Math.min(window.devicePixelRatio || 1, 2);

  /* ---------- capa de destellos (pantalla completa) ---------- */
  var cv = document.getElementById('sparkles');
  var ctx = cv ? cv.getContext('2d') : null;
  var parts = [];
  var running = false;

  function size() {
    if (!cv) return;
    cv.width = innerWidth * DPR; cv.height = innerHeight * DPR;
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  }
  size(); addEventListener('resize', size);

  function star(c, x, y, r, rot) {
    c.save(); c.translate(x, y); c.rotate(rot); c.beginPath();
    for (var i = 0; i < 4; i++) {
      c.lineTo(0, -r); c.rotate(Math.PI / 4); c.lineTo(0, -r * 0.36); c.rotate(Math.PI / 4);
    }
    c.closePath(); c.fill(); c.restore();
  }

  function emit(x, y, opt) {
    if (!ctx || reduce) return;
    opt = opt || {};
    var n = opt.count || 3;
    for (var i = 0; i < n; i++) {
      var a = opt.angle != null ? opt.angle + (Math.random() - .5) * (opt.spread || 1.2) : Math.random() * Math.PI * 2;
      var sp = (opt.speed || 1.4) * (0.4 + Math.random());
      parts.push({
        x: x, y: y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp,
        life: 0, max: (opt.life || 60) * (0.6 + Math.random() * .8),
        r: (opt.size || 6) * (0.5 + Math.random()),
        rot: Math.random() * 6, vr: (Math.random() - .5) * .2,
        c: opt.color || COLORS[(Math.random() * COLORS.length) | 0],
        g: opt.gravity != null ? opt.gravity : 0.02,
        dot: Math.random() < (opt.dots != null ? opt.dots : .35)
      });
    }
    if (parts.length > 900) parts.splice(0, parts.length - 900);
    if (!running) { running = true; requestAnimationFrame(tick); }
  }

  function burst(x, y, n) { emit(x, y, { count: n || 40, speed: 4, life: 70, size: 9, gravity: .05 }); }

  function tick() {
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    for (var i = parts.length - 1; i >= 0; i--) {
      var p = parts[i];
      p.life++; p.x += p.vx; p.y += p.vy; p.vy += p.g; p.vx *= .985; p.vy *= .985; p.rot += p.vr;
      var t = p.life / p.max;
      if (t >= 1) { parts.splice(i, 1); continue; }
      ctx.globalAlpha = t < .15 ? t / .15 : 1 - (t - .15) / .85;
      ctx.fillStyle = p.c;
      ctx.shadowColor = p.c; ctx.shadowBlur = 10;
      if (p.dot) { ctx.beginPath(); ctx.arc(p.x, p.y, p.r * .35 * (1 - t * .5), 0, 7); ctx.fill(); }
      else star(ctx, p.x, p.y, p.r * (1 - t * .4), p.rot);
    }
    ctx.globalAlpha = 1; ctx.shadowBlur = 0;
    if (parts.length) requestAnimationFrame(tick); else { running = false; ctx.clearRect(0, 0, innerWidth, innerHeight); }
  }

  /* ---------- cielo estrellado en un canvas ---------- */
  function sky(canvas, opt) {
    if (!canvas) return;
    opt = opt || {};
    var c = canvas.getContext('2d');
    var stars = [], shooting = null, w, h, visible = true, raf = 0;
    function resize() {
      var r = canvas.getBoundingClientRect();
      w = r.width; h = r.height;
      canvas.width = w * DPR; canvas.height = h * DPR; c.setTransform(DPR, 0, 0, DPR, 0, 0);
      var n = Math.round(w * h / (opt.density || 5200));
      stars = [];
      for (var i = 0; i < n; i++) {
        stars.push({ x: Math.random() * w, y: Math.random() * h * (opt.height || 1), r: Math.random() * 1.4 + .3,
          p: Math.random() * 6.28, s: .5 + Math.random() * 1.5, big: Math.random() < .06 });
      }
      if (reduce) draw(0);
    }
    function draw(time) {
      c.clearRect(0, 0, w, h);
      for (var i = 0; i < stars.length; i++) {
        var s = stars[i];
        var a = .35 + .65 * Math.abs(Math.sin(s.p + time * .001 * s.s));
        c.globalAlpha = a; c.fillStyle = s.big ? '#ffe9a6' : '#fff';
        if (s.big) { c.shadowColor = '#ffe9a6'; c.shadowBlur = 8; star(c, s.x, s.y, s.r * 3.2, 0); c.shadowBlur = 0; }
        else { c.beginPath(); c.arc(s.x, s.y, s.r, 0, 7); c.fill(); }
      }
      // estrella fugaz ocasional
      if (!reduce) {
        if (!shooting && Math.random() < .004) shooting = { x: Math.random() * w * .8 + w * .2, y: Math.random() * h * .3, l: 0 };
        if (shooting) {
          shooting.l += 1;
          var sx = shooting.x - shooting.l * 9, sy = shooting.y + shooting.l * 4;
          var g = c.createLinearGradient(sx, sy, sx + 90, sy - 40);
          g.addColorStop(0, 'rgba(255,255,255,.9)'); g.addColorStop(1, 'rgba(255,255,255,0)');
          c.globalAlpha = 1 - shooting.l / 50; c.strokeStyle = g; c.lineWidth = 2;
          c.beginPath(); c.moveTo(sx, sy); c.lineTo(sx + 90, sy - 40); c.stroke();
          if (shooting.l > 50) shooting = null;
        }
      }
      c.globalAlpha = 1;
    }
    function loop(t) { if (visible) draw(t); raf = requestAnimationFrame(loop); }
    resize();
    addEventListener('resize', resize);
    if (!reduce) {
      if ('IntersectionObserver' in window) new IntersectionObserver(function (e) { visible = e[0].isIntersecting; }).observe(canvas);
      raf = requestAnimationFrame(loop);
    }
    return { stop: function () { cancelAnimationFrame(raf); } };
  }

  window.Magic = { emit: emit, burst: burst, sky: sky, reduce: reduce, COLORS: COLORS };
})();
