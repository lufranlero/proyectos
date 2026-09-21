export function formatGs(n: number): string {
  return "Gs. " + n.toLocaleString("es-PY");
}

export function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}
