"use client";

import { FormEvent, useState } from "react";

export function InviteForm() {
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError(""); setUrl("");
    const form = event.currentTarget;
    const data = new FormData(form);
    const response = await fetch("/api/invitations", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(Object.fromEntries(data)) });
    const result = await response.json();
    if (!response.ok) return setError(result.error);
    setUrl(result.url); form.reset();
  }

  return <section className="card"><h2>Invitar usuario</h2><form className="inline-form" onSubmit={submit}>
    <input aria-label="Correo" name="email" type="email" placeholder="correo@clinica.com" required />
    <select aria-label="Rol" name="role"><option value="DOCTOR">Doctor/Fisio</option><option value="ADMIN">Administrador</option></select><button>Crear enlace</button>
  </form>{error && <p className="error" role="alert">{error}</p>}{url && <div className="success"><p>Enlace válido durante 7 días:</p><input readOnly value={url} onFocus={(event) => event.currentTarget.select()} /></div>}</section>;
}
