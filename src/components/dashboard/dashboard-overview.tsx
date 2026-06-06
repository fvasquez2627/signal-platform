"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState, type ReactNode } from "react";
import { useApp } from "@/context/app-context";
import { matchesCompetitorName } from "@/lib/product-utils";
import {
  ACTION_ITEMS,
  AGENTS,
  COMPETITORS,
  DRAFT_CREATIVE,
  INTELLIGENCE_SUMMARY,
  PLATFORMS,
  SIGNAL_BORDER,
  SIGNALS,
  STAT_CARDS,
  THREAT_STYLES,
  PLATFORM_ACCENT,
  type ActionItem,
  type ActionUrgency,
  type SignalFilter,
} from "@/components/dashboard/mock-data";
import { IntegrationSection } from "@/components/integrations/integration-section";

type DashboardOverviewProps = {
  variant: "summary" | "detail";
};

function Panel({
  title,
  action,
  children,
  className = "",
}: {
  title: string;
  action?: React.ReactNode;
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

function ScoreRing({
  score,
  size = 56,
  stroke = 4,
}: {
  score: number;
  size?: number;
  stroke?: number;
}) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--cyan)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <span
        className="font-mono-label absolute inset-0 flex items-center justify-center text-xs font-semibold text-[var(--cyan)]"
        style={{ fontSize: size < 48 ? 10 : 12 }}
      >
        {score}
      </span>
    </div>
  );
}

const ACCENT_VAR: Record<string, string> = {
  cyan: "var(--cyan)",
  green: "var(--green)",
  purple: "var(--purple)",
  yellow: "var(--yellow)",
};

const URGENCY_BORDER: Record<ActionUrgency, string> = {
  urgent: "border-l-[var(--red)]",
  opportunity: "border-l-[var(--yellow)]",
  "quick-win": "border-l-[var(--green)]",
};

const URGENCY_BADGE: Record<ActionUrgency, string> = {
  urgent: "bg-[var(--red)]/15 text-[var(--red)]",
  opportunity: "bg-[var(--yellow)]/15 text-[var(--yellow)]",
  "quick-win": "bg-[var(--green)]/15 text-[var(--green)]",
};

const URGENCY_LABEL: Record<ActionUrgency, string> = {
  urgent: "Urgent",
  opportunity: "Opportunity",
  "quick-win": "Quick Win",
};

const SUMMARY_EMOJI: Record<ActionUrgency, string> = {
  urgent: "🔴",
  opportunity: "🟡",
  "quick-win": "🟢",
};

function MiniBarChart({
  values,
  accent,
}: {
  values: number[];
  accent: keyof typeof ACCENT_VAR;
}) {
  const max = Math.max(...values, 1);
  const fill = ACCENT_VAR[accent] ?? "var(--cyan)";

  return (
    <div className="flex h-10 items-end gap-0.5">
      {values.map((v, i) => (
        <div
          key={i}
          className="flex-1 rounded-sm"
          style={{ height: `${(v / max) * 100}%`, background: fill, opacity: 0.85 }}
        />
      ))}
    </div>
  );
}

