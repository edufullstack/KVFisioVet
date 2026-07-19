import Link from "next/link";
import { db } from "@/lib/db";
import { createExercise, deleteExercise } from "./actions";

export default async function ExercisesPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;
  const exercises = await db.exercise.findMany({ include: { _count: { select: { sessions: true } } }, orderBy: [{ category: "asc" }, { name: "asc" }] });
  return <><p className="eyebrow">Catálogo clínico</p><h1>Ejercicios y modalidades</h1>
    <section className="card section-stack"><h2>Agregar al catálogo</h2><form className="exercise-form" action={createExercise}><input name="name" placeholder="Ej. Cavalletes" required maxLength={120} /><input name="category" placeholder="Ej. Propiocepción" required maxLength={100} /><input name="description" placeholder="Descripción opcional" maxLength={500} /><button>Agregar</button></form>{error && <p className="error" role="alert">{error}</p>}</section>
    <section className="card section-stack"><h2>Catálogo</h2><div className="table">{exercises.map((exercise) => <div className="row" key={exercise.id}><span><strong>{exercise.name}</strong><small>{exercise.category}{exercise.description ? ` · ${exercise.description}` : ""} · {exercise._count.sessions} sesión(es)</small></span><span className="row-actions"><Link href={`/dashboard/exercises/${exercise.id}/edit`}>Editar</Link>{exercise._count.sessions === 0 && <form action={deleteExercise.bind(null, exercise.id)}><button className="danger-link">Eliminar</button></form>}</span></div>)}{!exercises.length && <p className="muted">El catálogo está vacío.</p>}</div></section>
  </>;
}
