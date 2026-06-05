import { PageContent } from "@/components/layout/page-content";
import { PageHeader } from "@/components/layout/page-header";
import { SettingsPanel } from "@/components/settings/settings-panel";

export default function SettingsPage() {
  return (
    <>
      <PageHeader
        title="Settings"
        description="Account, integrations, team access, and platform configuration"
      />
      <PageContent
        summary={<SettingsPanel variant="summary" />}
        detail={<SettingsPanel variant="detail" />}
      />
    </>
  );
}
