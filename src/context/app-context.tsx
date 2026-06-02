"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Client, Product, UserRole } from "@/types/database";
import type { ViewMode } from "@/components/ui/view-toggle";

type AppContextValue = {
  role: UserRole;
  clients: Client[];
  products: Product[];
  currentClient: Client | null;
  currentProduct: Product | null;
  setCurrentClientId: (id: string) => void;
  setCurrentProductId: (id: string) => void;
  lastRefreshed: Date;
  refresh: () => void;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  agentsRunning: boolean;
  runAgents: () => void;
};

const AppContext = createContext<AppContextValue | null>(null);

type AppProviderProps = {
  children: ReactNode;
  role: UserRole;
  clients: Client[];
  products: Product[];
};

export function AppProvider({
  children,
  role,
  clients,
  products,
}: AppProviderProps) {
  const [clientId, setClientId] = useState(clients[0]?.id ?? "");
  const [productId, setProductId] = useState(() => {
    const firstClient = clients[0]?.id;
    return products.find((p) => p.client_id === firstClient)?.id ?? products[0]?.id ?? "";
  });
  const [lastRefreshed, setLastRefreshed] = useState(() => new Date());
  const [viewMode, setViewMode] = useState<ViewMode>("summary");
  const [agentsRunning, setAgentsRunning] = useState(false);

  const clientProducts = useMemo(
    () => products.filter((p) => p.client_id === clientId),
    [products, clientId],
  );

  const currentClient = useMemo(
    () => clients.find((c) => c.id === clientId) ?? null,
    [clients, clientId],
  );

  const currentProduct = useMemo(() => {
    const match = products.find((p) => p.id === productId);
    if (match && match.client_id === clientId) return match;
    return clientProducts[0] ?? null;
  }, [products, productId, clientId, clientProducts]);

  const setCurrentClientId = useCallback(
    (id: string) => {
      setClientId(id);
      const firstProduct = products.find((p) => p.client_id === id);
      if (firstProduct) setProductId(firstProduct.id);
    },
    [products],
  );

  const setCurrentProductId = useCallback((id: string) => {
    setProductId(id);
  }, []);

  const refresh = useCallback(() => {
    setLastRefreshed(new Date());
  }, []);

  const runAgents = useCallback(() => {
    setAgentsRunning(true);
    setTimeout(() => {
      setAgentsRunning(false);
      setLastRefreshed(new Date());
    }, 2000);
  }, []);

  const value = useMemo<AppContextValue>(
    () => ({
      role,
      clients,
      products,
      currentClient,
      currentProduct,
      setCurrentClientId,
      setCurrentProductId,
      lastRefreshed,
      refresh,
      viewMode,
      setViewMode,
      agentsRunning,
      runAgents,
    }),
    [
      role,
      clients,
      products,
      currentClient,
      currentProduct,
      setCurrentClientId,
      setCurrentProductId,
      lastRefreshed,
      refresh,
      viewMode,
      agentsRunning,
      runAgents,
    ],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error("useApp must be used within AppProvider");
  }
  return ctx;
}
