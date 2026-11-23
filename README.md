# Guardería Infantil Amelín: propuesta de nueva web

Propuesta de rediseño para [guarderiaamelin.com](http://www.guarderiaamelin.com/). Es HTML, CSS y JavaScript sin dependencias ni paso de compilación: se puede publicar tal cual en Cloudflare Pages, Netlify, GitHub Pages o el hosting actual.

## Ver en local

```bash
python3 -m http.server 8000
```

Abrir `http://localhost:8000`. La intro solo se reproduce una vez por sesión; para volver a verla, añadir `?intro` a la URL.

## Qué incluye

**Web pública (`index.html`)**
- Intro animada: la bruja Amelín cruza la pantalla dejando una estela de estrellas mientras aparecen las letras A·M·E·L·Í·N con los colores del rótulo original.
- Hero nocturno con luna, estrellas fugaces y la bruja flotando. Al tocarla da una voltereta mágica.
- Bruja "guía" flotante al hacer scroll: se inclina con la velocidad y abre accesos rápidos (visita, llamar, familias).
- Secciones: la escuela, grupos (Brujillos, Aprendices, Magos y Tardarines), un día en Amelín (la escoba recorre la línea del tiempo al hacer scroll), horarios interactivos con barra del día, instalaciones, comedor con el menú del día, ludoteca de verano, talleres, preguntas frecuentes y formulario de visita con mapa.
- SEO local: datos estructurados `ChildCare`, metadatos y textos pensados para "guardería Zizur Mayor".
- Accesible: navegación por teclado, `prefers-reduced-motion` respetado y contenido visible aunque falle el JavaScript.

**Rincón de familias (`familias.html`)**: app web de comunicación familias ⇄ guardería
- *Familia*: estado en tiempo real ("Lucía está durmiendo la siesta"), agenda del día (comidas, siesta, pañales, actividades, notas), avisos en un toque (ausencia, recoge otra persona, llegaré tarde, medicación con autorización), chat con la educadora, circulares con firma digital y "necesita traer".
- *Educadora*: vista del grupo con estado de cada peque, registro rápido en dos toques, bandeja de avisos con "marcar leído", chat y envío de circulares con seguimiento de firmas.
- Ambas vistas comparten datos: lo que envía la familia aparece en el panel de la educadora y al revés. Se puede probar con dos pestañas abiertas.

## Pendiente antes de publicar

- [ ] Fotos reales del centro (ahora hay imágenes de ambiente del prototipo anterior).
- [ ] Validar con la guardería los textos, los horarios, los grupos y el menú de ejemplo.
- [ ] Conectar el formulario de visita a un email (por ejemplo, Formspree, Netlify Forms o Web3Forms).
- [ ] Subir los PDFs de menús y calendario al nuevo hosting (ahora enlazan a la web antigua).
- [ ] Textos legales: aviso legal, privacidad y cookies.
- [ ] **App de familias en producción:** ahora es una demo que guarda los datos en el navegador. Para usarla de verdad hace falta un backend con usuarios y contraseñas (por ejemplo, Supabase o Firebase), notificaciones push y cumplir el RGPD, porque son datos de menores.

## Estructura

```
index.html        Web pública
familias.html     Demo de la app de familias
css/styles.css    Estilos de la web
css/app.css       Estilos de la app
js/sparkles.js    Partículas y cielos estrellados (canvas)
js/main.js        Intro, bruja, scroll, horarios y formulario
js/app.js         Lógica de la app de familias
assets/img/       Ilustraciones (bruja, cocinero, calendario) y fotos
```
