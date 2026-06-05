"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  FALLBACK_CLIENT,
  FALLBACK_PRODUCTS,
} from "@/lib/data/workspace-fallback";
import {
  CLIENT_SELECT,
  normalizeClient,
  normalizeProduct,
  PRODUCT_SELECT,
} from "@/lib/data/workspace-utils";
import { findAllProductsProduct } from "@/lib/product-utils";
import { createClient } from "@/lib/supabase/client";
import type { ViewMode } from "@/components/ui/view-toggle";
import type { Client, Product, UserRole } from "@/types/database";

const STORAGE_CLIENT = "signal_selected_client_id";
const STORAGE_PRODUCT = "signal_selected_product_id";

export type AppContextValue = {
  role: UserRole;
  clients: Client[];
  products: Product[];
  selectedClient: Client | null;
  selectedProduct: Product | null;
  setSelectedClient: (client: Client) => void;
  setSelectedProduct: (product: Product) => void;
  currentKeywords: string[];
  currentCompetitors: string[];
  currentDemographic: string;
  currentBenefit: string;
  currentAngles: string[];
  currentPlatforms: string[];
  currentPeaks: string[];
  isAllProducts: boolean;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  lastRefreshed: Date | null;
  mounted: boolean;
  refresh: () => void;
  agentsRunning: boolean;
  runAgents: () => void;
  refreshWorkspace: () => Promise<void>;
  // Backward-compatible aliases
  currentClient: Client | null;
  currentProduct: Product | null;
  setCurrentClientId: (id: string) => void;
  setCurrentProductId: (id: string) => void;
};

const AppContext = createContext<AppContextValue | null>(null);

type AppProviderProps = {
  children: ReactNode;
  role: UserRole;
  clients: Client[];
  products: Product[];
};

function readStoredId(key: string): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(key);
}

function writeStoredId(key: string, id: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, id);
}

function defaultClientId(clients: Client[]): string {
  return clients[0]?.id ?? "";
}

function defaultProductId(products: Product[], clientId: string): string {
  if (!clientId) return "";
  const clientProducts = products.filter((p) => p.client_id === clientId);
  return (
    findAllProductsProduct(clientProducts, clientId)?.id ??
    clientProducts[0]?.id ??
    ""
  );
}

function resolveStoredSelection(clients: Client[], products: Product[]) {
  const storedClientId = readStoredId(STORAGE_CLIENT);
  const client =
    clients.find((c) => c.id === storedClientId) ?? clients[0] ?? null;
  if (!client) return { clientId: "", productId: "" };

  const clientProducts = products.filter((p) => p.client_id === client.id);
  const storedProductId = readStoredId(STORAGE_PRODUCT);
  const product =
    clientProducts.find((p) => p.id === storedProductId) ??
    findAllProductsProduct(clientProducts, client.id) ??
    clientProducts[0] ??
    null;

  return {
    clientId: client.id,
    productId: product?.id ?? "",
  };
}

