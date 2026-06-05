import { PageContent } from "@/components/layout/page-content";
import { PageHeader } from "@/components/layout/page-header";
import { PerformanceDashboard } from "@/components/performance/performance-dashboard";

export default function PerformancePage() {
  return (
    <>
      <PageHeader
        title="Performance"
        description="Content and campaign outcomes across channels"
      />
      <PageContent
        summary={<PerformanceDashboard variant="summary" />}
        detail={<PerformanceDashboard variant="detail" />}
      />
    </>
  );
}
