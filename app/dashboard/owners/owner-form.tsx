import Link from "next/link";

type Owner = { name: string; phone: string; email: string };

export function OwnerForm({ action, owner, error }: { action: (formData: FormData) => Promise<void>; owner?: Owner; error?: string }) {
  return <form className="card entity-form" action={action}>
    {error && <p className="error" role="alert">{error}</p>}
    <label>Nombre completo<input name="name" defaultValue={owner?.name} required maxLength={120} autoComplete="name" /></label>
    <div className="form-grid">
      <label>Teléfono<input name="phone" defaultValue={owner?.phone} required maxLength={30} type="tel" autoComplete="tel" /></label>
      <label>Correo<input name="email" defaultValue={owner?.email} required maxLength={160} type="email" autoComplete="email" /></label>
    </div>
    <div className="actions"><button>Guardar propietario</button><Link className="secondary-button" href="/dashboard/owners">Cancelar</Link></div>
  </form>;
}
