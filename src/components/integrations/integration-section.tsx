"use client";

import type { ReactNode } from "react";
import type { IntegrationKey } from "@/lib/integrations/config";
import { useIntegration } from "@/lib/integrations/hooks";

type IntegrationSectionProps = {
  integration: IntegrationKey;
  children: ReactNode;
};

/**
 * INTEGRATION gate — Toggle: Settings > Integrations
 * When OFF: hides section. When ON: swap mock for live API data.
 */
export function IntegrationSection({
  integration,
  children,
}: IntegrationSectionProps) {
  const { enabled } = useIntegration(integration);
  if (!enabled) return null;
  return <>{children}</>;
}
