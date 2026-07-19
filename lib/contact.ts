export function contactUrl(message: string, subject: string) {
  const phone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.replace(/\D/g, "");
  if (phone) return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  const email = process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim();
  if (email) return `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
  return null;
}

export function productQuoteUrl(product: string) {
  return contactUrl(`Hola, me interesa cotizar: ${product}.`, `Cotización de ${product}`);
}
