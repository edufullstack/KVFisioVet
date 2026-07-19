import Link from "next/link";

type Staff = { id: string; name: string };
type Exercise = { id: string; name: string; category: string };
type SessionData = { doctorId: string; occurredAt: Date; painScore: number; notes: string; nextPlan: string; exercises: { exerciseId: string; dosage: string }[] };

export function SessionForm({ action, patientId, staff, exercises, session, defaultDoctorId, error }: { action: (formData: FormData) => Promise<void>; patientId: string; staff: Staff[]; exercises: Exercise[]; session?: SessionData; defaultDoctorId: string; error?: string }) {
  const selected = new Map(session?.exercises.map((exercise) => [exercise.exerciseId, exercise.dosage]));
  return <form className="card entity-form" action={action}>{error && <p className="error">{error}</p>}<div className="form-grid">
    <label>Fecha<input name="occurredAt" type="date" required defaultValue={(session?.occurredAt ?? new Date()).toISOString().slice(0, 10)} /></label>
    <label>Doctor tratante<select name="doctorId" required defaultValue={session?.doctorId ?? defaultDoctorId}>{staff.map((user) => <option key={user.id} value={user.id}>{user.name}</option>)}</select></label>
    <label>Dolor del día (0–10)<input name="painScore" type="number" min="0" max="10" step="1" required defaultValue={session?.painScore ?? 0} /></label>
  </div><label>Notas de la sesión<textarea name="notes" required rows={5} maxLength={6000} defaultValue={session?.notes} /></label>
    <fieldset className="exercise-picker"><legend>Ejercicios y modalidades</legend>{exercises.map((exercise) => <label key={exercise.id}><span><input type="checkbox" name="exerciseIds" value={exercise.id} defaultChecked={selected.has(exercise.id)} /><span><strong>{exercise.name}</strong><small>{exercise.category}</small></span></span><input name={`dosage-${exercise.id}`} defaultValue={selected.get(exercise.id) ?? ""} placeholder="Dosificación, ej. 10 × 5" maxLength={200} /></label>)}{!exercises.length && <p className="muted">El catálogo está vacío. Puedes guardar la sesión y agregar ejercicios después.</p>}</fieldset>
    <label>Plan para la siguiente sesión<textarea name="nextPlan" required rows={4} maxLength={4000} defaultValue={session?.nextPlan} /></label><div className="actions"><button>Guardar sesión</button><Link className="secondary-button" href={`/dashboard/patients/${patientId}/sessions`}>Cancelar</Link></div>
  </form>;
}
