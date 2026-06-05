"use client";

import { useMemo, useState, type ReactNode } from "react";
import { IntegrationSection } from "@/components/integrations/integration-section";
import {
  CONTENT_PERFORMANCE,
  GOOGLE_ADS,
  INSTAGRAM,
  META_ADS,
  PERFORMANCE_SCORE,
  SIDEBAR,
  SUMMARY,
  TIKTOK_SHOP,
  formatCurrency,
  formatViews,
  type ContentRow,
} from "@/components/performance/mock-data";

type PerformanceDashboardProps = {
  variant: "summary" | "detail";
};

type SortKey = keyof Pick<
  ContentRow,
  "platform" | "hook" | "views" | "engagement" | "conversions" | "revenue"
>;

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

function ScoreRing({
  score,
  size = 80,
  stroke = 5,
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
      <span className="font-mono-label absolute inset-0 flex items-center justify-center text-lg font-semibold text-[var(--cyan)]">
        {score}
      </span>
    </div>
  );
}

function ConnectNotice({
  visible,
  onDismiss,
}: {
  visible: boolean;
  onDismiss: () => void;
}) {
  if (!visible) return null;

  return (
    <div
      role="status"
      className="flex flex-col gap-3 rounded-xl border border-[var(--cyan)]/30 bg-[var(--cyan)]/5 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
    >
      <p className="text-sm text-white/70">
        Connect your platforms in Settings to see live data. Showing sample metrics
        below.
      </p>
      <button
        type="button"
        onClick={onDismiss}
        className="shrink-0 rounded-lg border border-white/20 px-3 py-1.5 text-xs text-white/70 transition-colors hover:bg-white/5 hover:text-white"
        aria-label="Dismiss notice"
      >
        Dismiss
      </button>
    </div>
  );
}