function ActionItemCard({
  item,
  onDismiss,
}: {
  item: ActionItem;
  onDismiss?: () => void;
}) {
  const router = useRouter();

  return (
    <article
      className={`rounded-xl border border-white/10 border-l-4 bg-white/[0.03] p-4 ${URGENCY_BORDER[item.urgency]}`}
    >
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
        <span
          className={`rounded px-2 py-0.5 font-mono-label text-[10px] font-medium uppercase tracking-wide ${URGENCY_BADGE[item.urgency]}`}
        >
          {URGENCY_LABEL[item.urgency]}
        </span>
        <span className="rounded bg-white/5 px-2 py-0.5 font-mono-label text-[10px] uppercase tracking-wide text-white/50">
          {item.sourceSignal}
        </span>
        <span className="font-mono-label text-[10px] text-white/35">{item.timestamp}</span>
      </div>

      <h3 className="mt-2.5 font-heading text-base font-semibold leading-snug text-white">
        {item.title}
      </h3>
      <p className="mt-1.5 text-sm leading-relaxed text-white/55">{item.why}</p>

      <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1">
        {item.ready.map((asset) => (
          <span key={asset} className="text-xs text-[var(--green)]">
            ✓ {asset} ready
          </span>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => router.push(item.contentHref)}
          className="rounded-lg bg-[var(--cyan)] px-4 py-2 text-xs font-semibold text-[var(--bg)] transition-opacity hover:opacity-90"
        >
          {item.primaryButton}
        </button>
        {item.dismissible && onDismiss && (
          <button
            type="button"
            onClick={onDismiss}
            className="rounded-lg border border-white/15 px-3 py-2 text-xs text-white/60 transition-colors hover:bg-white/5 hover:text-white/80"
          >
            Dismiss
          </button>
        )}
      </div>
    </article>
  );
}

function ViewAllActionsPrompt() {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => router.push("/content")}
      className="w-full rounded-xl border border-dashed border-[var(--cyan)]/30 bg-[var(--cyan)]/5 px-4 py-3 text-sm font-medium text-[var(--cyan)] transition-colors hover:bg-[var(--cyan)]/10"
    >
      View all actions →
    </button>
  );
}

function ActionItemsPanel({ isDetail }: { isDetail: boolean }) {
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());

  const visibleItems = useMemo(() => {
    const list = ACTION_ITEMS.filter((item) => !dismissed.has(item.id));
    return isDetail ? list : list.slice(0, 3);
  }, [dismissed, isDetail]);

  const handleDismiss = (id: string) => {
    setDismissed((prev) => new Set(prev).add(id));
  };

  return (
    <section className="rounded-xl border border-white/10 bg-white/[0.02]">
      <div className="border-b border-white/10 px-4 py-3">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="font-heading text-sm font-semibold tracking-wide text-white">
            Today&apos;s Actions
          </h2>
          <span className="rounded-md bg-[var(--cyan)]/15 px-2 py-0.5 font-mono-label text-[10px] font-medium text-[var(--cyan)]">
            {visibleItems.length}
          </span>
        </div>
        <p className="mt-1 text-xs text-white/45">
          Generated from overnight signal analysis — everything below is ready to execute
        </p>
      </div>

      <div className="space-y-3 p-4">
        {isDetail ? (
          visibleItems.map((item) => (
            <ActionItemCard
              key={item.id}
              item={item}
              onDismiss={item.dismissible ? () => handleDismiss(item.id) : undefined}
            />
          ))
        ) : (
          <ol className="space-y-2">
            {visibleItems.map((item, i) => (
              <li
                key={item.id}
                className="flex items-start gap-2 rounded-lg bg-white/[0.03] px-3 py-2.5 text-sm text-white/80"
              >
                <span className="shrink-0 font-mono-label text-xs text-white/40">
                  {i + 1}.
                </span>
                <span>
                  {SUMMARY_EMOJI[item.urgency]} {item.summaryLabel}
                </span>
              </li>
            ))}
          </ol>
        )}
        {!isDetail && <ViewAllActionsPrompt />}
      </div>
    </section>
  );
}

function IntelligenceSummarySection({ isDetail }: { isDetail: boolean }) {
  const { setViewMode, selectedClient, selectedProduct } = useApp();
  const clientName = selectedClient?.name ?? "YouTheory";
  const productName = selectedProduct?.name ?? "Collagen Peptides";
  const productLabel = `${clientName} ${productName}`;

  const fullText = INTELLIGENCE_SUMMARY.full.replace(
    /YouTheory Collagen/g,
    productLabel,
  );
  const firstSentence = INTELLIGENCE_SUMMARY.firstSentence;

  return (
    <section className="rounded-xl border border-white/10 border-l-4 border-l-[var(--cyan)] bg-white/[0.02] p-4">
      <p className="font-mono-label text-[10px] font-medium uppercase tracking-widest text-[var(--cyan)]">
        Intelligence Summary
      </p>
      <p className="mt-1 text-xs text-white/45">
        What this week&apos;s signals mean for {productLabel} — written by AI
      </p>
      <p className="mt-3 text-sm leading-relaxed text-white/75">
        {isDetail ? fullText : firstSentence}
      </p>
      {!isDetail && (
        <button
          type="button"
          onClick={() => setViewMode("detail")}
          className="mt-3 text-sm font-medium text-[var(--cyan)] transition-colors hover:text-[var(--cyan)]/80"
        >
          Read full summary →
        </button>
      )}
    </section>
  );
}

