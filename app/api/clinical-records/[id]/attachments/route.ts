import { AttachmentKind } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { attachmentPolicy } from "@/lib/attachments";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) return Response.json({ error: "No autorizado" }, { status: 401 });
  const { id: recordId } = await params;
  if (!(await db.clinicalRecord.findUnique({ where: { id: recordId }, select: { id: true } }))) return Response.json({ error: "Expediente inexistente" }, { status: 404 });
  const body = await request.json();
  const kind = body.kind as AttachmentKind;
  const policy = attachmentPolicy(kind);
  const originalName = typeof body.originalName === "string" ? body.originalName.slice(0, 200) : "";
  const url = typeof body.url === "string" ? body.url : "";
  const publicId = typeof body.publicId === "string" ? body.publicId : "";
  const resourceType = typeof body.resourceType === "string" ? body.resourceType : "";
  const bytes = Number(body.bytes);
  let hostname = "";
  try { hostname = new URL(url).hostname; } catch { /* invalid URL */ }
  if (!policy || !originalName || !hostname.endsWith("cloudinary.com") || !publicId.startsWith("kv-fisio-vet/clinical-records/") || !["image", "video", "raw"].includes(resourceType) || !Number.isInteger(bytes) || bytes <= 0 || bytes > policy.maxBytes) return Response.json({ error: "Metadatos de archivo inválidos" }, { status: 400 });
  const attachment = await db.clinicalAttachment.create({ data: { recordId, kind, originalName, url, publicId, resourceType, bytes, uploadedById: session.user.id } });
  return Response.json({ id: attachment.id });
}
