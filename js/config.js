/* ==========================================================================
   LA PARRILLA · CONFIGURACIÓN
   Datos de contacto, horarios y valoraciones. Respeta las comillas y las comas.
   ========================================================================== */

window.PARRILLA_CONFIG = {

  restaurante: {
    nombre: "La Parrilla",
    subtitulo: "Restaurant · Lloret de Mar",
    desde: 1989,
    direccion: "Carrer Santa Llúcia, 13",
    ciudad: "17310 Lloret de Mar · Girona",
    url: "https://durducco-source.github.io/la-parrilla-lloret"
  },

  contacto: {
    // Teléfono tal y como se muestra (las reservas se atienden por teléfono)
    telefono: "+34 972 369 636",
    // WhatsApp (número internacional sin + ni espacios). Vacío = no se muestra.
    whatsapp: "",
    instagram: "https://www.instagram.com/laparrilla_restaurante1989/",
    tripadvisor: "https://www.tripadvisor.com/Restaurant_Review-g494960-d1101193-Reviews-La_Parrilla-Lloret_de_Mar_Costa_Brava_Province_of_Girona_Catalonia.html",
    mapa: "https://www.google.com/maps/search/?api=1&query=La+Parrilla+Carrer+Santa+Llucia+13+Lloret+de+Mar",
    mapaEmbed: "https://www.google.com/maps?q=La+Parrilla+Carrer+Santa+Llucia+13+Lloret+de+Mar&output=embed"
  },

  // Horario: una línea por día
  horario: [
    ["Lunes", "12:30–15:30 · 19:00–23:00"],
    ["Martes", "12:30–15:30 · 19:00–23:00"],
    ["Miércoles", "12:30–15:30 · 19:00–23:00"],
    ["Jueves", "12:30–15:30 · 19:00–23:00"],
    ["Viernes", "12:30–15:30 · 19:00–23:00"],
    ["Sábado", "12:30–15:30 · 19:00–23:00"],
    ["Domingo", "12:30–15:30 · 19:00–23:00"]
  ],
  horarioNota: "Horario orientativo: confírmalo por teléfono.",

  analitica: { googleAnalyticsId: "" }
};
