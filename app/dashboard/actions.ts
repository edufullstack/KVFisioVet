"use server";

import { DiscountStatus, Role } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/session";

export async function applyDiscount(id: string) {
  const session = await requireUser();
  if (session.user.role !== Role.ADMIN) throw new Error("No autorizado");
  await db.patientDiscount.updateMany({ where: { id, status: DiscountStatus.PENDING }, data: { status: DiscountStatus.APPLIED, appliedAt: new Date(), appliedById: session.user.id } });
  revalidatePath("/dashboard");
}
