/** Dialable tel: href: digits and a leading plus, nothing else. */
export const telHref = (phone: string): string => `tel:${phone.replace(/[^\d+]/g, '')}`;
