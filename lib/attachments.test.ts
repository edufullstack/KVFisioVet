import assert from "node:assert/strict";
import test from "node:test";
import { attachmentPolicy } from "./attachments";

test("limita videos a 50 MB y rechaza tipos desconocidos", () => {
  assert.equal(attachmentPolicy("VIDEO")?.maxBytes, 50 * 1024 * 1024);
  assert.equal(attachmentPolicy("XRAY")?.maxBytes, 10 * 1024 * 1024);
  assert.equal(attachmentPolicy("EXECUTABLE"), null);
  assert.equal(attachmentPolicy("toString"), null);
});

test("acepta las fotos que produce un celular", () => {
  for (const kind of ["XRAY", "BLOOD_TEST", "OTHER"]) {
    const formats = attachmentPolicy(kind)!.formats.split(",");
    for (const format of ["jpg", "png", "heic", "heif", "webp", "pdf"]) assert.ok(formats.includes(format), `${kind} debe aceptar ${format}`);
  }
});
