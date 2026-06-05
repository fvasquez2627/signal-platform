import { redirect } from "next/navigation";
import { AppProvider } from "@/context/app-context";
import { AppShell } from "@/components/layout/app-shell";
import { IntegrationsProvider } from "@/lib/integrations/context";
import { getSessionUser } from "@/lib/auth/session";
import { getIntegrationsForClient } from "@/lib/data/integrations";
import { getWorkspaceData } from "@/lib/data/workspace";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSessionUser();
  if (!session) redirect("/login");

  const { clients, products } = await getWorkspaceData();
  const initialIntegrations = clients[0]
    ? await getIntegrationsForClient(clients[0].id)
    : [];

  return (
    <AppProvider role={session.role} clients={clients} products={products}>
      <IntegrationsProvider initialRows={initialIntegrations}>
        <AppShell>{children}</AppShell>
      </IntegrationsProvider>
    </AppProvider>
  );
}
