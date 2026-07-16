import { PrismaClient, Role } from "@prisma/client";
import { hashPassword } from "../lib/password";

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) throw new Error("ADMIN_EMAIL y ADMIN_PASSWORD son obligatorios");
  if (password.length < 12) throw new Error("ADMIN_PASSWORD debe tener al menos 12 caracteres");

  await prisma.user.upsert({
    where: { email },
    update: { role: Role.ADMIN },
    create: { name: "Administrador", email, passwordHash: await hashPassword(password), role: Role.ADMIN },
  });
}

main().finally(() => prisma.$disconnect());
