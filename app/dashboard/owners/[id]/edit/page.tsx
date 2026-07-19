import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { updateOwner } from "../../actions";
import { OwnerForm } from "../../owner-form";

export default async function EditOwnerPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ error?: string }> }) {
  const { id } = await params;
  const { error } = await searchParams;
  const owner = await db.owner.findUnique({ where: { id }, select: { name: true, phone: true, email: true } });
  if (!owner) notFound();
  return <><p className="eyebrow">Propietarios</p><h1>Editar propietario</h1><OwnerForm action={updateOwner.bind(null, id)} owner={owner} error={error} /></>;
}
