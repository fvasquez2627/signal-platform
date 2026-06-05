"use client";

import { useApp } from "@/context/app-context";
import { CompetitiveIntel } from "@/components/competitive/competitive-intel";
import { PageContent } from "@/components/layout/page-content";
import { PageHeader } from "@/components/layout/page-header";

export default function CompetitivePage() {
  const { selectedProduct } = useApp();
  const productName = selectedProduct?.name ?? "All Products";

  return (
    <>
      <PageHeader
        title="Competitive Intel"
        description={`${productName} competitors — track moves, positioning, and messaging shifts`}
      />
      <PageContent
        summary={<CompetitiveIntel variant="summary" />}
        detail={<CompetitiveIntel variant="detail" />}
      />
    </>
  );
}
