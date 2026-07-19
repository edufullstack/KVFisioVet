import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { LineChart } from "@/components/line-chart";

const dateLabel = (date: Date) => date.toLocaleDateString("es-MX", { day: "2-digit", month: "short", timeZone: "UTC" });

export default async function SessionsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const patient = await db.patient.findUnique({ where: { id }, select: { name: true, therapySessions: { orderBy: { occurredAt: "asc" }, include: { doctor: { select: { name: true } }, exercises: true, romMeasurements: true } } } });
  if (!patient) notFound();
  const sessions = patient.therapySessions;
  const romSeries = new Map<string, { label: string; value: number }[]>();
  for (const session of sessions) for (const rom of session.romMeasurements) {
    const key = `${rom.joint} · ${rom.side} · ${rom.movement}`;
    romSeries.set(key, [...(romSeries.get(key) ?? []), { label: dateLabel(session.occurredAt), value: rom.degrees }]);
  }
  return <><div className="page-header"><div><p className="eyebrow">Evolución</p><h1>Sesiones de {patient.name}</h1></div><div className="actions"><Link className="secondary-button" href={`/dashboard/patients/${id}`}>Paciente</Link><Link className="primary-button" href={`/dashboard/patients/${id}/sessions/new`}>Nueva sesión</Link></div></div>
    <section className="stats"><div className="card"><strong>{sessions.length}</strong><span>Sesiones registradas</span></div></section>
    {sessions.length > 0 && <section className="charts"><LineChart title="Dolor (0–10)" fixedRange={[0, 10]} values={sessions.map((session) => ({ label: dateLabel(session.occurredAt), value: session.painScore }))} />{[...romSeries].map(([title, values]) => <LineChart key={title} title={`${title} (grados)`} values={values} />)}</section>}
    <section className="card section-stack"><h2>Historial</h2><div className="table">{sessions.toReversed().map((session, index) => <Link className="row session-row" href={`/dashboard/patients/${id}/sessions/${session.id}`} key={session.id}><span><strong>Sesión {sessions.length - index} · {session.occurredAt.toLocaleDateString("es-MX", { timeZone: "UTC" })}</strong><small>{session.doctor.name} · Dolor {session.painScore}/10 · {session.exercises.length} ejercicio(s)</small></span><span>Ver →</span></Link>)}{!sessions.length && <p className="muted">Todavía no hay sesiones registradas.</p>}</div></section>
  </>;
}
