import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { updateProduct } from "../../actions";
import { ProductForm } from "../../product-form";

export default async function EditProductPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ error?: string }> }) {
  const { id } = await params;
  const { error } = await searchParams;
  const product = await db.product.findUnique({ where: { id } });
  if (!product) notFound();
  return <><p className="eyebrow">Catálogo</p><h1>Editar producto</h1><ProductForm action={updateProduct.bind(null, id)} product={product} error={error} /></>;
}
