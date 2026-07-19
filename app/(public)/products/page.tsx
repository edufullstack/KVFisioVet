import { db } from "@/lib/db";
import { productQuoteUrl } from "@/lib/contact";

export const metadata = { title: "Productos | KV FisioVet", description: "Catálogo de apoyo para movilidad y rehabilitación veterinaria." };
export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  const products = await db.product.findMany({ where: { active: true }, orderBy: { name: "asc" } });
  return <main className="public-page"><p className="eyebrow">Catálogo</p><h1>Productos para apoyar su recuperación</h1><p className="page-intro">Solicita una cotización; confirmaremos disponibilidad y compatibilidad con las indicaciones de tu mascota.</p><div className="product-grid">{products.map((product) => { const quoteUrl = productQuoteUrl(product.name); return <article className="public-card product-card" key={product.id}>{product.imageUrl ? <img src={product.imageUrl} alt={product.name} /> : <div className="product-placeholder" aria-hidden="true">KV</div>}<h2>{product.name}</h2><p>{product.description}</p><strong>${product.price.toLocaleString("es-MX", { minimumFractionDigits: 2 })} MXN</strong>{quoteUrl ? <a className="primary-button" href={quoteUrl}>Solicitar cotización</a> : <span className="muted">Contacto por configurar</span>}</article>; })}{!products.length && <p className="public-card muted">El catálogo se publicará próximamente.</p>}</div></main>;
}
