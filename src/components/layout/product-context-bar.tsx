"use client";

import { useApp } from "@/context/app-context";
import { formatPlatformLabel } from "@/lib/product-utils";

export function ProductContextBar() {
  const {
    viewMode,
    currentDemographic,
    currentBenefit,
    currentPlatforms,
  } = useApp();

  if (viewMode !== "detail") return null;

  const platformLine = currentPlatforms
    .map((p) => formatPlatformLabel(p))
    .join(" · ");

  return (
    <div className="sticky top-14 z-30 border-b border-[#1C2530] bg-[#0A0D12]/95 px-3 py-2 backdrop-blur-md sm:px-4">
      <div className="flex flex-wrap items-center gap-2 text-xs text-white/70 sm:gap-3 sm:text-sm">
        <span className="inline-flex items-center gap-1.5 rounded-md border border-[#1C2530] bg-white/[0.03] px-2.5 py-1">
          <span aria-hidden>🎯</span>
          <span>
            Target: <span className="text-white/90">{currentDemographic}</span>
          </span>
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-md border border-[#1C2530] bg-white/[0.03] px-2.5 py-1">
          <span aria-hidden>✦</span>
          <span>
            Benefit: <span className="text-white/90">{currentBenefit}</span>
          </span>
        </span>
        {platformLine && (
          <span className="inline-flex items-center gap-1.5 rounded-md border border-[#1C2530] bg-white/[0.03] px-2.5 py-1">
            <span aria-hidden>📱</span>
            <span className="text-white/90">{platformLine}</span>
          </span>
        )}
      </div>
    </div>
  );
}