function StatCard({
  label,
  value,
  sub,
  ring,
  locked,
  lockedMessage,
}: {
  label: string;
  value: ReactNode;
  sub?: string;
  ring?: number;
  locked?: boolean;
  lockedMessage?: string;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
      <p className="font-mono-label text-[10px] font-medium uppercase tracking-widest text-white/45">
        {label}
      </p>
      <div className="mt-2 flex items-center justify-between gap-2">
        <div className="min-w-0">
          {locked ? (
            <p className="text-sm font-medium text-white/40">
              {lockedMessage ?? "Connect to unlock"}
            </p>
          ) : (
            <p className="font-mono-label text-xl font-semibold text-white sm:text-2xl">
              {value}
            </p>
          )}
          {sub && !locked && (
            <p className="mt-0.5 text-xs text-white/45">{sub}</p>
          )}
        </div>
        {ring !== undefined && !locked && <ScoreRing score={ring} size={48} stroke={3} />}
      </div>
    </div>
  );
}

function GmvSparkline({ values }: { values: number[] }) {
  const max = Math.max(...values, 1);
  return (
    <div className="mt-2 flex h-8 items-end gap-0.5">
      {values.map((v, i) => (
        <div
          key={i}
          className="flex-1 rounded-sm bg-[var(--cyan)]"
          style={{ height: `${(v / max) * 100}%`, opacity: 0.75 }}
        />
      ))}
    </div>
  );
}

function GmvStatCard({ isDetail }: { isDetail: boolean }) {
  return (
    <IntegrationSection integration="tiktok_shop">
      <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
        <p className="font-mono-label text-[10px] font-medium uppercase tracking-widest text-white/45">
          GMV 7-Day
        </p>
        <p className="mt-2 font-mono-label text-xl font-semibold text-white sm:text-2xl">
          {STAT_CARDS.gmv7Day}
        </p>
        {isDetail && (
          <>
            <p className="mt-0.5 text-xs text-[var(--green)]">↑ 18% vs last week</p>
            <GmvSparkline values={STAT_CARDS.gmvSparkline} />
          </>
        )}
      </div>
    </IntegrationSection>
  );
}

function StatRow({ isDetail }: { isDetail: boolean }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
      <StatCard
        label="Signal Score"
        value={STAT_CARDS.signalScore}
        sub={isDetail ? "↑ 12% vs last week" : undefined}
        ring={STAT_CARDS.signalScore}
      />
      <StatCard
        label="TikTok Trend Velocity"
        value={STAT_CARDS.tiktokVelocity}
        sub={isDetail ? "Category hashtag momentum" : undefined}
      />
      <StatCard
        label="Competitor Moves"
        value={STAT_CARDS.competitorMoves}
        sub={isDetail ? "Last 7 days" : undefined}
      />
      <StatCard
        label="Content Drafts Ready"
        value={STAT_CARDS.draftsReady}
        sub={isDetail ? "Awaiting review" : undefined}
      />
      <GmvStatCard isDetail={isDetail} />
    </div>
  );
}

