import {
  CONTACT_FORM,
  DEFAULT_PLAN_ID,
  OTRO_RUBRO_ID,
  PLANS,
  RUBROS,
  TIP_ADDONS_THRESHOLD,
  UNIVERSAL,
  type Addon,
  type Plan,
  type Rubro,
} from "./catalog";
import { formatGs, normalize } from "./format";

export type LineItem = {
  id: string;
  label: string;
  price: number;
  unit: string;
  recurring: boolean;
};

export type QuoteInput = {
  rubroId: string | null;
  planId: string;
  checkedAddons: Set<string>;
  checkedUniversal: Set<string>;
  otroTexto: string;
};

export type Quote = {
  plan: Plan;
  rubro: Rubro | null;
  rubroName: string;
  items: LineItem[];
  oneTimeTotal: number;
  monthlyTotal: number;
  addonsCost: number;
  showTip: boolean;
};

export function findPlan(planId: string): Plan {
  return PLANS.find((p) => p.id === planId) ?? PLANS.find((p) => p.id === DEFAULT_PLAN_ID)!;
}

export function findRubro(rubroId: string | null): Rubro | null {
  if (!rubroId || rubroId === OTRO_RUBRO_ID) return null;
  return RUBROS.find((r) => r.id === rubroId) ?? null;
}

export function filterRubros(query: string): Rubro[] {
  const q = normalize(query || "");
  if (!q) return RUBROS;
  return RUBROS.filter(
    (r) =>
      normalize(r.label).includes(q) ||
      r.keywords.some((k) => normalize(k).includes(q) || q.includes(normalize(k))),
  );
}

export function applyUniversalToggle(
  current: Set<string>,
  id: string,
  checked: boolean,
): Set<string> {
  const next = new Set(current);
  if (!checked) {
    next.delete(id);
    return next;
  }
  next.add(id);
  if (id === "mantenimiento") next.delete("cambio_puntual");
  if (id === "cambio_puntual") next.delete("mantenimiento");
  return next;
}

function toItem(addon: Addon): LineItem {
  return {
    id: addon.id,
    label: addon.label,
    price: addon.price,
    unit: addon.unit || "",
    recurring: !!addon.recurring,
  };
}

export function computeQuote(input: QuoteInput): Quote {
  const plan = findPlan(input.planId);
  const rubro = findRubro(input.rubroId);
  const items: LineItem[] = [
    {
      id: plan.id,
      label: plan.name,
      price: plan.price,
      unit: "",
      recurring: false,
    },
    toItem(CONTACT_FORM),
  ];

  if (rubro) {
    for (const addon of rubro.addons) {
      if (input.checkedAddons.has(addon.id)) items.push(toItem(addon));
    }
  }

  for (const addon of UNIVERSAL) {
    if (input.checkedUniversal.has(addon.id)) items.push(toItem(addon));
  }

  const oneTime = items.filter((i) => !i.recurring);
  const recurring = items.filter((i) => i.recurring);
  const oneTimeTotal = oneTime.reduce((sum, i) => sum + i.price, 0);
  const monthlyTotal = recurring.reduce((sum, i) => sum + i.price, 0);
  const addonsCost = oneTimeTotal - plan.price;

  const rubroName =
    input.rubroId === OTRO_RUBRO_ID
      ? input.otroTexto.trim() || "tu negocio"
      : rubro?.label ?? "tu negocio";

  return {
    plan,
    rubro,
    rubroName,
    items,
    oneTimeTotal,
    monthlyTotal,
    addonsCost,
    showTip: plan.id !== "medida" && addonsCost >= TIP_ADDONS_THRESHOLD,
  };
}

export function buildQuoteMessage(quote: Quote): string {
  const oneTime = quote.items.filter((i) => !i.recurring);
  const recurring = quote.items.filter((i) => i.recurring);
  let msg = `*Cotización de página web*\nRubro: ${quote.rubroName}\n\n`;
  for (const item of oneTime) {
    msg += `• ${item.label}: ${item.price === 0 ? "Incluido" : formatGs(item.price)}\n`;
  }
  msg += `\n*Pago único: ${formatGs(quote.oneTimeTotal)}*`;
  if (quote.monthlyTotal > 0) {
    msg += `\n\nMensual:\n`;
    for (const item of recurring) {
      msg += `• ${item.label}: ${formatGs(item.price)}${item.unit}\n`;
    }
    msg += `*Total mensual: ${formatGs(quote.monthlyTotal)} /mes*`;
  }
  msg += `\n\n(Los cambios o rediseños después de la entrega tienen costo aparte — no están incluidos para siempre en el pago único.)`;
  return msg;
}

export function priceLabel(addon: Addon): string {
  if (addon.price === 0) return "Incluido";
  return `+ ${formatGs(addon.price)}${addon.unit || ""}`;
}
