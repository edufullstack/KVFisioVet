import { AttachmentKind } from "@prisma/client";

const policies = {
  [AttachmentKind.VIDEO]: { formats: "mp4,mov,webm", maxBytes: 50 * 1024 * 1024 },
  [AttachmentKind.XRAY]: { formats: "jpg,jpeg,png,webp,pdf", maxBytes: 10 * 1024 * 1024 },
  [AttachmentKind.BLOOD_TEST]: { formats: "jpg,jpeg,png,webp,pdf", maxBytes: 10 * 1024 * 1024 },
  [AttachmentKind.OTHER]: { formats: "jpg,jpeg,png,webp,pdf,mp4,mov,webm", maxBytes: 10 * 1024 * 1024 },
};

export function attachmentPolicy(kind: unknown) {
  return typeof kind === "string" && kind in policies ? policies[kind as AttachmentKind] : null;
}
