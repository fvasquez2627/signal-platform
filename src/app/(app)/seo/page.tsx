"use client";

import { useApp } from "@/context/app-context";
import { PageContent } from "@/components/layout/page-content";
import { PageHeader } from "@/components/layout/page-header";
import { SeoIntel } from "@/components/seo/seo-intel";

export default function SeoPage() {
  const { selectedProduct } = useApp();
  const productName = selectedProduct?.name ?? "All Products";

  return (
    <>
      <PageHeader
        title="SEO + AEO"
        description={`Search visibility and answer-engine optimization for ${productName}`}
      />
      <PageContent
        summary={<SeoIntel variant="summary" />}
        detail={<SeoIntel variant="detail" />}
      />
    </>
  );
}
