import Link from "next/link";
import { ageParts } from "@/lib/date";

type Owner = { id: string; name: string };
type Patient = { name: string; species: string; breed: string; birthDate: Date | null; weightKg: number | null; ownerId: string; photoUrl: string | null };

export function PatientForm({ action, owners, patient, error }: { action: (formData: FormData) => Promise<void>; owners: Owner[]; patient?: Patient; error?: string }) {
  const age = ageParts(patient?.birthDate ?? null);
  return <form className="card entity-form" action={action}>
    {error && <p className="error" role="alert">{error}</p>}
    <div className="form-grid">
      <label>Nombre<input name="name" defaultValue={patient?.name} required maxLength={100} /></label>
      <label>Propietario<select name="ownerId" defaultValue={patient?.ownerId} required><option value="">Selecciona</option>{owners.map((owner) => <option key={owner.id} value={owner.id}>{owner.name}</option>)}</select></label>
      <label>Especie<select name="species" defaultValue={patient?.species ?? "Perro"} required><option>Perro</option><option>Gato</option><option>Caballo</option><option>Otra</option></select></label>
      <label>Raza<input name="breed" defaultValue={patient?.breed} required maxLength={100} /></label>
      <label>Edad aproximada (años)<input name="ageYears" type="number" min="0" max="40" step="1" defaultValue={age?.years ?? ""} /></label>
      <label>Meses adicionales<input name="ageMonths" type="number" min="0" max="11" step="1" defaultValue={age?.months ?? ""} /></label>
      <label>Peso (kg)<input name="weightKg" type="number" min="0.1" max="1000" step="0.1" defaultValue={patient?.weightKg ?? ""} /></label>
    </div>
    <small className="muted">Con la edad se calcula una fecha de nacimiento aproximada; déjala vacía si no se conoce.</small>
    <label>Foto {patient?.photoUrl && <small>Deja vacío para conservar la actual.</small>}<input name="photo" type="file" accept="image/*" /></label>
    <small className="muted">JPG, PNG o WebP, máximo 5 MB. Requiere Cloudinary configurado.</small>
    <div className="actions"><button>Guardar paciente</button><Link className="secondary-button" href="/dashboard/patients">Cancelar</Link></div>
  </form>;
}
