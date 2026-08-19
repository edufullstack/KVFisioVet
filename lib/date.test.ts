import assert from "node:assert/strict";
import test from "node:test";
import { ageFromBirthDate, ageParts, birthDateFromAge } from "./date";

test("calcula la edad según si ya pasó el cumpleaños", () => {
  const today = new Date(2026, 6, 19);
  assert.equal(ageFromBirthDate(new Date(2020, 6, 19), today), "6 años");
  assert.equal(ageFromBirthDate(new Date(2020, 7, 19), today), "5 años y 11 meses");
  assert.equal(ageFromBirthDate(new Date(2026, 6, 1), today), "Menos de 1 mes");
  assert.equal(ageFromBirthDate(null, today), "Sin fecha");
});

test("la edad capturada va y vuelve como fecha aproximada", () => {
  for (const today of [new Date(2026, 6, 19), new Date(2026, 2, 31), new Date(2024, 1, 29)]) {
    for (const [years, months] of [[0, 0], [0, 1], [0, 11], [5, 0], [12, 7]]) {
      assert.deepEqual(ageParts(birthDateFromAge(years, months, today), today), { years, months }, `${years}a ${months}m en ${today.toDateString()}`);
    }
  }
});
