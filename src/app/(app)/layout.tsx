import { redirect } from "next/navigation";
import { AppProvider } from "@/context/app-context";
import { AppShell } from "@/components/layout/app-shell";
import { getSessionUser } from "@/lib/auth/session";
import { getWorkspaceData } from "@/lib/data/workspace";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSessionUser();
  if (!session) redirect("/login");

  const { clients, products } = await getWorkspaceData();

  return (
    <AppProvider role={session.role} clients={clients} products={products}>
      <AppShell>{children}</AppShell>
    </AppProvider>
  );
}
