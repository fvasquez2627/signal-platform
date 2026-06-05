"use client";

import { IntegrationSection } from "@/components/integrations/integration-section";
import {
  AI_PATTERN_STATS,
  META_AD_INTEL,
  TIKTOK_ADS,
  TIKTOK_SHOP_TRENDS,
} from "@/components/signals/mock-data-extras";

function Panel({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-white/10 bg-white/[0.02]">
      <h2 className="border-b border-white/10 px-4 py-3 font-heading text-sm font-semibold text-white">
        {title}
      </h2>
      <div className="p-4">{children}</div>
    </section>
  );
}

function Badge({ label, color }: { label: string; color: string }) {
  return (
    <span
      className={`rounded px-2 py-0.5 font-mono-label text-[10px] uppercase ${color}`}
    >
      {label}
    </span>
  );
}

export function SignalsIntelExtras() {
  return (
    <div className="space-y-6">
      {/* INTEGRATION: tiktok_commercial_api — Toggle: Settings > Integrations > TikTok Commercial Content API */}
      <IntegrationSection integration="tiktok_commercial_api">
        <Panel title="TikTok Ad Intelligence">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {TIKTOK_ADS.map((ad) => (
              <article
                key={ad.id}
                className="rounded-xl border border-[var(--cyan)]/30 bg-white/[0.03] p-4"
              >
                <div className="mb-3 flex h-28 items-center justify-center rounded-lg border border-[var(--cyan)]/40 bg-[var(--cyan)]/5">
                  <span className="font-mono-label text-xs text-[var(--cyan)]">
                    Video thumbnail
                  </span>
                </div>
                <p className="font-heading text-sm font-semibold text-white">
                  {ad.advertiser}
                </p>
                <p className="font-mono-label text-[10px] text-white/40">{ad.handle}</p>
                <p className="mt-2 text-xs text-white/50">
                  First shown {ad.firstShown} · Last shown {ad.lastShown}
                </p>
                <p className="mt-1 font-mono-label text-xs text-[var(--cyan)]">
                  Reach: {ad.reach}
                </p>
                <p className="text-xs text-white/55">{ad.demographics}</p>
                <p className="mt-2 text-xs text-[var(--yellow)]">{ad.daysRunning}</p>
                <p className="mt-2 text-sm italic text-white/70">
                  &ldquo;{ad.hook}&rdquo;
                </p>
                <div className="mt-2 flex flex-wrap gap-1">
                  <Badge label={ad.hookType} color="bg-[var(--green)]/15 text-[var(--green)]" />
                  <Badge label={ad.format} color="bg-[var(--purple)]/15 text-[var(--purple)]" />
                  <Badge label={ad.cta} color="bg-[var(--cyan)]/15 text-[var(--cyan)]" />
                </div>
              </article>
            ))}
          </div>
        </Panel>

        <Panel title="TikTok Shop Trends">
          <ul className="space-y-3">
            {TIKTOK_SHOP_TRENDS.map((t) => (
              <li
                key={t.product}
                className="flex items-center justify-between rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3"
              >
                <div>
                  <p className="text-sm font-medium text-white">{t.product}</p>
                  <p className="text-xs text-white/45">{t.category}</p>
                </div>
                <span className="font-mono-label text-sm text-[var(--green)]">
                  {t.velocity}
                </span>
              </li>
            ))}
          </ul>
        </Panel>
      </IntegrationSection>

      {/* INTEGRATION: meta_ad_library_full */}
      <IntegrationSection integration="meta_ad_library_full">
        <Panel title="Meta Ad Intelligence">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {META_AD_INTEL.map((ad) => (
              <article
                key={ad.id}
                className="rounded-xl border border-white/10 bg-white/[0.03] p-4"
              >
                <p className="font-heading text-sm font-semibold text-white">
                  {ad.competitor}
                </p>
                <p className="mt-2 text-sm italic text-white/70">&ldquo;{ad.copy}&rdquo;</p>
                <div className="mt-2 flex flex-wrap gap-2 font-mono-label text-[10px] text-white/45">
                  <span>{ad.spendRange}</span>
                  <span>·</span>
                  <span>{ad.daysRunning}d running</span>
                </div>
                <div className="mt-2 flex gap-1">
                  {ad.platforms.map((p) => (
                    <span
                      key={p}
                      className="rounded bg-[var(--purple)]/15 px-2 py-0.5 text-[10px] text-[var(--purple)]"
                    >
                      {p}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </Panel>
      </IntegrationSection>

      {/* INTEGRATION: ai_analysis */}
      <IntegrationSection integration="ai_analysis">
        <Panel title="AI Pattern Analysis">
          <p className="font-mono-label text-xs text-white/45">
            Analyzed {AI_PATTERN_STATS.totalAds} competitor ads this week
          </p>
          <div className="mt-4 space-y-3">
            {AI_PATTERN_STATS.hookPatterns.map((h) => (
              <div key={h.label}>
                <div className="flex justify-between text-xs text-white/60">
                  <span>{h.label}</span>
                  <span className="font-mono-label">{h.pct}%</span>
                </div>
                <div className="mt-1 h-2 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-[var(--cyan)]"
                    style={{ width: `${h.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
            <div className="rounded-lg bg-white/[0.04] p-3">
              <p className="font-mono-label text-[9px] uppercase text-white/40">
                Avg video length
              </p>
              <p className="mt-1 text-sm font-semibold text-white">
                {AI_PATTERN_STATS.avgVideoLength}
              </p>
            </div>
            <div className="rounded-lg bg-white/[0.04] p-3">
              <p className="font-mono-label text-[9px] uppercase text-white/40">Top CTA</p>
              <p className="mt-1 text-sm text-white/80">{AI_PATTERN_STATS.topCta}</p>
            </div>
            <div className="rounded-lg bg-white/[0.04] p-3">
              <p className="font-mono-label text-[9px] uppercase text-white/40">
                Top format
              </p>
              <p className="mt-1 text-sm text-white/80">{AI_PATTERN_STATS.topFormat}</p>
            </div>
          </div>
        </Panel>
      </IntegrationSection>
    </div>
  );
}
