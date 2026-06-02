import { PageHeader } from "@/components/layout/page-header";
import { PageContent } from "@/components/layout/page-content";
import { PlaceholderPanel } from "@/components/pages/placeholder-panel";

export default function SignalsPage() {
  return (
    <>
      <PageHeader
        title="Signal Feed"
        description="Incoming intelligence across news, social, and market sources"
      />
      <PageContent
        summary={
          <div className="grid gap-4 lg:grid-cols-2">
            <PlaceholderPanel
              title="Top Signals"
              accent="cyan"
              items={[
                "Competitor launches AI feature — score 91",
                "Trending keyword: answer engine optimization",
                "Industry report mentions your category",
              ]}
            />
            <PlaceholderPanel
              title="By Source"
              accent="green"
              items={["News: 12", "Social: 28", "SEO: 7", "Competitor: 5"]}
            />
          </div>
        }
        detail={
          <PlaceholderPanel
            title="All Signals"
            accent="cyan"
            items={[
              "[news] TechCrunch — Category shift in content tools",
              "[social] LinkedIn — 340 mentions of target keyword",
              "[competitor] RivalCo updated pricing page",
              "[seo] New SERP feature for product queries",
              "[trend] AEO queries up 45% QoQ",
            ]}
          />
        }
      />
    </>
  );
}
