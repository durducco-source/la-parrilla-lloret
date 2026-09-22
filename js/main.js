/* ==========================================================================
   LA PARRILLA · FUNCIONAMIENTO
   Carta por pestañas, galería, horario, enlaces de contacto, menú,
   animaciones y datos para Google. Normalmente no hay que tocarlo.
   ========================================================================== */
(function () {
  "use strict";

  var CFG = window.PARRILLA_CONFIG || {};
  var DATA = window.PARRILLA_DATA || { carta: [], galeria: [] };
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function get(path) {
    return path.split(".").reduce(function (o, k) { return o && o[k] != null ? o[k] : undefined; }, CFG);
  }
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function safe(fn) { try { fn(); } catch (e) { if (window.console) console.warn("[La Parrilla]", e); } }
  function priceLabel(p) { return /€/.test(p) ? p : p.replace(/(\d)( p\. p\.)?$/, "$1 €$2"); }

  /* ---------- Contacto y datos ---------- */
  function applyConfig() {
    var tel = get("contacto.telefono");
    $$("[data-tel-link]").forEach(function (a) { if (tel) a.href = "tel:" + tel.replace(/[^\d+]/g, ""); });
    $$("[data-tel-text]").forEach(function (a) { if (tel) a.textContent = tel; });
    var wa = String(get("contacto.whatsapp") || "").replace(/\D/g, "");
    $$("[data-wa]").forEach(function (a) {
      if (wa) { a.hidden = false; a.href = "https://wa.me/" + wa + "?text=" + encodeURIComponent("Hola, me gustaría reservar una mesa en La Parrilla."); }
      else a.hidden = true;
    });
    [["[data-ig]", "contacto.instagram"], ["[data-ta]", "contacto.tripadvisor"], ["[data-map]", "contacto.mapa"]].forEach(function (p) {
      var v = get(p[1]);
      $$(p[0]).forEach(function (a) { if (v) a.href = v; else a.hidden = true; });
    });
    var embed = $("[data-map-embed]"); if (embed && get("contacto.mapaEmbed")) embed.src = get("contacto.mapaEmbed");
    $$("[data-addr]").forEach(function (el) { if (get("restaurante.direccion")) el.textContent = get("restaurante.direccion"); });
    $$("[data-city]").forEach(function (el) { if (get("restaurante.ciudad")) el.textContent = get("restaurante.ciudad"); });
    $$("[data-year]").forEach(function (el) { el.textContent = new Date().getFullYear(); });

    var hours = $("[data-hours]"), list = get("horario") || [];
    if (hours) {
      var today = (new Date().getDay() + 6) % 7; // 0 = lunes
      hours.innerHTML = list.map(function (h, i) {
        return '<div' + (i === today ? ' class="is-today"' : "") + '><span>' + esc(h[0]) + (i === today ? " · hoy" : "") + "</span><span>" + esc(h[1]) + "</span></div>";
      }).join("");
    }
    var note = $("[data-hours-note]"); if (note) note.textContent = get("horarioNota") || "";
  }

  /* ---------- Carta ---------- */
  function renderMenu() {
    var tabs = $("[data-tabs]"), box = $("[data-menu]"); if (!tabs || !box) return;
    tabs.innerHTML = DATA.carta.map(function (c, i) {
      return '<button type="button" role="tab" id="tab-' + esc(c.id) + '" aria-controls="panel-' + esc(c.id) + '" aria-selected="' + (i === 0) + '" data-tab="' + esc(c.id) + '">' + esc(c.titulo) + "</button>";
    }).join("");
    box.innerHTML = DATA.carta.map(function (c, i) {
      return '<div class="menu-panel' + (i === 0 ? " is-active" : "") + '" role="tabpanel" id="panel-' + esc(c.id) + '" aria-labelledby="tab-' + esc(c.id) + '">' +
        "<h3>" + esc(c.titulo) + "</h3>" + (c.nota ? '<p class="menu-cat-note">' + esc(c.nota) + "</p>" : "") +
        '<div class="dishes">' + c.platos.map(function (d) {
          return '<div class="dish"><span class="dish-name">' + esc(d[0]) + '</span><span class="dish-price">' + esc(priceLabel(d[1])) + "</span>" +
            (d[2] ? '<span class="dish-desc">' + esc(d[2]) + "</span>" : "") + "</div>";
        }).join("") + "</div></div>";
    }).join("");
    var note = $("[data-menu-note]"); if (note) note.textContent = DATA.cartaNota || "";

    $$("button", tabs).forEach(function (b) { b.addEventListener("click", function () { selectTab(b.getAttribute("data-tab")); }); });
    tabs.addEventListener("keydown", function (e) {
      if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
      var btns = $$("button", tabs), i = btns.indexOf(document.activeElement); if (i < 0) return;
      var n = btns[(i + (e.key === "ArrowRight" ? 1 : btns.length - 1)) % btns.length];
      n.focus(); selectTab(n.getAttribute("data-tab"));
    });
    $$("[data-tab-go]").forEach(function (a) { a.addEventListener("click", function () { selectTab(a.getAttribute("data-tab-go")); }); });
  }
  function selectTab(id) {
    $$("[data-tabs] button").forEach(function (b) {
      var on = b.getAttribute("data-tab") === id;
      b.setAttribute("aria-selected", on); b.tabIndex = on ? 0 : -1;
      if (on && b.scrollIntoView && window.innerWidth < 760) b.scrollIntoView({ block: "nearest", inline: "center" });
    });
    $$(".menu-panel").forEach(function (p) { p.classList.toggle("is-active", p.id === "panel-" + id); });
  }

  /* ---------- Galería ---------- */
  function renderGallery() {
    var box = $("[data-gallery]"); if (!box) return;
    box.innerHTML = (DATA.galeria || []).map(function (g, i) {
      return '<figure class="gal gal--' + esc(g.forma || "cuadrada") + ' reveal" style="--d:' + ((i % 4) * 0.06).toFixed(2) + 's"><img src="' + esc(g.img) + '" alt="' + esc(g.alt) + '" loading="lazy" decoding="async"></figure>';
    }).join("");
  }

  /* ---------- Cabecera, menú y barra móvil ---------- */
  function initHeader() {
    var header = $(".header"), burger = $(".burger"), mbar = $("[data-mbar]"), hero = $(".hero");
    function onScroll() {
      header.classList.toggle("is-scrolled", window.scrollY > 20);
      if (mbar && hero) {
        var past = window.scrollY > hero.offsetHeight * 0.7;
        var nearEnd = (window.innerHeight + window.scrollY) > document.body.scrollHeight - 480;
        mbar.classList.toggle("is-on", past && !nearEnd);
      }
    }
    onScroll(); window.addEventListener("scroll", onScroll, { passive: true });
    function setMenu(open) {
      document.body.classList.toggle("nav-open", open);
      burger.setAttribute("aria-expanded", open ? "true" : "false");
      burger.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
    }
    burger.addEventListener("click", function () { setMenu(!document.body.classList.contains("nav-open")); });
    $$(".nav a").forEach(function (a) { a.addEventListener("click", function () { setMenu(false); }); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") setMenu(false); });

    if (!("IntersectionObserver" in window)) return;
    var links = {};
    $$(".nav a:not(.btn)").forEach(function (a) { links[a.getAttribute("href").slice(1)] = a; });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        $$(".nav a").forEach(function (a) { a.classList.remove("is-active"); });
        if (links[en.target.id]) links[en.target.id].classList.add("is-active");
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    $$("main section[id]").forEach(function (s) { io.observe(s); });
  }

  function initReveal() {
    var els = $$(".reveal");
    if (reduce || !("IntersectionObserver" in window)) { els.forEach(function (e) { e.classList.add("is-in"); }); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); } });
    }, { threshold: 0.1, rootMargin: "0px 0px -5% 0px" });
    els.forEach(function (e) { io.observe(e); });
  }

  /* ---------- Fuego animado (llamas y chispas en canvas) ---------- */
  function initFire() {
    // Paleta de la llama: núcleo blanco-amarillo → naranja → rojo → brasa oscura.
    var STOPS = [[255, 226, 160], [255, 196, 90], [255, 150, 40], [235, 80, 20], [150, 30, 12], [60, 20, 10]];
    function mix(a, b, f) { return Math.round(a + (b - a) * f); }
    function colorAt(t) {
      var x = t * (STOPS.length - 1), i = Math.min(STOPS.length - 2, Math.floor(x)), f = x - i;
      return [mix(STOPS[i][0], STOPS[i + 1][0], f), mix(STOPS[i][1], STOPS[i + 1][1], f), mix(STOPS[i][2], STOPS[i + 1][2], f)];
    }
    // Sprites pre-renderizados (uno por fase de la llama) para que la animación sea ligera.
    var SPRITES = [];
    for (var s = 0; s < 24; s++) {
      var sc = document.createElement("canvas"); sc.width = sc.height = 64;
      var sx = sc.getContext("2d"), col = colorAt(s / 23);
      var gr = sx.createRadialGradient(32, 32, 0, 32, 32, 32);
      gr.addColorStop(0, "rgba(" + col + ",1)");
      gr.addColorStop(0.35, "rgba(" + col + ",.55)");
      gr.addColorStop(1, "rgba(" + col + ",0)");
      sx.fillStyle = gr; sx.fillRect(0, 0, 64, 64);
      SPRITES.push(sc);
    }

    $$("canvas[data-fire]").forEach(function (cv) {
      var ctx = cv.getContext("2d"); if (!ctx) return;
      var k = parseFloat(cv.getAttribute("data-fire")) || 1;
      var RES = 0.5; // se dibuja a media resolución: bordes más suaves y menos trabajo
      var W = 1, H = 1, ps = [], raf = 0, visible = true, tick = 0;
      var small = window.matchMedia("(max-width: 760px)").matches;
      var MAX = small ? 380 : 900, scale = small ? 0.7 : 1;
      function size() {
        var b = cv.getBoundingClientRect();
        W = Math.max(1, Math.floor(b.width)); H = Math.max(1, Math.floor(b.height));
        cv.width = Math.ceil(W * RES); cv.height = Math.ceil(H * RES); ctx.setTransform(RES, 0, 0, RES, 0, 0);
      }
      function spawn() {
        var x = Math.random() * W, c = Math.max(0, 1 - Math.abs(x / W - 0.5) * 1.1);
        // el fuego respira: la altura de las llamas oscila a lo largo del ancho
        var breath = 0.75 + 0.25 * Math.sin(tick * 0.02 + x * 0.004) + 0.15 * Math.sin(tick * 0.051 + x * 0.013);
        if (Math.random() < 0.035) {
          ps.push({ s: 1, x: x, y: H - 10 - Math.random() * 40, vx: (Math.random() - 0.5) * 1.2, vy: -(1.5 + Math.random() * 2.5), l: 0, m: 80 + Math.random() * 140, r: 0.8 + Math.random() * 1.4 });
        } else {
          ps.push({ s: 0, x: x, y: H + 6, vx: (Math.random() - 0.5) * 0.5, vy: -(1.6 + Math.random() * 2.2) * (0.5 + c * 0.8) * breath, l: 0, m: (40 + Math.random() * 50) * (0.6 + c * 0.6), r: (12 + Math.random() * 22) * (0.55 + c * 0.7) * scale, w: Math.random() * 6.28 });
        }
      }
      function frame() {
        tick++;
        ctx.clearRect(0, 0, W, H);
        ctx.globalCompositeOperation = "lighter";
        var n = Math.ceil((W / 45) * k), i, p, t, a, rad, sp;
        if (ps.length < MAX) for (i = 0; i < n; i++) spawn();
        for (i = ps.length - 1; i >= 0; i--) {
          p = ps[i]; p.l++;
          t = p.l / p.m;
          if (t >= 1 || p.y < -30) { ps.splice(i, 1); continue; }
          if (p.s) {
            p.x += p.vx + Math.sin(p.l * 0.09 + p.x) * 0.7; p.y += p.vy; p.vy *= 0.995;
            ctx.globalAlpha = (1 - t) * 0.9;
            ctx.fillStyle = "rgb(255," + (210 - Math.round(t * 110)) + ",90)";
            ctx.fillRect(p.x, p.y, p.r * 2, p.r * 2);
            continue;
          }
          // turbulencia: las lenguas de fuego ondulan al subir
          p.x += p.vx + Math.sin(p.w + p.l * 0.12) * 0.6 * t; p.y += p.vy; p.vy *= 0.992;
          a = Math.min(1, t * 7) * Math.pow(1 - t, 1.3) * 0.62;
          rad = p.r * (1 - t * 0.55);
          sp = SPRITES[Math.min(23, Math.floor(t * 24))];
          ctx.globalAlpha = a;
          ctx.drawImage(sp, p.x - rad, p.y - rad * 1.7, rad * 2, rad * 3.2); // estirada en vertical = lengua de fuego
        }
        ctx.globalAlpha = 1;
        raf = visible && !document.hidden ? requestAnimationFrame(frame) : 0;
      }
      size();
      if (window.ResizeObserver) new ResizeObserver(size).observe(cv); else window.addEventListener("resize", size);
      if (reduce) { for (var j = 0; j < 90; j++) frame(); cancelAnimationFrame(raf); raf = 0; return; }
      if ("IntersectionObserver" in window) {
        new IntersectionObserver(function (es) {
          visible = es[0].isIntersecting;
          if (visible && !raf) raf = requestAnimationFrame(frame);
        }).observe(cv);
      }
      document.addEventListener("visibilitychange", function () { if (!document.hidden && visible && !raf) raf = requestAnimationFrame(frame); });
      raf = requestAnimationFrame(frame);
    });
  }

  /* ---------- SEO: datos estructurados del restaurante ---------- */
  function injectSchema() {
    var base = get("restaurante.url") || "";
    var dias = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    var hours = [];
    (get("horario") || []).forEach(function (h, i) {
      String(h[1]).split("·").forEach(function (r) {
        var m = r.trim().match(/^(\d{1,2}:\d{2})\s*[–-]\s*(\d{1,2}:\d{2})$/);
        if (m) hours.push({ "@type": "OpeningHoursSpecification", "dayOfWeek": dias[i], "opens": m[1], "closes": m[2] });
      });
    });
    var data = {
      "@context": "https://schema.org",
      "@type": "Restaurant",
      "name": get("restaurante.nombre") || "La Parrilla",
      "description": "Restaurante de cocina mediterránea en Lloret de Mar: paellas y carnes a la brasa desde 1989.",
      "url": base,
      "image": base + "/assets/img/og-image.jpg",
      "logo": base + "/assets/logo.png",
      "telephone": get("contacto.telefono"),
      "servesCuisine": ["Mediterránea", "Paella", "Carnes a la brasa"],
      "priceRange": "20–30 €",
      "acceptsReservations": true,
      "foundingDate": String(get("restaurante.desde") || ""),
      "address": { "@type": "PostalAddress", "streetAddress": get("restaurante.direccion"), "postalCode": "17310", "addressLocality": "Lloret de Mar", "addressRegion": "Girona", "addressCountry": "ES" },
      "openingHoursSpecification": hours,
      "sameAs": [get("contacto.instagram"), get("contacto.tripadvisor")].filter(Boolean),
      "hasMenu": base + "/#carta"
    };
    var s = document.createElement("script"); s.type = "application/ld+json"; s.textContent = JSON.stringify(data);
    document.head.appendChild(s);
  }
  function injectAnalytics() {
    var id = get("analitica.googleAnalyticsId"); if (!id) return;
    var s = document.createElement("script"); s.async = true; s.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(id);
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag("js", new Date()); window.gtag("config", id, { anonymize_ip: true });
  }

  safe(renderMenu);
  safe(renderGallery);
  safe(applyConfig);
  safe(initHeader);
  safe(initReveal);
  safe(initFire);
  safe(injectSchema);
  safe(injectAnalytics);
})();
