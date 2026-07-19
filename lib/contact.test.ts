import assert from "node:assert/strict";
import test from "node:test";
import { productQuoteUrl } from "./contact";

test("crea cotización por WhatsApp y usa correo como respaldo", () => {
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER = "+52 55 1234 5678";
  process.env.NEXT_PUBLIC_CONTACT_EMAIL = "clinica@example.com";
  assert.match(productQuoteUrl("Arnés") ?? "", /^https:\/\/wa\.me\/525512345678/);
  delete process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
  assert.match(productQuoteUrl("Arnés") ?? "", /^mailto:clinica@example\.com/);
  delete process.env.NEXT_PUBLIC_CONTACT_EMAIL;
});
