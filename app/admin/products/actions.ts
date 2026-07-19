"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/session";

function productData(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const price = Number(formData.get("price"));
  const imageUrl = String(formData.get("imageUrl") ?? "").trim() || null;
  const active = formData.get("active") === "on";
  let validImage = true;
  if (imageUrl) try { validImage = new URL(imageUrl).protocol === "https:"; } catch { validImage = false; }
  return name && description && Number.isFinite(price) && price >= 0 && validImage ? { name, description, price, imageUrl, active } : null;
}

export async function createProduct(formData: FormData) {
  await requireAdmin();
  const data = productData(formData);
  if (!data) redirect("/admin/products/new?error=Revisa+los+datos+del+producto");
  try { await db.product.create({ data }); } catch { redirect("/admin/products/new?error=Ya+existe+un+producto+con+ese+nombre"); }
  revalidatePath("/products");
  redirect("/admin/products");
}

export async function updateProduct(id: string, formData: FormData) {
  await requireAdmin();
  const data = productData(formData);
  if (!data) redirect(`/admin/products/${id}/edit?error=Revisa+los+datos+del+producto`);
  try { await db.product.update({ where: { id }, data }); } catch { redirect(`/admin/products/${id}/edit?error=No+se+pudo+guardar`); }
  revalidatePath("/products");
  redirect("/admin/products");
}

export async function deleteProduct(id: string) {
  await requireAdmin();
  await db.product.delete({ where: { id } });
  revalidatePath("/products");
  revalidatePath("/admin/products");
}
