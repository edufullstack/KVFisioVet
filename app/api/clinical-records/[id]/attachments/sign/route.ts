import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { signClinicalUpload } from "@/lib/cloudinary";
import { attachmentPolicy } from "@/lib/attachments";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await getServerSession(authOptions))) return Response.json({ error: "No autorizado" }, { status: 401 });
  const { id } = await params;
  if (!(await db.clinicalRecord.findUnique({ where: { id }, select: { id: true } }))) return Response.json({ error: "Expediente inexistente" }, { status: 404 });
  const body = await request.json();
  const policy = attachmentPolicy(body.kind);
  const size = Number(body.size);
  if (!policy || !Number.isFinite(size)) return Response.json({ error: "Archivo inválido" }, { status: 400 });
  if (size <= 0 || size > policy.maxBytes) return Response.json({ error: `El archivo supera el límite de ${policy.maxBytes / 1024 / 1024} MB` }, { status: 400 });
  try {
    return Response.json({ ...signClinicalUpload(policy.formats), maxBytes: policy.maxBytes });
  } catch {
    return Response.json({ error: "Cloudinary no está configurado" }, { status: 503 });
  }
}
