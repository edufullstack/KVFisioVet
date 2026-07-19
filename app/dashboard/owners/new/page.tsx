import { createOwner } from "../actions";
import { OwnerForm } from "../owner-form";

export default async function NewOwnerPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;
  return <><p className="eyebrow">Propietarios</p><h1>Nuevo propietario</h1><OwnerForm action={createOwner} error={error} /></>;
}
