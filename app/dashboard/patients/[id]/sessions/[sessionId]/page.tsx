import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { addSessionRom, deleteSessionRom, deleteTherapySession } from "../actions";

export default async function SessionPage({ params, searchParams }: { params: Promise<{ id: string; sessionId: string }>; searchParams: Promise<{ error?: string }> }) {
  const { id, sessionId } = await params;
  const { error } = await searchParams;
  const session = await db.therapySession.findFirst({ where: { id: sessionId, patientId: id }, include: { patient: { select: { name: true } }, doctor: { select: { name: true } }, exercises: { include: { exercise: true } }, romMeasurements: { orderBy: { createdAt: "asc" } } } });
  if (!session) notFound();
  return <><div className="page-header"><div><p className="eyebrow">{session.patient.name}</p><h1>Sesión del {session.occurredAt.toLocaleDateString("es-MX", { timeZone: "UTC" })}</h1></div><div className="actions"><Link className="secondary-button" href={`/dashboard/patients/${id}/sessions`}>Historial</Link><Link className="secondary-button" href={`/dashboard/patients/${id}/sessions/${sessionId}/edit`}>Editar</Link><form action={deleteTherapySession.bind(null, id, sessionId)}><button className="danger-button">Eliminar</button></form></div></div>
    {error && <p className="card error">{error}</p>}<section className="card session-summary"><div><span>Doctor tratante</span><strong>{session.doctor.name}</strong></div><div><span>Dolor</span><strong>{session.painScore}/10</strong></div><div><span>Notas</span><p>{session.notes}</p></div><div><span>Siguiente sesión</span><p>{session.nextPlan}</p></div></section>
    <section className="card section-stack"><h2>Ejercicios y modalidades</h2><div className="table">{session.exercises.map(({ exercise, dosage }) => <div className="row" key={exercise.id}><span><strong>{exercise.name}</strong><small>{exercise.category}</small></span><span>{dosage}</span></div>)}{!session.exercises.length && <p className="muted">Sin ejercicios del catálogo.</p>}</div></section>
    <section className="card section-stack"><h2>ROM del día</h2><form className="rom-form" action={addSessionRom.bind(null, id, sessionId)}><input name="joint" placeholder="Articulación" required maxLength={100} /><select name="side"><option>Derecho</option><option>Izquierdo</option><option>Bilateral</option><option>No aplica</option></select><input name="movement" placeholder="Movimiento" required maxLength={100} /><input name="degrees" type="number" step="0.1" min="-360" max="360" placeholder="Grados" required /><button>Agregar</button></form><div className="table">{session.romMeasurements.map((rom) => <div className="row" key={rom.id}><span><strong>{rom.joint} · {rom.side}</strong><small>{rom.movement}: {rom.degrees}°</small></span><form action={deleteSessionRom.bind(null, id, sessionId, rom.id)}><button className="danger-link">Eliminar</button></form></div>)}{!session.romMeasurements.length && <p className="muted">Sin mediciones ROM.</p>}</div></section>
  </>;
}
