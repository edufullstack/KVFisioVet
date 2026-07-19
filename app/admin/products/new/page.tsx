import { createProduct } from "../actions";
import { ProductForm } from "../product-form";

export default async function NewProductPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;
  return <><p className="eyebrow">Catálogo</p><h1>Nuevo producto</h1><ProductForm action={createProduct} error={error} /></>;
}
