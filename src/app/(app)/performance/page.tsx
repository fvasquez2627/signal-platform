import { PageHeader } from "@/components/layout/page-header";
import { PageContent } from "@/components/layout/page-content";
import { PlaceholderPanel } from "@/components/pages/placeholder-panel";

export default function PerformancePage() {
  return (
    <>
      <PageHeader
        title="Performance"
        description="Content and campaign outcomes across channels"
      />
      <PageContent
        summary={
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <PlaceholderPanel
              title="Traffic"
              accent="green"
              items={["Sessions: 24.3k (+8%)", "Organic: 62%", "Avg duration: 2m 14s"]}
            />
            <PlaceholderPanel
              title="Engagement"
              accent="cyan"
              items={["CTR: 3.2%", "Shares: 142", "Comments: 38"]}
            />
            <PlaceholderPanel
              title="Conversions"
              accent="yellow"
              items={["Leads: 89 (+12%)", "Demo requests: 23", "Trial signups: 41"]}
            />
          </div>
        }
        detail={
          <PlaceholderPanel
            title="Top Performing Content"
            accent="green"
            items={[
              "AEO guide — 4.2k views, 12% CTR",
              "Competitive intel report — 2.8k views, 8% CTR",
              "Product launch post — 1.9k views, 15% CTR",
            ]}
          />
        }
      />
    </>
  );
}
