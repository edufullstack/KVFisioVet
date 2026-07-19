import Link from "next/link";
import { Role } from "@prisma/client";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { SignOutButton } from "@/app/dashboard/sign-out-button";
import { authOptions } from "@/lib/auth";

export default async function PortalLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");
  if (session.user.role !== Role.OWNER) redirect("/dashboard");
  return <div className="shell"><aside><Link className="brand" href="/portal">KV FisioVet</Link><nav><Link href="/portal">Mis mascotas</Link></nav><div className="account"><span>{session.user.name}</span><small>Propietario</small><SignOutButton /></div></aside><main className="content">{children}</main></div>;
}
