import { db } from "@/lib/db";
import { RegisterForm } from "./register-form";

export default async function InvitePage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const invitation = await db.invitation.findUnique({ where: { token }, select: { email: true, expiresAt: true, usedAt: true } });
  const valid = invitation && !invitation.usedAt && invitation.expiresAt > new Date();
  return <main className="center"><section className="card form"><p className="eyebrow">KV FisioVet</p><h1>Crear cuenta</h1>{valid ? <><p>Invitación para <strong>{invitation.email}</strong></p><RegisterForm token={token} /></> : <p className="error">Esta invitación no existe, expiró o ya fue usada.</p>}</section></main>;
}
