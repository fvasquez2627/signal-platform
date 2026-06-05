import { PageContent } from "@/components/layout/page-content";
import { PageHeader } from "@/components/layout/page-header";
import { SignalsFeed } from "@/components/signals/signals-feed";

export default function SignalsPage() {
  return (
    <>
      <PageHeader
        title="Market Feed"
        description="Incoming intelligence across news, social, and market sources"
      />
      <PageContent
        summary={<SignalsFeed variant="summary" />}
        detail={<SignalsFeed variant="detail" />}
      />
    </>
  );
}
