"use client";

import type { ConfigDiff, DiffItem } from "@/lib/config/config-diff";

type ConfigDiffPanelProps = {
  diff: ConfigDiff;
  onUpdateItem: (id: string, accepted: boolean) => void;
  onApply: () => void;
  applying?: boolean;
};

function DiffRow({
  item,
  onAccept,
  onSkip,
}: {
  item: DiffItem;
  onAccept: () => void;
  onSkip: () => void;
}) {
  const prefix = item.action === "add" ? "+" : "−";
  const color = item.action === "add" ? "text-[var(--green)]" : "text-[var(--red)]";

  return (
    <li className="flex flex-col gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2.5 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <p className="font-mono-label text-[10px] uppercase text-white/40">{item.field}</p>
        <p className={`mt-0.5 text-sm ${color}`}>
          {prefix} &ldquo;{item.value}&rdquo;
          {item.action === "remove" && (
            <span className="text-white/40"> (not relevant)</span>
          )}
        </p>
      </div>
      {item.accepted === null ? (
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={onAccept}
            className="rounded-md bg-[var(--green)]/20 px-2.5 py-1 text-xs font-medium text-[var(--green)] hover:bg-[var(--green)]/30"
          >
            {item.action === "add" ? "Add" : "Remove"}
          </button>
          <button
            type="button"
            onClick={onSkip}
            className="rounded-md border border-white/15 px-2.5 py-1 text-xs text-white/60 hover:bg-white/5"
          >
            {item.action === "add" ? "Skip" : "Keep"}
          </button>
        </div>
      ) : (
        <span className="font-mono-label text-[10px] uppercase text-white/40">
          {item.accepted ? "Accepted" : "Skipped"}
        </span>
      )}
    </li>
  );
}

export function ConfigDiffPanel({
  diff,
  onUpdateItem,
  onApply,
  applying,
}: ConfigDiffPanelProps) {
  const pending = diff.items.filter((i) => i.accepted === null);
  const grouped = diff.items.reduce<Record<string, DiffItem[]>>((acc, item) => {
    acc[item.field] = acc[item.field] ?? [];
    acc[item.field].push(item);
    return acc;
  }, {});

  if (diff.items.length === 0 && diff.unchanged.length > 0) {
    return (
      <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4 text-sm text-white/60">
        No changes detected — config is up to date.
      </div>
    );
  }

  return (
    <div className="space-y-4 rounded-xl border border-[var(--cyan)]/25 bg-[var(--cyan)]/5 p-4">
      <p className="font-heading text-sm font-semibold text-white">Claude found updates</p>

      {Object.entries(grouped).map(([field, items]) => (
        <div key={field}>
          <p className="mb-2 font-mono-label text-[10px] uppercase tracking-widest text-white/45">
            {field}
          </p>
          <ul className="space-y-2">
            {items.map((item) => (
              <DiffRow
                key={item.id}
                item={item}
                onAccept={() => onUpdateItem(item.id, true)}
                onSkip={() => onUpdateItem(item.id, false)}
              />
            ))}
          </ul>
        </div>
      ))}

      {diff.unchanged.map((label) => (
        <p key={label} className="text-xs text-white/45">
          ✓ No changes to {label.toLowerCase()}
        </p>
      ))}

      <button
        type="button"
        onClick={onApply}
        disabled={pending.length > 0 || applying}
        className="rounded-lg bg-[var(--cyan)] px-4 py-2 text-sm font-semibold text-[var(--bg)] hover:opacity-90 disabled:opacity-40"
      >
        {applying ? "Applying…" : "Apply Selected Changes"}
      </button>
      {pending.length > 0 && (
        <p className="text-xs text-white/40">
          Review all changes above before applying ({pending.length} pending)
        </p>
      )}
    </div>
  );
}
