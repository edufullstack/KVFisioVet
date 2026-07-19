import assert from "node:assert/strict";
import test from "node:test";
import { attachmentPolicy } from "./attachments";

test("limita videos a 50 MB y rechaza tipos desconocidos", () => {
  assert.equal(attachmentPolicy("VIDEO")?.maxBytes, 50 * 1024 * 1024);
  assert.equal(attachmentPolicy("XRAY")?.maxBytes, 10 * 1024 * 1024);
  assert.equal(attachmentPolicy("EXECUTABLE"), null);
});
