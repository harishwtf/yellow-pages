/** Dialable tel: href, e.g. "+91 98833 33123" → "tel:+919883333123". */
export const telHref = (phone: string): string => `tel:${phone.replace(/[^\d+]/g, '')}`;

/** "WhatsApp +91 94481 97197" → a wa.me link for that number, or null when the note isn't a WhatsApp number. */
export function whatsappHref(note: string): string | null {
  const match = note.match(/^WhatsApp\s+(\+?[\d\s]+)$/i);
  return match ? `https://wa.me/${match[1].replace(/\D/g, '')}` : null;
}

/** The number as a local directory prints it, without the +91 (the tel: link keeps it). */
export const localNumber = (phone: string): string => phone.replace(/^\+91\s*/, '');
