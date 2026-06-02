"use client";

export type ViewMode = "summary" | "detail";

type ViewToggleProps = {
  mode: ViewMode;
  onChange: (mode: ViewMode) => void;
};

export function ViewToggle({ mode, onChange }: ViewToggleProps) {
  return (
    <div
      className="inline-flex rounded-lg border border-white/10 bg-white/5 p-0.5"
      role="tablist"
      aria-label="View mode"
    >
      {(["summary", "detail"] as const).map((option) => (
        <button
          key={option}
          type="button"
          role="tab"
          aria-selected={mode === option}
          onClick={() => onChange(option)}
          className={`rounded-md px-3 py-1.5 text-sm font-medium capitalize transition-colors ${
            mode === option
              ? "bg-[var(--cyan)]/20 text-[var(--cyan)]"
              : "text-white/50 hover:text-white/80"
          }`}
        >
          {option}
        </button>
      ))}
    </div>
  );
}
