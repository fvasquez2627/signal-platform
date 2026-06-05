"use client";

import { ViewToggle } from "@/components/ui/view-toggle";
import { useApp } from "@/context/app-context";

type PageHeaderProps = {
  title: string;
  description?: string;
};

export function PageHeader({ title, description }: PageHeaderProps) {
  const { viewMode, setViewMode, selectedClient, selectedProduct } = useApp();

  const contextLine = selectedClient
    ? `${selectedClient.name} — ${selectedProduct?.name ?? "All Products"}`
    : undefined;

  return (
    <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <h1 className="font-heading text-2xl font-bold tracking-tight text-white sm:text-3xl">
          {title}
        </h1>
        {contextLine && (
          <p className="mt-1 text-sm font-medium text-[var(--cyan)]/80">
            {contextLine}
          </p>
        )}
        {description && (
          <p className="mt-1 text-sm text-white/50">{description}</p>
        )}
      </div>
      <ViewToggle mode={viewMode} onChange={setViewMode} />
    </header>
  );
}
