"use client";

import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const result = await signIn("credentials", { email: data.get("email"), password: data.get("password"), redirect: false });
    if (result?.error) return setError("Correo o contraseña incorrectos");
    router.push("/dashboard");
    router.refresh();
  }

  return <main className="center"><form className="card form" onSubmit={submit}>
    <p className="eyebrow">KV FisioVet</p><h1>Iniciar sesión</h1>
    <label>Correo<input name="email" type="email" required autoComplete="email" /></label>
    <label>Contraseña<input name="password" type="password" required autoComplete="current-password" /></label>
    {error && <p className="error" role="alert">{error}</p>}
    <button>Entrar</button>
  </form></main>;
}
