type RecordData = { reason: string; assessment: string; painScore: number; diagnosis: string; plannedProtocol: string };

export function ClinicalRecordForm({ action, record, error }: { action: (formData: FormData) => Promise<void>; record?: RecordData; error?: string }) {
  return <form className="card entity-form" action={action}>
    {error && <p className="error" role="alert">{error}</p>}
    <label>Motivo de consulta<textarea name="reason" defaultValue={record?.reason} required maxLength={3000} rows={3} /></label>
    <label>Evaluación y hallazgos<textarea name="assessment" defaultValue={record?.assessment} required maxLength={6000} rows={5} /></label>
    <label>Dolor (0–10)<input name="painScore" type="number" min="0" max="10" step="1" defaultValue={record?.painScore ?? 0} required /></label>
    <label>Diagnóstico<textarea name="diagnosis" defaultValue={record?.diagnosis} required maxLength={4000} rows={4} /></label>
    <label>Protocolo planeado<textarea name="plannedProtocol" defaultValue={record?.plannedProtocol} required maxLength={6000} rows={5} /></label>
    <button>Guardar consulta inicial</button>
  </form>;
}
