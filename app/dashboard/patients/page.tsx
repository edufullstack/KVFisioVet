import Link from "next/link";
import { db } from "@/lib/db";
import { ageFromBirthDate } from "@/lib/date";

export default async function PatientsPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q = "" } = await searchParams;
  const patients = await db.patient.findMany({
    where: q ? { OR: [{ name: { contains: q, mode: "insensitive" } }, { species: { contains: q, mode: "insensitive" } }, { breed: { contains: q, mode: "insensitive" } }, { owner: { is: { name: { contains: q, mode: "insensitive" } } } }] } : undefined,
    include: { owner: { select: { name: true } } }, orderBy: { name: "asc" },
  });
  return <><div className="page-header"><div><p className="eyebrow">Clínica compartida</p><h1>Pacientes</h1></div><Link className="primary-button" href="/dashboard/patients/new">Nuevo paciente</Link></div>
    <form className="search"><input name="q" defaultValue={q} placeholder="Buscar paciente, especie, raza o propietario" /><button>Buscar</button></form>
    <section className="patient-grid">{patients.map((patient) => <Link className="card patient-card" href={`/dashboard/patients/${patient.id}`} key={patient.id}>
      {patient.photoUrl ? <img src={patient.photoUrl} alt={`Foto de ${patient.name}`} /> : <div className="photo-placeholder" aria-hidden="true">{patient.name.slice(0, 1).toUpperCase()}</div>}
      <span><strong>{patient.name}</strong><small>{patient.species} · {patient.breed}</small><small>{ageFromBirthDate(patient.birthDate)} · {patient.owner.name}</small></span>
    </Link>)}{patients.length === 0 && <p className="muted card">No se encontraron pacientes.</p>}</section>
  </>;
}
