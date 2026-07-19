import Link from "next/link";
import { db } from "@/lib/db";
import { createPatient } from "../actions";
import { PatientForm } from "../patient-form";

export default async function NewPatientPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;
  const owners = await db.owner.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } });
  return <><p className="eyebrow">Pacientes</p><h1>Nuevo paciente</h1>{owners.length ? <PatientForm action={createPatient} owners={owners} error={error} /> : <section className="card"><p>Primero necesitas registrar un propietario.</p><Link className="primary-button" href="/dashboard/owners/new">Crear propietario</Link></section>}</>;
}
