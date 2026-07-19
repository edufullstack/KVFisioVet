"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { deleteCloudinaryAsset } from "@/lib/cloudinary";
import { requireUser } from "@/lib/session";

export async function saveClinicalRecord(patientId: string, formData: FormData) {
  const session = await requireUser();
  const reason = String(formData.get("reason") ?? "").trim();
  const assessment = String(formData.get("assessment") ?? "").trim();
  const diagnosis = String(formData.get("diagnosis") ?? "").trim();
  const plannedProtocol = String(formData.get("plannedProtocol") ?? "").trim();
  const painScore = Number(formData.get("painScore"));
  if (!reason || !assessment || !diagnosis || !plannedProtocol || !Number.isInteger(painScore) || painScore < 0 || painScore > 10) redirect(`/dashboard/patients/${patientId}/record?error=Completa+la+consulta+inicial`);

  await db.clinicalRecord.upsert({
    where: { patientId },
    update: { reason, assessment, diagnosis, plannedProtocol, painScore },
    create: { patientId, reason, assessment, diagnosis, plannedProtocol, painScore, createdById: session.user.id },
  });
  revalidatePath(`/dashboard/patients/${patientId}`);
  revalidatePath(`/dashboard/patients/${patientId}/record`);
  redirect(`/dashboard/patients/${patientId}/record`);
}

export async function addRomMeasurement(patientId: string, recordId: string, formData: FormData) {
  await requireUser();
  const joint = String(formData.get("joint") ?? "").trim();
  const side = String(formData.get("side") ?? "").trim();
  const movement = String(formData.get("movement") ?? "").trim();
  const degrees = Number(formData.get("degrees"));
  if (!joint || !side || !movement || !Number.isFinite(degrees) || degrees < -360 || degrees > 360) redirect(`/dashboard/patients/${patientId}/record?error=Revisa+la+medición+ROM`);
  await db.romMeasurement.create({ data: { recordId, joint, side, movement, degrees } });
  revalidatePath(`/dashboard/patients/${patientId}/record`);
}

export async function deleteRomMeasurement(patientId: string, id: string) {
  await requireUser();
  await db.romMeasurement.delete({ where: { id } });
  revalidatePath(`/dashboard/patients/${patientId}/record`);
}

export async function deleteAttachment(patientId: string, id: string) {
  await requireUser();
  const attachment = await db.clinicalAttachment.delete({ where: { id }, select: { publicId: true, resourceType: true } });
  await deleteCloudinaryAsset(attachment.publicId, attachment.resourceType).catch(() => undefined);
  revalidatePath(`/dashboard/patients/${patientId}/record`);
}
