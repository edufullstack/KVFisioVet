import Link from "next/link";
import { db } from "@/lib/db";
import { deleteOwner } from "./actions";

export default async function OwnersPage({ searchParams }: { searchParams: Promise<{ q?: string; error?: string }> }) {
  const { q = "", error } = await searchParams;
  const owners = await db.owner.findMany({
    where: q ? { OR: [{ name: { contains: q, mode: "insensitive" } }, { email: { contains: q, mode: "insensitive" } }, { phone: { contains: q } }] } : undefined,
    include: { _count: { select: { patients: true } } }, orderBy: { name: "asc" },
  });
  return <><div className="page-header"><div><p className="eyebrow">Directorio</p><h1>Propietarios</h1></div><Link className="primary-button" href="/dashboard/owners/new">Nuevo propietario</Link></div>
    <form className="search"><input name="q" defaultValue={q} placeholder="Buscar por nombre, correo o teléfono" /><button>Buscar</button></form>
    {error && <p className="error card" role="alert">{error}</p>}
    <section className="card"><div className="table">{owners.map((owner) => <div className="row" key={owner.id}>
      <span><strong>{owner.name}</strong><small>{owner.phone} · {owner.email} · {owner._count.patients} paciente(s)</small></span>
      <span className="row-actions"><Link href={`/dashboard/owners/${owner.id}/edit`}>Editar</Link>{owner._count.patients === 0 && <form action={deleteOwner.bind(null, owner.id)}><button className="danger-link">Eliminar</button></form>}</span>
    </div>)}{owners.length === 0 && <p className="muted">No se encontraron propietarios.</p>}</div></section>
  </>;
}
