"use client";

import { useMemo, useState, type ReactNode } from "react";
import { IntegrationSection } from "@/components/integrations/integration-section";
import { useApp } from "@/context/app-context";
import { matchesKeyword } from "@/lib/product-utils";
import {
  AEO_QUERIES,
  AI_PRESENCE,
  COMPETITOR_KEYWORD_GAPS,
  DOMAIN_AUTHORITY,
  filterSearchPresence,
  formatImpressions,
  getShoppingDiff,
  GOOGLE_TRENDS,
  GSC_FILTERS,
  INTENT_STYLES,
  KEYWORD_INTELLIGENCE,
  PAA_QUESTIONS,
  RECOMMENDED_ACTION,
  RISING_QUERIES,
  SEARCH_PRESENCE,
  SEO_HEALTH_SCORE,
  SHOPPING_ROWS,
  SIDEBAR_INSIGHTS,
  TOP_KEYWORD_OPPORTUNITIES,
  type GscFilter,
  type SearchPresenceRow,
} from "@/components/seo/mock-data";

type SeoIntelProps = {
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

function SeoHealthScoreRing({ score, size = 80 }: { score: number; size?: number }) {
  const stroke = 5;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color =
    score >= 80 ? "var(--green)" : score >= 60 ? "var(--yellow)" : "var(--red)";

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
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <span
        className="font-mono-label absolute inset-0 flex items-center justify-center text-lg font-semibold"
        style={{ color }}
      >
        {score}
      </span>
    </div>
  );
}

function PositionChangeCell({ row }: { row: SearchPresenceRow }) {
  if (row.change === "new") {
    return (
      <span className="font-mono-label text-xs text-[var(--cyan)]">New</span>
    );
  }
  if (row.change === "flat") {
    return <span className="font-mono-label text-xs text-white/40">—</span>;
  }
  const isUp = row.change === "up";
  return (
    <span
      className={`font-mono-label text-xs ${isUp ? "text-[var(--green)]" : "text-[var(--red)]"}`}
    >
      {isUp ? "↑" : "↓"} {row.changeAmount}
    </span>
  );
}

function Sparkline({ values }: { values: number[] }) {
  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = max - min || 1;

  return (
    <div className="flex h-12 items-end gap-0.5">
      {values.map((v, i) => (
        <div
          key={i}
          className="flex-1 rounded-sm bg-[var(--cyan)]/60"
          style={{ height: `${((v - min) / range) * 100}%`, minHeight: 4 }}
        />
      ))}
    </div>
  );
}

