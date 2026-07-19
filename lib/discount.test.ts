import assert from "node:assert/strict";
import test from "node:test";
import { earnsSessionDiscount } from "./discount";

test("genera el descuento únicamente al alcanzar la quinta sesión", () => {
  assert.equal(earnsSessionDiscount(4), false);
  assert.equal(earnsSessionDiscount(5), true);
  assert.equal(earnsSessionDiscount(6), false);
});
