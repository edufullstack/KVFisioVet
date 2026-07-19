"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { deletePatientPhoto, uploadPatientPhoto } from "@/lib/cloudinary";
import { requireUser } from "@/lib/session";

function patientData(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const species = String(formData.get("species") ?? "").trim();
  const breed = String(formData.get("breed") ?? "").trim();
  const ownerId = String(formData.get("ownerId") ?? "");
  const birth = String(formData.get("birthDate") ?? "");
  const weight = String(formData.get("weightKg") ?? "");
  const birthDate = birth ? new Date(`${birth}T12:00:00`) : null;
  const weightKg = weight ? Number(weight) : null;
  if (!name || !species || !breed || !ownerId || (birthDate && Number.isNaN(birthDate.getTime())) || (weightKg !== null && (!Number.isFinite(weightKg) || weightKg <= 0))) return null;
  return { name, species, breed, ownerId, birthDate, weightKg };
}

export async function createPatient(formData: FormData) {
  await requireUser();
  const data = patientData(formData);
  if (!data) redirect("/dashboard/patients/new?error=Revisa+los+datos+del+paciente");
  const photo = formData.get("photo");
  const uploaded = photo instanceof File && photo.size ? await uploadPatientPhoto(photo) : null;
  await db.patient.create({ data: { ...data, photoUrl: uploaded?.url, photoPublicId: uploaded?.publicId } });
  revalidatePath("/dashboard/patients");
  redirect("/dashboard/patients");
}

export async function updatePatient(id: string, formData: FormData) {
  await requireUser();
  const data = patientData(formData);
  if (!data) redirect(`/dashboard/patients/${id}/edit?error=Revisa+los+datos+del+paciente`);
  const current = await db.patient.findUniqueOrThrow({ where: { id }, select: { photoPublicId: true } });
  const photo = formData.get("photo");
  const uploaded = photo instanceof File && photo.size ? await uploadPatientPhoto(photo) : null;
  await db.patient.update({ where: { id }, data: { ...data, ...(uploaded && { photoUrl: uploaded.url, photoPublicId: uploaded.publicId }) } });
  if (uploaded && current.photoPublicId) await deletePatientPhoto(current.photoPublicId).catch(() => undefined);
  revalidatePath("/dashboard/patients");
  revalidatePath(`/dashboard/patients/${id}`);
  redirect(`/dashboard/patients/${id}`);
}

export async function deletePatient(id: string) {
  await requireUser();
  const patient = await db.patient.delete({ where: { id }, select: { photoPublicId: true } });
  if (patient.photoPublicId) await deletePatientPhoto(patient.photoPublicId).catch(() => undefined);
  revalidatePath("/dashboard/patients");
  redirect("/dashboard/patients");
}
