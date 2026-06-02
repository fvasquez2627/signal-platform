"use client";

import { ViewToggle } from "@/components/ui/view-toggle";
import { useApp } from "@/context/app-context";

type PageHeaderProps = {
  title: string;
  description?: string;
};

export function PageHeader({ title, description }: PageHeaderProps) {
  const { viewMode, setViewMode } = useApp();

  return (
    <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <h1 className="font-heading text-2xl font-bold tracking-tight text-white sm:text-3xl">
          {title}
        </h1>
        {description && (
          <p className="mt-1 text-sm text-white/50">{description}</p>
        )}
      </div>
      <ViewToggle mode={viewMode} onChange={setViewMode} />
    </header>
  );
}
