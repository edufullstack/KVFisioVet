"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export function RegisterForm({ token }: { token: string }) {
  const router = useRouter();
  const [error, setError] = useState("");
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const response = await fetch("/api/register", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...Object.fromEntries(data), token }) });
    const result = await response.json();
    if (!response.ok) return setError(result.error);
    router.push("/login");
  }
  return <form className="form" onSubmit={submit}><label>Nombre<input name="name" required autoComplete="name" /></label><label>Contraseña<input name="password" type="password" minLength={12} required autoComplete="new-password" /></label><small>Mínimo 12 caracteres.</small>{error && <p className="error" role="alert">{error}</p>}<button>Crear cuenta</button></form>;
}
