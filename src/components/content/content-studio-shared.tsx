"use client";

import { useState, type ReactNode } from "react";

export function Panel({
  title,
  action,
  children,
  className = "",
}: {
  title: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`rounded-xl border border-white/10 bg-white/[0.02] ${className}`}
    >
      <div className="flex items-center justify-between gap-2 border-b border-white/10 px-4 py-3">
        <h2 className="font-heading text-sm font-semibold tracking-wide text-white">
          {title}
        </h2>
        {action}
      </div>
      <div className="p-4">{children}</div>
    </section>
  );
}

export function CopyButton({ text, label = "Copy" }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable */
    }
  };

  return (
    <div className="relative inline-flex">
      <button
        type="button"
        onClick={() => void handleCopy()}
        className="rounded-md border border-white/15 px-2 py-0.5 font-mono-label text-[10px] uppercase tracking-wide text-white/50 transition-colors hover:bg-white/5 hover:text-white/80"
      >
        {label}
      </button>
      {copied && (
        <span className="absolute -top-7 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded bg-[var(--green)] px-2 py-0.5 font-mono-label text-[10px] text-[var(--bg)]">
          Copied!
        </span>
      )}
    </div>
  );
}

export function CopyBlock({
  label,
  text,
  accent = "text-white/40",
  multiline = false,
}: {
  label: string;
  text: string;
  accent?: string;
  multiline?: boolean;
}) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.02] p-3">
      <div className="flex items-center justify-between gap-2">
        <p className={`font-mono-label text-[10px] uppercase tracking-widest ${accent}`}>
          {label}
        </p>
        <CopyButton text={text} />
      </div>
      {multiline ? (
        <pre className="mt-2 whitespace-pre-wrap font-sans text-sm leading-relaxed text-white/75">
          {text}
        </pre>
      ) : (
        <p className="mt-2 text-sm leading-relaxed text-white/75">{text}</p>
      )}
    </div>
  );
}

export function CharCountBadge({
  count,
  max,
}: {
  count: number;
  max: number;
}) {
  const ok = count <= max;
  return (
    <span
      className={`shrink-0 rounded px-1.5 py-0.5 font-mono-label text-[10px] ${
        ok ? "bg-[var(--green)]/15 text-[var(--green)]" : "bg-[var(--red)]/15 text-[var(--red)]"
      }`}
    >
      ({count}) {ok ? "✓" : "✗"}
    </span>
  );
}

export function SignalBadges({
  signalSource,
  bucket,
}: {
  signalSource: string;
  bucket: string;
}) {
  return (
    <div className="mb-4 flex flex-wrap gap-2">
      <span className="rounded-md bg-white/5 px-2 py-0.5 font-mono-label text-[10px] uppercase tracking-wide text-white/55">
        {signalSource}
      </span>
      <span className="rounded-md bg-[var(--purple)]/15 px-2 py-0.5 font-mono-label text-[10px] uppercase tracking-wide text-[var(--purple)]">
        {bucket}
      </span>
    </div>
  );
}

export function DraftActions({
  approveLabel = "Approve",
  onApprove,
  approved = false,
  extraActions,
}: {
  approveLabel?: string;
  onApprove?: () => void;
  approved?: boolean;
  extraActions?: ReactNode;
}) {
  const [regenerating, setRegenerating] = useState(false);

  const regenerate = () => {
    setRegenerating(true);
    setTimeout(() => setRegenerating(false), 1500);
  };

  return (
    <div className="flex flex-wrap items-center gap-2 border-t border-white/10 pt-4">
      {extraActions}
      <button
        type="button"
        onClick={onApprove}
        disabled={approved}
        className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-opacity hover:opacity-90 disabled:opacity-100 ${
          approved
            ? "bg-[var(--green)] text-[var(--bg)]"
            : "bg-[var(--green)]/90 text-[var(--bg)]"
        }`}
      >
        {approved ? "Approved ✓" : approveLabel}
      </button>
      <button
        type="button"
        onClick={regenerate}
        disabled={regenerating}
        className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 px-3 py-1.5 text-xs text-white/70 hover:bg-white/5 disabled:opacity-50"
      >
        {regenerating && (
          <span className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-white/30 border-t-[var(--cyan)]" />
        )}
        {regenerating ? "Regenerating…" : "Regenerate"}
      </button>
      <button
        type="button"
        className="rounded-lg border border-white/15 px-3 py-1.5 text-xs text-white/70 hover:bg-white/5"
      >
        Edit
      </button>
    </div>
  );
}

export function VariantSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
      <h3 className="font-heading text-sm font-semibold text-white">{title}</h3>
      <div className="mt-4 space-y-4">{children}</div>
    </div>
  );
}
