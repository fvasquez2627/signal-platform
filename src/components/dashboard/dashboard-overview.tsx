"use client";

import { useMemo, useState, type ReactNode } from "react";
import {
  AGENTS,
  COMPETITORS,
  DRAFT_CREATIVE,
  MOCK_ACCOUNT_CONNECTED,
  PLATFORMS,
  SIGNAL_BORDER,
  SIGNALS,
  STAT_CARDS,
  THREAT_STYLES,
  URGENT_ALERT,
  PLATFORM_ACCENT,
  type SignalFilter,
} from "@/components/dashboard/mock-data";

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

function UrgentAlertBanner({
  visible,
  onDismiss,
  condensed,
}: {
  visible: boolean;
  onDismiss: () => void;
  condensed?: boolean;
}) {
  if (!visible) return null;

  return (
    <div
      role="alert"
      className="flex flex-col gap-3 rounded-xl border border-[var(--red)]/40 bg-[var(--red)]/10 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
    >
      <div className="min-w-0 flex-1">
        <p className="font-mono-label text-[10px] font-medium uppercase tracking-widest text-[var(--red)]">
          Urgent · High priority
        </p>
        <p className="mt-1 font-heading text-sm font-semibold text-white sm:text-base">
          {URGENT_ALERT.title}
        </p>
        {!condensed && (
          <p className="mt-0.5 text-xs text-white/60">{URGENT_ALERT.subtitle}</p>
        )}
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <button
          type="button"
          className="rounded-lg bg-[var(--red)] px-3 py-1.5 text-xs font-semibold text-white transition-opacity hover:opacity-90"
        >
          View Brief
        </button>
        <button
          type="button"
          onClick={onDismiss}
          className="rounded-lg border border-white/20 px-3 py-1.5 text-xs text-white/70 transition-colors hover:bg-white/5 hover:text-white"
          aria-label="Dismiss alert"
        >
          Dismiss
        </button>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  sub,
  ring,
  locked,
}: {
  label: string;
  value: ReactNode;
  sub?: string;
  ring?: number;
  locked?: boolean;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
      <p className="font-mono-label text-[10px] font-medium uppercase tracking-widest text-white/45">
        {label}
      </p>
      <div className="mt-2 flex items-center justify-between gap-2">
        <div className="min-w-0">
          {locked ? (
            <p className="text-sm font-medium text-white/40">Connect to unlock</p>
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
      <StatCard
        label="GMV 7-Day"
        value={STAT_CARDS.gmv7Day}
        sub={isDetail ? "TikTok Shop connected" : undefined}
        locked={!MOCK_ACCOUNT_CONNECTED}
      />
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
      title="Signal Feed"
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
  const list = isDetail ? COMPETITORS : COMPETITORS.slice(0, 3);

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

function PlatformPerformance({ isDetail }: { isDetail: boolean }) {
  const locked = !MOCK_ACCOUNT_CONNECTED;

  return (
    <Panel title="Platform Performance">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {PLATFORMS.map((platform) => (
          <div
            key={platform.id}
            className="rounded-lg border border-white/10 bg-white/[0.03] p-3"
          >
            <p className="font-heading text-sm font-semibold text-white">
              {platform.name}
            </p>
            <p className="font-mono-label mt-2 text-[10px] uppercase tracking-widest text-white/40">
              {platform.metric}
            </p>
            {locked ? (
              <p className="mt-2 text-sm text-white/40">Connect to unlock</p>
            ) : (
              <>
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
              </>
            )}
          </div>
        ))}
      </div>
    </Panel>
  );
}

export function DashboardOverview({ variant }: DashboardOverviewProps) {
  const isDetail = variant === "detail";
  const [alertDismissed, setAlertDismissed] = useState(false);
  const showAlert = !alertDismissed;

  return (
    <div className="space-y-4 md:space-y-6">
      <UrgentAlertBanner
        visible={showAlert}
        onDismiss={() => setAlertDismissed(true)}
        condensed={!isDetail}
      />

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
