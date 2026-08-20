import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/session";
import { InviteForm } from "./invite-form";

export default async function UsersPage() {
  await requireAdmin();
  const [users, owners] = await Promise.all([
    db.user.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true, email: true, role: true } }),
    db.owner.findMany({ where: { userId: null, email: { contains: "@" } }, orderBy: { name: "asc" }, select: { id: true, name: true, email: true } }),
  ]);
  const roleLabel = { ADMIN: "Admin", DOCTOR: "Doctor/Fisio", OWNER: "Propietario" } as const;

  return <><p className="eyebrow">Administración</p><h1>Usuarios</h1><InviteForm owners={owners} />
    <section className="card"><h2>Usuarios con acceso</h2><div className="table">{users.map((user) => <div className="row" key={user.id}><span><strong>{user.name}</strong><small>{user.email}</small></span><span className="badge">{roleLabel[user.role]}</span></div>)}</div></section>
  </>;
}
