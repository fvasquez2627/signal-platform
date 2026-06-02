import { PageHeader } from "@/components/layout/page-header";
import { PageContent } from "@/components/layout/page-content";
import { PlaceholderPanel } from "@/components/pages/placeholder-panel";
import { SignOutButton } from "@/components/auth/sign-out-button";

export default function SettingsPage() {
  return (
    <>
      <PageHeader
        title="Settings"
        description="Account, integrations, team access, and platform configuration"
      />
      <PageContent
        summary={
          <div className="grid gap-4 sm:grid-cols-2">
            <PlaceholderPanel
              title="Integrations"
              accent="purple"
              items={["Slack — connected", "HubSpot — not connected", "GA4 — connected"]}
            />
            <PlaceholderPanel
              title="Team"
              accent="cyan"
              items={["3 admins", "5 managers", "12 viewers"]}
            />
          </div>
        }
        detail={
          <div className="space-y-4">
            <PlaceholderPanel
              title="Integration Details"
              accent="purple"
              items={[
                "Slack — webhook active, last sync 10m ago",
                "Google Analytics — property ID configured",
                "Semrush — API key pending",
              ]}
            />
            <PlaceholderPanel
              title="Account"
              accent="yellow"
              items={["Profile settings", "Notification preferences", "API keys"]}
            />
            <div className="pt-2">
              <SignOutButton />
            </div>
          </div>
        }
      />
    </>
  );
}
