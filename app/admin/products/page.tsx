import Link from "next/link";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/session";
import { deleteProduct } from "./actions";

export default async function ProductsAdminPage() {
  await requireAdmin();
  const products = await db.product.findMany({ orderBy: { name: "asc" } });
  return <><div className="page-header"><div><p className="eyebrow">Administración</p><h1>Productos</h1></div><Link className="primary-button" href="/admin/products/new">Nuevo producto</Link></div><section className="card"><div className="table">{products.map((product) => <div className="row" key={product.id}><span><strong>{product.name}</strong><small>${product.price.toLocaleString("es-MX", { minimumFractionDigits: 2 })} MXN · {product.active ? "Publicado" : "Oculto"}</small></span><span className="row-actions"><Link href={`/admin/products/${product.id}/edit`}>Editar</Link><form action={deleteProduct.bind(null, product.id)}><button className="danger-link">Eliminar</button></form></span></div>)}{!products.length && <p className="muted">No hay productos registrados.</p>}</div></section></>;
}
