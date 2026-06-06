"use client";

import Link from "next/link";
import {
  CATEGORY_GAPS,
  FORMAT_BREAKDOWN,
  FORMAT_INTEL,
  HOOK_INTELLIGENCE,
  LONG_RUNNING_ADS,
  SPEND_INSIGHT,
  SPEND_INTELLIGENCE,
  type CategoryGap,
  type LongRunningAd,
} from "@/components/competitive/mock-data";

function Panel({
  title,
  action,
  children,
  className = "",
}: {
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
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

function BreakdownBar({ label, pct }: { label: string; pct: number }) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between gap-2 text-xs">
        <span className="text-white/70">{label}</span>
        <span className="font-mono-label text-white/45">{pct}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-[var(--cyan)]"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

function SpendBar({ name, spend, amountK, isYou }: { name: string; spend: string; amountK: number; isYou?: boolean }) {
  const maxK = 84;
  return (
    <div>
      <div className="mb-1 flex items-center justify-between gap-2 text-xs">
        <span className={isYou ? "font-medium text-[var(--cyan)]" : "text-white/70"}>
          {name}
        </span>
        <span className={`font-mono-label ${isYou ? "text-[var(--cyan)]" : "text-white/45"}`}>
          {spend}
          {isYou && " (estimated)"}
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-white/10">
        <div
          className={`h-full rounded-full ${isYou ? "bg-[var(--cyan)]" : "bg-[var(--purple)]/60"}`}
          style={{ width: `${(amountK / maxK) * 100}%` }}
        />
      </div>
    </div>
  );
}

function GapCard({ gap }: { gap: CategoryGap }) {
  const badgeClass =
    gap.level === "high"
      ? "bg-[var(--green)]/15 text-[var(--green)]"
      : "bg-[var(--yellow)]/15 text-[var(--yellow)]";

  return (
    <article className="rounded-lg border border-white/10 bg-white/[0.03] p-3">
      <span
        className={`rounded px-2 py-0.5 font-mono-label text-[10px] uppercase tracking-wide ${badgeClass}`}
      >
        {gap.level === "high" ? "High opportunity" : "Medium opportunity"}
      </span>
      <h4 className="mt-2 font-heading text-sm font-semibold text-white">{gap.title}</h4>
      <p className="mt-1 text-sm leading-relaxed text-white/55">{gap.description}</p>
      <Link
        href={gap.contentHref}
        className="mt-3 inline-block rounded-lg bg-[var(--cyan)]/10 px-3 py-1.5 text-xs font-semibold text-[var(--cyan)] transition-colors hover:bg-[var(--cyan)]/20"
      >
        {gap.actionLabel}
      </Link>
    </article>
  );
}

function LongRunningAdCard({ ad }: { ad: LongRunningAd }) {
  return (
    <article className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h4 className="font-heading text-sm font-semibold text-white">{ad.competitor}</h4>
        <span className="rounded bg-[var(--green)]/15 px-2 py-0.5 font-mono-label text-[10px] text-[var(--green)]">
          Running {ad.daysRunning} days
        </span>
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
      <p className="mt-2 text-sm italic text-white/70">&ldquo;{ad.hook}&rdquo;</p>
      <p className="mt-1 font-mono-label text-[10px] text-white/45">{ad.format}</p>
      <p className="mt-1 font-mono-label text-xs text-white/50">Reach: {ad.reach}</p>
      <p className="mt-2 text-sm text-white/60">
        <span className="font-medium text-white/75">Why it&apos;s working:</span>{" "}
        {ad.whyWorking}
      </p>
      <Link
        href="/content?tab=tiktok"
        className="mt-3 inline-block rounded-lg border border-[var(--purple)]/40 bg-[var(--purple)]/10 px-3 py-2 text-xs font-semibold text-[var(--purple)] transition-opacity hover:opacity-90"
      >
        Study This Format →
      </Link>
    </article>
  );
}

export function WhatsWinningNowPanel() {
  return (
    <section className="space-y-4">
      <div className="rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="font-heading text-sm font-semibold tracking-wide text-white">
            What&apos;s Winning Right Now
          </h2>
          <span className="rounded bg-white/5 px-2 py-0.5 font-mono-label text-[9px] text-white/40">
            {/* INTEGRATION: tiktok_commercial_api + ai_analysis */}
            // INTEGRATION: tiktok_commercial_api + ai_analysis
          </span>
        </div>
        <p className="mt-1 text-xs text-white/45">
          Last 7 days — pattern analysis across 89 competitor ads
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-6">
        <div className="space-y-4">
          <Panel title="Top Performing Format">
            <p className="font-mono-label text-[10px] uppercase tracking-widest text-[var(--green)]">
              Winning format this week
            </p>
            <p className="mt-2 font-heading text-2xl font-bold text-white">
              {FORMAT_INTEL.winningFormat}
            </p>
            <p className="mt-0.5 text-sm text-white/50">
              {FORMAT_INTEL.winningPct}% of top performing ads
            </p>

            <div className="mt-4 space-y-2.5">
              {FORMAT_BREAKDOWN.map((row) => (
                <BreakdownBar key={row.label} label={row.label} pct={row.pct} />
              ))}
            </div>

            <div className="mt-4 grid grid-cols-1 gap-2 border-t border-white/10 pt-4 sm:grid-cols-3">
              <div>
                <p className="font-mono-label text-[9px] uppercase text-white/35">Avg length</p>
                <p className="mt-0.5 text-xs text-white/75">{FORMAT_INTEL.avgLength}</p>
              </div>
              <div>
                <p className="font-mono-label text-[9px] uppercase text-white/35">Top hook type</p>
                <p className="mt-0.5 text-xs text-white/75">{FORMAT_INTEL.topHookType}</p>
              </div>
              <div>
                <p className="font-mono-label text-[9px] uppercase text-white/35">Top CTA</p>
                <p className="mt-0.5 text-xs text-white/75">{FORMAT_INTEL.topCta}</p>
              </div>
            </div>

            <div className="mt-4 rounded-lg border border-[var(--cyan)]/30 bg-[var(--cyan)]/5 px-3 py-2.5">
              <p className="text-sm leading-relaxed text-white/75">{FORMAT_INTEL.insight}</p>
            </div>

            <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-white/50">{FORMAT_INTEL.draftReadyLabel}</p>
              <Link
                href={FORMAT_INTEL.draftHref}
                className="shrink-0 rounded-lg bg-[var(--cyan)] px-4 py-2 text-center text-xs font-semibold text-[var(--bg)] transition-opacity hover:opacity-90"
              >
                Review Draft →
              </Link>
            </div>
          </Panel>

          <Panel title="Spending Intelligence">
            <p className="-mt-1 mb-4 font-mono-label text-[10px] uppercase tracking-widest text-white/40">
              Active ad spend this week
            </p>
            <div className="space-y-3">
              {SPEND_INTELLIGENCE.map((row) => (
                <SpendBar
                  key={row.name}
                  name={row.name}
                  spend={row.spend}
                  amountK={row.amountK}
                  isYou={row.isYou}
                />
              ))}
            </div>
            <p className="mt-4 rounded-lg bg-[var(--red)]/10 px-3 py-2 text-xs text-white/65">
              {SPEND_INSIGHT}
            </p>
          </Panel>
        </div>

        <Panel title="Gaps Nobody Is Owning">
          <p className="-mt-1 mb-4 font-mono-label text-[10px] uppercase tracking-widest text-white/40">
            Unclaimed angles in your category
          </p>
          <div className="space-y-3">
            {CATEGORY_GAPS.map((gap) => (
              <GapCard key={gap.id} gap={gap} />
            ))}
          </div>
        </Panel>
      </div>

      <Panel title="Hook Intelligence">
        <p className="-mt-1 mb-4 text-xs text-white/45">
          Extracted from 89 competitor ads via AI analysis
        </p>
        <div className="-mx-4 overflow-x-auto px-4">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-white/10 font-mono-label text-[10px] uppercase tracking-widest text-white/40">
                <th className="pb-2 pr-4 font-medium">Hook type</th>
                <th className="pb-2 pr-4 font-medium">% winning</th>
                <th className="pb-2 pr-4 font-medium">Avg reach</th>
                <th className="pb-2 pr-4 font-medium">Your coverage</th>
                <th className="pb-2 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {HOOK_INTELLIGENCE.map((row) => (
                <tr key={row.hookType} className="border-b border-white/5">
                  <td className="py-3 pr-4 text-white/80">{row.hookType}</td>
                  <td className="py-3 pr-4 font-mono-label text-white/60">{row.pctWinning}%</td>
                  <td className="py-3 pr-4 font-mono-label text-white/60">{row.avgReach}</td>
                  <td className="py-3 pr-4">
                    <span
                      className={
                        row.hasCoverage
                          ? "text-[var(--green)]"
                          : "text-[var(--red)]"
                      }
                    >
                      {row.hasCoverage ? "✓ Have it" : "✗ Gap"}
                    </span>
                  </td>
                  <td className="py-3">
                    <Link
                      href={row.contentHref}
                      className="text-xs font-semibold text-[var(--cyan)] hover:underline"
                    >
                      {row.actionLabel}
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </section>
  );
}

export function AdLongevityTracker() {
  return (
    <Panel
      title="Ad Longevity Tracker"
      action={
        <span className="font-mono-label text-[9px] text-white/35">
          {/* INTEGRATION: meta_ad_library_full + tiktok_commercial_api */}
          // INTEGRATION: meta_ad_library_full
        </span>
      }
    >
      <p className="-mt-1 mb-4 text-xs text-white/45">
        Ads running 60+ days (these are profitable — study them)
      </p>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {LONG_RUNNING_ADS.map((ad) => (
          <LongRunningAdCard key={ad.id} ad={ad} />
        ))}
      </div>
    </Panel>
  );
}
