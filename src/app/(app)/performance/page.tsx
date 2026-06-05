"use client";

import { useApp } from "@/context/app-context";
import { PageContent } from "@/components/layout/page-content";
import { PageHeader } from "@/components/layout/page-header";
import { PerformanceDashboard } from "@/components/performance/performance-dashboard";

export default function PerformancePage() {
  const { selectedProduct } = useApp();
  const productName = selectedProduct?.name ?? "All Products";

  return (
    <>
      <PageHeader
        title="Performance"
        description={`Content and campaign outcomes for ${productName} across channels`}
      />
      <PageContent
        summary={<PerformanceDashboard variant="summary" />}
        detail={<PerformanceDashboard variant="detail" />}
      />
    </>
  );
}
