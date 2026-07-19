import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { updatePatient } from "../../actions";
import { PatientForm } from "../../patient-form";

export default async function EditPatientPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ error?: string }> }) {
  const { id } = await params;
  const { error } = await searchParams;
  const [patient, owners] = await Promise.all([
    db.patient.findUnique({ where: { id }, select: { name: true, species: true, breed: true, birthDate: true, weightKg: true, ownerId: true, photoUrl: true } }),
    db.owner.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } }),
  ]);
  if (!patient) notFound();
  return <><p className="eyebrow">Pacientes</p><h1>Editar {patient.name}</h1><PatientForm action={updatePatient.bind(null, id)} owners={owners} patient={patient} error={error} /></>;
}
