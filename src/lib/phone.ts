/** "1533 (WhatsApp +91 94481 97197)" → { primary: "1533", extra: "(WhatsApp +91 94481 97197)" } */
export function splitPhone(phone: string): { primary: string; extra: string | null } {
  const i = phone.indexOf('(');
  if (i === -1) return { primary: phone.trim(), extra: null };
  return { primary: phone.slice(0, i).trim(), extra: phone.slice(i).trim() };
}

/** Dialable tel: href for the primary number. */
export function telHref(phone: string): string {
  return `tel:${splitPhone(phone).primary.replace(/[^\d+]/g, '')}`;
}
