import {
  CONTACT_FORM,
  DEFAULT_PLAN_ID,
  OTRO_RUBRO_ID,
  PLANS,
  UNIVERSAL,
  type Addon,
} from "./catalog";
import { formatGs } from "./format";
import {
  applyUniversalToggle,
  buildQuoteMessage,
  computeQuote,
  filterRubros,
  findRubro,
  priceLabel,
  type Quote,
} from "./quote";
import "./styles.css";

type State = {
  query: string;
  rubroId: string | null;
  planId: string;
  addons: Set<string>;
  universal: Set<string>;
  otroTexto: string;
};

const searchIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>`;

const wspIcon = `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.5 14.4c-.3-.1-1.7-.9-2-1-.3-.1-.5-.1-.7.1-.2.3-.8 1-.9 1.2-.2.2-.3.2-.6.1-.3-.1-1.2-.5-2.3-1.5-.9-.8-1.4-1.7-1.6-2-.2-.3 0-.5.1-.6.1-.1.3-.3.4-.5.1-.1.2-.3.3-.5.1-.2 0-.4 0-.5C10.1 9 9.5 7.6 9.3 7c-.2-.5-.4-.5-.6-.5h-.5c-.2 0-.5.1-.7.3-.2.3-.9.9-.9 2.2s1 2.6 1.1 2.7c.1.2 2 3 4.8 4.3.7.3 1.2.5 1.6.6.7.2 1.3.2 1.8.1.5-.1 1.7-.7 1.9-1.3.2-.7.2-1.2.2-1.3-.1-.1-.3-.2-.5-.3z"/><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5.1-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2z"/></svg>`;

export function mount(root: HTMLElement): void {
  const state: State = {
    query: "",
    rubroId: null,
    planId: DEFAULT_PLAN_ID,
    addons: new Set(),
    universal: new Set(),
    otroTexto: "",
  };

  root.innerHTML = `
    <a class="skip" href="#search">Saltar al buscador</a>
    <div class="wrap">
      <header>
        <div class="brand">
          <div class="mark" aria-hidden="true">L</div>
          <p class="eyebrow">Taller León · páginas web</p>
        </div>
        <h1>Armá el presupuesto de la web</h1>
        <p class="sub">1. Buscá el rubro. 2. Elegí el plan. 3. Marcá lo que le sirve al negocio. El total se calcula solo, abajo de todo.</p>
      </header>

      <div class="banner">
        <span aria-hidden="true">✦</span>
        <span>Cada sitio se arma <b>100% a medida</b>: nombre, productos, fotos y datos reales del negocio. Nada de plantillas genéricas.</span>
      </div>

      <div class="search">
        ${searchIcon}
        <label class="visually-hidden" for="search" style="position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0);">Buscar rubro</label>
        <input id="search" type="search" placeholder="Escribí el rubro: dentista, gimnasio, boutique..." autocomplete="off" />
      </div>

      <div class="rubro-grid" id="rubroGrid" role="list"></div>
      <p class="no-match" id="noMatch" hidden>No encontramos ese rubro — tocá “Otro rubro” y contanos del negocio.</p>

      <section id="config" aria-live="polite">
        <h2 class="section-title"><span class="n">1</span> Elegí el plan</h2>
        <p class="hint">Esto define el tamaño del sitio. Las funciones de abajo se pueden sumar a cualquiera de los tres.</p>
        <div class="plan-grid" id="planGrid"></div>

        <div id="otroBlock" hidden>
          <h2 class="section-title"><span class="n">—</span> Contanos del negocio</h2>
          <p class="hint">No está en la lista todavía, pero armamos la propuesta igual.</p>
          <textarea id="otroTexto" placeholder="Rubro y detalle del negocio (ej: florería, inmobiliaria, academia de inglés...)"></textarea>
        </div>

        <h2 class="section-title"><span class="n">2</span> Sumá lo que sirve para <span id="rubroNombreTitulo" style="color:var(--brick)"></span></h2>
        <p class="hint" id="addonsHint">Tocá para agregar o sacar. Nada viene marcado de entrada.</p>
        <div class="addon-list" id="addonsRubro"></div>

        <h2 class="section-title"><span class="n">3</span> Extras para cualquier rubro</h2>
        <p class="hint">Opcionales, sirven para cualquier negocio.</p>
        <div class="addon-list" id="addonsUniversal"></div>

        <div class="tip" id="tip">💡 Sumaste bastantes funciones — capaz te conviene el plan <b>A Medida</b> en vez de ir agregando de a una.</div>

        <article id="ticket">
          <h2>Detalle de la cotización</h2>
          <div id="ticketBody"></div>
        </article>
      </section>

      <p class="note">
        * Precios de referencia en guaraníes, según proyectos anteriores (San Lorenzo, Luque). Ajustalos con confianza según cada cliente.<br>
        * El pago único cubre la entrega de la web tal cual se cotiza acá. Cualquier cambio o rediseño después de eso (precios, fotos, textos, secciones nuevas) se cobra aparte, con mantenimiento mensual o por cambio puntual.
      </p>
    </div>

    <div id="totalBar" role="status" aria-live="polite">
      <div class="inner">
        <div>
          <span class="total-label">Pago único</span>
          <span class="total-amount" id="totalAmount">Gs. 0</span>
          <span class="monthly-line" id="monthlyLine"></span>
        </div>
        <div class="total-actions">
          <button class="btn btn-copy" id="btnCopy" type="button">Copiar</button>
          <button class="btn btn-wsp" id="btnWsp" type="button">${wspIcon} Enviar</button>
        </div>
      </div>
    </div>
    <div class="toast" id="toast" role="status"></div>
  `;

  const els = {
    search: root.querySelector<HTMLInputElement>("#search")!,
    rubroGrid: root.querySelector<HTMLElement>("#rubroGrid")!,
    noMatch: root.querySelector<HTMLElement>("#noMatch")!,
    config: root.querySelector<HTMLElement>("#config")!,
    planGrid: root.querySelector<HTMLElement>("#planGrid")!,
    otroBlock: root.querySelector<HTMLElement>("#otroBlock")!,
    otroTexto: root.querySelector<HTMLTextAreaElement>("#otroTexto")!,
    rubroNombreTitulo: root.querySelector<HTMLElement>("#rubroNombreTitulo")!,
    addonsHint: root.querySelector<HTMLElement>("#addonsHint")!,
    addonsRubro: root.querySelector<HTMLElement>("#addonsRubro")!,
    addonsUniversal: root.querySelector<HTMLElement>("#addonsUniversal")!,
    tip: root.querySelector<HTMLElement>("#tip")!,
    ticket: root.querySelector<HTMLElement>("#ticket")!,
    ticketBody: root.querySelector<HTMLElement>("#ticketBody")!,
    totalBar: root.querySelector<HTMLElement>("#totalBar")!,
    totalAmount: root.querySelector<HTMLElement>("#totalAmount")!,
    monthlyLine: root.querySelector<HTMLElement>("#monthlyLine")!,
    btnCopy: root.querySelector<HTMLButtonElement>("#btnCopy")!,
    btnWsp: root.querySelector<HTMLButtonElement>("#btnWsp")!,
    toast: root.querySelector<HTMLElement>("#toast")!,
  };

  function currentQuote(): Quote {
    return computeQuote({
      rubroId: state.rubroId,
      planId: state.planId,
      checkedAddons: state.addons,
      checkedUniversal: state.universal,
      otroTexto: state.otroTexto,
    });
  }

  function renderRubros(): void {
    const list = filterRubros(state.query);
    els.noMatch.hidden = !(state.query && list.length === 0);
    els.rubroGrid.innerHTML = "";

    for (const rubro of list) {
      els.rubroGrid.appendChild(
        rubroButton(rubro.id, rubro.icon, rubro.label, state.rubroId === rubro.id, false),
      );
    }
    els.rubroGrid.appendChild(
      rubroButton(OTRO_RUBRO_ID, "✏️", "Otro rubro", state.rubroId === OTRO_RUBRO_ID, true),
    );
  }

  function rubroButton(
    id: string,
    icon: string,
    label: string,
    selected: boolean,
    isOtro: boolean,
  ): HTMLButtonElement {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = `rubro-card${isOtro ? " otro" : ""}${selected ? " selected" : ""}`;
    btn.setAttribute("role", "listitem");
    btn.setAttribute("aria-pressed", selected ? "true" : "false");
    btn.innerHTML = `<span class="ic">${icon}</span><span>${label}</span>`;
    btn.addEventListener("click", () => selectRubro(id));
    return btn;
  }

  function selectRubro(id: string): void {
    state.rubroId = id;
    state.addons = new Set();
    els.config.classList.add("show");
    els.totalBar.classList.add("show");
    const isOtro = id === OTRO_RUBRO_ID;
    els.otroBlock.hidden = !isOtro;
    const rubro = findRubro(id);
    els.rubroNombreTitulo.textContent = isOtro ? "tu rubro" : (rubro?.label.toLowerCase() ?? "");
    renderRubros();
    renderRubroAddons();
    updateQuote();
    els.config.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function renderPlans(): void {
    els.planGrid.innerHTML = "";
    for (const plan of PLANS) {
      const card = document.createElement("button");
      card.type = "button";
      card.className = `plan-card${state.planId === plan.id ? " selected" : ""}`;
      card.setAttribute("aria-pressed", state.planId === plan.id ? "true" : "false");
      const bullets = plan.bullets.map((b) => `<li>✓ ${b}</li>`).join("");
      const missing = plan.missing ? `<li class="miss">✕ ${plan.missing}</li>` : "";
      card.innerHTML = `
        <div class="plan-tag">${plan.tag}</div>
        <div class="plan-name">${plan.name}</div>
        <div class="plan-price">${formatGs(plan.price)}</div>
        <ul class="plan-bullets">${bullets}${missing}</ul>
        <div class="plan-included">✓ ${CONTACT_FORM.label} incluido gratis</div>
      `;
      card.addEventListener("click", () => {
        state.planId = plan.id;
        renderPlans();
        updateQuote();
      });
      els.planGrid.appendChild(card);
    }
  }

  function renderAddon(addon: Addon, set: Set<string>, onToggle: (id: string, checked: boolean) => void): HTMLElement {
    const row = document.createElement("label");
    row.className = `addon${set.has(addon.id) ? " checked" : ""}`;
    row.innerHTML = `
      <input type="checkbox" />
      <div class="addon-body">
        <div class="addon-label">${addon.label}</div>
        <div class="addon-desc">${addon.desc}</div>
      </div>
      <div class="addon-price ${addon.price === 0 ? "free" : ""}">${priceLabel(addon)}</div>
    `;
    const input = row.querySelector("input")!;
    input.checked = set.has(addon.id);
    input.addEventListener("change", () => onToggle(addon.id, input.checked));
    return row;
  }

  function renderRubroAddons(): void {
    const rubro = findRubro(state.rubroId);
    els.addonsRubro.innerHTML = "";
    if (state.rubroId === OTRO_RUBRO_ID) {
      els.addonsHint.textContent =
        "Contame qué necesita este negocio y armamos funciones a medida — mientras tanto podés sumar los extras generales de abajo.";
      return;
    }
    els.addonsHint.textContent = "Tocá para agregar o sacar. Nada viene marcado de entrada.";
    if (!rubro) return;
    for (const addon of rubro.addons) {
      els.addonsRubro.appendChild(
        renderAddon(addon, state.addons, (id, checked) => {
          if (checked) state.addons.add(id);
          else state.addons.delete(id);
          renderRubroAddons();
          updateQuote();
        }),
      );
    }
  }

  function renderUniversal(): void {
    els.addonsUniversal.innerHTML = "";
    for (const addon of UNIVERSAL) {
      els.addonsUniversal.appendChild(
        renderAddon(addon, state.universal, (id, checked) => {
          state.universal = applyUniversalToggle(state.universal, id, checked);
          renderUniversal();
          updateQuote();
        }),
      );
    }
  }

  function updateQuote(): void {
    if (!state.rubroId) return;
    const quote = currentQuote();
    els.totalAmount.textContent = formatGs(quote.oneTimeTotal);
    if (quote.monthlyTotal > 0) {
      els.monthlyLine.textContent = `+ ${formatGs(quote.monthlyTotal)} /mes`;
      els.monthlyLine.classList.add("show");
    } else {
      els.monthlyLine.classList.remove("show");
      els.monthlyLine.textContent = "";
    }

    els.ticketBody.innerHTML = "";
    for (const item of quote.items) {
      const row = document.createElement("div");
      row.className = "ticket-row";
      const value = item.price === 0 ? "Incluido" : formatGs(item.price) + item.unit;
      row.innerHTML = `<span class="rl">${item.label}</span><span class="rv">${value}</span>`;
      els.ticketBody.appendChild(row);
    }
    const totalRow = document.createElement("div");
    totalRow.className = "ticket-row total";
    totalRow.innerHTML = `<span class="rl">Pago único</span><span class="rv">${formatGs(quote.oneTimeTotal)}</span>`;
    els.ticketBody.appendChild(totalRow);
    if (quote.monthlyTotal > 0) {
      const monthlyRow = document.createElement("div");
      monthlyRow.className = "ticket-row total";
      monthlyRow.innerHTML = `<span class="rl">Pago mensual</span><span class="rv">${formatGs(quote.monthlyTotal)} /mes</span>`;
      els.ticketBody.appendChild(monthlyRow);
    }
    els.ticket.classList.add("show");
    els.tip.classList.toggle("show", quote.showTip);
  }

  function showToast(text: string): void {
    els.toast.textContent = text;
    els.toast.classList.add("show");
    window.setTimeout(() => els.toast.classList.remove("show"), 1600);
  }

  async function copyQuote(): Promise<void> {
    const text = buildQuoteMessage(currentQuote());
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const area = document.createElement("textarea");
      area.value = text;
      document.body.appendChild(area);
      area.select();
      document.execCommand("copy");
      area.remove();
    }
    const old = els.btnCopy.textContent;
    els.btnCopy.textContent = "Copiado ✓";
    showToast("Cotización copiada");
    window.setTimeout(() => {
      els.btnCopy.textContent = old;
    }, 1500);
  }

  function sendWhatsApp(): void {
    const url = "https://wa.me/?text=" + encodeURIComponent(buildQuoteMessage(currentQuote()));
    window.open(url, "_blank", "noopener,noreferrer");
  }

  els.search.addEventListener("input", () => {
    state.query = els.search.value;
    renderRubros();
  });
  els.otroTexto.addEventListener("input", () => {
    state.otroTexto = els.otroTexto.value;
  });
  els.btnCopy.addEventListener("click", () => void copyQuote());
  els.btnWsp.addEventListener("click", sendWhatsApp);

  renderRubros();
  renderPlans();
  renderUniversal();
}
