import { Shell } from "@/app/shell";
import { requireUser } from "@/lib/session";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await requireUser();
  return <Shell user={session.user}>{children}</Shell>;
}
