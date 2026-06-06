"use client";

import Link from "next/link";
import { useMemo, useState, type ReactNode } from "react";
import { useApp } from "@/context/app-context";
import { getProductSignalCount, matchesKeyword } from "@/lib/product-utils";
import {
  countByType,
  DETAIL_FILTERS,
  FEED_SIGNALS,
  getTopSignals,
  hasCreativeIntel,
  LAST_UPDATED,
  matchesFilter,
  QUICK_STATS,
  signalAction,
  SIGNAL_BORDER,
  SOURCE_BADGE,
  topSourcesByCount,
  TRENDING_KEYWORDS,
  TYPE_TAG,
  type CreativeIntelligence,
  type DetailFilter,
  type FeedSignal,
} from "@/components/signals/mock-data";
import { SignalsIntelExtras } from "@/components/signals/signals-intel-extras";

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

function IntelBadge({ children }: { children: ReactNode }) {
  return (
    <span className="rounded bg-white/5 px-2 py-0.5 font-mono-label text-[10px] text-white/60">
      {children}
    </span>
  );
}

function CreativeIntelligenceSection({
  intel,
  contentHref,
}: {
  intel: CreativeIntelligence;
  contentHref: string;
}) {
  const longRunning = intel.daysRunning >= 60;

  return (
    <div className="mt-4 space-y-3 rounded-lg border border-[var(--purple)]/20 bg-[var(--purple)]/5 p-3">
      <p className="font-mono-label text-[10px] uppercase tracking-widest text-[var(--purple)]">
        Creative intelligence
        <span className="ml-2 text-white/30">
          {/* INTEGRATION: meta_ad_library_full + tiktok_commercial_api + ai_analysis */}
        </span>
      </p>

      <div className="flex flex-wrap gap-1.5">
        <IntelBadge>{intel.hookType}</IntelBadge>
        <IntelBadge>{intel.format}</IntelBadge>
        <IntelBadge>{intel.length}</IntelBadge>
        <IntelBadge>{intel.reach} reach</IntelBadge>
      </div>

      <div className="flex flex-wrap gap-2">
        <span className="rounded bg-white/5 px-2 py-0.5 font-mono-label text-[10px] text-white/55">
          Days running: {intel.daysRunning}
        </span>
        {longRunning && (
          <span className="rounded bg-[var(--yellow)]/15 px-2 py-0.5 font-mono-label text-[10px] text-[var(--yellow)]">
            ⚡ Long-running — likely profitable
          </span>
        )}
      </div>

      <p className="text-sm italic text-white/65">
        Opening line: &ldquo;{intel.extractedHook}&rdquo;
      </p>

      {intel.hasCounterDraft && intel.counterDraftHook ? (
        <div className="rounded-lg border border-[var(--cyan)]/25 bg-[var(--cyan)]/5 px-3 py-2.5">
          <p className="font-mono-label text-[10px] uppercase tracking-widest text-[var(--cyan)]">
            Your version is ready
          </p>
          <p className="mt-1 text-sm text-white/75">&ldquo;{intel.counterDraftHook}&rdquo;</p>
          <Link
            href={contentHref}
            className="mt-2 inline-block rounded-lg bg-[var(--cyan)] px-3 py-1.5 text-xs font-semibold text-[var(--bg)] transition-opacity hover:opacity-90"
          >
            Review Draft →
          </Link>
        </div>
      ) : (
        <div className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2.5">
          <p className="font-mono-label text-[10px] uppercase tracking-widest text-white/45">
            Generate your version
          </p>
          <Link
            href={contentHref}
            className="mt-2 inline-block rounded-lg border border-[var(--cyan)]/40 bg-[var(--cyan)]/10 px-3 py-1.5 text-xs font-semibold text-[var(--cyan)] transition-colors hover:bg-[var(--cyan)]/20"
          >
            Create Counter-Draft →
          </Link>
        </div>
      )}
    </div>
  );
}

function creativeContentHref(signal: FeedSignal): string {
  if (signal.id === "sig-01") return "/content?tab=tiktok&bucket=2";
  if (signal.id === "sig-04") return "/content?tab=tiktok&bucket=1";
  return "/content?tab=tiktok";
}

