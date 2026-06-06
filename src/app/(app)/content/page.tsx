"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";
import { useApp } from "@/context/app-context";
import { ContentStudio } from "@/components/content/content-studio";
import { PageContent } from "@/components/layout/page-content";
import { PageHeader } from "@/components/layout/page-header";

function ContentPageBody() {
  const { selectedProduct, setViewMode } = useApp();
  const searchParams = useSearchParams();
  const productName = selectedProduct?.name ?? "All Products";

  useEffect(() => {
    if (searchParams.has("tab") || searchParams.has("bucket")) {
      setViewMode("detail");
    }
  }, [searchParams, setViewMode]);

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

export default function ContentPage() {
  return (
    <Suspense fallback={<div className="text-sm text-white/45">Loading…</div>}>
      <ContentPageBody />
    </Suspense>
  );
}
