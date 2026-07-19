import assert from "node:assert/strict";
import test from "node:test";
import { ageFromBirthDate } from "./date";

test("calcula la edad según si ya pasó el cumpleaños", () => {
  const today = new Date(2026, 6, 19);
  assert.equal(ageFromBirthDate(new Date(2020, 6, 19), today), "6 años");
  assert.equal(ageFromBirthDate(new Date(2020, 7, 19), today), "5 años");
  assert.equal(ageFromBirthDate(null, today), "Sin fecha");
});
