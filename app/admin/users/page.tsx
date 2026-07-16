import { Role } from "@prisma/client";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { InviteForm } from "./invite-form";

export default async function UsersPage() {
  const session = await getServerSession(authOptions);
  if (session?.user.role !== Role.ADMIN) redirect("/dashboard");
  const users = await db.user.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true, email: true, role: true } });

  return <><p className="eyebrow">Administración</p><h1>Usuarios</h1><InviteForm />
    <section className="card"><h2>Equipo</h2><div className="table">{users.map((user) => <div className="row" key={user.id}><span><strong>{user.name}</strong><small>{user.email}</small></span><span className="badge">{user.role === Role.ADMIN ? "Admin" : "Doctor/Fisio"}</span></div>)}</div></section>
  </>;
}
