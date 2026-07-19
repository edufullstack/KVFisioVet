import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { ageFromBirthDate } from "@/lib/date";
import { deletePatient } from "../actions";
import { DiscountStatus } from "@prisma/client";

export default async function PatientPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const patient = await db.patient.findUnique({ where: { id }, include: { owner: true, clinicalRecord: { select: { id: true } }, discount: true, _count: { select: { therapySessions: true } } } });
  if (!patient) notFound();
  return <><div className="page-header"><div><p className="eyebrow">Paciente</p><h1>{patient.name}</h1></div><div className="actions"><Link className="secondary-button" href={`/dashboard/patients/${id}/edit`}>Editar</Link><form action={deletePatient.bind(null, id)}><button className="danger-button">Eliminar</button></form></div></div>
    <section className="card patient-detail">
      {patient.photoUrl ? <img src={patient.photoUrl} alt={`Foto de ${patient.name}`} /> : <div className="photo-placeholder large" aria-hidden="true">{patient.name.slice(0, 1).toUpperCase()}</div>}
      <dl><div><dt>Especie</dt><dd>{patient.species}</dd></div><div><dt>Raza</dt><dd>{patient.breed}</dd></div><div><dt>Edad</dt><dd>{ageFromBirthDate(patient.birthDate)}</dd></div><div><dt>Nacimiento</dt><dd>{patient.birthDate?.toLocaleDateString("es-MX", { timeZone: "UTC" }) ?? "Sin fecha"}</dd></div><div><dt>Peso</dt><dd>{patient.weightKg ? `${patient.weightKg} kg` : "Sin registro"}</dd></div><div><dt>Propietario</dt><dd>{patient.owner.name}</dd></div><div><dt>Contacto</dt><dd>{patient.owner.phone} · {patient.owner.email}</dd></div></dl>
    </section>
    {patient.discount?.status === DiscountStatus.PENDING && <section className="card discount-banner"><strong>{patient.discount.percentage}% de descuento disponible</strong><span>Beneficio obtenido al completar {patient.discount.triggerSessionCount} sesiones.</span></section>}
    <section className="card record-callout"><div><h2>Expediente clínico</h2><p>{patient.clinicalRecord ? "Consulta inicial, ROM y archivos clínicos." : "Aún no se ha registrado la valoración inicial."}</p></div><Link className="primary-button" href={`/dashboard/patients/${id}/record`}>{patient.clinicalRecord ? "Ver expediente" : "Crear expediente"}</Link></section>
    <section className="card record-callout"><div><h2>Sesiones y evolución</h2><p>{patient._count.therapySessions} sesión(es) registradas.</p></div><Link className="primary-button" href={`/dashboard/patients/${id}/sessions`}>Ver sesiones</Link></section>
  </>;
}
