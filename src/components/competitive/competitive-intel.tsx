"use client";

import { useMemo, useState, type ReactNode } from "react";
import { CompetitiveExtras } from "@/components/competitive/competitive-extras";
import { useApp } from "@/context/app-context";
import { matchesCompetitorName } from "@/lib/product-utils";
import { IntegrationSection } from "@/components/integrations/integration-section";
import {
  COMPETITORS,
  META_ADS,
  PRESSURE_SCORE,
  PRICING_ROWS,
  RECOMMENDED_ACTION,
  SHARE_OF_VOICE,
  SIDEBAR_INSIGHTS,
  THREAT_STYLES,
  TOP_MOVES,
  getPriceDiff,
  type Competitor,
  type MetaAd,
} from "@/components/competitive/mock-data";

type CompetitiveIntelProps = {
  variant: "summary" | "detail";
};

function Panel({
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

function ThreatBadge({ threat }: { threat: Competitor["threat"] }) {
  const style = THREAT_STYLES[threat];
  return (
    <span
      className={`rounded px-2 py-0.5 font-mono-label text-[10px] uppercase tracking-wide ${style.className}`}
    >
      {style.label}
    </span>
  );
}

function CompetitorAvatar({ competitor }: { competitor: Competitor }) {
  return (
    <div
      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg font-mono-label text-sm font-bold text-white"
      style={{ backgroundColor: `${competitor.avatarColor}33`, color: competitor.avatarColor }}
    >
      {competitor.initials}
    </div>
  );
}

function PressureScoreRing({ score, size = 80 }: { score: number; size?: number }) {
  const stroke = 5;
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
          stroke="var(--red)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <span className="font-mono-label absolute inset-0 flex items-center justify-center text-lg font-semibold text-[var(--red)]">
        {score}
      </span>
    </div>
  );
}

function SummaryView({ activeCompetitors }: { activeCompetitors: Competitor[] }) {
  const activeNames = new Set(activeCompetitors.map((c) => c.name));
  const topMoves = TOP_MOVES.filter((m) =>
    [...activeNames].some((name) => matchesCompetitorName(m.competitor, [name])),
  );

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
        <p className="font-mono-label text-[10px] uppercase tracking-widest text-white/40">
          Competitive pressure
        </p>
        <div className="mt-3 flex items-center gap-4">
          <PressureScoreRing score={PRESSURE_SCORE.score} />
          <div>
            <p className="font-heading text-2xl font-bold text-white">
              {PRESSURE_SCORE.score}
              <span className="text-base font-normal text-white/40"> / 100</span>
            </p>
            <p
              className={`mt-1 font-mono-label text-sm ${
                PRESSURE_SCORE.trend === "up" ? "text-[var(--red)]" : "text-[var(--green)]"
              }`}
            >
              {PRESSURE_SCORE.trend === "up" ? "↑" : "↓"} {PRESSURE_SCORE.change} vs last week
            </p>
          </div>
        </div>
      </div>

      <Panel title="Top Moves This Week">
        <ul className="space-y-3">
          {topMoves.map((item) => (
            <li
              key={item.competitor}
              className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2.5"
            >
              <p className="font-mono-label text-[10px] uppercase tracking-wide text-[var(--purple)]">
                {item.competitor}
              </p>
              <p className="mt-1 text-sm text-white/75">{item.move}</p>
            </li>
          ))}
        </ul>
      </Panel>

      <div className="rounded-xl border border-[var(--cyan)]/30 bg-[var(--cyan)]/5 p-4">
        <p className="font-mono-label text-[10px] uppercase tracking-widest text-[var(--cyan)]">
          Recommended action
        </p>
        <p className="mt-2 text-sm leading-relaxed text-white/80">{RECOMMENDED_ACTION}</p>
      </div>
    </div>
  );
}

