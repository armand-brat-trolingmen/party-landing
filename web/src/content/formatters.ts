export function buildPhoneHref(raw: string) {
  return `tel:${raw}`;
}

export function buildMailtoHref(raw: string) {
  return `mailto:${raw}`;
}