function BarChart({
  values,
  labels,
  accent = "var(--cyan)",
}: {
  values: number[];
  labels?: string[];
  accent?: string;
}) {
  const max = Math.max(...values, 1);

  return (
    <div>
      <div className="flex h-32 items-end gap-1.5 sm:gap-2">
        {values.map((v, i) => (
          <div key={i} className="flex flex-1 flex-col items-center gap-1">
            <div
              className="w-full rounded-sm transition-all"
              style={{
                height: `${(v / max) * 100}%`,
                minHeight: 4,
                background: accent,
                opacity: 0.85,
              }}
              title={labels?.[i] ? `${labels[i]}: $${v.toLocaleString()}` : undefined}
            />
          </div>
        ))}
      </div>
      {labels && (
        <div className="mt-2 flex gap-1.5 sm:gap-2">
          {labels.map((label) => (
            <span
              key={label}
              className="flex-1 text-center font-mono-label text-[9px] text-white/35"
            >
              {label}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

function LineChart({
  values,
  labels,
  accent = "var(--purple)",
}: {
  values: number[];
  labels?: string[];
  accent?: string;
}) {
  const max = Math.max(...values, 1);
  const min = Math.min(...values);
  const range = max - min || 1;
  const width = 100;
  const height = 48;
  const points = values
    .map((v, i) => {
      const x = (i / (values.length - 1)) * width;
      const y = height - ((v - min) / range) * height;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <div>
      <svg viewBox={`0 0 ${width} ${height}`} className="h-24 w-full" preserveAspectRatio="none">
        <polyline
          fill="none"
          stroke={accent}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={points}
          vectorEffect="non-scaling-stroke"
        />
        {values.map((v, i) => {
          const x = (i / (values.length - 1)) * width;
          const y = height - ((v - min) / range) * height;
          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r="2"
              fill={accent}
              vectorEffect="non-scaling-stroke"
            />
          );
        })}
      </svg>
      {labels && (
        <div className="mt-1 flex justify-between">
          {labels.map((label) => (
            <span key={label} className="font-mono-label text-[9px] text-white/35">
              {label}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

function MetricPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2">
      <p className="font-mono-label text-[10px] uppercase tracking-widest text-white/40">
        {label}
      </p>
      <p className="mt-1 font-mono-label text-sm font-semibold text-white">{value}</p>
    </div>
  );
}

function ChangeBadge({
  change,
  direction,
}: {
  change: string;
  direction: "up" | "down";
}) {
  return (
    <span
      className={`font-mono-label text-xs ${
        direction === "up" ? "text-[var(--green)]" : "text-[var(--red)]"
      }`}
    >
      {change}
    </span>
  );
}

function TikTokShopSection() {
  const { gmvChart, metrics, topProducts, topCreators } = TIKTOK_SHOP;

  return (
    <Panel title="TikTok Shop">
      <BarChart
        values={gmvChart.values}
        labels={gmvChart.labels}
        accent="var(--cyan)"
      />
      <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
        <MetricPill label="Total GMV" value={metrics.totalGmv} />
        <MetricPill label="Orders" value={metrics.orders} />
        <MetricPill label="AOV" value={metrics.aov} />
        <MetricPill label="Conv Rate" value={metrics.convRate} />
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div>
          <h3 className="font-mono-label text-[10px] uppercase tracking-widest text-white/40">
            Top Products
          </h3>
          <div className="-mx-4 mt-3 overflow-x-auto px-4">
            <table className="w-full min-w-[480px] text-left text-sm">
              <thead>
                <tr className="border-b border-white/10 font-mono-label text-[10px] uppercase tracking-widest text-white/40">
                  <th className="pb-2 pr-4 font-medium">Product</th>
                  <th className="pb-2 pr-4 font-medium">GMV</th>
                  <th className="pb-2 pr-4 font-medium">Orders</th>
                  <th className="pb-2 font-medium">Change</th>
                </tr>
              </thead>
              <tbody>
                {topProducts.map((row) => (
                  <tr key={row.id} className="border-b border-white/5">
                    <td className="py-2.5 pr-4 text-white/80">{row.name}</td>
                    <td className="py-2.5 pr-4 font-mono-label text-white">{row.gmv}</td>
                    <td className="py-2.5 pr-4 font-mono-label text-white/70">
                      {row.orders.toLocaleString()}
                    </td>
                    <td className="py-2.5">
                      <ChangeBadge change={row.change} direction={row.direction} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div>
          <h3 className="font-mono-label text-[10px] uppercase tracking-widest text-white/40">
            Top Creators
          </h3>
          <div className="-mx-4 mt-3 overflow-x-auto px-4">
            <table className="w-full min-w-[480px] text-left text-sm">
              <thead>
                <tr className="border-b border-white/10 font-mono-label text-[10px] uppercase tracking-widest text-white/40">
                  <th className="pb-2 pr-4 font-medium">Creator</th>
                  <th className="pb-2 pr-4 font-medium">GMV</th>
                  <th className="pb-2 pr-4 font-medium">Orders</th>
                  <th className="pb-2 font-medium">Conv</th>
                </tr>
              </thead>
              <tbody>
                {topCreators.map((row) => (
                  <tr key={row.id} className="border-b border-white/5">
                    <td className="py-2.5 pr-4 font-mono-label text-[var(--cyan)]">
                      {row.handle}
                    </td>
                    <td className="py-2.5 pr-4 font-mono-label text-white">{row.gmv}</td>
                    <td className="py-2.5 pr-4 font-mono-label text-white/70">
                      {row.orders}
                    </td>
                    <td className="py-2.5 font-mono-label text-white/70">{row.convRate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Panel>
  );
}

function MetaAdsSection() {
  const { roasTrend, metrics, topAd } = META_ADS;

  return (
    <Panel title="Meta Ads">
      <LineChart
        values={roasTrend.values}
        labels={roasTrend.labels}
        accent="var(--purple)"
      />
      <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-5">
        <MetricPill label="Spend" value={metrics.spend} />
        <MetricPill label="Impressions" value={metrics.impressions} />
        <MetricPill label="CPM" value={metrics.cpm} />
        <MetricPill label="CTR" value={metrics.ctr} />
        <MetricPill label="ROAS" value={metrics.roas} />
      </div>
      <div className="mt-4 rounded-lg border border-[var(--purple)]/30 bg-[var(--purple)]/5 p-4">
        <p className="font-mono-label text-[10px] uppercase tracking-widest text-[var(--purple)]">
          Top performing ad this week
        </p>
        <p className="mt-2 font-heading text-sm font-semibold text-white">
          &ldquo;{topAd.title}&rdquo; — ROAS {topAd.roas}
        </p>
        <p className="mt-1 text-sm text-white/55">{topAd.description}</p>
      </div>
    </Panel>
  );
}

function InstagramSection() {
  return (
    <Panel title="Instagram">
      <div className="grid gap-3 sm:grid-cols-2">
        <MetricPill label="Reach" value={`${INSTAGRAM.reach} ${INSTAGRAM.reachChange}`} />
        <MetricPill label="Engagement Rate" value={INSTAGRAM.engagementRate} />
        <MetricPill label="Top Reel" value={INSTAGRAM.topReel} />
        <MetricPill label="Follower Growth" value={INSTAGRAM.followerGrowth} />
      </div>
      <p className="mt-4 text-sm text-white/55">
        <span className="font-mono-label text-[10px] uppercase tracking-widest text-white/40">
          Best time to post:{" "}
        </span>
        <span className="text-[var(--green)]">{INSTAGRAM.bestTimeToPost}</span>
      </p>
    </Panel>
  );
}

function GoogleAdsSection() {
  return (
    <Panel title="Google Ads">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <MetricPill
          label="Impressions"
          value={`${GOOGLE_ADS.impressions} ${GOOGLE_ADS.impressionsChange}`}
        />
        <MetricPill label="Clicks" value={GOOGLE_ADS.clicks} />
        <MetricPill label="CTR" value={GOOGLE_ADS.ctr} />
        <MetricPill label="Avg Position" value={GOOGLE_ADS.avgPosition} />
      </div>
      <div className="mt-4 rounded-lg border border-[var(--yellow)]/30 bg-[var(--yellow)]/5 p-4">
        <p className="font-mono-label text-[10px] uppercase tracking-widest text-[var(--yellow)]">
          Top keyword
        </p>
        <p className="mt-2 font-heading text-sm font-semibold text-white">
          &ldquo;{GOOGLE_ADS.topKeyword.term}&rdquo; — {GOOGLE_ADS.topKeyword.clicks} clicks
        </p>
      </div>
    </Panel>
  );
}

function ContentPerformanceTable() {
  const [sortKey, setSortKey] = useState<SortKey>("views");
  const [sortAsc, setSortAsc] = useState(false);

  const sorted = useMemo(() => {
    const list = [...CONTENT_PERFORMANCE];
    list.sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      if (typeof av === "string" && typeof bv === "string") {
        return sortAsc ? av.localeCompare(bv) : bv.localeCompare(av);
      }
      return sortAsc
        ? (av as number) - (bv as number)
        : (bv as number) - (av as number);
    });
    return list;
  }, [sortKey, sortAsc]);

  function handleSort(key: SortKey) {
    if (sortKey === key) {
      setSortAsc((v) => !v);
    } else {
      setSortKey(key);
      setSortAsc(key === "platform" || key === "hook");
    }
  }

  const columns: { key: SortKey; label: string }[] = [
    { key: "platform", label: "Platform" },
    { key: "hook", label: "Hook" },
    { key: "views", label: "Views" },
    { key: "engagement", label: "Engagement" },
    { key: "conversions", label: "Conversions" },
    { key: "revenue", label: "Revenue" },
  ];

  return (
    <Panel title="Content Performance">
      <div className="-mx-4 overflow-x-auto px-4">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead>
            <tr className="border-b border-white/10 font-mono-label text-[10px] uppercase tracking-widest text-white/40">
              {columns.map((col) => (
                <th key={col.key} className="pb-2 pr-4 font-medium last:pr-0">
                  <button
                    type="button"
                    onClick={() => handleSort(col.key)}
                    className="flex items-center gap-1 transition-colors hover:text-white/70"
                  >
                    {col.label}
                    {sortKey === col.key && (
                      <span className="text-[var(--cyan)]">{sortAsc ? "↑" : "↓"}</span>
                    )}
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.map((row) => (
              <tr key={row.id} className="border-b border-white/5">
                <td className="py-3 pr-4">
                  <span className="rounded bg-white/10 px-2 py-0.5 font-mono-label text-[10px] uppercase text-white/60">
                    {row.platform}
                  </span>
                </td>
                <td className="max-w-[240px] truncate py-3 pr-4 text-white/75">
                  {row.hook}
                </td>
                <td className="py-3 pr-4 font-mono-label text-white">
                  {formatViews(row.views)}
                </td>
                <td className="py-3 pr-4 font-mono-label text-white/70">
                  {row.engagement}%
                </td>
                <td className="py-3 pr-4 font-mono-label text-white/70">
                  {row.conversions}
                </td>
                <td className="py-3 font-mono-label text-[var(--green)]">
                  {formatCurrency(row.revenue)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Panel>
  );
}

function DetailSidebar() {
  return (
    <aside className="flex flex-col gap-4 lg:gap-6">
      <Panel title="Performance Score">
        <div className="flex flex-col items-center gap-3">
          <ScoreRing score={PERFORMANCE_SCORE.score} size={96} />
          <p className="text-center text-sm text-white/50">
            Strong TikTok Shop momentum offsetting Meta ROAS dip
          </p>
          <p
            className={`font-mono-label text-sm ${
              PERFORMANCE_SCORE.trend === "up" ? "text-[var(--green)]" : "text-[var(--red)]"
            }`}
          >
            {PERFORMANCE_SCORE.trend === "up" ? "↑" : "↓"} {PERFORMANCE_SCORE.change} vs last
            week
          </p>
        </div>
      </Panel>

      <Panel title="Week over Week">
        <ul className="space-y-3">
          {SIDEBAR.weekOverWeek.map((item) => (
            <li
              key={item.label}
              className="flex items-center justify-between rounded-lg bg-white/[0.03] px-3 py-2"
            >
              <span className="text-sm text-white/70">{item.label}</span>
              <span className="flex items-center gap-2">
                <span
                  className={`font-mono-label text-sm font-semibold ${
                    item.direction === "up" ? "text-[var(--green)]" : "text-[var(--red)]"
                  }`}
                >
                  {item.value}
                </span>
                {"watch" in item && item.watch && (
                  <span className="rounded bg-[var(--yellow)]/15 px-1.5 py-0.5 font-mono-label text-[9px] uppercase text-[var(--yellow)]">
                    watch
                  </span>
                )}
              </span>
            </li>
          ))}
        </ul>
      </Panel>

      <Panel title="Top Recommendation">
        <p className="text-sm leading-relaxed text-white/70">{SIDEBAR.topRecommendation}</p>
        <button
          type="button"
          className="mt-3 rounded-lg bg-[var(--cyan)]/15 px-3 py-2 text-xs font-semibold text-[var(--cyan)] transition-opacity hover:opacity-90"
        >
          Review Variants →
        </button>
      </Panel>

      <Panel title="Next Opportunity">
        <p className="text-sm leading-relaxed text-white/70">{SIDEBAR.nextOpportunity}</p>
      </Panel>
    </aside>
  );
}

function SummaryView() {
  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
        <p className="font-mono-label text-[10px] uppercase tracking-widest text-white/40">
          Performance score
        </p>
        <div className="mt-3 flex items-center gap-4">
          <ScoreRing score={PERFORMANCE_SCORE.score} />
          <div>
            <p className="font-heading text-2xl font-bold text-white">
              {PERFORMANCE_SCORE.score}
              <span className="text-base font-normal text-white/40"> / 100</span>
            </p>
            <p
              className={`mt-1 font-mono-label text-sm ${
                PERFORMANCE_SCORE.trend === "up" ? "text-[var(--green)]" : "text-[var(--red)]"
              }`}
            >
              {PERFORMANCE_SCORE.trend === "up" ? "↑" : "↓"} {PERFORMANCE_SCORE.change} vs last
              week
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
          <p className="font-mono-label text-[10px] uppercase tracking-widest text-white/40">
            GMV trend
          </p>
          <p className="mt-2 font-mono-label text-xl font-semibold text-[var(--cyan)]">
            {SUMMARY.gmv}{" "}
            <span className="text-sm text-[var(--green)]">{SUMMARY.gmvChange}</span>
          </p>
          <p className="mt-0.5 text-xs text-white/45">{SUMMARY.gmvPeriod}</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
          <p className="font-mono-label text-[10px] uppercase tracking-widest text-white/40">
            Top platform
          </p>
          <p className="mt-2 font-heading text-lg font-semibold text-white">
            {SUMMARY.topPlatform}
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-[var(--green)]/30 bg-[var(--green)]/5 p-4">
        <p className="font-mono-label text-[10px] uppercase tracking-widest text-[var(--green)]">
          Best content
        </p>
        <p className="mt-2 text-sm text-white/80">{SUMMARY.bestContent}</p>
      </div>
    </div>
  );
}

function DetailView() {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-6">
      <div className="space-y-4 lg:col-span-2 lg:space-y-6">
        {/*
          INTEGRATION: tiktok_shop
          Toggle: Settings > Integrations > TikTok Shop Seller Center
          When OFF: hide this entire section
          When ON: replace mock data with real API data
        */}
        <IntegrationSection integration="tiktok_shop">
          <TikTokShopSection />
        </IntegrationSection>

        {/*
          INTEGRATION: meta_business
          Toggle: Settings > Integrations > Meta Business Manager
          When OFF: hide this entire section
          When ON: replace mock data with real API data
        */}
        <IntegrationSection integration="meta_business">
          <MetaAdsSection />
        </IntegrationSection>

        <InstagramSection />

        {/*
          INTEGRATION: google_ads
          Toggle: Settings > Integrations > Google Ads
          When OFF: hide this entire section
          When ON: replace mock data with real API data
        */}
        <IntegrationSection integration="google_ads">
          <GoogleAdsSection />
        </IntegrationSection>

        <ContentPerformanceTable />
      </div>
      <DetailSidebar />
    </div>
  );
}

export function PerformanceDashboard({ variant }: PerformanceDashboardProps) {
  const [noticeDismissed, setNoticeDismissed] = useState(false);

  return (
    <div className="space-y-4 md:space-y-6">
      <ConnectNotice
        visible={!noticeDismissed}
        onDismiss={() => setNoticeDismissed(true)}
      />
      {variant === "summary" ? <SummaryView /> : <DetailView />}
    </div>
  );
}
