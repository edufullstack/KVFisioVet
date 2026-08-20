import { Shell } from "@/app/shell";
import { requireAdmin } from "@/lib/session";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await requireAdmin();
  return <Shell user={session.user}>{children}</Shell>;
}
