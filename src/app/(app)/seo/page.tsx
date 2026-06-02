import { PageHeader } from "@/components/layout/page-header";
import { PageContent } from "@/components/layout/page-content";
import { PlaceholderPanel } from "@/components/pages/placeholder-panel";

export default function SeoPage() {
  return (
    <>
      <PageHeader
        title="SEO + AEO"
        description="Search visibility and answer-engine optimization insights"
      />
      <PageContent
        summary={
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <PlaceholderPanel
              title="Keyword Rankings"
              accent="green"
              items={["12 keywords in top 10", "3 new opportunities", "2 ranking drops"]}
            />
            <PlaceholderPanel
              title="AEO Coverage"
              accent="cyan"
              items={["8 featured snippets", "4 AI overview citations", "Gap: 6 queries"]}
            />
            <PlaceholderPanel
              title="Technical Health"
              accent="yellow"
              items={["Core Web Vitals: pass", "2 crawl errors", "Schema: 94% coverage"]}
            />
          </div>
        }
        detail={
          <PlaceholderPanel
            title="Keyword & Query Detail"
            accent="green"
            items={[
              "content intelligence — pos 4 (↑2)",
              "answer engine optimization — pos 11 (new)",
              "competitive content analysis — pos 7 (↓1)",
              "AI search visibility — not ranking (opportunity)",
            ]}
          />
        }
      />
    </>
  );
}
