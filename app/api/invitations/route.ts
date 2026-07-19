import { randomBytes } from "node:crypto";
import { Role } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions, isRole } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (session?.user.role !== Role.ADMIN) return Response.json({ error: "No autorizado" }, { status: 403 });

  const body = await request.json();
  const role = isRole(body.role) ? body.role : Role.DOCTOR;
  const ownerId = role === Role.OWNER && typeof body.ownerId === "string" ? body.ownerId : null;
  const owner = ownerId ? await db.owner.findFirst({ where: { id: ownerId, userId: null } }) : null;
  const email = role === Role.OWNER ? owner?.email.trim().toLowerCase() ?? "" : typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  if (role === Role.OWNER && !owner) return Response.json({ error: "Selecciona un propietario sin acceso" }, { status: 400 });
  if (!email || !email.includes("@")) return Response.json({ error: "Correo inválido" }, { status: 400 });
  if (await db.user.findUnique({ where: { email } })) return Response.json({ error: "El usuario ya existe" }, { status: 409 });

  const invitation = await db.invitation.upsert({
    where: { email },
    update: { token: randomBytes(24).toString("hex"), role, ownerId, usedAt: null, expiresAt: new Date(Date.now() + 7 * 86400000), createdById: session.user.id },
    create: { email, role, ownerId, token: randomBytes(24).toString("hex"), expiresAt: new Date(Date.now() + 7 * 86400000), createdById: session.user.id },
  });
  return Response.json({ url: `${new URL(request.url).origin}/invite/${invitation.token}` });
}
