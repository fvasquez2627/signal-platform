"use client";

import { useMemo, useState, type ReactNode } from "react";
import { useApp } from "@/context/app-context";
import {
  countByType,
  DETAIL_FILTERS,
  FEED_SIGNALS,
  getTopSignals,
  LAST_UPDATED,
  matchesFilter,
  QUICK_STATS,
  signalAction,
  SIGNAL_BORDER,
  SOURCE_BADGE,
  topSourcesByCount,
  TRENDING_KEYWORDS,
  TYPE_TAG,
  type DetailFilter,
  type FeedSignal,
} from "@/components/signals/mock-data";

type SignalsFeedProps = {
  variant: "summary" | "detail";
};

function Panel({
  title,
  children,
  className = "",
}: {
  title: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`rounded-xl border border-white/10 bg-white/[0.02] ${className}`}
    >
      <h2 className="border-b border-white/10 px-4 py-3 font-heading text-sm font-semibold tracking-wide text-white">
        {title}
      </h2>
      <div className="p-4">{children}</div>
    </section>
  );
}

function TypeTag({ type }: { type: FeedSignal["type"] }) {
  const tag = TYPE_TAG[type];
  return (
    <span
      className={`rounded px-2 py-0.5 font-mono-label text-[10px] uppercase tracking-wide ${tag.className}`}
    >
      {tag.label}
    </span>
  );
}

function SourceBadge({ source }: { source: FeedSignal["source"] }) {
  return (
    <span
      className={`rounded px-2 py-0.5 font-mono-label text-[10px] uppercase tracking-wide ${SOURCE_BADGE[source]}`}
    >
      {source}
    </span>
  );
}

function ScoreBadge({ score }: { score: number }) {
  const color =
    score >= 85
      ? "text-[var(--red)] bg-[var(--red)]/15"
      : score >= 70
        ? "text-[var(--yellow)] bg-[var(--yellow)]/15"
        : "text-white/60 bg-white/10";

  return (
    <span
      className={`rounded px-2 py-0.5 font-mono-label text-xs font-semibold ${color}`}
    >
      {score}
    </span>
  );
}

