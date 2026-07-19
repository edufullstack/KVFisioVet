"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/session";

function exerciseData(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const category = String(formData.get("category") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim() || null;
  return name && category ? { name, category, description } : null;
}

export async function createExercise(formData: FormData) {
  await requireUser();
  const data = exerciseData(formData);
  if (!data) redirect("/dashboard/exercises?error=Completa+nombre+y+categoría");
  try { await db.exercise.create({ data }); } catch { redirect("/dashboard/exercises?error=Ya+existe+un+ejercicio+con+ese+nombre"); }
  revalidatePath("/dashboard/exercises");
}

export async function updateExercise(id: string, formData: FormData) {
  await requireUser();
  const data = exerciseData(formData);
  if (!data) redirect(`/dashboard/exercises/${id}/edit?error=Completa+nombre+y+categoría`);
  try { await db.exercise.update({ where: { id }, data }); } catch { redirect(`/dashboard/exercises/${id}/edit?error=No+se+pudo+guardar`); }
  revalidatePath("/dashboard/exercises");
  redirect("/dashboard/exercises");
}

export async function deleteExercise(id: string) {
  await requireUser();
  if (await db.sessionExercise.count({ where: { exerciseId: id } })) redirect("/dashboard/exercises?error=No+puedes+eliminar+un+ejercicio+ya+utilizado");
  await db.exercise.delete({ where: { id } });
  revalidatePath("/dashboard/exercises");
}
