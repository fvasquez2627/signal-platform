"use client";

import { useApp } from "@/context/app-context";
import { ContentStudio } from "@/components/content/content-studio";
import { PageContent } from "@/components/layout/page-content";
import { PageHeader } from "@/components/layout/page-header";

export default function ContentPage() {
  const { selectedProduct } = useApp();
  const productName = selectedProduct?.name ?? "All Products";

  return (
    <>
      <PageHeader
        title="Content Studio"
        description={`Drafts, hooks, and publishing workflow for ${productName}`}
      />
      <PageContent
        summary={<ContentStudio variant="summary" />}
        detail={<ContentStudio variant="detail" />}
      />
    </>
  );
}
