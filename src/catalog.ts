export type Plan = {
  id: string;
  name: string;
  price: number;
  tag: string;
  bullets: string[];
  missing: string | null;
};

export type Addon = {
  id: string;
  label: string;
  desc: string;
  price: number;
  unit?: string;
  recurring?: boolean;
};

export type Rubro = {
  id: string;
  label: string;
  icon: string;
  keywords: string[];
  addons: Addon[];
};

/** Precios invertidos del cotizador de referencia (Gs.), relevados el 2026-09-21. */
export const PLANS: Plan[] = [
  {
    id: "landing",
    name: "Landing Simple",
    price: 500_000,
    tag: "La más elegida",
    bullets: [
      "100% personalizada a tu negocio",
      "1 sola página",
      "Sin animaciones, diseño directo",
      "Se entrega en pocos días",
    ],
    missing: "No incluye menú de navegación ni animaciones",
  },
  {
    id: "completa",
    name: "Web Completa",
    price: 840_000,
    tag: "Para negocios con más para mostrar",
    bullets: [
      "100% personalizada a tu negocio",
      "Varias secciones con menú de navegación",
      "Animaciones al hacer scroll",
      "Más personalidad visual",
    ],
    missing: "Sin funciones específicas del rubro (se suman aparte)",
  },
  {
    id: "medida",
    name: "A Medida",
    price: 1_290_000,
    tag: "Si vas a sumar varios extras",
    bullets: [
      "100% personalizada a tu negocio",
      "Todo lo de la Web Completa",
      "Diseño pensado desde cero para el rubro",
      "Ideal si sumás catálogo, reservas o carrito",
    ],
    missing: null,
  },
];

export const DEFAULT_PLAN_ID = "completa";

export const CONTACT_FORM: Addon = {
  id: "formulario_contacto",
  label: "Formulario de contacto",
  desc: "Incluido en todos los planes, sin cargo extra.",
  price: 0,
};

export const UNIVERSAL: Addon[] = [
  {
    id: "whatsapp_btn",
    label: "Botón de WhatsApp directo",
    desc: "Botón flotante que abre un chat de WhatsApp con mensaje prearmado.",
    price: 30_000,
    unit: "",
  },
  {
    id: "mapa",
    label: "Mapa de ubicación",
    desc: "Google Maps en la sección de contacto, para que encuentren el local fácil.",
    price: 30_000,
    unit: "",
  },
  {
    id: "mantenimiento",
    label: "Mantenimiento mensual",
    desc: "Pago recurrente cada mes: cambian textos, precios o fotos las veces que necesiten, sin límite.",
    price: 80_000,
    unit: "/mes",
    recurring: true,
  },
  {
    id: "cambio_puntual",
    label: "Cambio puntual (sin mensualidad)",
    desc: "Para el que no quiere pagar todos los meses: cada pedido de cambio (precio, foto, texto) después de la entrega se cobra aparte, por cambio.",
    price: 40_000,
    unit: "/cambio",
    recurring: false,
  },
  {
    id: "ingles",
    label: "Versión en inglés",
    desc: "Botón para pasar toda la web a inglés.",
    price: 100_000,
    unit: "",
  },
  {
    id: "seo",
    label: "SEO básico",
    desc: "Para que el negocio aparezca mejor cuando lo buscan en Google.",
    price: 90_000,
    unit: "",
  },
  {
    id: "social",
    label: "Feed de Instagram en vivo",
    desc: "Muestra las últimas publicaciones de Instagram dentro de la web.",
    price: 50_000,
    unit: "",
  },
];