export function AppProvider({
  children,
  role,
  clients: initialClients,
  products: initialProducts,
}: AppProviderProps) {
  const [clients, setClients] = useState<Client[]>(
    initialClients.length > 0 ? initialClients : [FALLBACK_CLIENT],
  );
  const [products, setProducts] = useState<Product[]>(
    initialProducts.length > 0 ? initialProducts : FALLBACK_PRODUCTS,
  );
  const initialClientList = useMemo(
    () => (initialClients.length > 0 ? initialClients : [FALLBACK_CLIENT]),
    [initialClients],
  );
  const initialProductList = useMemo(
    () => (initialProducts.length > 0 ? initialProducts : FALLBACK_PRODUCTS),
    [initialProducts],
  );
  const initialClientId = defaultClientId(initialClientList);
  const restoredSelection = useRef(false);

  // SSR-safe defaults only — localStorage is applied in useEffect after mount.
  const [clientId, setClientId] = useState(initialClientId);
  const [productId, setProductId] = useState(() =>
    defaultProductId(initialProductList, initialClientId),
  );

  const [lastRefreshed, setLastRefreshed] = useState<Date | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("summary");
  const [agentsRunning, setAgentsRunning] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- client-only mount flag
    setMounted(true);
  }, []);

  const loadWorkspace = useCallback(async () => {
    const supabase = createClient();

    const { data: clientRows } = await supabase
      .from("clients")
      .select(CLIENT_SELECT)
      .order("name");

    const { data: productRows } = await supabase
      .from("products")
      .select(PRODUCT_SELECT)
      .order("name");

    const nextClients =
      clientRows && clientRows.length > 0
        ? clientRows.map((row) => normalizeClient(row as Record<string, unknown>))
        : [FALLBACK_CLIENT];
    const nextProducts =
      productRows && productRows.length > 0
        ? productRows.map((row) => normalizeProduct(row as Record<string, unknown>))
        : FALLBACK_PRODUCTS;

    setClients(nextClients);
    setProducts(nextProducts);

    setClientId((prev) => {
      if (nextClients.some((c) => c.id === prev)) return prev;
      const stored = readStoredId(STORAGE_CLIENT);
      const match = nextClients.find((c) => c.id === stored);
      return match?.id ?? nextClients[0]?.id ?? "";
    });

    setProductId((prev) => {
      const activeClientId =
        nextClients.find((c) => c.id === readStoredId(STORAGE_CLIENT))?.id ??
        nextClients[0]?.id;
      const clientProducts = nextProducts.filter((p) => p.client_id === activeClientId);
      if (clientProducts.some((p) => p.id === prev)) return prev;
      const stored = readStoredId(STORAGE_PRODUCT);
      const storedProduct = clientProducts.find((p) => p.id === stored);
      return (
        storedProduct?.id ??
        findAllProductsProduct(clientProducts, activeClientId ?? "")?.id ??
        clientProducts[0]?.id ??
        ""
      );
    });

    setLastRefreshed(new Date());
  }, []);

  useEffect(() => {
    if (restoredSelection.current) return;
    restoredSelection.current = true;

    const { clientId: storedClientId, productId: storedProductId } =
      resolveStoredSelection(initialClientList, initialProductList);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- restore persisted selection after mount
    if (storedClientId) setClientId(storedClientId);
    if (storedProductId) setProductId(storedProductId);
    setLastRefreshed(new Date());
  }, [initialClientList, initialProductList]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- hydrate workspace from Supabase on mount
    void loadWorkspace();
  }, [loadWorkspace]);

  const selectedClient = useMemo(
    () => clients.find((c) => c.id === clientId) ?? null,
    [clients, clientId],
  );

  const clientProducts = useMemo(
    () => products.filter((p) => p.client_id === clientId),
    [products, clientId],
  );

  const selectedProduct = useMemo(() => {
    const match = products.find((p) => p.id === productId);
    if (match && match.client_id === clientId) return match;
    return findAllProductsProduct(clientProducts, clientId) ?? clientProducts[0] ?? null;
  }, [products, productId, clientId, clientProducts]);

  const isAllProducts = selectedProduct?.name === "All Products";

  const currentKeywords = useMemo(
    () => selectedProduct?.keywords ?? [],
    [selectedProduct],
  );

  const currentCompetitors = useMemo(
    () => selectedProduct?.competitors ?? [],
    [selectedProduct],
  );

  const currentDemographic = selectedProduct?.target_demographic ?? "—";
  const currentBenefit = selectedProduct?.primary_benefit ?? "—";
  const currentAngles = useMemo(
    () => selectedProduct?.content_angles ?? [],
    [selectedProduct?.content_angles],
  );
  const currentPlatforms = useMemo(
    () => selectedProduct?.primary_platforms ?? [],
    [selectedProduct?.primary_platforms],
  );
  const currentPeaks = useMemo(
    () => selectedProduct?.seasonal_peaks ?? [],
    [selectedProduct?.seasonal_peaks],
  );

  const setSelectedClient = useCallback(
    (client: Client) => {
      setClientId(client.id);
      writeStoredId(STORAGE_CLIENT, client.id);
      const allProducts = findAllProductsProduct(
        products.filter((p) => p.client_id === client.id),
        client.id,
      );
      if (allProducts) {
        setProductId(allProducts.id);
        writeStoredId(STORAGE_PRODUCT, allProducts.id);
      }
    },
    [products],
  );

  const setSelectedProduct = useCallback((product: Product) => {
    setProductId(product.id);
    writeStoredId(STORAGE_PRODUCT, product.id);
  }, []);

  const setCurrentClientId = useCallback(
    (id: string) => {
      const client = clients.find((c) => c.id === id);
      if (client) setSelectedClient(client);
    },
    [clients, setSelectedClient],
  );

  const setCurrentProductId = useCallback(
    (id: string) => {
      const product = products.find((p) => p.id === id);
      if (product) setSelectedProduct(product);
    },
    [products, setSelectedProduct],
  );

  const refresh = useCallback(() => {
    setLastRefreshed(new Date());
  }, []);

  const refreshWorkspace = loadWorkspace;

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
      selectedClient,
      selectedProduct,
      setSelectedClient,
      setSelectedProduct,
      currentKeywords,
      currentCompetitors,
      currentDemographic,
      currentBenefit,
      currentAngles,
      currentPlatforms,
      currentPeaks,
      isAllProducts,
      viewMode,
      setViewMode,
      lastRefreshed,
      mounted,
      refresh,
      agentsRunning,
      runAgents,
      refreshWorkspace,
      currentClient: selectedClient,
      currentProduct: selectedProduct,
      setCurrentClientId,
      setCurrentProductId,
    }),
    [
      role,
      clients,
      products,
      selectedClient,
      selectedProduct,
      setSelectedClient,
      setSelectedProduct,
      currentKeywords,
      currentCompetitors,
      currentDemographic,
      currentBenefit,
      currentAngles,
      currentPlatforms,
      currentPeaks,
      isAllProducts,
      viewMode,
      lastRefreshed,
      mounted,
      refresh,
      agentsRunning,
      runAgents,
      refreshWorkspace,
      setCurrentClientId,
      setCurrentProductId,
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
