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
  safe(injectSchema);
  safe(injectAnalytics);
})();
