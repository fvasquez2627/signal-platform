import { PageHeader } from "@/components/layout/page-header";
import { PageContent } from "@/components/layout/page-content";
import { PlaceholderPanel } from "@/components/pages/placeholder-panel";

export default function ContentPage() {
  return (
    <>
      <PageHeader
        title="Content Studio"
        description="Drafts, hooks, CTAs, and publishing workflow"
      />
      <PageContent
        summary={
          <div className="grid gap-4 sm:grid-cols-2">
            <PlaceholderPanel
              title="Draft Pipeline"
              accent="cyan"
              items={["3 drafts", "2 in review", "1 approved", "0 published today"]}
            />
            <PlaceholderPanel
              title="By Platform"
              accent="purple"
              items={["Blog: 2", "LinkedIn: 2", "Newsletter: 1", "Landing page: 0"]}
            />
          </div>
        }
        detail={
          <PlaceholderPanel
            title="Active Drafts"
            accent="cyan"
            items={[
              "[blog/draft] How AEO changes content strategy — hook ready",
              "[linkedin/review] Signal score launch announcement",
              "[newsletter/approved] Weekly intel roundup #14",
            ]}
          />
        }
      />
    </>
  );
}
