import { createHash } from "node:crypto";

const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

function config() {
  if (!cloudName || !apiKey || !apiSecret) throw new Error("Cloudinary no está configurado");
  return { cloudName, apiKey, apiSecret };
}

function signature(value: string, secret: string) {
  return createHash("sha1").update(value + secret).digest("hex");
}

export async function uploadPatientPhoto(file: File) {
  if (!file.type.startsWith("image/")) throw new Error("La foto debe ser una imagen");
  if (file.size > 5 * 1024 * 1024) throw new Error("La foto no puede superar 5 MB");
  const { cloudName, apiKey, apiSecret } = config();
  const timestamp = Math.floor(Date.now() / 1000);
  const folder = "kv-fisio-vet/patients";
  const body = new FormData();
  body.set("file", file);
  body.set("api_key", apiKey);
  body.set("timestamp", String(timestamp));
  body.set("folder", folder);
  body.set("signature", signature(`folder=${folder}&timestamp=${timestamp}`, apiSecret));

  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, { method: "POST", body });
  if (!response.ok) throw new Error("No se pudo subir la foto");
  const result = await response.json();
  return { url: result.secure_url as string, publicId: result.public_id as string };
}

export async function deletePatientPhoto(publicId: string) {
  const { cloudName, apiKey, apiSecret } = config();
  const timestamp = Math.floor(Date.now() / 1000);
  const body = new URLSearchParams({ public_id: publicId, api_key: apiKey, timestamp: String(timestamp), signature: signature(`public_id=${publicId}&timestamp=${timestamp}`, apiSecret) });
  await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`, { method: "POST", body });
}
