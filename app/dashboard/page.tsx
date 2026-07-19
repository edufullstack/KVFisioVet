import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  const [patients, owners] = await Promise.all([db.patient.count(), db.owner.count()]);
  return <><p className="eyebrow">Panel privado</p><h1>Hola, {session?.user.name}</h1><section className="stats"><div className="card"><strong>{patients}</strong><span>Pacientes</span></div><div className="card"><strong>{owners}</strong><span>Propietarios</span></div></section></>;
}
