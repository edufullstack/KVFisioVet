"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/session";

function ownerData(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  return name && phone && email.includes("@") ? { name, phone, email } : null;
}

export async function createOwner(formData: FormData) {
  await requireUser();
  const data = ownerData(formData);
  if (!data) redirect("/dashboard/owners/new?error=Completa+los+datos+del+propietario");
  await db.owner.create({ data });
  revalidatePath("/dashboard/owners");
  redirect("/dashboard/owners");
}

export async function updateOwner(id: string, formData: FormData) {
  await requireUser();
  const data = ownerData(formData);
  if (!data) redirect(`/dashboard/owners/${id}/edit?error=Completa+los+datos+del+propietario`);
  await db.owner.update({ where: { id }, data });
  revalidatePath("/dashboard/owners");
  redirect("/dashboard/owners");
}

export async function deleteOwner(id: string) {
  await requireUser();
  const patients = await db.patient.count({ where: { ownerId: id } });
  if (patients) redirect("/dashboard/owners?error=No+puedes+eliminar+un+propietario+con+pacientes");
  await db.owner.delete({ where: { id } });
  revalidatePath("/dashboard/owners");
  redirect("/dashboard/owners");
}
