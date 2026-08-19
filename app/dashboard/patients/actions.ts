"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { deleteCloudinaryAsset, uploadImage } from "@/lib/cloudinary";
import { birthDateFromAge } from "@/lib/date";
import { requireUser } from "@/lib/session";

function patientData(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const species = String(formData.get("species") ?? "").trim();
  const breed = String(formData.get("breed") ?? "").trim();
  const ownerId = String(formData.get("ownerId") ?? "");
  const years = String(formData.get("ageYears") ?? "").trim();
  const months = String(formData.get("ageMonths") ?? "").trim();
  const weight = String(formData.get("weightKg") ?? "");
  const ageYears = years ? Number(years) : 0;
  const ageMonths = months ? Number(months) : 0;
  const validAge = Number.isInteger(ageYears) && ageYears >= 0 && ageYears <= 40 && Number.isInteger(ageMonths) && ageMonths >= 0 && ageMonths <= 11;
  const birthDate = validAge && (years || months) ? birthDateFromAge(ageYears, ageMonths) : null;
  const weightKg = weight ? Number(weight) : null;
  if (!name || !species || !breed || !ownerId || !validAge || (weightKg !== null && (!Number.isFinite(weightKg) || weightKg <= 0))) return null;
  return { name, species, breed, ownerId, birthDate, weightKg };
}

export async function createPatient(formData: FormData) {
  await requireUser();
  const data = patientData(formData);
  if (!data) redirect("/dashboard/patients/new?error=Revisa+los+datos+del+paciente");
  const photo = formData.get("photo");
  const uploaded = photo instanceof File && photo.size ? await uploadImage(photo, "patients") : null;
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
  const uploaded = photo instanceof File && photo.size ? await uploadImage(photo, "patients") : null;
  await db.patient.update({ where: { id }, data: { ...data, ...(uploaded && { photoUrl: uploaded.url, photoPublicId: uploaded.publicId }) } });
  if (uploaded && current.photoPublicId) await deleteCloudinaryAsset(current.photoPublicId, "image").catch(() => undefined);
  revalidatePath("/dashboard/patients");
  revalidatePath(`/dashboard/patients/${id}`);
  redirect(`/dashboard/patients/${id}`);
}

export async function deletePatient(id: string) {
  await requireUser();
  const patient = await db.patient.delete({ where: { id }, select: { photoPublicId: true } });
  if (patient.photoPublicId) await deleteCloudinaryAsset(patient.photoPublicId, "image").catch(() => undefined);
  revalidatePath("/dashboard/patients");
  redirect("/dashboard/patients");
}
