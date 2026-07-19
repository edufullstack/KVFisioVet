import type { Metadata } from "next";
import "./styles.css";

export const metadata: Metadata = { title: "KV FisioVet | Rehabilitación veterinaria", description: "Fisioterapia, rehabilitación y seguimiento de movilidad para mascotas." };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="es"><body>{children}</body></html>;
}
