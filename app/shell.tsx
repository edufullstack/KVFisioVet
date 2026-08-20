import Link from "next/link";
import { Role } from "@prisma/client";
import { SignOutButton } from "./dashboard/sign-out-button";

type ShellUser = { name?: string | null; role: Role };

export function Shell({ user, children }: { user: ShellUser; children: React.ReactNode }) {
  return <div className="shell">
    <aside><Link className="brand" href="/dashboard">KV FisioVet</Link><nav>
      <Link href="/dashboard">🏠 Inicio</Link>
      <Link href="/dashboard/patients">Pacientes</Link>
      <Link href="/dashboard/owners">Propietarios</Link>
      <Link href="/dashboard/exercises">Ejercicios</Link>
      {user.role === Role.ADMIN && <><Link href="/admin/products">Productos</Link><Link href="/admin/users">Usuarios</Link></>}
    </nav><div className="account"><span>{user.name}</span><small>{user.role === Role.ADMIN ? "Administrador" : "Doctor/Fisio"}</small><SignOutButton /></div></aside>
    <main className="content">{children}</main>
  </div>;
}
