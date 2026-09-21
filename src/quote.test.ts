import { describe, expect, it } from "vitest";
import { DEFAULT_PLAN_ID, PLANS, RUBROS, UNIVERSAL } from "./catalog";
import { formatGs, normalize } from "./format";
import {
  applyUniversalToggle,
  buildQuoteMessage,
  computeQuote,
  filterRubros,
} from "./quote";

function quote(partial: {
  rubroId?: string | null;
  planId?: string;
  addons?: string[];
  universal?: string[];
  otroTexto?: string;
}) {
  return computeQuote({
    rubroId: partial.rubroId ?? "gastronomia",
    planId: partial.planId ?? DEFAULT_PLAN_ID,
    checkedAddons: new Set(partial.addons ?? []),
    checkedUniversal: new Set(partial.universal ?? []),
    otroTexto: partial.otroTexto ?? "",
  });
}

describe("formatGs", () => {
  it("usa prefijo Gs. y locale es-PY", () => {
    expect(formatGs(840000)).toMatch(/^Gs\. /);
    expect(formatGs(840000)).toContain("840");
  });
});

describe("filterRubros", () => {
  it("encuentra dentista en consultorios y salud", () => {
    const list = filterRubros("dentista");
    expect(list.map((r) => r.id)).toEqual(["salud"]);
  });

  it("es insensible a acentos", () => {
    expect(filterRubros("perfumeria").map((r) => r.id)).toContain("perfumeria");
    expect(filterRubros("peluquería").map((r) => r.id)).toContain("barberia");
  });

  it("devuelve vacío si no hay coincidencia", () => {
    expect(filterRubros("xyzzy")).toEqual([]);
  });

  it("sin query muestra todos los rubros", () => {
    expect(filterRubros("")).toHaveLength(RUBROS.length);
  });
});

describe("computeQuote", () => {
  it("usa Web Completa por defecto: Gs. 840.000", () => {
    const q = quote({});
    expect(q.plan.id).toBe("completa");
    expect(q.oneTimeTotal).toBe(840_000);
    expect(q.monthlyTotal).toBe(0);
    expect(q.items[1].label).toBe("Formulario de contacto");
    expect(q.items[1].price).toBe(0);
  });

  it("Landing Simple = 500.000 y A Medida = 1.290.000", () => {
    expect(quote({ planId: "landing" }).oneTimeTotal).toBe(500_000);
    expect(quote({ planId: "medida" }).oneTimeTotal).toBe(1_290_000);
  });

  it("suma extras del rubro al pago único", () => {
    const q = quote({
      addons: ["menu_animado", "pedido_wsp"],
    });
    expect(q.oneTimeTotal).toBe(840_000 + 100_000 + 130_000);
    expect(q.addonsCost).toBe(230_000);
    expect(q.showTip).toBe(false);
  });

  it("muestra el tip A Medida desde Gs. 400.000 en extras únicos", () => {
    const q = quote({
      addons: ["menu_animado", "pedido_wsp", "estilos", "promos"],
      universal: ["ingles", "seo"],
    });
    expect(q.addonsCost).toBe(530_000);
    expect(q.showTip).toBe(true);
    expect(
      quote({
        planId: "medida",
        addons: ["menu_animado", "pedido_wsp", "estilos", "promos"],
        universal: ["ingles", "seo"],
      }).showTip,
    ).toBe(false);
  });

  it("el umbral del tip es inclusivo en 400.000 y no dispara debajo", () => {
    const below = quote({
      planId: "landing",
      universal: ["ingles", "seo", "social", "whatsapp_btn", "mapa", "cambio_puntual"],
    });
    expect(below.addonsCost).toBe(340_000);
    expect(below.showTip).toBe(false);

    const exact = quote({
      planId: "landing",
      addons: ["estilos"],
      universal: ["ingles", "seo", "social", "whatsapp_btn", "mapa", "cambio_puntual"],
    });
    expect(exact.addonsCost).toBe(400_000);
    expect(exact.showTip).toBe(true);
  });

  it("mantenimiento mensual no suma al pago único", () => {
    const q = quote({ universal: ["mantenimiento"] });
    expect(q.oneTimeTotal).toBe(840_000);
    expect(q.monthlyTotal).toBe(80_000);
    expect(q.items.some((i) => i.id === "mantenimiento" && i.recurring)).toBe(true);
  });

  it("cambio puntual sí suma al pago único", () => {
    const q = quote({ universal: ["cambio_puntual"] });
    expect(q.oneTimeTotal).toBe(880_000);
    expect(q.monthlyTotal).toBe(0);
  });

  it("otro rubro no agrega extras de categoría", () => {
    const q = quote({
      rubroId: "otro",
      addons: ["menu_animado"],
      otroTexto: "florería en Luque",
    });
    expect(q.oneTimeTotal).toBe(840_000);
    expect(q.rubroName).toBe("florería en Luque");
  });

  it("otro rubro sin texto usa 'tu negocio'", () => {
    expect(quote({ rubroId: "otro" }).rubroName).toBe("tu negocio");
  });
});

describe("applyUniversalToggle", () => {
  it("mantenimiento y cambio puntual son excluyentes", () => {
    let set = applyUniversalToggle(new Set(), "mantenimiento", true);
    expect([...set]).toEqual(["mantenimiento"]);
    set = applyUniversalToggle(set, "cambio_puntual", true);
    expect([...set]).toEqual(["cambio_puntual"]);
    set = applyUniversalToggle(set, "mantenimiento", true);
    expect([...set]).toEqual(["mantenimiento"]);
    set = applyUniversalToggle(set, "mantenimiento", false);
    expect([...set]).toEqual([]);
  });
});

describe("buildQuoteMessage", () => {
  it("incluye rubro, ítems y pago único", () => {
    const msg = buildQuoteMessage(
      quote({ universal: ["mantenimiento", "whatsapp_btn"] }),
    );
    expect(msg).toContain("Restaurantes y comida");
    expect(msg).toContain("Web Completa");
    expect(msg).toContain("Formulario de contacto: Incluido");
    expect(msg).toContain("Botón de WhatsApp directo");
    expect(msg).toContain("Pago único:");
    expect(msg).toContain("Total mensual:");
    expect(msg).toContain("Mantenimiento mensual");
  });
});

describe("catálogo", () => {
  it("tiene 13 rubros y 3 planes", () => {
    expect(RUBROS).toHaveLength(13);
    expect(PLANS).toHaveLength(3);
    expect(UNIVERSAL).toHaveLength(7);
  });

  it("normaliza para búsquedas", () => {
    expect(normalize("Peluquería")).toBe("peluqueria");
  });
});
