import { db } from "@/lib/db";
import { hashPassword } from "@/lib/password";

export async function POST(request: Request) {
  const body = await request.json();
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const token = typeof body.token === "string" ? body.token : "";
  const password = typeof body.password === "string" ? body.password : "";
  if (!name || password.length < 12) return Response.json({ error: "Nombre requerido y contraseña mínima de 12 caracteres" }, { status: 400 });

  try {
    await db.$transaction(async (tx) => {
      const invitation = await tx.invitation.findUnique({ where: { token } });
      if (!invitation || invitation.usedAt || invitation.expiresAt <= new Date()) throw new Error("INVALID_INVITATION");
      const claimed = await tx.invitation.updateMany({ where: { id: invitation.id, usedAt: null }, data: { usedAt: new Date() } });
      if (claimed.count !== 1) throw new Error("INVALID_INVITATION");
      const user = await tx.user.create({ data: { name, email: invitation.email, passwordHash: await hashPassword(password), role: invitation.role } });
      if (invitation.ownerId) await tx.owner.update({ where: { id: invitation.ownerId }, data: { userId: user.id } });
    });
    return Response.json({ ok: true });
  } catch {
    return Response.json({ error: "La invitación no es válida, expiró o ya fue usada" }, { status: 400 });
  }
}
