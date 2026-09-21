# Cotizador de páginas web — Taller León

Aplicación web en español para armar el presupuesto de un sitio a medida: rubro, plan, extras y total en **guaraníes (Gs.)**.

El flujo y los precios se invirtieron del cotizador de referencia [cotizadorwebpy.netlify.app](https://cotizadorwebpy.netlify.app) (relevado el 21-sep-2026). La interfaz es original (Taller León); no es un clon visual ni usa su marca.

## Cómo usarlo

1. Buscá o elegí el rubro del negocio (o **Otro rubro**).
2. Elegí el plan: Landing Simple, Web Completa (por defecto) o A Medida.
3. Marcá funciones del rubro y extras universales.
4. El **pago único** y el eventual **pago mensual** se actualizan solos.
5. **Copiar** deja el detalle en el portapapeles; **Enviar** abre WhatsApp con el mismo texto.

No hay PDF ni envío por correo: el sitio de referencia tampoco los ofrece.

## Desarrollo

```bash
npm install
npm test
npm run dev
```

Build estático (Netlify u otro host):

```bash
npm run build
```

La carpeta publicada es `dist/`.

## Lógica de precios (inversión)

| Concepto | Monto |
| --- | ---: |
| Landing Simple | Gs. 500.000 |
| Web Completa (default) | Gs. 840.000 |
| A Medida | Gs. 1.290.000 |
| Formulario de contacto | Incluido (Gs. 0) |
| Botón de WhatsApp | Gs. 30.000 |
| Mapa | Gs. 30.000 |
| Mantenimiento mensual | Gs. 80.000 /mes (no suma al pago único) |
| Cambio puntual | Gs. 40.000 /cambio (sí suma al pago único) |
| Versión en inglés | Gs. 100.000 |
| SEO básico | Gs. 90.000 |
| Feed de Instagram | Gs. 50.000 |

- Mantenimiento mensual y cambio puntual son **excluyentes**.
- Si el plan no es A Medida y los extras de **pago único** llegan a Gs. 400.000, aparece la sugerencia de pasar a A Medida.
- Al cambiar de rubro se limpian los extras de categoría; los extras universales se conservan.

Ver `src/catalog.ts` y `src/quote.ts` para el detalle por rubro. Los tests en `src/quote.test.ts` fijan esta lógica.
