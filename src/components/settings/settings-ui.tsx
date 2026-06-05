"use client";

import { useState } from "react";
import { MONTH_OPTIONS, PLATFORM_OPTIONS } from "@/lib/config/constants";

export function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="font-mono-label text-[10px] uppercase tracking-widest text-white/40">
      {children}
    </label>
  );
}

export function TextInput({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <FieldLabel>{label}</FieldLabel>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-1 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none placeholder:text-white/25 focus:border-[var(--cyan)]/40"
      />
    </div>
  );
}

export function TextArea({
  label,
  value,
  onChange,
  rows = 3,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
  placeholder?: string;
}) {
  return (
    <div>
      <FieldLabel>{label}</FieldLabel>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        placeholder={placeholder}
        className="mt-1 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none placeholder:text-white/25 focus:border-[var(--cyan)]/40"
      />
    </div>
  );
}

export function TagInput({
  label,
  values,
  onChange,
  placeholder,
  variant = "default",
  hint,
}: {
  label: string;
  values: string[];
  onChange: (v: string[]) => void;
  placeholder?: string;
  variant?: "default" | "green" | "red";
  hint?: string;
}) {
  const [input, setInput] = useState("");

  const pillClass =
    variant === "green"
      ? "bg-[var(--green)]/15 text-[var(--green)]"
      : variant === "red"
        ? "bg-[var(--red)]/15 text-[var(--red)]"
        : "bg-white/10 text-white/70";

  const add = () => {
    const trimmed = input.trim();
    if (trimmed && !values.some((v) => v.toLowerCase() === trimmed.toLowerCase())) {
      onChange([...values, trimmed]);
    }
    setInput("");
  };

  return (
    <div>
      <FieldLabel>{label}</FieldLabel>
      {hint && <p className="mt-1 text-xs text-white/40">{hint}</p>}
      <div className="mt-1.5 flex flex-wrap gap-1.5">
        {values.map((v) => (
          <span
            key={v}
            className={`flex items-center gap-1 rounded px-2 py-0.5 text-xs ${pillClass}`}
          >
            {v}
            <button
              type="button"
              onClick={() => onChange(values.filter((x) => x !== v))}
              className="opacity-60 hover:opacity-100"
              aria-label={`Remove ${v}`}
            >
              ×
            </button>
          </span>
        ))}
      </div>
      <div className="mt-2 flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              add();
            }
          }}
          placeholder={placeholder}
          className="flex-1 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-[var(--cyan)]/40"
        />
        <button
          type="button"
          onClick={add}
          className="shrink-0 rounded-lg border border-white/15 px-3 py-2 text-xs text-white/70 hover:bg-white/5"
        >
          Add
        </button>
      </div>
    </div>
  );
}

export function PlatformCheckboxes({
  label,
  selected,
  onChange,
}: {
  label: string;
  selected: string[];
  onChange: (v: string[]) => void;
}) {
  return (
    <div>
      <FieldLabel>{label}</FieldLabel>
      <div className="mt-2 flex flex-wrap gap-3">
        {PLATFORM_OPTIONS.map((p) => (
          <label key={p} className="flex items-center gap-2 text-sm text-white/70">
            <input
              type="checkbox"
              checked={selected.some((s) => s.toLowerCase() === p.toLowerCase())}
              onChange={(e) => {
                if (e.target.checked) onChange([...selected, p]);
                else
                  onChange(selected.filter((x) => x.toLowerCase() !== p.toLowerCase()));
              }}
              className="rounded border-white/20"
            />
            {p}
          </label>
        ))}
      </div>
    </div>
  );
}

export function MonthCheckboxes({
  label,
  selected,
  onChange,
}: {
  label: string;
  selected: string[];
  onChange: (v: string[]) => void;
}) {
  return (
    <div>
      <FieldLabel>{label}</FieldLabel>
      <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
        {MONTH_OPTIONS.map((month) => (
          <label key={month} className="flex items-center gap-2 text-xs text-white/70">
            <input
              type="checkbox"
              checked={selected.some((s) => s.toLowerCase().startsWith(month.toLowerCase()))}
              onChange={(e) => {
                if (e.target.checked) onChange([...selected, month]);
                else
                  onChange(
                    selected.filter((x) => !x.toLowerCase().startsWith(month.toLowerCase())),
                  );
              }}
              className="rounded border-white/20"
            />
            {month}
          </label>
        ))}
      </div>
    </div>
  );
}

export function SaveRegenerateButton({
  onClick,
  disabled,
  saving,
  label = "Save & Regenerate",
}: {
  onClick: () => void;
  disabled?: boolean;
  saving?: boolean;
  label?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || saving}
      className="rounded-lg bg-gradient-to-r from-[var(--cyan)] to-[var(--green)] px-4 py-2.5 text-sm font-semibold text-[var(--bg)] transition-opacity hover:opacity-90 disabled:opacity-50"
    >
      {saving ? "Saving…" : label}
    </button>
  );
}

export function ProgressOverlay({
  visible,
  message,
  progress,
}: {
  visible: boolean;
  message: string;
  progress: number;
}) {
  if (!visible) return null;

  return (
    <div className="rounded-xl border border-[var(--cyan)]/30 bg-[var(--cyan)]/5 p-4">
      <p className="text-sm text-white/80">{message}</p>
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-gradient-to-r from-[var(--cyan)] to-[var(--green)] transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

export function Toast({
  message,
  variant = "success",
  onDismiss,
}: {
  message: string;
  variant?: "success" | "info" | "error";
  onDismiss?: () => void;
}) {
  return (
    <div
      className={`flex items-start justify-between gap-3 rounded-xl border px-4 py-3 text-sm ${
        variant === "success"
          ? "border-[var(--green)]/40 bg-[var(--green)]/10 text-[var(--green)]"
          : variant === "error"
            ? "border-[var(--red)]/40 bg-[var(--red)]/10 text-[var(--red)]"
            : "border-[var(--cyan)]/40 bg-[var(--cyan)]/10 text-[var(--cyan)]"
      }`}
    >
      <span>{message}</span>
      {onDismiss && (
        <button type="button" onClick={onDismiss} className="opacity-60 hover:opacity-100">
          ×
        </button>
      )}
    </div>
  );
}

export async function simulateRegeneration(
  onProgress: (pct: number) => void,
  ms = 3000,
): Promise<void> {
  const steps = 20;
  const interval = ms / steps;
  for (let i = 1; i <= steps; i++) {
    await new Promise((r) => setTimeout(r, interval));
    onProgress(Math.round((i / steps) * 100));
  }
}