function CompetitorCard({ competitor }: { competitor: Competitor }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <article className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
      <div className="flex items-start gap-3">
        <CompetitorAvatar competitor={competitor} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-heading text-base font-semibold text-white">
              {competitor.name}
            </h3>
            <ThreatBadge threat={competitor.threat} />
          </div>
          <p className="mt-0.5 font-mono-label text-[10px] text-white/40">
            Last activity · {competitor.lastActivity}
          </p>
          <p className="mt-2 text-sm text-white/65">{competitor.activitySummary}</p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {(
          [
            ["Active Ads", competitor.metrics.activeAds],
            ["Est. Spend", competitor.metrics.estSpend],
            ["TikTok Posts", competitor.metrics.tiktokPosts],
            ["Amazon Rating", competitor.metrics.amazonRating],
          ] as const
        ).map(([label, value]) => (
          <div key={label} className="rounded-lg bg-white/[0.04] px-3 py-2">
            <p className="font-mono-label text-[9px] uppercase tracking-widest text-white/35">
              {label}
            </p>
            <p className="mt-0.5 font-mono-label text-sm font-semibold text-white">{value}</p>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="mt-3 text-xs text-[var(--cyan)] hover:underline"
      >
        {expanded ? "Hide recent moves" : "Show recent moves"}
      </button>

      {expanded && (
        <ul className="mt-2 space-y-1.5 border-t border-white/10 pt-3">
          {competitor.recentMoves.map((move) => (
            <li key={move} className="flex gap-2 text-sm text-white/60">
              <span className="text-[var(--cyan)]">·</span>
              {move}
            </li>
          ))}
        </ul>
      )}

      <button
        type="button"
        className="mt-4 w-full rounded-lg border border-[var(--purple)]/40 bg-[var(--purple)]/10 px-3 py-2 text-xs font-semibold text-[var(--purple)] transition-opacity hover:opacity-90 sm:w-auto"
      >
        Build Counter Brief
      </button>
    </article>
  );
}

function MetaAdCard({ ad, showCreativeBadge }: { ad: MetaAd; showCreativeBadge?: boolean }) {
  return (
    <article className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="font-heading text-sm font-semibold text-white">{ad.competitorName}</p>
        <div className="flex flex-wrap gap-1.5">
          {showCreativeBadge && (
            <span className="rounded bg-[var(--green)]/15 px-2 py-0.5 font-mono-label text-[10px] uppercase text-[var(--green)]">
              Enhanced: creative previews
            </span>
          )}
          <span className="rounded bg-white/10 px-2 py-0.5 font-mono-label text-[10px] uppercase text-white/55">
            {ad.format}
          </span>
        </div>
      </div>
      <p className="mt-2 text-sm italic text-white/70">&ldquo;{ad.hook}&rdquo;</p>
      <div className="mt-3 flex flex-wrap gap-3 font-mono-label text-[10px] text-white/45">
        <span>{ad.spendRange}</span>
        <span>·</span>
        <span>{ad.daysRunning}d running</span>
      </div>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {ad.platforms.map((p) => (
          <span
            key={p}
            className="rounded bg-[var(--cyan)]/10 px-2 py-0.5 font-mono-label text-[10px] text-[var(--cyan)]"
          >
            {p}
          </span>
        ))}
      </div>
    </article>
  );
}

function MetaAdLibrary({ activeCompetitors }: { activeCompetitors: Competitor[] }) {
  const [filter, setFilter] = useState<string>("all");
  const competitors = ["all", ...activeCompetitors.map((c) => c.id)];

  const scopedAds = useMemo(
    () => {
      const activeIds = new Set(activeCompetitors.map((c) => c.id));
      return META_ADS.filter((ad) => activeIds.has(ad.competitorId));
    },
    [activeCompetitors],
  );

  const filtered = useMemo(
    () =>
      filter === "all"
        ? scopedAds
        : scopedAds.filter((ad) => ad.competitorId === filter),
    [filter, scopedAds],
  );

  return (
    <IntegrationSection integration="meta_ad_library_full">
      <Panel title="Meta Ad Library Monitor">
        <p className="mb-4 -mt-1 font-mono-label text-[10px] uppercase tracking-wide text-[var(--green)]">
          Enhanced: spend ranges + demographic targeting
        </p>
        <div className="-mx-1 mb-4 overflow-x-auto px-1 pb-1">
        <div className="flex min-w-max gap-1.5">
          {competitors.map((id) => {
            const label =
              id === "all"
                ? "All"
                : activeCompetitors.find((c) => c.id === id)?.name ?? id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => setFilter(id)}
                className={`shrink-0 rounded-lg px-3 py-1.5 font-mono-label text-[10px] uppercase tracking-wide transition-colors ${
                  filter === id
                    ? "bg-[var(--cyan)]/20 text-[var(--cyan)]"
                    : "border border-white/10 bg-white/5 text-white/45 hover:text-white/70"
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {filtered.map((ad) => (
            <MetaAdCard key={ad.id} ad={ad} showCreativeBadge />
          ))}
        </div>
      </Panel>
    </IntegrationSection>
  );
}

function PricingIntelligence({ activeCompetitors }: { activeCompetitors: Competitor[] }) {
  const activeNames = activeCompetitors.map((c) => c.name);
  const rows = PRICING_ROWS.filter((row) =>
    matchesCompetitorName(row.competitor, activeNames),
  );

  return (
    <Panel title="Pricing Intelligence">
      <div className="-mx-4 overflow-x-auto px-4">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="border-b border-white/10 font-mono-label text-[10px] uppercase tracking-widest text-white/40">
              <th className="pb-2 pr-4 font-medium">Competitor</th>
              <th className="pb-2 pr-4 font-medium">Product</th>
              <th className="pb-2 pr-4 font-medium">Their price</th>
              <th className="pb-2 pr-4 font-medium">Your price</th>
              <th className="pb-2 pr-4 font-medium">Difference</th>
              <th className="pb-2 font-medium">Changed</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const { diff, pct, label } = getPriceDiff(row.theirPrice, row.yourPrice);
              const highlight =
                label === "underpriced"
                  ? "bg-[var(--green)]/5"
                  : label === "overpriced"
                    ? "bg-[var(--red)]/5"
                    : "";

              return (
                <tr
                  key={row.id}
                  className={`border-b border-white/5 ${highlight}`}
                >
                  <td className="py-3 pr-4 text-white/80">{row.competitor}</td>
                  <td className="py-3 pr-4 text-white/60">{row.product}</td>
                  <td className="py-3 pr-4 font-mono-label text-white">
                    ${row.theirPrice.toFixed(2)}
                  </td>
                  <td className="py-3 pr-4 font-mono-label text-white">
                    ${row.yourPrice.toFixed(2)}
                  </td>
                  <td className="py-3 pr-4">
                    <span
                      className={`font-mono-label text-xs ${
                        diff > 0 ? "text-[var(--red)]" : diff < 0 ? "text-[var(--green)]" : "text-white/50"
                      }`}
                    >
                      {diff > 0 ? "+" : ""}
                      {diff.toFixed(2)} ({pct}%)
                    </span>
                    <span className="ml-1 font-mono-label text-[9px] uppercase text-white/35">
                      {label}
                    </span>
                  </td>
                  <td className="py-3">
                    <span className="flex items-center gap-1 font-mono-label text-xs text-white/50">
                      {row.direction === "up" && (
                        <span className="text-[var(--red)]">↑</span>
                      )}
                      {row.direction === "down" && (
                        <span className="text-[var(--green)]">↓</span>
                      )}
                      {row.direction === "flat" && (
                        <span className="text-white/30">—</span>
                      )}
                      {row.lastChanged}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Panel>
  );
}

function ShareOfVoiceChart() {
  const channels = ["tiktok", "meta", "google"] as const;
  const labels = { tiktok: "TikTok", meta: "Meta", google: "Google" };

  return (
    <Panel title="Share of Voice">
      <div className="space-y-4">
        {SHARE_OF_VOICE.map((brand) => (
          <div key={brand.name}>
            <div className="mb-1.5 flex items-center justify-between">
              <span
                className={`text-sm font-medium ${
                  brand.isYou ? "text-[var(--cyan)]" : "text-white/75"
                }`}
              >
                {brand.name}
              </span>
              <span className="font-mono-label text-[10px] text-white/40">
                {brand.tiktok + brand.meta + brand.google}% total
              </span>
            </div>
            <div className="flex h-6 overflow-hidden rounded-md">
              {channels.map((ch) => (
                <div
                  key={ch}
                  className="flex items-center justify-center font-mono-label text-[9px] text-white/80"
                  style={{
                    width: `${brand[ch]}%`,
                    background: brand.isYou
                      ? "var(--cyan)"
                      : ch === "tiktok"
                        ? "rgba(0, 212, 255, 0.35)"
                        : ch === "meta"
                          ? "rgba(185, 127, 255, 0.35)"
                          : "rgba(255, 212, 38, 0.35)",
                    opacity: brand.isYou ? 0.9 : 0.7,
                  }}
                  title={`${labels[ch]}: ${brand[ch]}%`}
                />
              ))}
            </div>
            <div className="mt-1 flex gap-3 font-mono-label text-[9px] text-white/35">
              <span>TikTok {brand.tiktok}%</span>
              <span>Meta {brand.meta}%</span>
              <span>Google {brand.google}%</span>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 flex flex-wrap gap-4 font-mono-label text-[10px] text-white/40">
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-sm bg-[var(--cyan)]" /> Your brand
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-sm bg-[var(--cyan)]/35" /> TikTok
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-sm bg-[var(--purple)]/35" /> Meta
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-sm bg-[var(--yellow)]/35" /> Google
        </span>
      </div>
    </Panel>
  );
}

function DetailSidebar() {
  const { mostActive, biggestThreat, opportunity, categoryAdSpend } = SIDEBAR_INSIGHTS;

  return (
    <aside className="flex flex-col gap-4 lg:gap-6">
      <Panel title="Competitive Pressure">
        <div className="flex flex-col items-center gap-3">
          <PressureScoreRing score={PRESSURE_SCORE.score} size={96} />
          <p className="text-center text-sm text-white/50">
            Elevated pressure from Vital Proteins SKU launch
          </p>
          <p
            className={`font-mono-label text-sm ${
              PRESSURE_SCORE.trend === "up" ? "text-[var(--red)]" : "text-[var(--green)]"
            }`}
          >
            {PRESSURE_SCORE.trend === "up" ? "↑" : "↓"} {PRESSURE_SCORE.change} vs last week
          </p>
        </div>
      </Panel>

      <Panel title="Most Active This Week">
        <p className="font-heading text-sm font-semibold text-white">{mostActive.name}</p>
        <p className="mt-1 text-sm text-white/55">{mostActive.detail}</p>
      </Panel>

      <Panel title="Biggest Threat">
        <p className="font-heading text-sm font-semibold text-[var(--red)]">
          {biggestThreat.name}
        </p>
        <p className="mt-1 text-sm text-white/55">{biggestThreat.detail}</p>
      </Panel>

      <Panel title="Opportunity">
        <p className="font-heading text-sm font-semibold text-[var(--green)]">
          {opportunity.name}
        </p>
        <p className="mt-1 text-sm text-white/55">{opportunity.detail}</p>
      </Panel>

      <Panel title="Category Ad Spend">
        <p
          className={`font-mono-label text-2xl font-semibold ${
            categoryAdSpend.direction === "up" ? "text-[var(--red)]" : "text-[var(--green)]"
          }`}
        >
          {categoryAdSpend.direction === "up" ? "↑" : "↓"} {categoryAdSpend.change}
        </p>
        <p className="mt-1 text-sm text-white/45">Category-wide paid spend trend</p>
      </Panel>
    </aside>
  );
}

function DetailView({ activeCompetitors }: { activeCompetitors: Competitor[] }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-6">
        <div className="space-y-4 lg:col-span-2 lg:space-y-6">
          <Panel title="Competitor Tracker">
            <div className="space-y-4">
              {activeCompetitors.map((c) => (
                <CompetitorCard key={c.id} competitor={c} />
              ))}
            </div>
          </Panel>

          <MetaAdLibrary activeCompetitors={activeCompetitors} />
          <PricingIntelligence activeCompetitors={activeCompetitors} />
          <ShareOfVoiceChart />
        </div>
        <DetailSidebar />
      </div>
      <CompetitiveExtras />
    </div>
  );
}

export function CompetitiveIntel({ variant }: CompetitiveIntelProps) {
  const { currentCompetitors } = useApp();
  const activeCompetitors = useMemo(() => {
    if (currentCompetitors.length === 0) return COMPETITORS;
    return COMPETITORS.filter((c) => matchesCompetitorName(c.name, currentCompetitors));
  }, [currentCompetitors]);

  if (variant === "summary") {
    return <SummaryView activeCompetitors={activeCompetitors} />;
  }
  return <DetailView activeCompetitors={activeCompetitors} />;
}
