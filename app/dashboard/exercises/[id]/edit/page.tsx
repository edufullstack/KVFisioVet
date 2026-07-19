import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { updateExercise } from "../../actions";

export default async function EditExercisePage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ error?: string }> }) {
  const { id } = await params;
  const { error } = await searchParams;
  const exercise = await db.exercise.findUnique({ where: { id } });
  if (!exercise) notFound();
  return <><p className="eyebrow">Catálogo</p><h1>Editar ejercicio</h1><form className="card entity-form" action={updateExercise.bind(null, id)}>{error && <p className="error">{error}</p>}<label>Nombre<input name="name" defaultValue={exercise.name} required maxLength={120} /></label><label>Categoría<input name="category" defaultValue={exercise.category} required maxLength={100} /></label><label>Descripción<textarea name="description" defaultValue={exercise.description ?? ""} maxLength={500} rows={4} /></label><div className="actions"><button>Guardar</button><Link className="secondary-button" href="/dashboard/exercises">Cancelar</Link></div></form></>;
}
