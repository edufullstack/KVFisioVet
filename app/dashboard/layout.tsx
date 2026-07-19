import Link from "next/link";
import { Role } from "@prisma/client";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { SignOutButton } from "./sign-out-button";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  return <div className="shell">
    <aside><Link className="brand" href="/dashboard">KV FisioVet</Link><nav>
      <Link href="/dashboard">Inicio</Link>
      <Link href="/dashboard/patients">Pacientes</Link>
      <Link href="/dashboard/owners">Propietarios</Link>
      <Link href="/dashboard/exercises">Ejercicios</Link>
      {session.user.role === Role.ADMIN && <Link href="/admin/users">Usuarios</Link>}
    </nav><div className="account"><span>{session.user.name}</span><small>{session.user.role === Role.ADMIN ? "Administrador" : "Doctor/Fisio"}</small><SignOutButton /></div></aside>
    <main className="content">{children}</main>
  </div>;
}
