"use client";

import { useApp } from "@/context/app-context";
import type { ReactNode } from "react";

type PageContentProps = {
  summary: ReactNode;
  detail: ReactNode;
};

export function PageContent({ summary, detail }: PageContentProps) {
  const { viewMode } = useApp();
  return <div className="animate-in fade-in duration-200">{viewMode === "summary" ? summary : detail}</div>;
}
