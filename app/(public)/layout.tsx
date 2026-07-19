import Link from "next/link";
import { contactUrl } from "@/lib/contact";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  const scheduleUrl = contactUrl("Hola, quiero información para agendar una valoración.", "Solicitud de valoración");
  return <div className="public-site"><header className="public-header"><Link className="public-brand" href="/">KV FisioVet</Link><nav><Link href="/#servicios">Servicios</Link><Link href="/articles">Educación</Link><Link href="/products">Productos</Link><a href={scheduleUrl ?? "/#contacto"}>Agendar</a></nav><Link className="secondary-button" href="/login">Acceso clínica</Link></header>{children}<footer className="public-footer"><div><strong>KV FisioVet</strong><p>Rehabilitación y fisioterapia veterinaria centrada en movilidad, confort y seguimiento.</p></div><div><Link href="/articles">Educación</Link><Link href="/products">Productos</Link><Link href="/login">Panel privado</Link></div><small>La información del sitio es educativa y no sustituye una valoración veterinaria.</small></footer></div>;
}
