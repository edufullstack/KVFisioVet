import { DiscountStatus } from "@prisma/client";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";
import { LineChart } from "@/components/line-chart";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { ageFromBirthDate } from "@/lib/date";

const dateLabel = (date: Date) => date.toLocaleDateString("es-MX", { day: "2-digit", month: "short", timeZone: "UTC" });

export default async function PortalPatientPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  const patient = await db.patient.findFirst({ where: { id, owner: { userId: session!.user.id } }, include: {
    owner: { select: { name: true } }, discount: true,
    clinicalRecord: { include: { romMeasurements: { orderBy: { createdAt: "asc" } }, attachments: { where: { visibleToOwner: true }, orderBy: { createdAt: "desc" } } } },
    therapySessions: { where: { visibleToOwner: true }, orderBy: { occurredAt: "asc" }, include: { doctor: { select: { name: true } }, exercises: { include: { exercise: true } }, romMeasurements: { orderBy: { createdAt: "asc" } } } },
  } });
  if (!patient) notFound();
  const record = patient.clinicalRecord;
  const sessions = patient.therapySessions;
  const romSeries = new Map<string, { label: string; value: number }[]>();
  for (const therapy of sessions) for (const rom of therapy.romMeasurements) {
    const key = `${rom.joint} · ${rom.side} · ${rom.movement}`;
    romSeries.set(key, [...(romSeries.get(key) ?? []), { label: dateLabel(therapy.occurredAt), value: rom.degrees }]);
  }

  return <><p className="eyebrow">Mi mascota</p><h1>{patient.name}</h1><section className="card patient-detail">{patient.photoUrl ? <img src={patient.photoUrl} alt={`Foto de ${patient.name}`} /> : <div className="photo-placeholder large" aria-hidden="true">{patient.name.slice(0, 1).toUpperCase()}</div>}<dl><div><dt>Especie</dt><dd>{patient.species}</dd></div><div><dt>Raza</dt><dd>{patient.breed}</dd></div><div><dt>Edad</dt><dd>{ageFromBirthDate(patient.birthDate)}</dd></div><div><dt>Nacimiento</dt><dd>{patient.birthDate?.toLocaleDateString("es-MX", { timeZone: "UTC" }) ?? "Sin fecha"}</dd></div><div><dt>Peso</dt><dd>{patient.weightKg ? `${patient.weightKg} kg` : "Sin registro"}</dd></div><div><dt>Propietario</dt><dd>{patient.owner.name}</dd></div></dl></section>
    {patient.discount?.status === DiscountStatus.PENDING && <section className="card discount-banner"><strong>{patient.discount.percentage}% de descuento disponible</strong><span>Beneficio obtenido al completar {patient.discount.triggerSessionCount} sesiones.</span></section>}
    {record?.visibleToOwner && <section className="card section-stack"><h2>Consulta inicial</h2><div className="record-summary portal-record"><div><span>Dolor inicial</span><strong>{record.painScore}/10</strong></div><div><span>Motivo</span><p>{record.reason}</p></div><div><span>Evaluación</span><p>{record.assessment}</p></div><div><span>Diagnóstico</span><p>{record.diagnosis}</p></div><div><span>Protocolo</span><p>{record.plannedProtocol}</p></div></div>{record.romMeasurements.length > 0 && <div><h3>Rango de movimiento inicial</h3><div className="table">{record.romMeasurements.map((rom) => <div className="row" key={rom.id}><strong>{rom.joint} · {rom.side}</strong><span>{rom.movement}: {rom.degrees}°</span></div>)}</div></div>}</section>}
    {record && record.attachments.length > 0 && <section className="card section-stack"><h2>Archivos compartidos</h2><div className="table">{record.attachments.map((attachment) => <a className="row" href={attachment.url} target="_blank" rel="noreferrer" key={attachment.id}><span><strong>{attachment.originalName}</strong><small>Compartido por la clínica</small></span><span>Abrir →</span></a>)}</div></section>}
    {sessions.length > 0 && <><section className="charts"><LineChart title="Dolor (0–10)" fixedRange={[0, 10]} values={sessions.map((therapy) => ({ label: dateLabel(therapy.occurredAt), value: therapy.painScore }))} />{[...romSeries].map(([title, values]) => <LineChart key={title} title={`${title} (grados)`} values={values} />)}</section><section className="card section-stack"><h2>Sesiones compartidas</h2>{sessions.toReversed().map((therapy) => <details className="portal-session" key={therapy.id}><summary><strong>{therapy.occurredAt.toLocaleDateString("es-MX", { timeZone: "UTC" })}</strong><span>Dolor {therapy.painScore}/10 · {therapy.doctor.name}</span></summary><div><p><strong>Trabajo realizado</strong><br />{therapy.notes}</p><p><strong>Plan siguiente</strong><br />{therapy.nextPlan}</p>{therapy.exercises.length > 0 && <ul>{therapy.exercises.map(({ exercise, dosage }) => <li key={exercise.id}>{exercise.name}: {dosage}</li>)}</ul>}</div></details>)}</section></>}
    {!record?.visibleToOwner && !record?.attachments.length && !sessions.length && <section className="card empty"><h2>Aún no hay información clínica compartida</h2><p>Tu equipo médico decide qué elementos estarán disponibles aquí.</p></section>}
  </>;
}
