/* Rincón de familias — demo funcional (sin servidor, datos en localStorage) */
(function () {
  'use strict';
  var KEY = 'amelin-demo-v1';
  var app = document.getElementById('app');
  var params = new URLSearchParams(location.search);
  if (params.has('embed')) document.body.classList.add('embed');

  /* ---------------- iconos ---------------- */
  var P = {
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
    apple: '<path d="M12 7c-2-2-7-1.5-7 4 0 4 3 9 5 9 1 0 1.3-.5 2-.5s1 .5 2 .5c2 0 5-5 5-9 0-5.5-5-6-7-4z"/><path d="M12 7c0-2 1-4 3-4"/>',
    bowl: '<path d="M3 11h18a9 9 0 0 1-18 0z"/><path d="M8 7c0-1.5 1-2 1-3.5M12 7c0-1.5 1-2 1-3.5M16 7c0-1.5 1-2 1-3.5"/>',
    moon: '<path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/>',
    wake: '<path d="M4 18h16M7 14a5 5 0 0 1 10 0M12 4v3M5.6 7.6l1.6 1.6M18.4 7.6l-1.6 1.6"/>',
    drop: '<path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z"/>',
    smile: '<circle cx="12" cy="12" r="9"/><path d="M8.5 14.5a4.5 4.5 0 0 0 7 0M9 9.5h.01M15 9.5h.01"/>',
    note: '<path d="M5 4h10l4 4v12H5z"/><path d="M15 4v4h4M8 12h8M8 16h5"/>',
    palette: '<path d="M12 3a9 9 0 1 0 0 18c1.5 0 2-1 2-2s-1-1.5-1-2.5S14 15 15 15h2a4 4 0 0 0 4-4c0-4.4-4-8-9-8z"/><circle cx="7.5" cy="11" r="1"/><circle cx="10.5" cy="7.5" r="1"/><circle cx="15" cy="8" r="1"/>',
    home: '<path d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z"/>',
    bell: '<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9M10.3 21a2 2 0 0 0 3.4 0"/>',
    chat: '<path d="M21 12a8 8 0 0 1-11.6 7.1L4 20.5l1.4-4.8A8 8 0 1 1 21 12z"/>',
    doc: '<path d="M6 3h9l4 4v14H6z"/><path d="M14 3v5h5M9 13h7M9 17h5"/>',
    users: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c.7-3.4 3.4-5.5 6.5-5.5s5.8 2.1 6.5 5.5M16 4.6a3.5 3.5 0 0 1 0 6.8M18 14.7c2 .7 3.3 2.6 3.5 5.3"/>',
    send: '<path d="M22 2 11 13M22 2l-7 20-4-9-9-4z"/>',
    check: '<path d="M20 6 9 17l-5-5"/>',
    away: '<circle cx="12" cy="8" r="4"/><path d="M4 21c1.4-3.7 4.4-6 8-6M16 16l5 5M21 16l-5 5"/>',
    car: '<path d="M5 17h14M5 17a2 2 0 1 0 4 0M15 17a2 2 0 1 0 4 0M3 17v-5l2-5h14l2 5v5"/><path d="M3 12h18"/>',
    pill: '<rect x="3" y="9" width="18" height="6" rx="3" transform="rotate(-45 12 12)"/><path d="M9.5 9.5l5 5"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    bag: '<path d="M5 8h14l-1 13H6z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/>',
    pen: '<path d="M4 20h4L19 9l-4-4L4 16z"/><path d="M13.5 6.5l4 4"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    out: '<path d="M15 4h4v16h-4M10 17l5-5-5-5M15 12H3"/>',
    door: '<path d="M5 21V4h10v17M15 6h4v15M11 12h.01"/>',
    star: '<path d="M12 2l2.9 6.9L22 9.6l-5.5 4.7 1.7 7.2L12 17.8 5.8 21.5l1.7-7.2L2 9.6l7.1-.7z"/>',
    spark: '<path d="M12 2l2.4 7.6L22 12l-7.6 2.4L12 22l-2.4-7.6L2 12l7.6-2.4z"/>'
  };
  function ic(n, extra) { return '<svg class="i"' + (extra || '') + ' viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + P[n] + '</svg>'; }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function now() { var d = new Date(); return pad(d.getHours()) + ':' + pad(d.getMinutes()); }
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function mins(t) { var p = t.split(':'); return +p[0] * 60 + +p[1]; }
  function todayISO() { var d = new Date(); return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }
  function niceDate(iso) { if (!iso) return ''; var d = new Date(iso + 'T12:00'); return d.toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short' }); }

  /* ---------------- tipos de registro ---------------- */
  var T = {
    llegada: { icon: 'sun', c: 'var(--c-e)', title: 'Llegada' },
    salida: { icon: 'door', c: 'var(--c-i)', title: 'Salida' },
    almuerzo: { icon: 'apple', c: 'var(--c-m)', title: 'Almuerzo' },
    comida: { icon: 'bowl', c: 'var(--c-l)', title: 'Comida' },
    merienda: { icon: 'apple', c: 'var(--c-a)', title: 'Merienda' },
    'siesta-ini': { icon: 'moon', c: '#5b6ee1', title: 'Se ha dormido' },
    'siesta-fin': { icon: 'wake', c: '#5b6ee1', title: 'Se ha despertado' },
    panal: { icon: 'drop', c: '#2f9bd6', title: 'Pañal' },
    animo: { icon: 'smile', c: 'var(--c-a)', title: 'Estado de ánimo' },
    actividad: { icon: 'palette', c: 'var(--brand)', title: 'Actividad' },
    nota: { icon: 'note', c: 'var(--brand)', title: 'Nota de Ana' },
    pide: { icon: 'bag', c: '#c38f00', title: 'Necesita traer' }
  };
  var LEVEL = ['', 'Poco', 'Bastante', 'Todo'];
  var AVISO = {
    ausencia: { icon: 'away', c: 'var(--c-n)', title: 'Ausencia' },
    recoge: { icon: 'car', c: 'var(--c-m)', title: 'Recoge otra persona' },
    tarde: { icon: 'clock', c: 'var(--c-l)', title: 'Llegaré tarde' },
    medicacion: { icon: 'pill', c: 'var(--brand)', title: 'Medicación' },
    info: { icon: 'bag', c: '#c38f00', title: 'Aviso' }
  };

  /* ---------------- datos iniciales ---------------- */
  function seed() {
    var tpl = [
      ['08:05', 'llegada', 'Ha llegado con papá, muy contenta.'],
      ['09:40', 'actividad', 'Asamblea y canciones. ¡Hoy tocaba la canción de la bruja!'],
      ['10:05', 'almuerzo', 'Pera y plátano.', 3],
      ['10:45', 'actividad', 'Pintura con los dedos. Ha elegido el morado, como Amelín.'],
      ['11:30', 'panal', 'Pis.'],
      ['12:05', 'comida', 'Crema de calabacín y merluza al horno. Ha repetido crema.', 2],
      ['12:50', 'siesta-ini', ''],
      ['14:35', 'siesta-fin', 'Ha dormido 1 h 45 min.'],
      ['15:00', 'merienda', 'Yogur y galletas.', 3]
    ];
    var n = new Date(), cur = n.getHours() * 60 + n.getMinutes(), wd = n.getDay();
    var live = wd >= 1 && wd <= 5 && cur > mins('08:05') && cur < mins('17:00');
    var lucia = tpl.filter(function (r) { return !live || mins(r[0]) <= cur; }).map(function (r) {
      return { t: r[0], type: r[1], text: r[2], level: r[3] || 0 };
    });
    return {
      v: 1,
      date: todayISO(),
      kids: [
        { id: 'lucia', name: 'Lucía', c: 'var(--c-a)', age: '20 meses', family: 'Familia de Lucía' },
        { id: 'mateo', name: 'Mateo', c: 'var(--c-m)', age: '22 meses' },
        { id: 'irati', name: 'Irati', c: 'var(--c-l)', age: '19 meses' },
        { id: 'unai', name: 'Unai', c: '#2f9bd6', age: '23 meses' },
        { id: 'noa', name: 'Noa', c: 'var(--brand)', age: '18 meses' },
        { id: 'aimar', name: 'Aimar', c: '#e6a800', age: '21 meses' }
      ],
      log: {
        lucia: lucia,
        mateo: [{ t: '07:45', type: 'llegada', text: 'Con mamá.' }, { t: '10:05', type: 'almuerzo', text: 'Manzana.', level: 2 }],
        irati: [{ t: '08:30', type: 'llegada', text: '' }],
        unai: [{ t: '09:10', type: 'llegada', text: 'Viene un poco mimoso.' }, { t: '12:40', type: 'siesta-ini', text: '' }],
        noa: [],
        aimar: [{ t: '08:50', type: 'llegada', text: '' }, { t: '10:05', type: 'almuerzo', text: '', level: 3 }]
      },
      bring: { lucia: ['Pañales', 'Toallitas'] },
      avisos: [
        { id: 'a1', kid: 'noa', type: 'ausencia', date: todayISO(), detail: 'Tiene un poco de fiebre, se queda en casa hoy.', created: '07:52', status: 'nuevo' },
        { id: 'a2', kid: 'lucia', type: 'recoge', date: todayISO(), detail: 'Recoge la abuela Maite (DNI ···4521K) a las 16:00.', created: 'Ayer', status: 'leido' }
      ],
      msgs: [
        { from: 'educadora', text: '¡Hola! Hoy Lucía ha dicho «agua» por primera vez. Nos ha hecho muchísima ilusión.', t: 'Ayer · 11:20' },
        { from: 'familia', text: '¡Qué bonito! Gracias por contárnoslo, en casa también lo intenta.', t: 'Ayer · 13:02' },
        { from: 'educadora', text: 'Recordad que el viernes hacemos el taller de otoño. Si podéis, traed hojas secas del parque.', t: 'Hoy · 08:15' }
      ],
      circs: [
        { id: 'c1', title: 'Excursión a la granja escuela', date: 'Viernes 4 dic', body: 'Saldremos a las 9:30 y volveremos para la comida. Traed ropa cómoda y una gorra. Necesitamos vuestra autorización.', sign: true, signed: false, count: 9, total: 14, c: 'var(--c-m)' },
        { id: 'c2', title: 'Autorización de fotos y vídeos', date: 'Curso 2026-27', body: 'Fotos del día a día que compartimos solo con las familias del grupo dentro de la app.', sign: true, signed: true, signedAt: '12 sep · 18:40', count: 14, total: 14, c: 'var(--c-a)' },
        { id: 'c3', title: 'Calendario de Navidad', date: 'Diciembre', body: 'La guarde cierra del 24 al 26 de diciembre y el 31 y 1 de enero. El día 22 celebramos la fiesta con las familias a las 15:30.', sign: false, c: 'var(--c-e)' }
      ]
    };
  }

  var S;
  function load() {
    try { S = JSON.parse(localStorage.getItem(KEY)); } catch (e) { S = null; }
    if (!S || S.v !== 1 || S.date !== todayISO()) { S = seed(); save(); }
  }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} }
  load();

  /* ---------------- sesión / navegación ---------------- */
  var role = params.get('rol') === 'educadora' ? 'educadora' : (params.get('rol') === 'familia' ? 'familia' : null);
  var tab = 'hoy';
  var avisoType = 'ausencia';
  var openKid = null;
  var ME = 'lucia';

  function kid(id) { for (var i = 0; i < S.kids.length; i++) if (S.kids[i].id === id) return S.kids[i]; }
  function unreadAvisos() { return S.avisos.filter(function (a) { return a.status === 'nuevo'; }).length; }
  function pendingSign() { return S.circs.filter(function (c) { return c.sign && !c.signed; }).length; }

  /* ---------------- render ---------------- */
  function render() {
    var keepScroll = app.querySelector('.screen');
    var st = keepScroll ? keepScroll.scrollTop : 0;
    var html = '';
    if (!role) html += loginHTML();
    else if (role === 'familia') html += familyHTML();
    else html += staffHTML();
    html += '<div class="toast" id="toast" role="status"></div>';
    app.innerHTML = html;
    var sc = app.querySelector('.screen');
    if (sc && keepScroll && !render.reset) sc.scrollTop = st;
    render.reset = false;
    if (tab === 'chat') { var b = app.querySelector('.screen'); if (b) b.scrollTop = b.scrollHeight; }
    document.querySelectorAll('[data-role]').forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.role === (role || 'familia'))); });
  }

  function toast(msg) {
    var t = document.getElementById('toast');
    if (!t) return;
    t.innerHTML = ic('spark') + esc(msg);
    t.classList.add('show');
    clearTimeout(toast.h);
    toast.h = setTimeout(function () { t.classList.remove('show'); }, 2200);
  }

  function loginHTML() {
    return '<div class="login">' +
      '<img src="assets/img/bruja.png" alt="">' +
      '<h1>Rincón de <em>familias</em></h1>' +
      '<p>Su día en la guarde, avisos, mensajes y autorizaciones. Todo en un mismo sitio.</p>' +
      '<button class="cta cta--gold" data-act="login" data-r="familia">Entrar como familia</button>' +
      '<button class="cta cta--line" data-act="login" data-r="educadora">Entrar como educadora</button>' +
      '<small>Demo: no hace falta usuario ni contraseña</small></div>';
  }

  function tabbar(items) {
    return '<nav class="tabbar" aria-label="Secciones">' + items.map(function (it) {
      return '<button data-act="tab" data-tab="' + it[0] + '"' + (tab === it[0] ? ' aria-current="page"' : '') + '>' + ic(it[2]) + it[1] +
        (it[3] ? '<span class="dot-badge">' + it[3] + '</span>' : '') + '</button>';
    }).join('') + '</nav>';
  }

  function topbar(small, title, right) {
    return '<div class="topbar"><h2><small>' + esc(small) + '</small>' + title + '</h2>' + (right || '') + '</div>';
  }

  function feedItem(e) {
    var t = T[e.type] || T.nota;
    var meter = e.level ? '<div class="meter" aria-label="Ha comido: ' + LEVEL[e.level] + '">' + [1, 2, 3].map(function (n) { return '<span class="' + (n <= e.level ? 'on' : '') + '"></span>'; }).join('') + '</div>' : '';
    var title = t.title + (e.level ? ' · ' + LEVEL[e.level] : '');
    return '<li style="--c:' + t.c + '"><i>' + ic(t.icon) + '</i><div class="card"><header><b>' + esc(title) + '</b><time>' + esc(e.t) + '</time></header>' +
      (e.text ? '<p>' + esc(e.text) + '</p>' : '') + meter + '</div></li>';
  }

  function kidState(id) {
    var L = S.log[id] || [];
    if (!L.length) return { cls: 'off', txt: 'Sin llegar' };
    var last = L[L.length - 1];
    var sleeping = false;
    L.forEach(function (e) { if (e.type === 'siesta-ini') sleeping = true; if (e.type === 'siesta-fin') sleeping = false; });
    if (last.type === 'salida') return { cls: 'off', txt: 'Ya en casa' };
    if (sleeping) return { cls: 'sleep', txt: 'Durmiendo' };
    return { cls: '', txt: 'En clase' };
  }

  function statusCard() {
    var k = kid(ME), L = S.log[ME] || [], st = kidState(ME);
    var last = L[L.length - 1];
    var now_ = 'Todavía no ha llegado', since = 'Os avisaremos en cuanto llegue';
    if (last) {
      var map = {
        'siesta-ini': 'está durmiendo la siesta', 'siesta-fin': 'se acaba de despertar', comida: 'acaba de comer', almuerzo: 'acaba de almorzar',
        merienda: 'está merendando', actividad: 'está en plena actividad', llegada: 'ya está en la guarde', salida: 'ya está en casa', panal: 'está en clase, cambiada y feliz'
      };
      now_ = k.name + ' ' + (map[last.type] || 'está en clase');
      if (st.cls === 'sleep') { var ini = L.filter(function (e) { return e.type === 'siesta-ini'; }).pop(); now_ = k.name + ' está durmiendo la siesta'; since = 'Desde las ' + ini.t; }
      else since = 'Actualizado a las ' + last.t;
    }
    var food = L.filter(function (e) { return e.type === 'comida'; }).pop();
    var sl = L.filter(function (e) { return e.type === 'siesta-ini' || e.type === 'siesta-fin'; });
    var sleepTxt = '—';
    if (sl.length >= 2 && sl[sl.length - 1].type === 'siesta-fin') { var d = mins(sl[sl.length - 1].t) - mins(sl[sl.length - 2].t); sleepTxt = Math.floor(d / 60) + 'h ' + pad(d % 60) + 'm'; }
    else if (st.cls === 'sleep') sleepTxt = 'en curso';
    var diapers = L.filter(function (e) { return e.type === 'panal'; }).length;
    return '<div class="status"><img src="assets/img/bruja.png" alt="">' +
      '<div class="status__label">Ahora mismo</div><div class="status__now">' + esc(now_) + '</div><div class="status__since">' + esc(since) + '</div>' +
      '<div class="status__stats"><span>' + ic('bowl') + (food ? LEVEL[food.level] || 'Sí' : '—') + '</span><span>' + ic('moon') + sleepTxt + '</span><span>' + ic('drop') + diapers + '</span></div></div>';
  }

  /* ===== FAMILIA ===== */
  function familyHTML() {
    var k = kid(ME);
    var body = '';
    var unreadChat = 0;
    if (tab === 'hoy') {
      var L = (S.log[ME] || []).slice().reverse();
      var bring = S.bring[ME] || [];
      var d = new Date();
      body = topbar(d.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' }), 'Hola, familia<br>de ' + esc(k.name),
        '<div class="avatar" style="--c:' + k.c + '" aria-label="' + esc(k.name) + '">' + k.name[0] + '</div>') +
        statusCard() +
        (bring.length ? '<div class="bring">' + ic('bag') + '<div><b>Necesita: ' + esc(bring.join(', ')) + '</b><span>Te lo pide Ana, su educadora</span></div><button data-act="bring-ok">Lo llevo</button></div>' : '') +
        '<div class="h3">Avisar a la guarde</div>' +
        '<div class="quick">' +
        [['ausencia', 'No viene'], ['recoge', 'Recoge otra persona'], ['tarde', 'Llegaré tarde'], ['medicacion', 'Medicación']].map(function (q) {
          var a = AVISO[q[0]]; return '<button data-act="quick" data-type="' + q[0] + '" style="--c:' + a.c + '"><i>' + ic(a.icon) + '</i>' + q[1] + '</button>';
        }).join('') + '</div>' +
        '<div class="h3">Su día <small>' + L.length + ' momentos</small></div>' +
        (L.length ? '<ol class="feed">' + L.map(feedItem).join('') + '</ol>' : '<p class="empty">Aún no hay registros de hoy.</p>') +
        '<div class="h3">Menú de hoy</div>' +
        '<dl class="menu-card"><dt>1º</dt><dd>Crema de calabacín</dd><dt>2º</dt><dd>Merluza al horno con patata</dd><dt>Postre</dt><dd>Pera</dd><dt>Merienda</dt><dd>Yogur natural y galletas</dd></dl>';
    } else if (tab === 'avisos') {
      var mine = S.avisos.filter(function (a) { return a.kid === ME; }).slice().reverse();
      body = topbar('Enviar a la guarde', 'Avisos') + avisoForm() +
        '<div class="h3">Enviados <small>' + mine.length + '</small></div>' +
        (mine.length ? '<ul class="sent">' + mine.map(function (a) {
          var t = AVISO[a.type];
          return '<li style="--c:' + t.c + '"><i>' + ic(t.icon) + '</i><div><b>' + t.title + (a.date ? ' · ' + niceDate(a.date) : '') + '</b><span>' + esc(a.detail) + '</span></div>' +
            (a.status === 'leido' ? '<span class="tag tag--read">Leído ✓</span>' : '<span class="tag tag--sent">Enviado</span>') + '</li>';
        }).join('') + '</ul>' : '<p class="empty">Todavía no has enviado avisos.</p>');
    } else if (tab === 'chat') {
      return chatHTML('Ana · Educadora de Aprendices', 'familia') + tabbar(famTabs());
    } else if (tab === 'circulares') {
      body = topbar('De la dirección', 'Circulares') + S.circs.map(function (c) {
        return '<article class="circ" style="--c:' + c.c + '"><header><i>' + ic('doc') + '</i><div><b>' + esc(c.title) + '</b><small>' + esc(c.date) + '</small></div></header><p>' + esc(c.body) + '</p>' +
          (c.sign ? '<footer>' + (c.signed ? '<span class="signed">' + ic('check') + 'Firmado · ' + esc(c.signedAt) + '</span>' : '<span style="font-size:.8rem;color:var(--ink-2)">Requiere tu firma</span><button class="sign" data-act="sign" data-id="' + c.id + '">' + ic('pen') + 'Autorizar</button>') + '</footer>' : '') +
          '</article>';
      }).join('');
    }
    return '<div class="screen">' + body + '</div>' + tabbar(famTabs());
  }
  function famTabs() {
    return [['hoy', 'Hoy', 'home'], ['avisos', 'Avisos', 'bell'], ['chat', 'Mensajes', 'chat'], ['circulares', 'Circulares', 'doc', pendingSign() || '']];
  }

  function avisoForm() {
    var f = '';
    var opts = ['ausencia', 'recoge', 'tarde', 'medicacion'];
    f += '<div class="seg" role="group" aria-label="Tipo de aviso">' + opts.map(function (o) {
      var a = AVISO[o]; return '<button type="button" data-act="atype" data-type="' + o + '" style="--c:' + a.c + '" aria-pressed="' + (avisoType === o) + '"><i>' + ic(a.icon) + '</i>' + a.title + '</button>';
    }).join('') + '</div><form id="avisoForm">';
    if (avisoType === 'ausencia') {
      f += '<div class="row2"><div class="fld"><label for="a-date">Día</label><input id="a-date" type="date" value="' + todayISO() + '" required></div>' +
        '<div class="fld"><label for="a-why">Motivo</label><select id="a-why"><option>Está malito/a</option><option>Cita médica</option><option>Vacaciones</option><option>Otro</option></select></div></div>' +
        '<div class="fld"><label for="a-note">Algo más (opcional)</label><textarea id="a-note" placeholder="Ej.: tiene algo de fiebre desde anoche"></textarea></div>';
    } else if (avisoType === 'recoge') {
      f += '<div class="fld"><label for="a-who">¿Quién recoge?</label><input id="a-who" placeholder="Nombre y relación (ej.: Maite, abuela)" required></div>' +
        '<div class="row2"><div class="fld"><label for="a-dni">DNI</label><input id="a-dni" placeholder="Últimos 4 dígitos" maxlength="9"></div><div class="fld"><label for="a-hour">Hora</label><input id="a-hour" type="time" value="16:00"></div></div>';
    } else if (avisoType === 'tarde') {
      f += '<div class="row2"><div class="fld"><label for="a-date">Día</label><input id="a-date" type="date" value="' + todayISO() + '"></div><div class="fld"><label for="a-hour">Llegaremos a las</label><input id="a-hour" type="time" value="10:00"></div></div>' +
        '<div class="fld"><label for="a-note">Motivo (opcional)</label><input id="a-note" placeholder="Ej.: revisión del pediatra"></div>';
    } else {
      f += '<div class="fld"><label for="a-med">Medicamento</label><input id="a-med" placeholder="Nombre del medicamento" required></div>' +
        '<div class="row2"><div class="fld"><label for="a-dose">Dosis</label><input id="a-dose" placeholder="Ej.: 2,5 ml"></div><div class="fld"><label for="a-hour">Hora</label><input id="a-hour" type="time" value="12:00"></div></div>' +
        '<label style="display:flex;gap:10px;align-items:flex-start;margin-top:14px;font-size:.84rem;color:var(--ink-2)"><input id="a-ok" type="checkbox" required style="width:20px;height:20px;margin-top:1px;accent-color:#7b4d8f">Autorizo al personal de Amelín a administrar esta medicación según la receta médica.</label>';
    }
    return f + '<button class="cta" type="submit">' + ic('send') + 'Enviar aviso</button></form>';
  }

  function chatHTML(sub, me) {
    var other = me === 'familia' ? 'educadora' : 'familia';
    var html = '<div class="chat"><div class="screen">' + topbar(sub, me === 'familia' ? 'Mensajes' : 'Familia de Lucía', me === 'familia' ? '<div class="avatar avatar--sm" style="--c:var(--brand)">A</div>' : '<div class="avatar avatar--sm" style="--c:var(--c-a)">L</div>') +
      '<div class="bubbles">';
    var lastDay = '';
    S.msgs.forEach(function (m) {
      var day = m.t.split(' · ')[0];
      if (day !== lastDay) { html += '<div class="day-sep">' + esc(day) + '</div>'; lastDay = day; }
      html += '<div class="bubble ' + (m.from === me ? 'me' : 'them') + '">' + esc(m.text) + '<time>' + esc(m.t.split(' · ')[1] || '') + '</time></div>';
    });
    if (chatHTML.typing === other) html += '<div class="typing" aria-label="Escribiendo"><span></span><span></span><span></span></div>';
    html += '</div></div>';
    var chips = me === 'familia' ? ['¿Qué tal ha comido?', '¿Ha dormido bien?', 'Hoy viene con sueño', '¡Gracias!'] : ['Todo genial hoy', 'Ha comido de maravilla', 'Está un poco mimoso/a', 'Mañana traed ropa de cambio'];
    html += '<div class="chips">' + chips.map(function (c) { return '<button data-act="chip">' + esc(c) + '</button>'; }).join('') + '</div>' +
      '<form class="composer" id="composer"><input id="msg" placeholder="Escribe un mensaje…" autocomplete="off" aria-label="Mensaje"><button type="submit" aria-label="Enviar">' + ic('send') + '</button></form></div>';
    return html;
  }

  /* ===== EDUCADORA ===== */
  function staffHTML() {
    var body = '';
    var un = unreadAvisos();
    if (tab === 'hoy') {
      var present = S.kids.filter(function (k) { var s = kidState(k.id); return s.txt !== 'Sin llegar' && s.txt !== 'Ya en casa'; }).length;
      var sleeping = S.kids.filter(function (k) { return kidState(k.id).cls === 'sleep'; }).length;
      body = topbar('Aprendices · 1 a 2 años', 'Hola, Ana', '<button class="iconbtn" data-act="tab" data-tab="avisos" aria-label="Avisos">' + ic('bell') + (un ? '<span class="dot-badge">' + un + '</span>' : '') + '</button>') +
        '<div class="summary"><div><b>' + present + '/' + S.kids.length + '</b><span>En clase</span></div><div><b>' + sleeping + '</b><span>Durmiendo</span></div><div><b>' + un + '</b><span>Avisos nuevos</span></div></div>' +
        '<div class="h3">Tu grupo <small>Toca para registrar</small></div><div class="kids">' +
        S.kids.map(function (k) {
          var s = kidState(k.id), L = S.log[k.id] || [], last = L[L.length - 1];
          var aw = S.avisos.some(function (a) { return a.kid === k.id && a.status === 'nuevo'; });
          return '<button class="kid" data-act="kid" data-id="' + k.id + '"><header><div class="avatar avatar--sm" style="--c:' + k.c + '">' + k.name[0] + '</div><div><b>' + esc(k.name) + (aw ? ' <span style="color:var(--c-n)">●</span>' : '') + '</b><small>' + (last ? (T[last.type] || T.nota).title + ' · ' + last.t : esc(k.age)) + '</small></div></header><span class="state ' + s.cls + '">' + s.txt + '</span></button>';
        }).join('') + '</div>';
    } else if (tab === 'avisos') {
      var list = S.avisos.slice().reverse();
      body = topbar('De las familias', 'Bandeja de avisos') +
        (list.length ? '<ul class="sent">' + list.map(function (a) {
          var t = AVISO[a.type], k = kid(a.kid);
          return '<li style="--c:' + t.c + '"><i>' + ic(t.icon) + '</i><div><b>' + esc(k.name) + ' · ' + t.title + '</b><span>' + (a.date ? niceDate(a.date) + ' — ' : '') + esc(a.detail) + '</span><span style="font-size:.72rem;margin-top:2px">Recibido ' + esc(a.created) + '</span></div>' +
            (a.status === 'nuevo' ? '<button class="tag" data-act="read" data-id="' + a.id + '">Marcar leído</button>' : '<span class="tag tag--read">Leído</span>') + '</li>';
        }).join('') + '</ul>' : '<p class="empty">Sin avisos.</p>');
    } else if (tab === 'chat') {
      return chatHTML('Chat privado', 'educadora') + tabbar(staffTabs(un)) + kidSheet();
    } else if (tab === 'circulares') {
      body = topbar('Para todas las familias', 'Circulares', '<button class="iconbtn" data-act="newcirc" aria-label="Nueva circular">' + ic('plus') + '</button>') +
        S.circs.map(function (c) {
          var count = c.count + (c.signed && c.count < c.total && c.id === 'c1' ? 1 : 0);
          return '<article class="circ" style="--c:' + c.c + '"><header><i>' + ic('doc') + '</i><div><b>' + esc(c.title) + '</b><small>' + esc(c.date) + '</small></div></header><p>' + esc(c.body) + '</p>' +
            (c.sign ? '<footer><div class="progress"><span style="width:' + Math.round(count / c.total * 100) + '%"></span></div><span style="font-size:.8rem;font-weight:800">' + count + '/' + c.total + ' firmas</span></footer>' : '') + '</article>';
        }).join('');
    }
    return '<div class="screen">' + body + '</div>' + tabbar(staffTabs(un)) + kidSheet();
  }
  function staffTabs(un) { return [['hoy', 'Clase', 'users'], ['avisos', 'Avisos', 'bell', un || ''], ['chat', 'Mensajes', 'chat'], ['circulares', 'Circulares', 'doc']]; }

  function kidSheet() {
    var k = openKid && kid(openKid);
    var inner = '';
    if (openKid === '__circ') {
      inner = '<div class="grab"></div><h3>Nueva circular</h3><form id="circForm"><div class="fld"><label for="c-t">Título</label><input id="c-t" required placeholder="Ej.: Fiesta de Navidad"></div>' +
        '<div class="fld"><label for="c-b">Mensaje</label><textarea id="c-b" required placeholder="Escribe la información para las familias"></textarea></div>' +
        '<label style="display:flex;gap:10px;align-items:center;margin-top:14px;font-size:.88rem;font-weight:700"><input id="c-s" type="checkbox" style="width:20px;height:20px;accent-color:#7b4d8f">Pedir firma / autorización</label>' +
        '<button class="cta" type="submit">' + ic('send') + 'Enviar a las familias</button></form>';
    } else if (k) {
      var s = kidState(k.id);
      var btn = function (act, type, label, icon, c, extra) { return '<button data-act="' + act + '" data-type="' + type + '"' + (extra || '') + ' style="--c:' + c + '"><i>' + ic(icon) + '</i>' + label + '</button>'; };
      inner = '<div class="grab"></div><div style="display:flex;gap:12px;align-items:center"><div class="avatar" style="--c:' + k.c + '">' + k.name[0] + '</div><div><h3>' + esc(k.name) + '</h3><span style="font-size:.82rem;color:var(--ink-2)">' + s.txt + ' · ' + esc(k.age) + '</span></div></div>' +
        '<div class="acts-label">Entrada y salida</div><div class="acts">' + btn('log', 'llegada', 'Llegada', 'sun', 'var(--c-e)') + btn('log', 'salida', 'Salida', 'door', 'var(--c-i)') + btn('log', s.cls === 'sleep' ? 'siesta-fin' : 'siesta-ini', s.cls === 'sleep' ? 'Despierta' : 'Se duerme', s.cls === 'sleep' ? 'wake' : 'moon', '#5b6ee1') + '</div>' +
        '<div class="acts-label">Comida</div><div class="acts">' + btn('log', 'comida', 'Todo', 'bowl', 'var(--c-m)', ' data-level="3"') + btn('log', 'comida', 'Bastante', 'bowl', 'var(--c-l)', ' data-level="2"') + btn('log', 'comida', 'Poco', 'bowl', 'var(--c-n)', ' data-level="1"') + '</div>' +
        '<div class="acts-label">Higiene y ánimo</div><div class="acts">' + btn('log', 'panal', 'Pis', 'drop', '#2f9bd6', ' data-text="Pis."') + btn('log', 'panal', 'Caca', 'drop', '#8a5a2b', ' data-text="Caca."') + btn('log', 'animo', 'Contento', 'smile', 'var(--c-a)', ' data-text="Muy contento/a y participativo/a."') + '</div>' +
        '<div class="acts-label">Pedir a la familia</div><div class="acts">' + btn('ask', 'Pañales', 'Pañales', 'bag', '#c38f00') + btn('ask', 'Toallitas', 'Toallitas', 'bag', '#c38f00') + btn('ask', 'Ropa de cambio', 'Ropa', 'bag', '#c38f00') + '</div>' +
        '<form id="noteForm" class="fld"><label for="n-t">Nota para la familia</label><div style="display:flex;gap:8px"><input id="n-t" placeholder="Ej.: hoy ha compartido sus juguetes" autocomplete="off"><button class="cta" style="margin:0;width:52px;flex:none" aria-label="Enviar nota">' + ic('send') + '</button></div></form>'
        + '<button class="cta cta--ghost" type="button" data-act="close">Listo</button>';
    }
    return '<div class="sheet-bg' + (inner ? ' open' : '') + '" data-act="close"></div><div class="sheet' + (inner ? ' open' : '') + '" role="dialog" aria-modal="true" aria-label="Registro">' + inner + '</div>';
  }

  /* ---------------- acciones ---------------- */
  function go(t) { tab = t; openKid = null; render.reset = true; render(); }

  function sendMsg(text, from) {
    text = text.trim(); if (!text) return;
    S.msgs.push({ from: from, text: text, t: 'Hoy · ' + now() }); save(); render();
    if (from === 'familia') {
      var L = S.log[ME] || [], food = L.filter(function (x) { return x.type === 'comida'; }).pop();
      var lt = text.toLowerCase(), reply;
      if (/comid|comer|almuer/.test(lt)) reply = food ? '¡Sí! Hoy ha comido ' + LEVEL[food.level].toLowerCase() + '. Le ha encantado la crema.' : 'Todavía no hemos comido, a las 12:00 te lo apunto en su agenda.';
      else if (/dorm|siesta|sueño/.test(lt)) reply = 'Lo tenemos en cuenta. Te apuntamos en la agenda cuánto duerme la siesta.';
      else if (/gracias/.test(lt)) reply = '¡A vosotros! Da gusto trabajar así.';
      else reply = '¡Recibido! Lo tenemos en cuenta. Cualquier cosa te escribo.';
      var replies = [reply];
      setTimeout(function () { chatHTML.typing = 'educadora'; if (tab === 'chat') render(); }, 500);
      setTimeout(function () {
        chatHTML.typing = null;
        S.msgs.push({ from: 'educadora', text: replies[0], t: 'Hoy · ' + now() }); save();
        if (tab === 'chat') render();
      }, 2100);
    }
  }

  app.addEventListener('click', function (e) {
    var el = e.target.closest('[data-act]');
    if (!el) return;
    var a = el.dataset.act;
    if (a === 'login') { role = el.dataset.r; tab = 'hoy'; render(); toast(role === 'familia' ? 'Hola, familia de Lucía' : 'Hola, Ana'); }
    else if (a === 'tab') go(el.dataset.tab);
    else if (a === 'quick') { avisoType = el.dataset.type; go('avisos'); }
    else if (a === 'atype') { avisoType = el.dataset.type; render(); }
    else if (a === 'bring-ok') {
      var items = S.bring[ME] || [];
      S.avisos.push({ id: 'a' + Date.now(), kid: ME, type: 'info', date: '', detail: 'Mañana llevamos: ' + items.join(', ') + '.', created: 'Hoy ' + now(), status: 'nuevo' });
      S.bring[ME] = []; save(); render(); toast('Avisado: lo lleváis mañana');
    }
    else if (a === 'sign') {
      S.circs.forEach(function (c) { if (c.id === el.dataset.id) { c.signed = true; c.signedAt = 'Hoy · ' + now(); } }); save(); render(); toast('Autorización firmada');
    }
    else if (a === 'chip') sendMsg(el.textContent, role);
    else if (a === 'read') { S.avisos.forEach(function (x) { if (x.id === el.dataset.id) x.status = 'leido'; }); save(); render(); toast('La familia verá que lo has leído'); }
    else if (a === 'kid') { openKid = el.dataset.id; render(); }
    else if (a === 'newcirc') { openKid = '__circ'; render(); }
    else if (a === 'close') { openKid = null; render(); }
    else if (a === 'log') {
      var entry = { t: now(), type: el.dataset.type, text: el.dataset.text || '', level: +el.dataset.level || 0 };
      if (entry.type === 'siesta-fin') {
        var ini = (S.log[openKid] || []).filter(function (x) { return x.type === 'siesta-ini'; }).pop();
        if (ini) { var d = Math.max(mins(entry.t) - mins(ini.t), 0); entry.text = 'Ha dormido ' + Math.floor(d / 60) + ' h ' + (d % 60) + ' min.'; }
      }
      if (entry.type === 'comida') entry.text = 'Crema de calabacín y merluza al horno.';
      (S.log[openKid] = S.log[openKid] || []).push(entry); save();
      var nm = kid(openKid).name; render(); toast(nm + ': ' + (T[entry.type].title + (entry.level ? ' · ' + LEVEL[entry.level] : '')).toLowerCase() + ' registrado');
    }
    else if (a === 'ask') {
      var arr = S.bring[openKid] = S.bring[openKid] || [];
      if (arr.indexOf(el.dataset.type) < 0) arr.push(el.dataset.type);
      (S.log[openKid] = S.log[openKid] || []).push({ t: now(), type: 'pide', text: 'Por favor, traed ' + el.dataset.type.toLowerCase() + '.' });
      save(); render(); toast('Pedido a la familia: ' + el.dataset.type.toLowerCase());
    }
  });

  app.addEventListener('submit', function (e) {
    e.preventDefault();
    var f = e.target, v = function (id) { var x = f.querySelector('#' + id); return x ? x.value.trim() : ''; };
    if (f.id === 'composer') { var inp = f.querySelector('#msg'); sendMsg(inp.value, role); }
    else if (f.id === 'avisoForm') {
      var detail = '', date = v('a-date');
      if (avisoType === 'ausencia') detail = v('a-why') + (v('a-note') ? '. ' + v('a-note') : '.');
      if (avisoType === 'recoge') { if (!v('a-who')) return f.querySelector('#a-who').focus(); detail = 'Recoge ' + v('a-who') + (v('a-dni') ? ' (DNI ···' + v('a-dni').slice(-5) + ')' : '') + ' a las ' + v('a-hour') + '.'; date = todayISO(); }
      if (avisoType === 'tarde') detail = 'Llegaremos sobre las ' + v('a-hour') + (v('a-note') ? '. ' + v('a-note') : '.');
      if (avisoType === 'medicacion') {
        if (!v('a-med')) return f.querySelector('#a-med').focus();
        if (!f.querySelector('#a-ok').checked) { toast('Marca la autorización para enviar'); return; }
        detail = v('a-med') + (v('a-dose') ? ', ' + v('a-dose') : '') + ' a las ' + v('a-hour') + '. Autorizado por la familia.'; date = todayISO();
      }
      S.avisos.push({ id: 'a' + Date.now(), kid: ME, type: avisoType, date: date, detail: detail, created: 'Hoy ' + now(), status: 'nuevo' });
      save(); render(); toast('Aviso enviado a la guarde');
    }
    else if (f.id === 'noteForm') {
      var t = v('n-t'); if (!t) return;
      (S.log[openKid] = S.log[openKid] || []).push({ t: now(), type: 'nota', text: t }); save(); render(); toast('Nota enviada a la familia');
    }
    else if (f.id === 'circForm') {
      if (!v('c-t') || !v('c-b')) return;
      S.circs.unshift({ id: 'c' + Date.now(), title: v('c-t'), body: v('c-b'), date: 'Hoy', sign: f.querySelector('#c-s').checked, signed: false, count: 0, total: 14, c: 'var(--c-l)' });
      openKid = null; save(); render(); toast('Circular enviada a 14 familias');
    }
  });

  addEventListener('keydown', function (e) { if (e.key === 'Escape' && openKid) { openKid = null; render(); } });

  // sincroniza entre pestañas / iframe (familia ⇄ educadora)
  addEventListener('storage', function (e) { if (e.key === KEY) { load(); render(); } });

  // selector de rol del escaparate
  document.querySelectorAll('[data-role]').forEach(function (b) {
    b.addEventListener('click', function () { role = b.dataset.role; tab = 'hoy'; openKid = null; render.reset = true; render(); });
  });
  var reset = document.getElementById('reset');
  if (reset) reset.addEventListener('click', function () { S = seed(); save(); tab = 'hoy'; openKid = null; render(); toast('Demo reiniciada'); });

  // en escritorio, la app se dibuja a tamaño de iPhone real y se escala dentro del marco
  var screenEl = document.getElementById('screen');
  var full = matchMedia('(max-width: 900px)');
  function fit() {
    if (full.matches || document.body.classList.contains('embed') || !screenEl) { app.style.height = ''; return; }
    var k = screenEl.clientWidth / 390;
    app.style.transform = 'scale(' + k + ')';
    app.style.height = (screenEl.clientHeight / k) + 'px';
  }
  if ('ResizeObserver' in window && screenEl) new ResizeObserver(fit).observe(screenEl);
  addEventListener('resize', fit);

  render();
  fit();
})();
