"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export function AttachmentUploader({ recordId }: { recordId: string }) {
  const router = useRouter();
  const [status, setStatus] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("Subiendo…");
    const form = event.currentTarget;
    const data = new FormData(form);
    const file = data.get("file");
    const kind = String(data.get("kind"));
    if (!(file instanceof File) || !file.size) return setStatus("Selecciona un archivo");

    try {
      const signedResponse = await fetch(`/api/clinical-records/${recordId}/attachments/sign`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ kind, size: file.size }) });
      const signed = await signedResponse.json();
      if (!signedResponse.ok) throw new Error(signed.error);

      const upload = new FormData();
      upload.set("file", file);
      upload.set("api_key", signed.apiKey);
      upload.set("timestamp", String(signed.timestamp));
      upload.set("folder", signed.folder);
      upload.set("allowed_formats", signed.allowedFormats);
      upload.set("signature", signed.signature);
      const cloudResponse = await fetch(`https://api.cloudinary.com/v1_1/${signed.cloudName}/auto/upload`, { method: "POST", body: upload });
      const cloud = await cloudResponse.json();
      if (!cloudResponse.ok) throw new Error(cloud.error?.message ?? "No se pudo subir el archivo");

      const saveResponse = await fetch(`/api/clinical-records/${recordId}/attachments`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ kind, originalName: file.name, url: cloud.secure_url, publicId: cloud.public_id, resourceType: cloud.resource_type, bytes: cloud.bytes }) });
      const saved = await saveResponse.json();
      if (!saveResponse.ok) throw new Error(saved.error);
      form.reset();
      setStatus("Archivo agregado");
      router.refresh();
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "No se pudo subir el archivo");
    }
  }

  return <form className="attachment-form" onSubmit={submit}>
    <select aria-label="Tipo de archivo" name="kind"><option value="XRAY">Radiografía/imagen</option><option value="BLOOD_TEST">Estudio de sangre</option><option value="VIDEO">Video</option><option value="OTHER">Otro</option></select>
    <input aria-label="Archivo" name="file" type="file" accept="image/*,.pdf,video/mp4,video/quicktime,video/webm" required />
    <button disabled={status === "Subiendo…"}>Agregar</button>
    {status && <small className={status.startsWith("Archivo") ? "success-text" : "error"} role="status">{status}</small>}
  </form>;
}
