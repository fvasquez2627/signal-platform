"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  startTransition,
  type ReactNode,
} from "react";
import { useApp } from "@/context/app-context";
import type { IntegrationKey } from "@/lib/integrations/config";
import {
  resolveIntegration,
  type ClientIntegrationRow,
  type IntegrationState,
} from "@/lib/integrations/resolve";
import { createClient } from "@/lib/supabase/client";

type IntegrationsContextValue = {
  rows: ClientIntegrationRow[];
  loading: boolean;
  getIntegration: (key: string) => IntegrationState;
  saveIntegration: (
    key: IntegrationKey,
    data: { apiKey?: string; connected: boolean },
  ) => Promise<void>;
  refreshIntegrations: () => Promise<void>;
};

const IntegrationsContext = createContext<IntegrationsContextValue | null>(null);

export function IntegrationsProvider({
  children,
  initialRows = [],
}: {
  children: ReactNode;
  initialRows?: ClientIntegrationRow[];
}) {
  const { currentClient } = useApp();
  const [rows, setRows] = useState<ClientIntegrationRow[]>(initialRows);
  const [loading, setLoading] = useState(false);

  const clientId = currentClient?.id;

  const fetchIntegrations = useCallback(async () => {
    if (!clientId) {
      setRows([]);
      return;
    }

    setLoading(true);
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("integrations")
        .select("platform, encrypted_key, connected")
        .eq("client_id", clientId)
        .returns<
          { platform: string; encrypted_key: string | null; connected: boolean }[]
        >();

      if (error) {
        console.warn("integrations fetch:", error.message);
        setRows([]);
        return;
      }

      setRows(
        (data ?? []).map((row) => ({
          platform: String(row.platform),
          encrypted_key: row.encrypted_key,
          connected: row.connected,
        })),
      );
    } finally {
      setLoading(false);
    }
  }, [clientId]);

  useEffect(() => {
    startTransition(() => {
      void fetchIntegrations();
    });
  }, [fetchIntegrations]);

  const getIntegration = useCallback(
    (key: string) => resolveIntegration(key, rows),
    [rows],
  );

  const saveIntegration = useCallback(
    async (key: IntegrationKey, data: { apiKey?: string; connected: boolean }) => {
      if (!clientId) return;

      const supabase = createClient();
      const existing = rows.find((r) => r.platform === key);

      const payload = {
        client_id: clientId,
        platform: key as string,
        encrypted_key: data.apiKey ?? existing?.encrypted_key ?? null,
        connected: data.connected,
      };

      if (existing) {
        const { error } = await supabase
          .from("integrations")
          .update({
            encrypted_key: payload.encrypted_key,
            connected: payload.connected,
          } as never)
          .eq("client_id", clientId)
          .eq("platform", key as string);

        if (error) {
          console.warn("integrations update:", error.message);
        }
      } else {
        const { error } = await supabase
          .from("integrations")
          .insert(payload as never);

        if (error) {
          console.warn("integrations insert:", error.message);
        }
      }

      setRows((prev) => {
        const next = prev.filter((r) => r.platform !== key);
        next.push({
          platform: key,
          encrypted_key: payload.encrypted_key,
          connected: payload.connected,
        });
        return next;
      });
    },
    [clientId, rows],
  );

  const value = useMemo<IntegrationsContextValue>(
    () => ({
      rows,
      loading,
      getIntegration,
      saveIntegration,
      refreshIntegrations: fetchIntegrations,
    }),
    [rows, loading, getIntegration, saveIntegration, fetchIntegrations],
  );

  return (
    <IntegrationsContext.Provider value={value}>{children}</IntegrationsContext.Provider>
  );
}

export function useIntegrations() {
  const ctx = useContext(IntegrationsContext);
  if (!ctx) {
    throw new Error("useIntegrations must be used within IntegrationsProvider");
  }
  return ctx;
}
