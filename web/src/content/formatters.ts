export function buildPhoneHref(raw: string) {
  return `tel:${raw}`;
}

export function buildMailtoHref(raw: string) {
  return `mailto:${raw}`;
}

export function parseRubPriceFromLabel(label: string) {
  return Number(label.replace(/[^\d]/g, ''));
}

export function formatRubPriceFrom(value: number) {
  return `от ${value.toLocaleString('ru-RU').replace(/\s/g, '.')} ₽`;
}
