"use client";

import { DashboardOverview } from "@/components/dashboard/dashboard-overview";
import { PageContent } from "@/components/layout/page-content";
import { PageHeader } from "@/components/layout/page-header";

export default function DashboardPage() {
  return (
    <>
      <PageHeader
        title="Overview"
        description="High-level metrics and priorities for your content program"
      />
      <PageContent
        summary={<DashboardOverview variant="summary" />}
        detail={<DashboardOverview variant="detail" />}
      />
    </>
  );
}
