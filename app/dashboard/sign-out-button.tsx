"use client";

import { signOut } from "next-auth/react";

export function SignOutButton() {
  return <button className="link-button" onClick={() => signOut({ callbackUrl: "/login" })}>Cerrar sesión</button>;
}