function SignalCard({
  signal,
  compact = false,
}: {
  signal: FeedSignal;
  compact?: boolean;
}) {
  const action = signalAction(signal.type);

  return (
    <article
      className={`rounded-xl border border-white/10 border-l-4 bg-white/[0.03] p-4 ${SIGNAL_BORDER[signal.type]}`}
    >
      <div className="flex flex-wrap items-center gap-2">
        <SourceBadge source={signal.source} />
        <span className="font-mono-label text-[10px] text-white/40">{signal.timestamp}</span>
        {!compact && <TypeTag type={signal.type} />}
      </div>

      <h3 className="mt-2 font-heading text-base font-semibold text-white">{signal.title}</h3>

      <p className="mt-1.5 text-sm leading-relaxed text-white/60">
        {compact ? signal.summary : signal.body}
      </p>

      {!compact && (
        <>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {signal.tags.map((tag) => (
              <span
                key={tag}
                className="rounded bg-white/5 px-2 py-0.5 font-mono-label text-[10px] text-white/50"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="font-mono-label text-[10px] uppercase tracking-widest text-white/40">
                Score
              </span>
              <ScoreBadge score={signal.score} />
            </div>
            <button
              type="button"
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-opacity hover:opacity-90 ${
                action === "Add to Content Queue"
                  ? "bg-[var(--green)] text-[var(--bg)]"
                  : "border border-[var(--cyan)]/40 bg-[var(--cyan)]/10 text-[var(--cyan)]"
              }`}
            >
              {action}
            </button>
          </div>
        </>
      )}

      {compact && (
        <div className="mt-2">
          <TypeTag type={signal.type} />
        </div>
      )}
    </article>
  );
}

function ViewAllPrompt() {
  const { setViewMode } = useApp();

  return (
    <button
      type="button"
      onClick={() => setViewMode("detail")}
      className="w-full rounded-xl border border-dashed border-[var(--cyan)]/30 bg-[var(--cyan)]/5 px-4 py-3 text-sm font-medium text-[var(--cyan)] transition-colors hover:bg-[var(--cyan)]/10"
    >
      View all signals →
    </button>
  );
}

function SummaryView() {
  const topSignals = getTopSignals(3);

  return (
    <div className="space-y-4">
      {topSignals.map((signal) => (
        <SignalCard key={signal.id} signal={signal} compact />
      ))}
      <ViewAllPrompt />
    </div>
  );
}

function FilterBar({
  active,
  onChange,
}: {
  active: DetailFilter;
  onChange: (f: DetailFilter) => void;
}) {
  return (
    <div className="-mx-1 overflow-x-auto px-1 pb-1">
      <div className="flex min-w-max gap-1.5">
        {DETAIL_FILTERS.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => onChange(f.id)}
            className={`shrink-0 rounded-lg px-3 py-1.5 font-mono-label text-[10px] uppercase tracking-wide transition-colors ${
              active === f.id
                ? "bg-[var(--cyan)]/20 text-[var(--cyan)]"
                : "border border-white/10 bg-white/5 text-white/45 hover:text-white/70"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function ScoreSummaryRow() {
  const counts = countByType();

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
      <div className="flex flex-wrap gap-4">
        <p className="font-mono-label text-sm">
          <span className="text-[var(--green)]">{counts.opportunity}</span>
          <span className="text-white/40"> opportunities</span>
        </p>
        <p className="font-mono-label text-sm">
          <span className="text-[var(--red)]">{counts.threat + counts.competitor}</span>
          <span className="text-white/40"> threats</span>
        </p>
        <p className="font-mono-label text-sm">
          <span className="text-[var(--cyan)]">{counts.awareness}</span>
          <span className="text-white/40"> awareness</span>
        </p>
      </div>
      <p className="font-mono-label text-[10px] uppercase tracking-widest text-white/40">
        Last updated · {LAST_UPDATED}
      </p>
    </div>
  );
}

function BreakdownDonut() {
  const counts = countByType();
  const total =
    counts.opportunity + counts.threat + counts.awareness + counts.competitor;
  const threatTotal = counts.threat + counts.competitor;

  const segments = [
    { label: "Opportunity", value: counts.opportunity, color: "var(--green)" },
    { label: "Threat", value: threatTotal, color: "var(--red)" },
    { label: "Awareness", value: counts.awareness, color: "var(--cyan)" },
  ];

  let offset = 0;
  const gradientParts = segments.map((s) => {
    const pct = total > 0 ? (s.value / total) * 100 : 0;
    const start = offset;
    offset += pct;
    return `${s.color} ${start}% ${offset}%`;
  });

  return (
    <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center">
      <div
        className="relative h-28 w-28 shrink-0 rounded-full"
        style={{
          background: `conic-gradient(${gradientParts.join(", ")})`,
        }}
      >
        <div className="absolute inset-3 flex flex-col items-center justify-center rounded-full bg-[var(--bg)]">
          <span className="font-mono-label text-xl font-semibold text-white">{total}</span>
          <span className="font-mono-label text-[9px] uppercase text-white/40">signals</span>
        </div>
      </div>
      <ul className="w-full space-y-2">
        {segments.map((s) => (
          <li key={s.label} className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2 text-white/70">
              <span
                className="h-2 w-2 rounded-full"
                style={{ background: s.color }}
              />
              {s.label}
            </span>
            <span className="font-mono-label text-white/50">{s.value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function DetailSidebar() {
  const sources = topSourcesByCount(5);

  return (
    <aside className="flex flex-col gap-4 lg:gap-6">
      <Panel title="Signal Score Breakdown">
        <BreakdownDonut />
      </Panel>

      <Panel title="Top Sources">
        <ul className="space-y-2.5">
          {sources.map(({ source, count }) => (
            <li key={source} className="flex items-center justify-between gap-2">
              <span className="truncate text-sm text-white/75">{source}</span>
              <span className="font-mono-label shrink-0 text-xs text-[var(--cyan)]">
                {count}
              </span>
            </li>
          ))}
        </ul>
      </Panel>

      <Panel title="Trending Keywords">
        <ul className="space-y-2">
          {TRENDING_KEYWORDS.map((kw) => (
            <li
              key={kw.term}
              className="flex items-center justify-between gap-2 rounded-lg bg-white/[0.03] px-3 py-2"
            >
              <span className="truncate text-sm text-white/80">{kw.term}</span>
              <span className="shrink-0 font-mono-label text-[10px] text-[var(--green)]">
                {kw.change}
              </span>
            </li>
          ))}
        </ul>
      </Panel>

      <Panel title="Quick Stats">
        <dl className="space-y-3">
          <div className="flex justify-between gap-2">
            <dt className="text-sm text-white/50">Signals today</dt>
            <dd className="font-mono-label text-sm font-semibold text-white">
              {QUICK_STATS.totalToday}
            </dd>
          </div>
          <div className="flex justify-between gap-2">
            <dt className="text-sm text-white/50">High priority</dt>
            <dd className="font-mono-label text-sm font-semibold text-[var(--red)]">
              {QUICK_STATS.highPriority}
            </dd>
          </div>
          <div className="flex justify-between gap-2">
            <dt className="text-sm text-white/50">New since last run</dt>
            <dd className="font-mono-label text-sm font-semibold text-[var(--cyan)]">
              {QUICK_STATS.newSinceLastRun}
            </dd>
          </div>
        </dl>
      </Panel>
    </aside>
  );
}

function DetailView() {
  const [filter, setFilter] = useState<DetailFilter>("all");

  const filtered = useMemo(
    () =>
      FEED_SIGNALS.filter((s) => matchesFilter(s, filter)).sort(
        (a, b) => b.score - a.score,
      ),
    [filter],
  );

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-6">
      <div className="space-y-4 lg:col-span-2 lg:space-y-6">
        <FilterBar active={filter} onChange={setFilter} />
        <ScoreSummaryRow />
        <div className="space-y-4">
          {filtered.length === 0 ? (
            <p className="rounded-xl border border-white/10 bg-white/[0.02] p-6 text-center text-sm text-white/45">
              No signals match this filter.
            </p>
          ) : (
            filtered.map((signal) => (
              <SignalCard key={signal.id} signal={signal} />
            ))
          )}
        </div>
      </div>
      <DetailSidebar />
    </div>
  );
}

export function SignalsFeed({ variant }: SignalsFeedProps) {
  if (variant === "summary") {
    return <SummaryView />;
  }
  return <DetailView />;
}
