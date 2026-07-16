import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  return <><p className="eyebrow">Panel privado</p><h1>Hola, {session?.user.name}</h1><section className="card empty"><h2>Fundación lista</h2><p>En el Sprint 1 aparecerán aquí pacientes y propietarios.</p></section></>;
}
