import { PageHeader } from "@/components/layout/page-header";
import { PageContent } from "@/components/layout/page-content";
import { PlaceholderPanel } from "@/components/pages/placeholder-panel";

export default function CompetitivePage() {
  return (
    <>
      <PageHeader
        title="Competitive Intel"
        description="Track competitor moves, positioning, and messaging shifts"
      />
      <PageContent
        summary={
          <div className="grid gap-4 sm:grid-cols-2">
            <PlaceholderPanel
              title="Competitor Watchlist"
              accent="purple"
              items={["Contently — 2 changes", "Clearscope — 1 change", "MarketMuse — stable"]}
            />
            <PlaceholderPanel
              title="Recent Alerts"
              accent="red"
              items={[
                "Contently published case study in your vertical",
                "Clearscope added AEO reporting module",
              ]}
            />
          </div>
        }
        detail={
          <PlaceholderPanel
            title="Competitive Matrix"
            accent="purple"
            items={[
              "Feature parity: 78% vs top competitor",
              "Pricing position: mid-market",
              "Content velocity: +15% vs avg competitor",
              "Share of voice: 22% in target keywords",
            ]}
          />
        }
      />
    </>
  );
}
