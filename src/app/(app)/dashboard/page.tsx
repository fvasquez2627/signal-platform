import { PageHeader } from "@/components/layout/page-header";
import { PageContent } from "@/components/layout/page-content";
import { PlaceholderPanel } from "@/components/pages/placeholder-panel";

export default function DashboardPage() {
  return (
    <>
      <PageHeader
        title="Overview"
        description="High-level metrics and priorities for your content program"
      />
      <PageContent
        summary={
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <PlaceholderPanel
              title="Signal Score"
              accent="cyan"
              items={["Overall health: 82", "3 high-priority signals", "Trending up 12%"]}
            />
            <PlaceholderPanel
              title="Content Pipeline"
              accent="green"
              items={["5 drafts in review", "2 approved this week", "1 published today"]}
            />
            <PlaceholderPanel
              title="Competitive Moves"
              accent="purple"
              items={["2 competitor launches", "1 pricing change detected"]}
            />
          </div>
        }
        detail={
          <div className="space-y-4">
            <PlaceholderPanel
              title="Weekly Breakdown"
              accent="cyan"
              items={[
                "Mon: 4 signals ingested, 1 draft created",
                "Tue: SEO gap analysis completed",
                "Wed: Competitive alert — new landing page",
                "Thu: Content review cycle started",
                "Fri: Performance report generated",
              ]}
            />
            <PlaceholderPanel
              title="Agent Activity Log"
              accent="yellow"
              items={[
                "Signal scraper — last run 2h ago",
                "SEO analyzer — last run 4h ago",
                "Competitive watcher — last run 1h ago",
              ]}
            />
          </div>
        }
      />
    </>
  );
}
