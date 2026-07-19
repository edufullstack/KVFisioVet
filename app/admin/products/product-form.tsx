import Link from "next/link";

type Product = { name: string; description: string; price: number; imageUrl: string | null; active: boolean };

export function ProductForm({ action, product, error }: { action: (formData: FormData) => Promise<void>; product?: Product; error?: string }) {
  return <form className="card entity-form" action={action}>{error && <p className="error">{error}</p>}<label>Nombre<input name="name" defaultValue={product?.name} required maxLength={140} /></label><label>Descripción<textarea name="description" defaultValue={product?.description} required rows={5} maxLength={2000} /></label><div className="form-grid"><label>Precio (MXN)<input name="price" type="number" min="0" step="0.01" defaultValue={product?.price ?? ""} required /></label><label>URL de imagen (HTTPS)<input name="imageUrl" type="url" defaultValue={product?.imageUrl ?? ""} placeholder="https://…" /></label></div><label className="check-label"><input name="active" type="checkbox" defaultChecked={product?.active ?? true} /> Visible en el catálogo</label><div className="actions"><button>Guardar producto</button><Link className="secondary-button" href="/admin/products">Cancelar</Link></div></form>;
}
