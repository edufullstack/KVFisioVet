"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { deleteCloudinaryAsset, uploadImage } from "@/lib/cloudinary";
import { requireAdmin } from "@/lib/session";

function productData(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const price = Number(formData.get("price"));
  const active = formData.get("active") === "on";
  return name && description && Number.isFinite(price) && price >= 0 ? { name, description, price, active } : null;
}

async function uploadedImage(formData: FormData) {
  const image = formData.get("image");
  return image instanceof File && image.size ? await uploadImage(image, "products") : null;
}

export async function createProduct(formData: FormData) {
  await requireAdmin();
  const data = productData(formData);
  if (!data) redirect("/admin/products/new?error=Revisa+los+datos+del+producto");
  const uploaded = await uploadedImage(formData);
  try { await db.product.create({ data: { ...data, imageUrl: uploaded?.url, imagePublicId: uploaded?.publicId } }); } catch { redirect("/admin/products/new?error=Ya+existe+un+producto+con+ese+nombre"); }
  revalidatePath("/products");
  redirect("/admin/products");
}

export async function updateProduct(id: string, formData: FormData) {
  await requireAdmin();
  const data = productData(formData);
  if (!data) redirect(`/admin/products/${id}/edit?error=Revisa+los+datos+del+producto`);
  const current = await db.product.findUniqueOrThrow({ where: { id }, select: { imagePublicId: true } });
  const uploaded = await uploadedImage(formData);
  try { await db.product.update({ where: { id }, data: { ...data, ...(uploaded && { imageUrl: uploaded.url, imagePublicId: uploaded.publicId }) } }); } catch { redirect(`/admin/products/${id}/edit?error=No+se+pudo+guardar`); }
  if (uploaded && current.imagePublicId) await deleteCloudinaryAsset(current.imagePublicId, "image").catch(() => undefined);
  revalidatePath("/products");
  redirect("/admin/products");
}

export async function deleteProduct(id: string) {
  await requireAdmin();
  const product = await db.product.delete({ where: { id }, select: { imagePublicId: true } });
  if (product.imagePublicId) await deleteCloudinaryAsset(product.imagePublicId, "image").catch(() => undefined);
  revalidatePath("/products");
  revalidatePath("/admin/products");
}
