"use client";

import { useIntegrations } from "@/lib/integrations/context";

export function useIntegration(key: string) {
  const { getIntegration, loading } = useIntegrations();
  const state = getIntegration(key);

  return {
    enabled: state.enabled,
    apiKey: state.apiKey,
    loading,
  };
}
