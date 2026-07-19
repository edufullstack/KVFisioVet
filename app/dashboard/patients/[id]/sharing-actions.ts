"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/session";

function refresh(patientId: string) {
  revalidatePath(`/dashboard/patients/${patientId}/record`);
  revalidatePath(`/dashboard/patients/${patientId}/sessions`);
  revalidatePath(`/portal/patients/${patientId}`);
}

export async function setRecordVisibility(patientId: string, recordId: string, visibleToOwner: boolean) {
  await requireUser();
  await db.clinicalRecord.updateMany({ where: { id: recordId, patientId }, data: { visibleToOwner } });
  refresh(patientId);
}

export async function setAttachmentVisibility(patientId: string, attachmentId: string, visibleToOwner: boolean) {
  await requireUser();
  await db.clinicalAttachment.updateMany({ where: { id: attachmentId, record: { patientId } }, data: { visibleToOwner } });
  refresh(patientId);
}

export async function setSessionVisibility(patientId: string, sessionId: string, visibleToOwner: boolean) {
  await requireUser();
  await db.therapySession.updateMany({ where: { id: sessionId, patientId }, data: { visibleToOwner } });
  refresh(patientId);
}
