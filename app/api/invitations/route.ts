import { randomBytes } from "node:crypto";
import { Role } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions, isRole } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (session?.user.role !== Role.ADMIN) return Response.json({ error: "No autorizado" }, { status: 403 });

  const body = await request.json();
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const role = isRole(body.role) ? body.role : Role.DOCTOR;
  if (!email || !email.includes("@")) return Response.json({ error: "Correo inválido" }, { status: 400 });
  if (await db.user.findUnique({ where: { email } })) return Response.json({ error: "El usuario ya existe" }, { status: 409 });

  const invitation = await db.invitation.upsert({
    where: { email },
    update: { token: randomBytes(24).toString("hex"), role, usedAt: null, expiresAt: new Date(Date.now() + 7 * 86400000), createdById: session.user.id },
    create: { email, role, token: randomBytes(24).toString("hex"), expiresAt: new Date(Date.now() + 7 * 86400000), createdById: session.user.id },
  });
  return Response.json({ url: `${new URL(request.url).origin}/invite/${invitation.token}` });
}
