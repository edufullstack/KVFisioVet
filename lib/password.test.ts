import assert from "node:assert/strict";
import test from "node:test";
import { hashPassword, verifyPassword } from "./password";

test("verifica la contraseña sin guardar el texto original", async () => {
  const hash = await hashPassword("una-contraseña-segura");
  assert.equal(hash.includes("una-contraseña-segura"), false);
  assert.equal(await verifyPassword("una-contraseña-segura", hash), true);
  assert.equal(await verifyPassword("incorrecta", hash), false);
});
