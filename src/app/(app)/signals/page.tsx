"use client";

import { useApp } from "@/context/app-context";
import { PageContent } from "@/components/layout/page-content";
import { PageHeader } from "@/components/layout/page-header";
import { SignalsFeed } from "@/components/signals/signals-feed";

export default function SignalsPage() {
  const { selectedProduct } = useApp();
  const productName = selectedProduct?.name ?? "All Products";

  return (
    <>
      <PageHeader
        title="Market Feed"
        description={`Incoming intelligence for ${productName} across news, social, and market sources`}
      />
      <PageContent
        summary={<SignalsFeed variant="summary" />}
        detail={<SignalsFeed variant="detail" />}
      />
    </>
  );
}
