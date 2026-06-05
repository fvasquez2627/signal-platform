import {
  AI_INTEGRATION_KEYS,
  INTEGRATIONS,
  OAUTH_INTEGRATION_KEYS,
  PAID_INTEGRATION_KEYS,
  type IntegrationKey,
} from "@/lib/integrations/config";

export type ClientIntegrationRow = {
  platform: string;
  encrypted_key: string | null;
  connected: boolean;
};

export type IntegrationState = {
  enabled: boolean;
  apiKey: string | null;
};

function isAlwaysOn(key: IntegrationKey): boolean {
  const config = INTEGRATIONS[key];
  return "alwaysOn" in config && config.alwaysOn === true;
}

export function resolveIntegration(
  key: string,
  rows: ClientIntegrationRow[],
): IntegrationState {
  if (!(key in INTEGRATIONS)) {
    return { enabled: false, apiKey: null };
  }

  const integrationKey = key as IntegrationKey;
  const config = INTEGRATIONS[integrationKey];
  const row = rows.find((r) => r.platform === integrationKey);

  if (isAlwaysOn(integrationKey)) {
    return { enabled: config.enabled, apiKey: null };
  }

  const apiKey = row?.encrypted_key ?? null;

  // No DB row yet — OAuth defaults disconnected; paid/AI use preview or config
  if (!row) {
    if (AI_INTEGRATION_KEYS.includes(integrationKey)) {
      return { enabled: config.enabled, apiKey: null };
    }
    if (OAUTH_INTEGRATION_KEYS.includes(integrationKey)) {
      return { enabled: false, apiKey: null };
    }
    return { enabled: true, apiKey: null };
  }

  if (!row.connected) {
    return { enabled: false, apiKey };
  }

  if (PAID_INTEGRATION_KEYS.includes(integrationKey)) {
    return {
      enabled: Boolean(apiKey),
      apiKey,
    };
  }

  return {
    enabled: true,
    apiKey,
  };
}
