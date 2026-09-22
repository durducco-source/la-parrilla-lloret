/* ==========================================================================
   LA PARRILLA · CARTA Y GALERÍA
   --------------------------------------------------------------------------
   Para cambiar un precio o un plato, edita la línea correspondiente:
   ["Nombre del plato", "Precio", "Descripción opcional"]
   Para añadir un plato, copia una línea y pégala debajo (con su coma).
   ========================================================================== */

window.PARRILLA_DATA = {

  carta: [
    {
      id: "entrantes", titulo: "Entrantes", nota: "",
      platos: [
        ["Ensalada mixta", "8,50"],
        ["Ensalada de burrata", "13,50"],
        ["Alcachofas confitadas con jamón", "13,00"],
        ["Croquetas de pollo", "12,00", "6 unidades"],
        ["Melón con jamón", "13,50"],
        ["Ración de jamón", "16,90"],
        ["Tabla de embutidos", "16,90"],
        ["Huevos estrellados con jamón", "13,50"],
        ["Provolone", "10,90"],
        ["Coquinas", "14,90"],
        ["Anchoas del Cantábrico", "12,00"],
        ["Tartar de salmón y aguacate", "12,90"],
        ["Calamares a la andaluza", "13,90"],
        ["Pulpo a la gallega", "21,50"]
      ]
    },
    {
      id: "pescado", titulo: "Paella y pescado", nota: "",
      platos: [
        ["Paella mixta", "19,00 p. p.", "Pollo y marisco · mínimo 2 personas"],
        ["Mejillones al vapor", "12,00"],
        ["Mejillones a la marinera", "13,00"],
        ["Gambas a la plancha", "22,00"],
        ["Gambas al ajillo con jamón", "18,50"],
        ["Lenguado a la plancha con verduras", "26,50"],
        ["Pulpo a la brasa con patatas", "22,00"],
        ["Filete de dorada a la plancha con verduras", "18,90"],
        ["Calamar a la plancha con verduras", "22,50"],
        ["Suquet de rape, gambas y almejas", "26,50"]
      ]
    },
    {
      id: "carnes", titulo: "Carnes a la brasa", nota: "Todas nuestras carnes van acompañadas de guarnición.",
      platos: [
        ["Entrecot a la brasa", "23,90"],
        ["Entrecot a la pimienta", "25,90"],
        ["Entrecot al roquefort", "26,50"],
        ["Entraña a la brasa", "25,50"],
        ["Goulash", "16,00"],
        ["Solomillo de ternera", "28,00"],
        ["Chuletón de Girona", "39,50", "900 g"],
        ["Pollo a la pimienta", "14,50"],
        ["Pollo al roquefort", "14,90"],
        ["Muslos de pollo deshuesados a la brasa", "13,90"],
        ["Botifarra con judías", "12,90"],
        ["Solomillo de cerdo", "19,90"],
        ["Costillas de cordero", "26,00"],
        ["Parrillada de carne", "36,90", "1 kg · entraña, muslo de pollo, costilla de cordero, botifarra, lomo y chorizo"]
      ]
    },
    {
      id: "pastas", titulo: "Pastas", nota: "",
      platos: [
        ["Espaguetis boloñesa", "11,50"],
        ["Espaguetis carbonara", "12,50"],
        ["Macarrones boloñesa", "11,50"],
        ["Macarrones roquefort", "12,50"],
        ["Lasaña de verduras", "12,00"],
        ["Lasaña de carne", "12,50"]
      ]
    },
    {
      id: "combinados", titulo: "Platos combinados", nota: "",
      platos: [
        ["Calamares, croquetas, patatas y ensalada", "16,50"],
        ["Escalopa, huevo, patatas y ensalada", "14,00"],
        ["Bistec, huevo, patatas y ensalada", "15,00"],
        ["Lomo, huevo, patatas y ensalada", "12,00"],
        ["Hamburguesa, huevo, bacon, patatas y ensalada", "14,00"],
        ["Pechuga de pollo, patatas y ensalada", "12,50"],
        ["Filete de merluza a la romana, patatas y ensalada", "14,50"]
      ]
    }
  ],

  cartaNota: "Precios en euros. Consulta alérgenos e intolerancias con nuestro equipo de sala.",

  galeria: [
    { img: "assets/fotos/paella-marisco.jpg", alt: "Paella de marisco con gambas y mejillones", forma: "alta" },
    { img: "assets/fotos/gambas-ajillo.jpg", alt: "Gambas al ajillo en cazuela de barro", forma: "cuadrada" },
    { img: "assets/fotos/chuleton.jpg", alt: "Chuletón a la brasa sobre la parrilla", forma: "alta" },
    { img: "assets/fotos/jamon.jpg", alt: "Pan con tomate y jamón", forma: "alta" },
    { img: "assets/fotos/calamares.jpg", alt: "Calamares a la andaluza con limón", forma: "cuadrada" },
    { img: "assets/fotos/paella-fuego.jpg", alt: "Paella cocinándose sobre el fuego", forma: "alta" },
    { img: "assets/fotos/entrecot-brasa.jpg", alt: "Entrecot sobre las brasas", forma: "alta" },
    { img: "assets/fotos/carnes-parrilla.jpg", alt: "Carnes a la parrilla", forma: "cuadrada" },
    { img: "assets/fotos/paella-mixta.jpg", alt: "Paella mixta de La Parrilla", forma: "alta" },
    { img: "assets/fotos/fachada.jpg", alt: "Entrada del restaurante La Parrilla en Lloret de Mar", forma: "cuadrada" }
  ]
};
