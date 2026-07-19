import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { addRomMeasurement, deleteAttachment, deleteRomMeasurement, saveClinicalRecord } from "./actions";
import { AttachmentUploader } from "./attachment-uploader";
import { ClinicalRecordForm } from "./record-form";
import { setAttachmentVisibility, setRecordVisibility } from "../sharing-actions";

const kindLabel = { XRAY: "Radiografía", BLOOD_TEST: "Sangre", VIDEO: "Video", OTHER: "Otro" } as const;

export default async function RecordPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ error?: string }> }) {
  const { id } = await params;
  const { error } = await searchParams;
  const patient = await db.patient.findUnique({ where: { id }, select: { name: true, clinicalRecord: { include: { romMeasurements: { orderBy: { createdAt: "asc" } }, attachments: { orderBy: { createdAt: "desc" }, include: { uploadedBy: { select: { name: true } } } } } } } });
  if (!patient) notFound();
  const record = patient.clinicalRecord;

  return <><div className="page-header"><div><p className="eyebrow">Expediente clínico</p><h1>{patient.name}</h1></div><Link className="secondary-button" href={`/dashboard/patients/${id}`}>Volver al paciente</Link></div>
    {!record ? <><p className="muted">Registra la valoración inicial para abrir el expediente.</p><ClinicalRecordForm action={saveClinicalRecord.bind(null, id)} error={error} /></> : <>
      {error && <p className="card error" role="alert">{error}</p>}
      <section className="share-bar"><span className="badge">{record.visibleToOwner ? "Consulta compartida" : "Consulta privada"}</span><form action={setRecordVisibility.bind(null, id, record.id, !record.visibleToOwner)}><button className="secondary-button">{record.visibleToOwner ? "Ocultar al propietario" : "Compartir consulta"}</button></form></section>
      <section className="card record-summary"><div><span>Dolor inicial</span><strong>{record.painScore}/10</strong></div><div><span>Motivo</span><p>{record.reason}</p></div><div><span>Evaluación</span><p>{record.assessment}</p></div><div><span>Diagnóstico</span><p>{record.diagnosis}</p></div><div><span>Protocolo</span><p>{record.plannedProtocol}</p></div></section>
      <details className="card record-edit"><summary>Editar consulta inicial</summary><ClinicalRecordForm action={saveClinicalRecord.bind(null, id)} record={record} /></details>

      <section className="card section-stack"><h2>Rango de movimiento (ROM)</h2><form className="rom-form" action={addRomMeasurement.bind(null, id, record.id)}>
        <input name="joint" placeholder="Articulación" required maxLength={100} /><select name="side" aria-label="Lado"><option>Derecho</option><option>Izquierdo</option><option>Bilateral</option><option>No aplica</option></select><input name="movement" placeholder="Movimiento" required maxLength={100} /><input name="degrees" type="number" step="0.1" min="-360" max="360" placeholder="Grados" required /><button>Agregar</button>
      </form><div className="table">{record.romMeasurements.map((rom) => <div className="row" key={rom.id}><span><strong>{rom.joint} · {rom.side}</strong><small>{rom.movement}: {rom.degrees}°</small></span><form action={deleteRomMeasurement.bind(null, id, rom.id)}><button className="danger-link">Eliminar</button></form></div>)}{!record.romMeasurements.length && <p className="muted">Sin mediciones ROM.</p>}</div></section>

      <section className="card section-stack"><h2>Estudios y archivos</h2><AttachmentUploader recordId={record.id} /><p className="muted"><small>Imágenes/PDF: 10 MB. Videos MP4, MOV o WebM: 50 MB.</small></p><div className="table">{record.attachments.map((attachment) => <div className="row" key={attachment.id}><span><strong>{attachment.originalName}</strong><small>{kindLabel[attachment.kind]} · {(attachment.bytes / 1024 / 1024).toFixed(1)} MB · {attachment.uploadedBy.name}</small><small>{attachment.visibleToOwner ? "Visible en el portal" : "Privado"}</small></span><span className="row-actions"><a href={attachment.url} target="_blank" rel="noreferrer">Abrir</a><form action={setAttachmentVisibility.bind(null, id, attachment.id, !attachment.visibleToOwner)}><button className="secondary-button">{attachment.visibleToOwner ? "Ocultar" : "Compartir"}</button></form><form action={deleteAttachment.bind(null, id, attachment.id)}><button className="danger-link">Eliminar</button></form></span></div>)}{!record.attachments.length && <p className="muted">Sin archivos adjuntos.</p>}</div></section>
    </>}
  </>;
}