function SignalFeedPanel({ isDetail }: { isDetail: boolean }) {
  const [filter, setFilter] = useState<SignalFilter>("all");
  const filters: { id: SignalFilter; label: string }[] = [
    { id: "all", label: "All" },
    { id: "opportunity", label: "Opportunity" },
    { id: "threat", label: "Threat" },
    { id: "competitor", label: "Competitor" },
  ];

  const visibleSignals = useMemo(() => {
    const list = isDetail ? SIGNALS : SIGNALS.slice(0, 3);
    if (filter === "all") return list;
    return list.filter((s) => s.type === filter);
  }, [filter, isDetail]);

  return (
    <Panel
      title="Signal Intelligence"
      action={
        <div className="flex flex-wrap gap-1">
          {filters.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setFilter(f.id)}
              className={`rounded-md px-2 py-0.5 font-mono-label text-[10px] uppercase tracking-wide transition-colors ${
                filter === f.id
                  ? "bg-[var(--cyan)]/20 text-[var(--cyan)]"
                  : "text-white/40 hover:text-white/70"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      }
      className="lg:col-span-2"
    >
      <ul className="space-y-3">
        {visibleSignals.map((signal) => (
          <li
            key={signal.id}
            className={`rounded-lg border border-white/10 border-l-4 bg-white/[0.03] p-3 ${SIGNAL_BORDER[signal.type]}`}
          >
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-white/45">
              <span className="font-mono-label uppercase tracking-wide text-white/55">
                {signal.source}
              </span>
              <span>·</span>
              <span className="font-mono-label">{signal.timestamp}</span>
            </div>
            <h3 className="mt-1.5 font-heading text-sm font-semibold text-white">
              {signal.title}
            </h3>
            {(isDetail || signal.type === "competitor") && (
              <p className="mt-1 text-sm leading-relaxed text-white/55">
                {isDetail ? signal.body : `${signal.body.slice(0, 100)}…`}
              </p>
            )}
            {isDetail && (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {signal.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded bg-white/5 px-2 py-0.5 font-mono-label text-[10px] text-white/50"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </li>
        ))}
      </ul>
    </Panel>
  );
}

function AgentPipelinePanel({ isDetail }: { isDetail: boolean }) {
  const agents = isDetail ? AGENTS : AGENTS.slice(0, 3);

  return (
    <Panel
      title="Agent Pipeline"
      action={<ScoreRing score={STAT_CARDS.signalScore} size={40} stroke={3} />}
    >
      <ul className="space-y-3">
        {agents.map((agent) => (
          <li key={agent.id}>
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm text-white/80">{agent.name}</span>
              <span className="font-mono-label text-[10px] uppercase text-white/40">
                {agent.status}
              </span>
            </div>
            <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[var(--cyan)] to-[var(--green)] transition-all"
                style={{ width: `${agent.progress}%` }}
              />
            </div>
            {isDetail && (
              <p className="mt-0.5 font-mono-label text-[10px] text-white/35">
                {agent.progress}% complete
              </p>
            )}
          </li>
        ))}
      </ul>
    </Panel>
  );
}

function CompetitorWatchPanel({ isDetail }: { isDetail: boolean }) {
  const { currentCompetitors } = useApp();
  const list = useMemo(() => {
    const filtered =
      currentCompetitors.length === 0
        ? COMPETITORS
        : COMPETITORS.filter((c) => matchesCompetitorName(c.name, currentCompetitors));
    return isDetail ? filtered : filtered.slice(0, 3);
  }, [currentCompetitors, isDetail]);

  return (
    <Panel title="Competitor Watch">
      <ul className="space-y-2.5">
        {list.map((c) => (
          <li
            key={c.id}
            className="flex items-center justify-between gap-2 rounded-lg bg-white/[0.03] px-3 py-2"
          >
            <div className="min-w-0">
              <p className="text-sm font-medium text-white">{c.name}</p>
              {isDetail && (
                <p className="truncate text-xs text-white/45">{c.move}</p>
              )}
            </div>
            <span
              className={`shrink-0 rounded px-2 py-0.5 font-mono-label text-[10px] uppercase tracking-wide ${THREAT_STYLES[c.threat]}`}
            >
              {c.threat}
            </span>
          </li>
        ))}
      </ul>
    </Panel>
  );
}

function DraftCreativePanel({ condensed }: { condensed?: boolean }) {
  return (
    <Panel
      title="Draft Creative"
      action={
        <span className="rounded-md bg-[var(--cyan)]/15 px-2 py-0.5 font-mono-label text-[10px] uppercase tracking-wide text-[var(--cyan)]">
          {DRAFT_CREATIVE.platform}
        </span>
      }
    >
      <div className="space-y-3">
        <div>
          <p className="font-mono-label text-[10px] uppercase tracking-widest text-[var(--green)]">
            Hook
          </p>
          <p className="mt-1 text-sm text-white/80">
            {condensed
              ? `${DRAFT_CREATIVE.hook.slice(0, 72)}…`
              : DRAFT_CREATIVE.hook}
          </p>
        </div>
        {!condensed && (
          <>
            <div>
              <p className="font-mono-label text-[10px] uppercase tracking-widest text-[var(--cyan)]">
                Body
              </p>
              <p className="mt-1 text-sm text-white/70">{DRAFT_CREATIVE.body}</p>
            </div>
            <div>
              <p className="font-mono-label text-[10px] uppercase tracking-widest text-[var(--purple)]">
                CTA
              </p>
              <p className="mt-1 text-sm text-white/70">{DRAFT_CREATIVE.cta}</p>
            </div>
          </>
        )}
        <div className="flex flex-wrap gap-2 pt-1">
          <button
            type="button"
            className="rounded-lg bg-[var(--green)] px-3 py-1.5 text-xs font-semibold text-[var(--bg)] hover:opacity-90"
          >
            Approve
          </button>
          {!condensed && (
            <>
              <button
                type="button"
                className="rounded-lg border border-white/15 px-3 py-1.5 text-xs text-white/70 hover:bg-white/5"
              >
                Regenerate
              </button>
              <button
                type="button"
                className="rounded-lg border border-white/15 px-3 py-1.5 text-xs text-white/70 hover:bg-white/5"
              >
                Edit
              </button>
            </>
          )}
        </div>
      </div>
    </Panel>
  );
}

function PlatformMetrics({
  platform,
  isDetail,
}: {
  platform: (typeof PLATFORMS)[number];
  isDetail: boolean;
}) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.03] p-3">
      <p className="font-heading text-sm font-semibold text-white">{platform.name}</p>
      <p className="font-mono-label mt-2 text-[10px] uppercase tracking-widest text-white/40">
        {platform.metric}
      </p>
      <p
        className={`font-mono-label mt-1 text-lg font-semibold ${PLATFORM_ACCENT[platform.accent]}`}
      >
        {platform.value}
      </p>
      <p
        className={`font-mono-label text-xs ${
          platform.change.startsWith("+")
            ? "text-[var(--green)]"
            : "text-[var(--red)]"
        }`}
      >
        {platform.change}
      </p>
      {isDetail && (
        <div className="mt-3">
          <MiniBarChart values={platform.chart} accent={platform.accent} />
        </div>
      )}
    </div>
  );
}

function PlatformCard({
  platform,
  isDetail,
}: {
  platform: (typeof PLATFORMS)[number];
  isDetail: boolean;
}) {
  const integrationKey = platform.integrationKey;

  const content = (
    <PlatformMetrics platform={platform} isDetail={isDetail} />
  );

  if (!integrationKey) return content;

  return (
    <IntegrationSection integration={integrationKey}>{content}</IntegrationSection>
  );
}

function PlatformPerformance({ isDetail }: { isDetail: boolean }) {
  return (
    <Panel title="Platform Performance">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {PLATFORMS.map((platform) => (
          <PlatformCard key={platform.id} platform={platform} isDetail={isDetail} />
        ))}
      </div>
    </Panel>
  );
}

export function DashboardOverview({ variant }: DashboardOverviewProps) {
  const isDetail = variant === "detail";

  return (
    <div className="space-y-4 md:space-y-6">
      <ActionItemsPanel isDetail={isDetail} />
      <IntelligenceSummarySection isDetail={isDetail} />
      <StatRow isDetail={isDetail} />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-6">
        <SignalFeedPanel isDetail={isDetail} />

        <div className="flex flex-col gap-4 lg:gap-6">
          <AgentPipelinePanel isDetail={isDetail} />
          <CompetitorWatchPanel isDetail={isDetail} />
          <DraftCreativePanel condensed={!isDetail} />
        </div>
      </div>

      <PlatformPerformance isDetail={isDetail} />
    </div>
  );
}
