"use client";

import { IntegrationSection } from "@/components/integrations/integration-section";
import {
  AMAZON_BSR,
  CREATIVE_PATTERNS,
  INSTAGRAM_REELS,
  TIKTOK_AD_LIBRARY,
} from "@/components/competitive/mock-data-extras";

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-xl border border-white/10 bg-white/[0.02]">
      <h2 className="border-b border-white/10 px-4 py-3 font-heading text-sm font-semibold text-white">
        {title}
      </h2>
      <div className="p-4">{children}</div>
    </section>
  );
}

export function CompetitiveExtras() {
  return (
    <div className="space-y-6">
      {/* INTEGRATION: tiktok_commercial_api */}
      <IntegrationSection integration="tiktok_commercial_api">
        <Panel title="TikTok Ad Library">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {TIKTOK_AD_LIBRARY.map((ad) => (
              <article
                key={ad.id}
                className="rounded-xl border border-[var(--cyan)]/25 bg-white/[0.03] p-4"
              >
                <div className="mb-3 flex h-24 items-center justify-center rounded-lg border border-[var(--cyan)]/30 bg-[var(--cyan)]/5 text-xs text-[var(--cyan)]">
                  Video thumbnail
                </div>
                <p className="font-heading text-sm font-semibold text-white">
                  {ad.advertiser}
                </p>
                <p className="mt-1 text-sm italic text-white/65">&ldquo;{ad.hook}&rdquo;</p>
                <p className="mt-2 font-mono-label text-[10px] text-white/45">
                  Reach: {ad.reach}
                </p>
                <span className="mt-1 inline-block rounded bg-[var(--yellow)]/15 px-2 py-0.5 font-mono-label text-[10px] text-[var(--yellow)]">
                  {ad.daysRunning}
                </span>
                <p className="mt-2 text-xs text-white/50">{ad.demographics}</p>
                <div className="mt-2 flex flex-wrap gap-1">
                  <span className="rounded bg-[var(--green)]/15 px-2 py-0.5 font-mono-label text-[9px] text-[var(--green)]">
                    {ad.hookType}
                  </span>
                  <span className="rounded bg-[var(--purple)]/15 px-2 py-0.5 font-mono-label text-[9px] text-[var(--purple)]">
                    {ad.format}
                  </span>
                </div>
                <button
                  type="button"
                  className="mt-3 w-full rounded-lg border border-[var(--cyan)]/40 py-1.5 text-xs text-[var(--cyan)] hover:bg-[var(--cyan)]/10"
                >
                  View Ad
                </button>
              </article>
            ))}
          </div>
        </Panel>
      </IntegrationSection>

      {/* INTEGRATION: ai_analysis */}
      <IntegrationSection integration="ai_analysis">
        <Panel title="Creative Pattern Analysis">
          <p className="text-sm text-white/55">
            Last 30 days — {CREATIVE_PATTERNS.totalAnalyzed} competitor ads analyzed
          </p>
          <div className="mt-4 space-y-3">
            {CREATIVE_PATTERNS.hookBreakdown.map((h) => (
              <div key={h.label}>
                <div className="flex justify-between text-xs">
                  <span className="text-white/60">{h.label}</span>
                  <span className="font-mono-label text-white/45">{h.pct}%</span>
                </div>
                <div className="mt-1 h-2 rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-[var(--purple)]"
                    style={{ width: `${h.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
          <p className="mt-4 text-sm text-white/55">
            Winning video length: {CREATIVE_PATTERNS.videoLength}
          </p>
          <p className="text-sm text-white/55">
            Most common CTA: &ldquo;{CREATIVE_PATTERNS.commonCta}&rdquo;
          </p>
          <div className="mt-4 rounded-xl border border-[var(--cyan)]/30 bg-[var(--cyan)]/5 p-4">
            <p className="font-mono-label text-[10px] uppercase text-[var(--cyan)]">
              Your gap
            </p>
            <p className="mt-1 text-sm text-white/80">{CREATIVE_PATTERNS.gapInsight}</p>
          </div>
        </Panel>
      </IntegrationSection>

      {/* INTEGRATION: apify */}
      <IntegrationSection integration="apify">
        <Panel title="Amazon">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[480px] text-left text-sm">
              <thead>
                <tr className="font-mono-label text-[10px] uppercase text-white/40">
                  <th className="pb-2">Product</th>
                  <th className="pb-2">Competitor</th>
                  <th className="pb-2">BSR</th>
                  <th className="pb-2">Sentiment</th>
                </tr>
              </thead>
              <tbody>
                {AMAZON_BSR.map((row) => (
                  <tr key={row.product} className="border-t border-white/5">
                    <td className="py-2 text-white/75">{row.product}</td>
                    <td className="py-2 text-white/55">{row.competitor}</td>
                    <td className="py-2 font-mono-label">#{row.bsr}</td>
                    <td className={`py-2 font-mono-label text-xs ${row.sentimentColor}`}>
                      {row.sentiment}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>

        <Panel title="Instagram">
          <ul className="space-y-3">
            {INSTAGRAM_REELS.map((r) => (
              <li
                key={r.competitor}
                className="flex items-center justify-between rounded-lg bg-white/[0.03] px-3 py-2"
              >
                <span className="text-sm text-white/75">{r.competitor}</span>
                <div className="text-right">
                  <p className="font-mono-label text-sm text-white">{r.avgViews}</p>
                  <p className="font-mono-label text-[10px] text-[var(--green)]">
                    {r.change}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </Panel>
      </IntegrationSection>
    </div>
  );
}
