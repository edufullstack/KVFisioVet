import Link from "next/link";
import { DiscountStatus, Role } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { applyDiscount } from "./actions";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  const [patients, owners, sessions, recentPatients, recentSessions, birthdayCandidates, pendingDiscounts] = await Promise.all([
    db.patient.count(), db.owner.count(), db.therapySession.count(),
    db.patient.findMany({ take: 5, orderBy: { createdAt: "desc" }, include: { owner: { select: { name: true } } } }),
    db.therapySession.findMany({ take: 5, orderBy: { occurredAt: "desc" }, include: { patient: { select: { id: true, name: true } }, doctor: { select: { name: true } } } }),
    db.patient.findMany({ where: { birthDate: { not: null } }, select: { id: true, name: true, birthDate: true }, orderBy: { name: "asc" } }),
    db.patientDiscount.findMany({ where: { status: DiscountStatus.PENDING }, orderBy: { createdAt: "asc" }, include: { patient: { include: { owner: { select: { name: true } } } } } }),
  ]);
  const now = new Date();
  const month = Number(new Intl.DateTimeFormat("en", { month: "numeric", timeZone: "America/Mexico_City" }).format(now)) - 1;
  const birthdays = birthdayCandidates.filter(({ birthDate }) => birthDate?.getUTCMonth() === month);
  const monthName = new Intl.DateTimeFormat("es-MX", { month: "long", timeZone: "America/Mexico_City" }).format(now);

  return <><p className="eyebrow">Panel privado</p><h1>Hola, {session?.user.name}</h1>
    <section className="stats dashboard-stats"><div className="card"><strong>{patients}</strong><span>Pacientes</span></div><div className="card"><strong>{owners}</strong><span>Propietarios</span></div><div className="card"><strong>{sessions}</strong><span>Sesiones</span></div><div className="card"><strong>{pendingDiscounts.length}</strong><span>Descuentos pendientes</span></div></section>
    {pendingDiscounts.length > 0 && <section className="card section-stack alert-card"><h2>Descuentos pendientes</h2><div className="table">{pendingDiscounts.map((discount) => <div className="row" key={discount.id}><span><strong>{discount.patient.name}: {discount.percentage}%</strong><small>{discount.triggerSessionCount} sesiones · Propietario: {discount.patient.owner.name}</small></span><span className="row-actions"><Link href={`/dashboard/patients/${discount.patient.id}`}>Paciente</Link>{session?.user.role === Role.ADMIN && <form action={applyDiscount.bind(null, discount.id)}><button>Marcar aplicado</button></form>}</span></div>)}</div></section>}
    <div className="dashboard-grid"><section className="card section-stack"><h2>Sesiones recientes</h2><div className="table">{recentSessions.map((item) => <Link className="row" key={item.id} href={`/dashboard/patients/${item.patient.id}/sessions/${item.id}`}><span><strong>{item.patient.name}</strong><small>{item.occurredAt.toLocaleDateString("es-MX", { timeZone: "UTC" })} · {item.doctor.name} · Dolor {item.painScore}/10</small></span></Link>)}{!recentSessions.length && <p className="muted">Sin sesiones recientes.</p>}</div></section>
      <section className="card section-stack"><h2>Pacientes recientes</h2><div className="table">{recentPatients.map((patient) => <Link className="row" key={patient.id} href={`/dashboard/patients/${patient.id}`}><span><strong>{patient.name}</strong><small>{patient.species} · {patient.owner.name}</small></span></Link>)}{!recentPatients.length && <p className="muted">Sin pacientes registrados.</p>}</div></section>
      <section className="card section-stack"><h2>Cumpleaños de {monthName}</h2><div className="table">{birthdays.map((patient) => <Link className="row" key={patient.id} href={`/dashboard/patients/${patient.id}`}><span><strong>{patient.name}</strong><small>{patient.birthDate?.toLocaleDateString("es-MX", { day: "numeric", month: "long", timeZone: "UTC" })}</small></span></Link>)}{!birthdays.length && <p className="muted">No hay cumpleaños este mes.</p>}</div></section>
    </div>
  </>;
}