function TrendsChart({ months, values }: { months: string[]; values: number[] }) {
  const max = Math.max(...values);

  return (
    <div className="space-y-2">
      <div className="flex h-32 items-end gap-1">
        {values.map((v, i) => (
          <div key={months[i]} className="flex flex-1 flex-col items-center gap-1">
            <div
              className="w-full rounded-t bg-[var(--cyan)]/50"
              style={{ height: `${(v / max) * 100}%`, minHeight: 4 }}
            />
            <span className="font-mono-label text-[8px] text-white/35">{months[i]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function AiPresenceDots({ appearing, tracked }: { appearing: number; tracked: number }) {
  return (
    <div className="flex items-center gap-1.5">
      {Array.from({ length: tracked }).map((_, i) => (
        <span
          key={i}
          className={`h-2.5 w-2.5 rounded-full ${
            i < appearing ? "bg-[var(--green)]" : "bg-white/15"
          }`}
        />
      ))}
      <span className="ml-2 font-mono-label text-sm text-white/60">
        {appearing}/{tracked}
      </span>
    </div>
  );
}

function SummaryView() {
  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
        <p className="font-mono-label text-[10px] uppercase tracking-widest text-white/40">
          SEO health
        </p>
        <div className="mt-3 flex items-center gap-4">
          <SeoHealthScoreRing score={SEO_HEALTH_SCORE.score} />
          <div>
            <p className="font-heading text-2xl font-bold text-white">
              {SEO_HEALTH_SCORE.score}
              <span className="text-base font-normal text-white/40"> / 100</span>
            </p>
            <p
              className={`mt-1 font-mono-label text-sm ${
                SEO_HEALTH_SCORE.trend === "up"
                  ? "text-[var(--green)]"
                  : "text-[var(--red)]"
              }`}
            >
              {SEO_HEALTH_SCORE.trend === "up" ? "↑" : "↓"} {SEO_HEALTH_SCORE.change} vs
              last month
            </p>
          </div>
        </div>
      </div>

      <Panel title="Top Keyword Opportunities">
        <ul className="space-y-3">
          {TOP_KEYWORD_OPPORTUNITIES.map((item) => (
            <li
              key={item.keyword}
              className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2.5"
            >
              <p className="font-heading text-sm font-semibold text-white">{item.keyword}</p>
              <p className="mt-0.5 text-sm text-white/55">{item.detail}</p>
            </li>
          ))}
        </ul>
      </Panel>

      <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
        <p className="font-mono-label text-[10px] uppercase tracking-widest text-white/40">
          AI presence
        </p>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <p className="font-heading text-sm font-semibold text-white">{AI_PRESENCE.label}</p>
          <AiPresenceDots appearing={AI_PRESENCE.appearing} tracked={AI_PRESENCE.tracked} />
        </div>
      </div>

      <div className="rounded-xl border border-[var(--cyan)]/30 bg-[var(--cyan)]/5 p-4">
        <p className="font-mono-label text-[10px] uppercase tracking-widest text-[var(--cyan)]">
          Recommended action
        </p>
        <p className="mt-2 text-sm leading-relaxed text-white/80">{RECOMMENDED_ACTION}</p>
      </div>
    </div>
  );
}

function SearchPresenceSection() {
  const [filter, setFilter] = useState<GscFilter>("all");
  const filtered = useMemo(
    () => filterSearchPresence(SEARCH_PRESENCE, filter),
    [filter],
  );

  return (
    <Panel
      title="Your Search Presence"
      action={
        <div className="-mr-1 flex min-w-max gap-1">
          {GSC_FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setFilter(f.id)}
              className={`shrink-0 rounded-lg px-2.5 py-1 font-mono-label text-[10px] uppercase tracking-wide transition-colors ${
                filter === f.id
                  ? "bg-[var(--cyan)]/20 text-[var(--cyan)]"
                  : "border border-white/10 bg-white/5 text-white/45 hover:text-white/70"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      }
    >
      <div className="-mx-4 overflow-x-auto px-4">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead>
            <tr className="border-b border-white/10 font-mono-label text-[10px] uppercase tracking-widest text-white/40">
              <th className="pb-2 pr-4 font-medium">Keyword</th>
              <th className="pb-2 pr-4 font-medium">Position</th>
              <th className="pb-2 pr-4 font-medium">Impressions</th>
              <th className="pb-2 pr-4 font-medium">Clicks</th>
              <th className="pb-2 pr-4 font-medium">CTR</th>
              <th className="pb-2 font-medium">Change</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((row) => (
              <tr key={row.id} className="border-b border-white/5">
                <td className="py-3 pr-4 font-medium text-white/85">{row.keyword}</td>
                <td className="py-3 pr-4">
                  <span
                    className={`font-mono-label text-sm font-semibold ${
                      row.position <= 10
                        ? "text-[var(--green)]"
                        : row.position <= 20
                          ? "text-[var(--yellow)]"
                          : "text-white/50"
                    }`}
                  >
                    {row.position}
                  </span>
                </td>
                <td className="py-3 pr-4 font-mono-label text-white/70">
                  {formatImpressions(row.impressions)}
                </td>
                <td className="py-3 pr-4 font-mono-label text-white/70">{row.clicks}</td>
                <td className="py-3 pr-4 font-mono-label text-white/70">{row.ctr}%</td>
                <td className="py-3">
                  <PositionChangeCell row={row} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Panel>
  );
}

function MonitoringKeywordsBar() {
  const { currentKeywords } = useApp();
  const keywords = currentKeywords.slice(0, 8);

  if (keywords.length === 0) return null;

  return (
    <div className="rounded-xl border border-[#1C2530] bg-[#0A0D12] px-4 py-3">
      <p className="font-mono-label text-[10px] uppercase tracking-widest text-white/40">
        Monitoring keywords
      </p>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {keywords.map((kw) => (
          <span
            key={kw}
            className="rounded-md bg-[var(--cyan)]/10 px-2 py-0.5 text-xs text-[var(--cyan)]"
          >
            {kw}
          </span>
        ))}
      </div>
    </div>
  );
}

function KeywordIntelligenceSection() {
  const { currentKeywords } = useApp();
  const rows = useMemo(() => {
    const prioritized = KEYWORD_INTELLIGENCE.filter((row) =>
      matchesKeyword(row.keyword, currentKeywords),
    );
    const rest = KEYWORD_INTELLIGENCE.filter(
      (row) => !matchesKeyword(row.keyword, currentKeywords),
    );
    return [...prioritized, ...rest];
  }, [currentKeywords]);

  return (
    <Panel title="Keyword Intelligence">
      <div className="-mx-4 mb-6 overflow-x-auto px-4">
        <table className="w-full min-w-[800px] text-left text-sm">
          <thead>
            <tr className="border-b border-white/10 font-mono-label text-[10px] uppercase tracking-widest text-white/40">
              <th className="pb-2 pr-4 font-medium">Keyword</th>
              <th className="pb-2 pr-4 font-medium">Volume</th>
              <th className="pb-2 pr-4 font-medium">Difficulty</th>
              <th className="pb-2 pr-4 font-medium">Intent</th>
              <th className="pb-2 pr-4 font-medium">Your pos</th>
              <th className="pb-2 font-medium">Top competitor</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const intent = INTENT_STYLES[row.intent];
              return (
                <tr key={row.id} className="border-b border-white/5">
                  <td className="py-3 pr-4 text-white/85">{row.keyword}</td>
                  <td className="py-3 pr-4 font-mono-label text-white/70">
                    {row.volume.toLocaleString()}
                  </td>
                  <td className="py-3 pr-4">
                    <span
                      className={`font-mono-label text-xs ${
                        row.difficulty >= 70
                          ? "text-[var(--red)]"
                          : row.difficulty >= 50
                            ? "text-[var(--yellow)]"
                            : "text-[var(--green)]"
                      }`}
                    >
                      {row.difficulty}
                    </span>
                  </td>
                  <td className="py-3 pr-4">
                    <span
                      className={`rounded px-2 py-0.5 font-mono-label text-[10px] uppercase ${intent.className}`}
                    >
                      {intent.label}
                    </span>
                  </td>
                  <td className="py-3 pr-4 font-mono-label text-white/70">
                    {row.yourPosition ?? "—"}
                  </td>
                  <td className="py-3 text-white/60">
                    {row.topCompetitor}{" "}
                    <span className="font-mono-label text-white/40">
                      (pos {row.competitorPosition})
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <p className="font-mono-label text-[10px] uppercase tracking-widest text-white/40">
            Rising queries
          </p>
          <ul className="mt-2 space-y-2">
            {RISING_QUERIES.map((q) => (
              <li
                key={q.query}
                className="flex items-center justify-between rounded-lg bg-white/[0.04] px-3 py-2"
              >
                <span className="text-sm text-white/75">{q.query}</span>
                <span className="font-mono-label text-xs text-[var(--green)]">{q.change}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="font-mono-label text-[10px] uppercase tracking-widest text-white/40">
            Competitor keyword gaps
          </p>
          <ul className="mt-2 space-y-2">
            {COMPETITOR_KEYWORD_GAPS.map((g) => (
              <li
                key={g.keyword}
                className="rounded-lg border border-[var(--purple)]/20 bg-[var(--purple)]/5 px-3 py-2"
              >
                <p className="text-sm font-medium text-white/85">{g.keyword}</p>
                <p className="mt-0.5 font-mono-label text-[10px] text-white/45">
                  {g.competitor} · pos {g.theirPosition} · {g.volume.toLocaleString()}/mo
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Panel>
  );
}

function AeoSection() {
  return (
    <Panel title="AI Overview + AEO">
      <div className="space-y-3">
        {AEO_QUERIES.map((q) => (
          <article
            key={q.id}
            className="rounded-xl border border-white/10 bg-white/[0.03] p-4"
          >
            <div className="flex flex-wrap items-start justify-between gap-2">
              <h3 className="font-heading text-sm font-semibold text-white">{q.query}</h3>
              <span
                className={`rounded px-2 py-0.5 font-mono-label text-[10px] uppercase ${
                  q.aiOverview
                    ? "bg-[var(--green)]/15 text-[var(--green)]"
                    : "bg-[var(--red)]/15 text-[var(--red)]"
                }`}
              >
                AI Overview {q.aiOverview ? "✓" : "✗"}
              </span>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <span
                className={`rounded px-2 py-0.5 font-mono-label text-[10px] ${
                  q.perplexity
                    ? "bg-[var(--cyan)]/15 text-[var(--cyan)]"
                    : "bg-white/10 text-white/40"
                }`}
              >
                Perplexity {q.perplexity ? "cited" : "not cited"}
              </span>
              <span
                className={`rounded px-2 py-0.5 font-mono-label text-[10px] ${
                  q.chatgpt
                    ? "bg-[var(--purple)]/15 text-[var(--purple)]"
                    : "bg-white/10 text-white/40"
                }`}
              >
                ChatGPT {q.chatgpt ? "mentioned" : "not mentioned"}
              </span>
            </div>
            <p className="mt-3 text-sm text-white/55">{q.recommendation}</p>
          </article>
        ))}
      </div>
    </Panel>
  );
}

function PaaSection() {
  return (
    <Panel title="People Also Ask">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {PAA_QUESTIONS.map((q) => (
          <article
            key={q.id}
            className="rounded-xl border border-white/10 bg-white/[0.03] p-4"
          >
            <p className="font-heading text-sm font-semibold text-white">{q.question}</p>
            <div className="mt-3 flex flex-wrap items-center gap-3 font-mono-label text-[10px] text-white/45">
              <span>{q.volume.toLocaleString()}/mo</span>
              <span>·</span>
              <span
                className={
                  q.contentExists ? "text-[var(--green)]" : "text-[var(--yellow)]"
                }
              >
                Content {q.contentExists ? "exists" : "missing"}
              </span>
              <span>·</span>
              <span className="text-[var(--cyan)]">Score {q.opportunityScore}</span>
            </div>
          </article>
        ))}
      </div>
    </Panel>
  );
}

function GoogleShoppingSection() {
  return (
    <Panel title="Google Shopping">
      <div className="-mx-4 overflow-x-auto px-4">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="border-b border-white/10 font-mono-label text-[10px] uppercase tracking-widest text-white/40">
              <th className="pb-2 pr-4 font-medium">Product</th>
              <th className="pb-2 pr-4 font-medium">Competitor</th>
              <th className="pb-2 pr-4 font-medium">Their price</th>
              <th className="pb-2 pr-4 font-medium">Your price</th>
              <th className="pb-2 pr-4 font-medium">Difference</th>
              <th className="pb-2 font-medium">Trend</th>
            </tr>
          </thead>
          <tbody>
            {SHOPPING_ROWS.map((row) => {
              const { diff, pct } = getShoppingDiff(row.theirPrice, row.yourPrice);
              return (
                <tr key={row.id} className="border-b border-white/5">
                  <td className="py-3 pr-4 text-white/80">{row.product}</td>
                  <td className="py-3 pr-4 text-white/60">{row.competitor}</td>
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
                  </td>
                  <td className="py-3">
                    <span
                      className={`font-mono-label text-xs ${
                        row.trend === "up"
                          ? "text-[var(--red)]"
                          : row.trend === "down"
                            ? "text-[var(--green)]"
                            : "text-white/40"
                      }`}
                    >
                      {row.trend === "up" ? "↑" : row.trend === "down" ? "↓" : "—"}
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

function DomainAuthoritySection() {
  const da = DOMAIN_AUTHORITY;

  return (
    <Panel title="Domain Authority">
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-lg bg-white/[0.04] px-4 py-3 text-center">
          <p className="font-mono-label text-[9px] uppercase tracking-widest text-white/35">
            DA score
          </p>
          <p className="mt-1 font-mono-label text-3xl font-semibold text-[var(--cyan)]">
            {da.score}
          </p>
        </div>
        <div className="rounded-lg bg-white/[0.04] px-4 py-3 text-center">
          <p className="font-mono-label text-[9px] uppercase tracking-widest text-white/35">
            Backlinks
          </p>
          <p className="mt-1 font-mono-label text-2xl font-semibold text-white">
            {da.backlinks.toLocaleString()}
          </p>
        </div>
        <div className="rounded-lg bg-white/[0.04] px-4 py-3 text-center">
          <p className="font-mono-label text-[9px] uppercase tracking-widest text-white/35">
            Referring domains
          </p>
          <p className="mt-1 font-mono-label text-2xl font-semibold text-white">
            {da.referringDomains.toLocaleString()}
          </p>
        </div>
      </div>
      <div className="mt-4">
        <div className="mb-2 flex items-center justify-between">
          <p className="font-mono-label text-[10px] uppercase tracking-widest text-white/40">
            12-month trend
          </p>
          <span className="font-mono-label text-xs text-[var(--green)]">{da.change}</span>
        </div>
        <Sparkline values={da.trend} />
      </div>
    </Panel>
  );
}

function GoogleTrendsSection() {
  const trends = GOOGLE_TRENDS;

  return (
    <Panel title="Google Trends">
      <TrendsChart months={trends.months} values={trends.values} />
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div>
          <p className="font-mono-label text-[10px] uppercase tracking-widest text-white/40">
            Related rising queries
          </p>
          <ul className="mt-2 space-y-2">
            {trends.risingQueries.map((q) => (
              <li
                key={q.query}
                className="flex items-center justify-between rounded-lg bg-white/[0.04] px-3 py-2"
              >
                <span className="text-sm text-white/75">{q.query}</span>
                <span className="font-mono-label text-xs text-[var(--green)]">{q.change}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-lg border border-[var(--yellow)]/25 bg-[var(--yellow)]/5 p-3">
          <p className="font-mono-label text-[10px] uppercase tracking-widest text-[var(--yellow)]">
            Seasonal pattern
          </p>
          <p className="mt-2 text-sm leading-relaxed text-white/70">{trends.seasonalCallout}</p>
        </div>
      </div>
    </Panel>
  );
}

function DetailSidebar() {
  const { topOpportunity, biggestThreat, contentGaps } = SIDEBAR_INSIGHTS;

  return (
    <aside className="flex flex-col gap-4 lg:gap-6">
      <Panel title="SEO Health">
        <div className="flex flex-col items-center gap-3">
          <SeoHealthScoreRing score={SEO_HEALTH_SCORE.score} size={96} />
          <p className="text-center text-sm text-white/50">{SEO_HEALTH_SCORE.label}</p>
          <p
            className={`font-mono-label text-sm ${
              SEO_HEALTH_SCORE.trend === "up" ? "text-[var(--green)]" : "text-[var(--red)]"
            }`}
          >
            {SEO_HEALTH_SCORE.trend === "up" ? "↑" : "↓"} {SEO_HEALTH_SCORE.change} vs last
            month
          </p>
        </div>
      </Panel>

      <Panel title="Top Opportunity">
        <p className="font-heading text-sm font-semibold text-[var(--green)]">
          {topOpportunity.keyword}
        </p>
        <p className="mt-1 text-sm text-white/55">{topOpportunity.detail}</p>
      </Panel>

      <Panel title="Biggest Ranking Threat">
        <p className="font-heading text-sm font-semibold text-[var(--red)]">
          {biggestThreat.keyword}
        </p>
        <p className="mt-1 text-sm text-white/55">{biggestThreat.detail}</p>
      </Panel>

      <Panel title="AI Presence">
        <p className="font-heading text-sm font-semibold text-white">{AI_PRESENCE.label}</p>
        <div className="mt-3">
          <AiPresenceDots appearing={AI_PRESENCE.appearing} tracked={AI_PRESENCE.tracked} />
        </div>
      </Panel>

      <Panel title="Content Gaps">
        <ul className="space-y-3">
          {contentGaps.map((gap) => (
            <li
              key={gap.id}
              className={`rounded-lg border px-3 py-2.5 ${
                gap.priority === "high"
                  ? "border-[var(--cyan)]/25 bg-[var(--cyan)]/5"
                  : "border-white/10 bg-white/[0.03]"
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <p className="font-heading text-sm font-semibold text-white">{gap.topic}</p>
                <span
                  className={`rounded px-1.5 py-0.5 font-mono-label text-[9px] uppercase ${
                    gap.priority === "high"
                      ? "bg-[var(--cyan)]/15 text-[var(--cyan)]"
                      : "bg-white/10 text-white/45"
                  }`}
                >
                  {gap.priority}
                </span>
              </div>
              <p className="mt-1 text-xs text-white/50">{gap.reason}</p>
            </li>
          ))}
        </ul>
      </Panel>
    </aside>
  );
}

function DetailView() {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-6">
      <div className="space-y-4 lg:col-span-2 lg:space-y-6">
        <MonitoringKeywordsBar />
        {/* INTEGRATION: google_search_console */}
        {/* Toggle: Settings > Integrations > Google Search Console */}
        {/* When OFF: hide this entire section */}
        {/* When ON: replace mock data with real API data */}
        <IntegrationSection integration="google_search_console">
          <SearchPresenceSection />
        </IntegrationSection>

        {/* INTEGRATION: dataforseo */}
        {/* Toggle: Settings > Integrations > DataForSEO */}
        {/* When OFF: hide this entire section */}
        {/* When ON: replace mock data with real API data */}
        <IntegrationSection integration="dataforseo">
          <KeywordIntelligenceSection />
        </IntegrationSection>

        <IntegrationSection integration="dataforseo">
          <AeoSection />
        </IntegrationSection>

        <IntegrationSection integration="dataforseo">
          <PaaSection />
        </IntegrationSection>

        <IntegrationSection integration="dataforseo">
          <GoogleShoppingSection />
        </IntegrationSection>

        {/* INTEGRATION: apify */}
        {/* Toggle: Settings > Integrations > Apify */}
        {/* When OFF: hide this entire section */}
        {/* When ON: replace mock data with real API data */}
        <IntegrationSection integration="apify">
          <DomainAuthoritySection />
        </IntegrationSection>

        {/* INTEGRATION: google_trends */}
        {/* Toggle: Settings > Integrations > Google Trends */}
        {/* When OFF: hide this entire section */}
        {/* When ON: replace mock data with real API data */}
        <IntegrationSection integration="google_trends">
          <GoogleTrendsSection />
        </IntegrationSection>
      </div>
      <DetailSidebar />
    </div>
  );
}

export function SeoIntel({ variant }: SeoIntelProps) {
  if (variant === "summary") {
    return <SummaryView />;
  }
  return <DetailView />;
}
