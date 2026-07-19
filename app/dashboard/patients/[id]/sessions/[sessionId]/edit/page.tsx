import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { updateTherapySession } from "../../actions";
import { SessionForm } from "../../session-form";
import { Role } from "@prisma/client";

export default async function EditSessionPage({ params, searchParams }: { params: Promise<{ id: string; sessionId: string }>; searchParams: Promise<{ error?: string }> }) {
  const { id, sessionId } = await params;
  const { error } = await searchParams;
  const [session, staff, exercises, authSession] = await Promise.all([db.therapySession.findFirst({ where: { id: sessionId, patientId: id }, include: { patient: { select: { name: true } }, exercises: { select: { exerciseId: true, dosage: true } } } }), db.user.findMany({ where: { role: { in: [Role.ADMIN, Role.DOCTOR] } }, select: { id: true, name: true }, orderBy: { name: "asc" } }), db.exercise.findMany({ select: { id: true, name: true, category: true }, orderBy: [{ category: "asc" }, { name: "asc" }] }), getServerSession(authOptions)]);
  if (!session || !authSession) notFound();
  return <><p className="eyebrow">{session.patient.name}</p><h1>Editar sesión</h1><SessionForm action={updateTherapySession.bind(null, id, sessionId)} patientId={id} staff={staff} exercises={exercises} session={session} defaultDoctorId={authSession.user.id} error={error} /></>;
}