function SignalCard({
  signal,
  compact = false,
}: {
  signal: FeedSignal;
  compact?: boolean;
}) {
  const action = signalAction(signal.type);
  const showCreative = !compact && hasCreativeIntel(signal) && signal.creativeIntel;

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

      {showCreative && (
        <CreativeIntelligenceSection
          intel={signal.creativeIntel!}
          contentHref={creativeContentHref(signal)}
        />
      )}

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
            {!showCreative && (
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
            )}
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

function MonitoringKeywordsBar() {
  const { currentKeywords } = useApp();
  const keywords = currentKeywords.slice(0, 6);

  if (keywords.length === 0) return null;

  return (
    <div className="rounded-xl border border-[#1C2530] bg-[#0A0D12] px-4 py-3">
      <p className="font-mono-label text-[10px] uppercase tracking-widest text-white/40">
        Monitoring keywords
      </p>
      <p className="mt-1.5 text-sm text-white/70">{keywords.join(" · ")}</p>
    </div>
  );
}

function SummaryView() {
  const { currentKeywords, selectedProduct } = useApp();
  const topSignals = useMemo(() => {
    const matched = FEED_SIGNALS.filter((s) =>
      matchesKeyword(`${s.title} ${s.body} ${s.tags.join(" ")}`, currentKeywords),
    );
    const list = matched.length > 0 ? matched : FEED_SIGNALS;
    return getTopSignals(3, list);
  }, [currentKeywords]);

  const sourceCount = getProductSignalCount(selectedProduct?.name ?? "All Products");

  return (
    <div className="space-y-4">
      <MonitoringKeywordsBar />
      <p className="font-mono-label text-[10px] uppercase tracking-widest text-white/40">
        {sourceCount} sources active for this product scope
      </p>
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

function ScoreSummaryRow({ signals }: { signals: FeedSignal[] }) {
  const counts = countByType(signals);

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

function BreakdownDonut({ signals }: { signals: FeedSignal[] }) {
  const counts = countByType(signals);
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

function DetailSidebar({ signals }: { signals: FeedSignal[] }) {
  const { currentKeywords, selectedProduct } = useApp();
  const sources = topSourcesByCount(signals, 5);
  const sourceCount = getProductSignalCount(selectedProduct?.name ?? "All Products");
  const trending = useMemo(() => {
    return currentKeywords.slice(0, 5).map((term, i) => ({
      term,
      change: TRENDING_KEYWORDS[i]?.change ?? "+12%",
    }));
  }, [currentKeywords]);

  return (
    <aside className="flex flex-col gap-4 lg:gap-6">
      <Panel title="Signal Score Breakdown">
        <BreakdownDonut signals={signals} />
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
        <p className="mb-3 font-mono-label text-[10px] text-white/40">
          {sourceCount} sources · product scope
        </p>
        <ul className="space-y-2">
          {trending.map((kw) => (
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
  const { currentKeywords } = useApp();

  const scopedSignals = useMemo(() => {
    const matched = FEED_SIGNALS.filter((s) =>
      matchesKeyword(`${s.title} ${s.body} ${s.tags.join(" ")}`, currentKeywords),
    );
    return matched.length > 0 ? matched : FEED_SIGNALS;
  }, [currentKeywords]);

  const filtered = useMemo(
    () =>
      scopedSignals.filter((s) => matchesFilter(s, filter)).sort(
        (a, b) => b.score - a.score,
      ),
    [filter, scopedSignals],
  );

  return (
    <div className="space-y-6">
      <MonitoringKeywordsBar />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-6">
        <div className="space-y-4 lg:col-span-2 lg:space-y-6">
          <FilterBar active={filter} onChange={setFilter} />
          <ScoreSummaryRow signals={scopedSignals} />
          <div className="space-y-4">
            {filtered.map((signal) => (
              <SignalCard key={signal.id} signal={signal} />
            ))}
          </div>
        </div>
        <DetailSidebar signals={scopedSignals} />
      </div>
      <SignalsIntelExtras />
    </div>
  );
}

export function SignalsFeed({ variant }: SignalsFeedProps) {
  if (variant === "summary") {
    return <SummaryView />;
  }
  return <DetailView />;
}
