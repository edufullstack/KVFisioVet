import { AttachmentKind } from "@prisma/client";

// Cloudinary rechaza cualquier formato fuera de esta lista: incluye HEIC/HEIF
// porque es lo que producen las cámaras de iPhone/iPad al tomar la foto.
const imageFormats = "jpg,jpeg,png,webp,gif,bmp,tif,tiff,heic,heif,avif,pdf";
const videoFormats = "mp4,mov,m4v,webm,3gp";

const policies = {
  [AttachmentKind.VIDEO]: { formats: videoFormats, maxBytes: 50 * 1024 * 1024 },
  [AttachmentKind.XRAY]: { formats: imageFormats, maxBytes: 10 * 1024 * 1024 },
  [AttachmentKind.BLOOD_TEST]: { formats: imageFormats, maxBytes: 10 * 1024 * 1024 },
  [AttachmentKind.OTHER]: { formats: `${imageFormats},${videoFormats}`, maxBytes: 50 * 1024 * 1024 },
};

export function attachmentPolicy(kind: unknown) {
  return typeof kind === "string" && Object.hasOwn(policies, kind) ? policies[kind as AttachmentKind] : null;
}
