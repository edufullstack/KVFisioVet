import assert from "node:assert/strict";
import test from "node:test";
import { ownerData } from "./owner";

const form = (phone: string, email: string) => {
  const data = new FormData();
  data.set("name", "Karla"); data.set("phone", phone); data.set("email", email);
  return data;
};

test("acepta teléfono o correo y exige al menos uno", () => {
  assert.deepEqual(ownerData(form("961 123 4567", "")), { name: "Karla", phone: "961 123 4567", email: "" });
  assert.deepEqual(ownerData(form("", "KARLA@EXAMPLE.COM")), { name: "Karla", phone: "", email: "karla@example.com" });
  assert.equal(ownerData(form("", "")), null);
  assert.equal(ownerData(form("", "correo-invalido")), null);
});
