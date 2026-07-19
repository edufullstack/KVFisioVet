"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/session";

async function sessionData(formData: FormData) {
  const doctorId = String(formData.get("doctorId") ?? "");
  const date = String(formData.get("occurredAt") ?? "");
  const painScore = Number(formData.get("painScore"));
  const notes = String(formData.get("notes") ?? "").trim();
  const nextPlan = String(formData.get("nextPlan") ?? "").trim();
  const occurredAt = new Date(`${date}T12:00:00Z`);
  if (!doctorId || !date || Number.isNaN(occurredAt.getTime()) || !Number.isInteger(painScore) || painScore < 0 || painScore > 10 || !notes || !nextPlan) return null;
  if (!(await db.user.findUnique({ where: { id: doctorId }, select: { id: true } }))) return null;
  const requestedIds = [...new Set(formData.getAll("exerciseIds").map(String))];
  const exercises = await db.exercise.findMany({ where: { id: { in: requestedIds } }, select: { id: true } });
  return { doctorId, occurredAt, painScore, notes, nextPlan, exercises: exercises.map(({ id }) => ({ exerciseId: id, dosage: String(formData.get(`dosage-${id}`) ?? "").trim() || "Sin dosificación" })) };
}

export async function createTherapySession(patientId: string, formData: FormData) {
  await requireUser();
  const data = await sessionData(formData);
  if (!data) redirect(`/dashboard/patients/${patientId}/sessions/new?error=Revisa+los+datos+de+la+sesión`);
  const session = await db.therapySession.create({ data: { patientId, doctorId: data.doctorId, occurredAt: data.occurredAt, painScore: data.painScore, notes: data.notes, nextPlan: data.nextPlan, exercises: { create: data.exercises } } });
  revalidatePath(`/dashboard/patients/${patientId}`);
  revalidatePath(`/dashboard/patients/${patientId}/sessions`);
  redirect(`/dashboard/patients/${patientId}/sessions/${session.id}`);
}

export async function updateTherapySession(patientId: string, sessionId: string, formData: FormData) {
  await requireUser();
  const data = await sessionData(formData);
  if (!data) redirect(`/dashboard/patients/${patientId}/sessions/${sessionId}/edit?error=Revisa+los+datos+de+la+sesión`);
  await db.$transaction(async (tx) => {
    await tx.sessionExercise.deleteMany({ where: { sessionId } });
    await tx.therapySession.update({ where: { id: sessionId }, data: { doctorId: data.doctorId, occurredAt: data.occurredAt, painScore: data.painScore, notes: data.notes, nextPlan: data.nextPlan, exercises: { create: data.exercises } } });
  });
  revalidatePath(`/dashboard/patients/${patientId}/sessions`);
  redirect(`/dashboard/patients/${patientId}/sessions/${sessionId}`);
}

export async function deleteTherapySession(patientId: string, sessionId: string) {
  await requireUser();
  await db.therapySession.delete({ where: { id: sessionId } });
  revalidatePath(`/dashboard/patients/${patientId}`);
  revalidatePath(`/dashboard/patients/${patientId}/sessions`);
  redirect(`/dashboard/patients/${patientId}/sessions`);
}

export async function addSessionRom(patientId: string, sessionId: string, formData: FormData) {
  await requireUser();
  const joint = String(formData.get("joint") ?? "").trim();
  const side = String(formData.get("side") ?? "").trim();
  const movement = String(formData.get("movement") ?? "").trim();
  const degrees = Number(formData.get("degrees"));
  if (!joint || !side || !movement || !Number.isFinite(degrees) || degrees < -360 || degrees > 360) redirect(`/dashboard/patients/${patientId}/sessions/${sessionId}?error=Revisa+la+medición+ROM`);
  await db.sessionRomMeasurement.create({ data: { sessionId, joint, side, movement, degrees } });
  revalidatePath(`/dashboard/patients/${patientId}/sessions`);
  revalidatePath(`/dashboard/patients/${patientId}/sessions/${sessionId}`);
}

export async function deleteSessionRom(patientId: string, sessionId: string, id: string) {
  await requireUser();
  await db.sessionRomMeasurement.delete({ where: { id } });
  revalidatePath(`/dashboard/patients/${patientId}/sessions`);
  revalidatePath(`/dashboard/patients/${patientId}/sessions/${sessionId}`);
}
