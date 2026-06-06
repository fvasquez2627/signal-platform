"use client";

import { DashboardOverview } from "@/components/dashboard/dashboard-overview";
import { PageContent } from "@/components/layout/page-content";
import { PageHeader } from "@/components/layout/page-header";

export default function DashboardPage() {
  return (
    <>
      <PageHeader
        title="Overview"
        description="Your morning briefing — what to do today, ready to execute"
      />
      <PageContent
        summary={<DashboardOverview variant="summary" />}
        detail={<DashboardOverview variant="detail" />}
      />
    </>
  );
}
