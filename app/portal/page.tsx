import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { ageFromBirthDate } from "@/lib/date";

export default async function PortalPage() {
  const session = await getServerSession(authOptions);
  const owner = await db.owner.findUnique({ where: { userId: session!.user.id }, include: { patients: { orderBy: { name: "asc" }, include: { discount: true, _count: { select: { therapySessions: { where: { visibleToOwner: true } } } } } } } });
  return <><p className="eyebrow">Portal del propietario</p><h1>Mis mascotas</h1>{owner ? <><p className="muted">Hola, {owner.name}. Aquí encontrarás la información que tu equipo médico compartió contigo.</p><section className="patient-grid portal-grid">{owner.patients.map((patient) => <Link className="card patient-card" href={`/portal/patients/${patient.id}`} key={patient.id}>{patient.photoUrl ? <img src={patient.photoUrl} alt={`Foto de ${patient.name}`} /> : <div className="photo-placeholder" aria-hidden="true">{patient.name.slice(0, 1).toUpperCase()}</div>}<span><strong>{patient.name}</strong><small>{patient.species} · {patient.breed}</small><small>{ageFromBirthDate(patient.birthDate)} · {patient._count.therapySessions} sesión(es) compartidas</small>{patient.discount?.status === "PENDING" && <small className="success-text">{patient.discount.percentage}% de descuento disponible</small>}</span></Link>)}</section>{!owner.patients.length && <section className="card empty"><h2>Aún no hay mascotas vinculadas</h2><p>Solicita a la clínica que revise tu ficha de propietario.</p></section>}</> : <section className="card empty"><h2>Tu cuenta no está vinculada</h2><p>Contacta a la clínica para vincular tu acceso con tu ficha de propietario.</p></section>}</>;
}
