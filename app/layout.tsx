import type { Metadata } from "next";
import "./styles.css";

export const metadata: Metadata = { title: "KV FisioVet", description: "Gestión clínica veterinaria" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="es"><body>{children}</body></html>;
}
