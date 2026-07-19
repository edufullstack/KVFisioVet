import assert from "node:assert/strict";
import test from "node:test";
import { chartPoints } from "./chart";

test("distribuye una serie dentro del área SVG", () => {
  assert.deepEqual(chartPoints([0, 5, 10], 0, 10, 100, 100, 10), [{ x: 10, y: 90 }, { x: 50, y: 50 }, { x: 90, y: 10 }]);
  assert.deepEqual(chartPoints([5], 0, 10, 100, 100, 10), [{ x: 10, y: 50 }]);
});
