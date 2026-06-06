"use client";

import { useState } from "react";
import { GOOGLE_DRAFT } from "@/components/content/mock-data";
import {
  CharCountBadge,
  CopyBlock,
  CopyButton,
  DraftActions,
  SignalBadges,
} from "@/components/content/content-studio-shared";

const HEADLINE_MAX = 30;
const DESC_MAX = 90;

export function GoogleDraftTab() {
  const [approvedSearch, setApprovedSearch] = useState(false);
  const [approvedDisplay, setApprovedDisplay] = useState(false);

  const allHeadlines = GOOGLE_DRAFT.headlines.join("\n");
  const allDescriptions = GOOGLE_DRAFT.descriptions.join("\n\n");

  return (
    <div className="space-y-5">
      <SignalBadges signalSource={GOOGLE_DRAFT.signalSource} bucket={GOOGLE_DRAFT.bucket} />

      <section className="space-y-4 rounded-xl border border-white/10 bg-white/[0.02] p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <p className="font-mono-label text-[10px] uppercase tracking-widest text-white/40">
              Search Ads
            </p>
            <p className="mt-1 font-heading text-sm font-semibold text-white">
              {GOOGLE_DRAFT.campaignLabel}
            </p>
          </div>
          <span className="rounded-md bg-[var(--green)]/15 px-2 py-0.5 font-mono-label text-[10px] uppercase text-[var(--green)]">
            Ad Strength: {GOOGLE_DRAFT.adStrength}
          </span>
        </div>

        <div>
          <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
            <p className="font-mono-label text-[10px] uppercase tracking-widest text-[var(--green)]">
              Headlines (15)
            </p>
            <CopyButton text={allHeadlines} label="Copy All Headlines" />
          </div>
          <ul className="max-h-64 space-y-1.5 overflow-y-auto">
            {GOOGLE_DRAFT.headlines.map((h, i) => (
              <li
                key={h}
                className="flex items-center justify-between gap-2 rounded bg-white/[0.03] px-2 py-1.5"
              >
                <span className={`text-sm ${h.length > HEADLINE_MAX ? "text-[var(--red)]" : "text-white/75"}`}>
                  {i + 1}. {h}
                </span>
                <CharCountBadge count={h.length} max={HEADLINE_MAX} />
              </li>
            ))}
          </ul>
        </div>

        <div>
          <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
            <p className="font-mono-label text-[10px] uppercase tracking-widest text-[var(--cyan)]">
              Descriptions (4)
            </p>
            <CopyButton text={allDescriptions} label="Copy All Descriptions" />
          </div>
          <ul className="space-y-2">
            {GOOGLE_DRAFT.descriptions.map((d, i) => (
              <li key={d} className="rounded-lg bg-white/[0.03] px-3 py-2">
                <div className="flex items-start justify-between gap-2">
                  <p className={`text-sm ${d.length > DESC_MAX ? "text-[var(--red)]" : "text-white/75"}`}>
                    {i + 1}. {d}
                  </p>
                  <CharCountBadge count={d.length} max={DESC_MAX} />
                </div>
              </li>
            ))}
          </ul>
        </div>

        <p className="font-mono-label text-xs text-white/45">
          Display URL ·{" "}
          <span className="text-[var(--cyan)]">{GOOGLE_DRAFT.displayUrl}</span>
        </p>
      </section>

      <section className="space-y-3 rounded-xl border border-white/10 bg-white/[0.02] p-4">
        <p className="font-mono-label text-[10px] uppercase tracking-widest text-white/40">
          Display Ads
        </p>
        <CopyBlock label="Short Headline" text={GOOGLE_DRAFT.display.shortHeadline} accent="text-[var(--green)]" />
        <CopyBlock label="Long Headline" text={GOOGLE_DRAFT.display.longHeadline} accent="text-[var(--cyan)]" />
        <CopyBlock label="Description" text={GOOGLE_DRAFT.display.description} accent="text-[var(--purple)]" />
      </section>

      <section className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
        <p className="font-mono-label text-[10px] uppercase tracking-widest text-white/40">
          Keyword Recommendations
        </p>
        <ul className="mt-3 space-y-2">
          {GOOGLE_DRAFT.keywords.map((kw) => (
            <li
              key={kw.term}
              className="flex flex-wrap items-center justify-between gap-2 rounded-lg bg-white/[0.03] px-3 py-2"
            >
              <span className="text-sm text-white/75">{kw.term}</span>
              <div className="flex flex-wrap gap-1.5">
                <span className="rounded bg-[var(--purple)]/15 px-1.5 py-0.5 font-mono-label text-[9px] uppercase text-[var(--purple)]">
                  {kw.match}
                </span>
                <span
                  className={`rounded px-1.5 py-0.5 font-mono-label text-[9px] uppercase ${
                    kw.volume === "High"
                      ? "bg-[var(--green)]/15 text-[var(--green)]"
                      : kw.volume === "Medium"
                        ? "bg-[var(--yellow)]/15 text-[var(--yellow)]"
                        : "bg-white/10 text-white/50"
                  }`}
                >
                  {kw.volume}
                </span>
                <CopyButton text={kw.term} />
              </div>
            </li>
          ))}
        </ul>
      </section>

      <DraftActions
        extraActions={
          <>
            <button
              type="button"
              onClick={() => setApprovedSearch(true)}
              disabled={approvedSearch}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${
                approvedSearch
                  ? "bg-[var(--green)] text-[var(--bg)]"
                  : "border border-[var(--green)]/40 text-[var(--green)] hover:bg-[var(--green)]/10"
              }`}
            >
              {approvedSearch ? "Search Approved ✓" : "Approve Search"}
            </button>
            <button
              type="button"
              onClick={() => setApprovedDisplay(true)}
              disabled={approvedDisplay}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${
                approvedDisplay
                  ? "bg-[var(--green)] text-[var(--bg)]"
                  : "border border-[var(--green)]/40 text-[var(--green)] hover:bg-[var(--green)]/10"
              }`}
            >
              {approvedDisplay ? "Display Approved ✓" : "Approve Display"}
            </button>
          </>
        }
        approveLabel="Approve All"
        onApprove={() => {
          setApprovedSearch(true);
          setApprovedDisplay(true);
        }}
        approved={approvedSearch && approvedDisplay}
      />
    </div>
  );
}