export const RUBROS: Rubro[] = [
  {
    id: "gastronomia",
    label: "Restaurantes y comida",
    icon: "🍕",
    keywords: [
      "pizzeria",
      "pizza",
      "restaurante",
      "restaurant",
      "lomiteria",
      "lomitos",
      "comida",
      "hamburgueseria",
      "burger",
      "parrilla",
      "asado",
      "rotiseria",
      "delivery",
      "cocina",
      "gastronomia",
      "diner",
      "cafeteria",
      "cafe",
      "panaderia",
      "pasteleria",
      "heladeria",
      "comida rapida",
    ],
    addons: [
      {
        id: "menu_animado",
        label: "Menú digital con acordeón animado",
        desc: "Categorías (pizzas, lomitos, bebidas...) que se abren y cierran con animación al tocarlas.",
        price: 100_000,
      },
      {
        id: "promos",
        label: "Sección de promos y combos",
        desc: "Franja destacada con las ofertas del día.",
        price: 50_000,
      },
      {
        id: "carta_bebidas",
        label: "Carta de bebidas y tragos",
        desc: "Apartado separado del menú de comidas.",
        price: 40_000,
      },
      {
        id: "pedido_wsp",
        label: "Armador de pedido a WhatsApp",
        desc: "El cliente arma su pedido en la web y se envía listo por WhatsApp.",
        price: 130_000,
      },
      {
        id: "estilos",
        label: "Elegir entre varias paletas de diseño",
        desc: "Ej: versión rústica, moderna o estilo diner, para que el cliente elija.",
        price: 60_000,
      },
    ],
  },
  {
    id: "bar_boliche",
    label: "Bares y vida nocturna",
    icon: "🍸",
    keywords: [
      "bar",
      "boliche",
      "pub",
      "cerveceria",
      "discoteca",
      "nightclub",
      "tragos",
      "coctel",
      "after office",
      "vinoteca",
    ],
    addons: [
      {
        id: "carta_tragos",
        label: "Carta de tragos con fotos",
        desc: "Sección tipo carta con imágenes de cada trago.",
        price: 50_000,
      },
      {
        id: "reserva_mesa",
        label: "Reserva de mesa",
        desc: "Formulario que envía la reserva por WhatsApp.",
        price: 70_000,
      },
      {
        id: "happy_hour",
        label: "Cuenta regresiva de happy hour",
        desc: "Contador en vivo hasta que termina la promo.",
        price: 40_000,
      },
      {
        id: "galeria_ambiente",
        label: "Galería de ambiente",
        desc: "Fotos del local para mostrar la onda del lugar.",
        price: 50_000,
      },
    ],
  },
  {
    id: "veterinaria",
    label: "Veterinarias y petshops",
    icon: "🐾",
    keywords: [
      "veterinaria",
      "veterinario",
      "mascotas",
      "petshop",
      "pet shop",
      "clinica veterinaria",
      "animales",
      "perros",
      "gatos",
      "pet care",
    ],
    addons: [
      {
        id: "turnos_vet",
        label: "Reserva de turnos por WhatsApp",
        desc: "Formulario simple para pedir turno.",
        price: 70_000,
      },
      {
        id: "horario_vivo",
        label: '"Abierto / Cerrado" en vivo',
        desc: "Indicador automático según el horario de atención.",
        price: 40_000,
      },
      {
        id: "planes_pet",
        label: "Planes de salud / prepaga",
        desc: "Tabla comparativa de planes de salud o prepaga para mascotas, con lo que incluye cada uno.",
        price: 100_000,
      },
      {
        id: "normas",
        label: "Normas y requisitos de consulta",
        desc: "Qué traer, vacunas al día, etc.",
        price: 25_000,
      },
      {
        id: "promo_strip_vet",
        label: "Franja de promociones",
        desc: "Cintillo destacado con ofertas vigentes.",
        price: 40_000,
      },
    ],
  },
  {
    id: "moda_boutique",
    label: "Boutique y moda",
    icon: "👗",
    keywords: [
      "boutique",
      "ropa",
      "indumentaria",
      "moda",
      "tienda de ropa",
      "fashion",
      "calzados",
      "zapateria",
      "accesorios",
    ],
    addons: [
      {
        id: "catalogo_moda",
        label: "Catálogo con filtro por categoría",
        desc: "Filtrar por remeras, pantalones, accesorios, etc.",
        price: 100_000,
      },
      {
        id: "lookbook",
        label: "Galería tipo colección / lookbook",
        desc: "Fotos grandes al estilo editorial de moda.",
        price: 60_000,
      },
      {
        id: "carrito_moda",
        label: "Carrito de compra a WhatsApp",
        desc: "El cliente arma el pedido y se envía por WhatsApp.",
        price: 130_000,
      },
      {
        id: "instagram_moda",
        label: "Integración con Instagram",
        desc: "Feed embebido de las últimas publicaciones.",
        price: 50_000,
      },
    ],
  },
  {
    id: "perfumeria",
    label: "Perfumería y cosmética",
    icon: "🌸",
    keywords: [
      "perfumeria",
      "perfume",
      "fragancia",
      "cosmetica",
      "cosmeticos",
      "belleza",
      "skincare",
      "maquillaje",
      "aromas",
    ],
    addons: [
      {
        id: "catalogo_perf",
        label: "Catálogo con filtro (masculino/femenino/notas)",
        desc: "Filtrar los productos por categoría, público o tipo de nota.",
        price: 100_000,
      },
      {
        id: "notas_olfativas",
        label: "Sección de notas olfativas o proceso",
        desc: "Explicación del proceso artesanal de creación.",
        price: 50_000,
      },
      {
        id: "muestrario",
        label: "Sección de muestrario",
        desc: "Vitrina destacada de fragancias.",
        price: 50_000,
      },
      {
        id: "carrito_perf",
        label: "Carrito de compra a WhatsApp",
        desc: "Pedido armado y enviado directo por WhatsApp.",
        price: 130_000,
      },
    ],
  },
  {
    id: "ferreteria",
    label: "Ferretería y retail técnico",
    icon: "🔧",
    keywords: [
      "ferreteria",
      "repuestos",
      "materiales de construccion",
      "corralon",
      "electricidad",
      "plomeria",
      "herramientas",
    ],
    addons: [
      {
        id: "catalogo_ferr",
        label: "Catálogo por categorías",
        desc: "Productos organizados por rubro (eléctrico, plomería, herramientas...).",
        price: 100_000,
      },
      {
        id: "porque_elegirnos",
        label: 'Sección "Por qué elegirnos"',
        desc: "Años en el rubro, marcas, garantía, etc.",
        price: 25_000,
      },
    ],
  },
  {
    id: "gimnasio",
    label: "Gimnasios y fitness",
    icon: "🏋️",
    keywords: [
      "gimnasio",
      "gym",
      "fitness",
      "crossfit",
      "entrenamiento",
      "personal trainer",
      "box",
      "artes marciales",
      "boxeo",
      "fighting club",
    ],
    addons: [
      {
        id: "entrenadores",
        label: "Perfiles de entrenadores",
        desc: "Foto y especialidad de cada profesor o entrenador.",
        price: 60_000,
      },
      {
        id: "planes_gym",
        label: "Planes y precios de membresía",
        desc: "Tabla con los distintos abonos.",
        price: 60_000,
      },
      {
        id: "horario_clases",
        label: "Horarios de clases",
        desc: "Grilla semanal de actividades.",
        price: 40_000,
      },
      {
        id: "clase_prueba",
        label: "Reserva de clase de prueba",
        desc: "Formulario para agendar una clase gratis.",
        price: 70_000,
      },
    ],
  },
  {
    id: "barberia",
    label: "Barbería y peluquería",
    icon: "💈",
    keywords: [
      "barberia",
      "peluqueria",
      "estetica",
      "salon de belleza",
      "uñas",
      "manicura",
      "spa",
      "barberos",
    ],
    addons: [
      {
        id: "galeria_trabajos",
        label: "Galería de trabajos",
        desc: "Fotos de cortes y trabajos realizados.",
        price: 60_000,
      },
      {
        id: "opiniones",
        label: "Opiniones de clientes",
        desc: "Testimonios destacados en la web.",
        price: 40_000,
      },
      {
        id: "turno_barb",
        label: "Reserva de turno por WhatsApp",
        desc: "Formulario simple de reserva.",
        price: 70_000,
      },
    ],
  },
  {
    id: "tatuajes",
    label: "Estudios de tatuaje",
    icon: "🖋️",
    keywords: [
      "tatuaje",
      "tattoo",
      "piercing",
      "bodypiercing",
      "estudio de tatuajes",
      "tatuador",
    ],
    addons: [
      {
        id: "portfolio",
        label: "Portfolio con galería tipo lightbox",
        desc: "Fotos ampliables de trabajos hechos.",
        price: 60_000,
      },
      {
        id: "especialidades",
        label: "Sección de especialidades / estilos",
        desc: "Realismo, tradicional, fine line, etc.",
        price: 40_000,
      },
      {
        id: "proceso_cuidado",
        label: "Guía de proceso e higiene",
        desc: "Pasos del proceso y cuidados post-tatuaje.",
        price: 40_000,
      },
      {
        id: "reserva_consulta",
        label: "Formulario de reserva / consulta",
        desc: "Modal para pedir una consulta previa.",
        price: 70_000,
      },
    ],
  },
  {
    id: "eventos",
    label: "Eventos y producción",
    icon: "🎪",
    keywords: [
      "eventos",
      "salon de eventos",
      "produccion de eventos",
      "dj",
      "sonido",
      "pantallas led",
      "alquiler de equipos",
      "casamientos",
      "quince años",
      "fiestas",
    ],
    addons: [
      {
        id: "catalogo_equipos",
        label: "Catálogo de equipos / servicios",
        desc: "Productos o servicios disponibles para alquilar o contratar, con fotos.",
        price: 100_000,
      },
      {
        id: "galeria_eventos",
        label: "Galería de eventos realizados",
        desc: "Fotos de trabajos anteriores.",
        price: 60_000,
      },
      {
        id: "proceso_contratacion",
        label: "Proceso de contratación paso a paso",
        desc: "Cómo es el proceso desde la consulta hasta el evento.",
        price: 40_000,
      },
      {
        id: "form_cotizacion",
        label: "Formulario de cotización de evento",
        desc: "Piden fecha, tipo de evento y cantidad de invitados.",
        price: 70_000,
      },
    ],
  },
  {
    id: "salud",
    label: "Consultorios y salud",
    icon: "🦷",
    keywords: [
      "odontologia",
      "dentista",
      "clinica dental",
      "consultorio medico",
      "salud",
      "medico",
      "kinesiologia",
      "fisioterapia",
      "nutricionista",
      "psicologo",
      "consultorio",
    ],
    addons: [
      {
        id: "turnos_salud",
        label: "Reserva de turnos online",
        desc: "Formulario que envía la solicitud por WhatsApp.",
        price: 70_000,
      },
      {
        id: "tratamientos",
        label: "Sección de servicios / tratamientos",
        desc: "Detalle de cada tratamiento o especialidad.",
        price: 50_000,
      },
      {
        id: "perfil_profesional",
        label: "Perfil del profesional o equipo",
        desc: "Foto, formación y experiencia.",
        price: 40_000,
      },
      {
        id: "faq",
        label: "Preguntas frecuentes",
        desc: "Dudas comunes de pacientes.",
        price: 25_000,
      },
    ],
  },
  {
    id: "taller",
    label: "Talleres y automotor",
    icon: "🔩",
    keywords: [
      "taller mecanico",
      "mecanica",
      "automotor",
      "auto repuestos",
      "gomeria",
      "lubricentro",
      "chapa y pintura",
      "taller",
    ],
    addons: [
      {
        id: "servicios_taller",
        label: "Lista de servicios con precios orientativos",
        desc: "Cambio de aceite, frenos, diagnóstico, etc.",
        price: 50_000,
      },
      {
        id: "turno_taller",
        label: "Reserva de turno por WhatsApp",
        desc: "Formulario para agendar el vehículo.",
        price: 70_000,
      },
      {
        id: "antes_despues",
        label: "Galería antes / después",
        desc: "Fotos de trabajos de chapa y pintura.",
        price: 50_000,
      },
    ],
  },
  {
    id: "inmobiliaria",
    label: "Inmobiliarias",
    icon: "🏠",
    keywords: [
      "inmobiliaria",
      "propiedades",
      "alquileres",
      "ventas de casas",
      "real estate",
      "terrenos",
      "inmuebles",
    ],
    addons: [
      {
        id: "catalogo_prop",
        label: "Catálogo de propiedades con filtro",
        desc: "Filtrar por zona, precio o tipo de propiedad.",
        price: 130_000,
      },
      {
        id: "ficha_propiedad",
        label: "Ficha detallada por propiedad",
        desc: "Fotos, m², ubicación y características.",
        price: 70_000,
      },
      {
        id: "form_consulta_prop",
        label: "Formulario de consulta por propiedad",
        desc: "Consulta directa desde cada ficha.",
        price: 40_000,
      },
    ],
  },
];

export const OTRO_RUBRO_ID = "otro";
export const TIP_ADDONS_THRESHOLD = 400_000;
