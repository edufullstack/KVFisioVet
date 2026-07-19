import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { createTherapySession } from "../actions";
import { SessionForm } from "../session-form";
import { Role } from "@prisma/client";

export default async function NewSessionPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ error?: string }> }) {
  const { id } = await params;
  const { error } = await searchParams;
  const [patient, staff, exercises, authSession] = await Promise.all([db.patient.findUnique({ where: { id }, select: { name: true } }), db.user.findMany({ where: { role: { in: [Role.ADMIN, Role.DOCTOR] } }, select: { id: true, name: true }, orderBy: { name: "asc" } }), db.exercise.findMany({ select: { id: true, name: true, category: true }, orderBy: [{ category: "asc" }, { name: "asc" }] }), getServerSession(authOptions)]);
  if (!patient || !authSession) notFound();
  return <><p className="eyebrow">{patient.name}</p><h1>Nueva sesión</h1><SessionForm action={createTherapySession.bind(null, id)} patientId={id} staff={staff} exercises={exercises} defaultDoctorId={authSession.user.id} error={error} /></>;
}
