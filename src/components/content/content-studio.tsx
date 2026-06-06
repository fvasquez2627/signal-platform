"use client";

import { useMemo, useState, type ReactNode } from "react";
import { useApp } from "@/context/app-context";
import { AiPromptsDraftTab } from "@/components/content/ai-prompts-draft-tab";
import {
  CopyBlock,
  DraftActions,
  Panel,
  SignalBadges,
} from "@/components/content/content-studio-shared";
import { GoogleDraftTab } from "@/components/content/google-draft-tab";
import { MetaDraftTab } from "@/components/content/meta-draft-tab";
import {
  ACTIVE_DRAFT,
  BUCKET_HEALTH,
  BUCKET_STATUS_STYLES,
  CONTENT_BUCKETS,
  DRAFT_HISTORY,
  DRAFT_STATUS_STYLES,
  GENERATION_STATS,
  PLATFORM_TABS,
  SUMMARY,
  TIKTOK_DRAFT,
  type ContentBucket,
  type HistoryStatusFilter,
  type PlatformTab,
} from "@/components/content/mock-data";
import { SparkAdDraftTab } from "@/components/content/spark-ad-draft-tab";

type ContentStudioProps = {
  variant: "summary" | "detail";
};

function ToggleSwitch({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (next: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
        checked ? "bg-[var(--cyan)]" : "bg-white/15"
      }`}
    >
      <span
        className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
          checked ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
  );
}

function personalizeCopy(
  text: string,
  clientName: string,
  productName: string,
  benefit: string,
): string {
  const product = productName === "All Products" ? "wellness supplements" : productName;
  return text
    .replace(/YouTheory/g, clientName)
    .replace(/Collagen Peptides/g, product)
    .replace(/collagen peptides/gi, product.toLowerCase())
    .replace(
      /Skin elasticity, joint support, hair and nail strength/g,
      benefit,
    );
}

function SummaryView() {
  const [approved, setApproved] = useState(false);
  const { selectedProduct, selectedClient, currentBenefit } = useApp();
  const productName = selectedProduct?.name ?? "All Products";
  const clientName = selectedClient?.name ?? "YouTheory";

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
        <p className="font-mono-label text-[10px] uppercase tracking-widest text-white/40">
          Draft pipeline
        </p>
        <p className="mt-2 font-heading text-2xl font-bold text-white">
          {SUMMARY.draftsAwaitingReview}
          <span className="text-base font-normal text-white/45"> drafts awaiting review</span>
        </p>
        <p className="mt-1 font-mono-label text-xs text-white/45">
          Last generated · {SUMMARY.lastGenerated}
        </p>
      </div>

      <Panel
        title="Top Draft Preview"
        action={
          <span className="rounded-md bg-[var(--cyan)]/15 px-2 py-0.5 font-mono-label text-[10px] uppercase tracking-wide text-[var(--cyan)]">
            {SUMMARY.bucket}
          </span>
        }
      >
        <p className="font-mono-label text-[10px] uppercase tracking-widest text-[var(--green)]">
          Hook
        </p>
        <p className="mt-1.5 text-sm leading-relaxed text-white/80">
          {personalizeCopy(SUMMARY.topHook, clientName, productName, currentBenefit)}
        </p>
        <p className="mt-3 font-mono-label text-[10px] text-white/35">
          Source · {SUMMARY.signalSource}
        </p>
        <div className="mt-4">
          <DraftActions
            approveLabel="Quick Approve"
            onApprove={() => setApproved(true)}
            approved={approved}
          />
        </div>
      </Panel>
    </div>
  );
}

function BucketCard({
  bucket,
  onToggle,
  onNotesChange,
}: {
  bucket: ContentBucket;
  onToggle: (id: string, enabled: boolean) => void;
  onNotesChange: (id: string, notes: string) => void;
}) {
  return (
    <div
      className={`rounded-lg border px-4 py-3 transition-colors ${
        bucket.enabled
          ? "border-[var(--cyan)]/25 bg-[var(--cyan)]/5"
          : "border-white/10 bg-white/[0.02]"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-heading text-sm font-semibold text-white">{bucket.name}</p>
            <span
              className={`rounded px-2 py-0.5 font-mono-label text-[10px] uppercase tracking-wide ${BUCKET_STATUS_STYLES[bucket.status]}`}
            >
              {bucket.status}
            </span>
          </div>
          <p className="mt-1 font-mono-label text-[10px] uppercase tracking-wide text-white/40">
            {bucket.signalSource}
          </p>
          <p className="mt-1.5 text-sm text-white/60">{bucket.rationale}</p>
          <p className="mt-1 font-mono-label text-xs text-white/45">
            {bucket.piecesSuggested} piece{bucket.piecesSuggested !== 1 ? "s" : ""} suggested
          </p>
          {bucket.complianceNote && (
            <p className="mt-2 rounded-md border border-[var(--yellow)]/30 bg-[var(--yellow)]/10 px-2 py-1 text-xs text-[var(--yellow)]">
              {bucket.complianceNote}
            </p>
          )}
        </div>
        <ToggleSwitch
          checked={bucket.enabled}
          onChange={(next) => onToggle(bucket.id, next)}
          label={`Toggle ${bucket.name}`}
        />
      </div>
      <label className="mt-3 block">
        <span className="font-mono-label text-[10px] uppercase tracking-widest text-white/35">
          Direction notes
        </span>
        <textarea
          value={bucket.notes}
          onChange={(e) => onNotesChange(bucket.id, e.target.value)}
          placeholder="Add creative direction…"
          rows={2}
          className="mt-1 w-full resize-none rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white placeholder:text-white/25 focus:border-[var(--cyan)]/40 focus:outline-none"
        />
      </label>
    </div>
  );
}

function ContentAnglesSection() {
  const { currentAngles, selectedProduct } = useApp();

  if (currentAngles.length === 0) return null;

  return (
    <Panel title="Content Angles">
      <p className="mb-3 text-sm text-white/50">
        Recommended angles for {selectedProduct?.name ?? "this product"}
      </p>
      <div className="flex flex-wrap gap-2">
        {currentAngles.map((angle) => (
          <span
            key={angle}
            className="rounded-lg border border-[var(--cyan)]/25 bg-[var(--cyan)]/10 px-3 py-1.5 text-sm text-[var(--cyan)]"
          >
            {angle}
          </span>
        ))}
      </div>
    </Panel>
  );
}

function ContentBucketsSection() {
  const { selectedProduct } = useApp();
  const [buckets, setBuckets] = useState(CONTENT_BUCKETS);

  const handleToggle = (id: string, enabled: boolean) => {
    setBuckets((prev) => prev.map((b) => (b.id === id ? { ...b, enabled } : b)));
  };

  const handleNotesChange = (id: string, notes: string) => {
    setBuckets((prev) => prev.map((b) => (b.id === id ? { ...b, notes } : b)));
  };

  return (
    <Panel title="Content Buckets">
      <p className="mb-4 text-sm text-white/50">
        AI-recommended content buckets for {selectedProduct?.name ?? "your product"} based on
        current signals. Toggle buckets on to include in the next agent run.
      </p>
      <div className="space-y-3">
        {buckets.map((bucket) => (
          <BucketCard
            key={bucket.id}
            bucket={bucket}
            onToggle={handleToggle}
            onNotesChange={handleNotesChange}
          />
        ))}
      </div>
    </Panel>
  );
}

function TikTokTab() {
  const { selectedClient, selectedProduct, currentBenefit } = useApp();
  const [approved, setApproved] = useState(false);
  const clientName = selectedClient?.name ?? "YouTheory";
  const productName = selectedProduct?.name ?? "Collagen Peptides";

  return (
    <div className="space-y-4">
      <SignalBadges signalSource={ACTIVE_DRAFT.signalSource} bucket={ACTIVE_DRAFT.bucket} />
      <CopyBlock
        label="Hook (0–3 sec)"
        text={personalizeCopy(TIKTOK_DRAFT.hook, clientName, productName, currentBenefit)}
        accent="text-[var(--green)]"
      />
      <CopyBlock
        label="Script body (3–25 sec)"
        text={personalizeCopy(TIKTOK_DRAFT.scriptBody, clientName, productName, currentBenefit)}
        accent="text-[var(--cyan)]"
        multiline
      />
      <CopyBlock
        label="CTA"
        text={personalizeCopy(TIKTOK_DRAFT.cta, clientName, productName, currentBenefit)}
        accent="text-[var(--purple)]"
      />
      <div className="rounded-lg border border-[var(--cyan)]/20 bg-[var(--cyan)]/5 px-4 py-3">
        <p className="font-mono-label text-[10px] uppercase tracking-widest text-[var(--cyan)]">
          Trending sound pairing
        </p>
        <p className="mt-2 text-sm text-white/75">
          🎵 Suggested:{" "}
          <span className="font-medium text-white">{TIKTOK_DRAFT.sound.name}</span>
          {" — "}
          {TIKTOK_DRAFT.sound.videoCount}
        </p>
      </div>
      <DraftActions onApprove={() => setApproved(true)} approved={approved} />
    </div>
  );
}

function DraftCreativeSection() {
  const [tab, setTab] = useState<PlatformTab>("tiktok");

  const tabContent: Record<PlatformTab, ReactNode> = {
    tiktok: <TikTokTab />,
    meta: <MetaDraftTab />,
    google: <GoogleDraftTab />,
    ai_prompts: <AiPromptsDraftTab />,
    spark_ad: <SparkAdDraftTab />,
  };

  return (
    <Panel title="Draft Creative">
      <div className="-mx-1 mb-4 overflow-x-auto px-1 pb-1">
        <div className="flex min-w-max gap-1 border-b border-white/10 pb-3">
          {PLATFORM_TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`shrink-0 rounded-md px-3 py-1.5 font-mono-label text-[10px] uppercase tracking-wide transition-colors ${
                tab === t.id
                  ? "bg-[var(--cyan)]/20 text-[var(--cyan)]"
                  : "text-white/40 hover:text-white/70"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>
      {tabContent[tab]}
    </Panel>
  );
}

function DraftHistorySection() {
  const [statusFilter, setStatusFilter] = useState<HistoryStatusFilter>("all");

  const statuses: HistoryStatusFilter[] = ["all", "approved", "pending", "rejected"];

  const filtered = useMemo(() => {
    return DRAFT_HISTORY.filter((row) => {
      if (statusFilter !== "all" && row.status !== statusFilter) return false;
      return true;
    });
  }, [statusFilter]);

  return (
    <Panel
      title="Draft History"
      action={
        <span className="font-mono-label text-[10px] text-white/35">
          {filtered.length} of {DRAFT_HISTORY.length}
        </span>
      }
    >
      <div className="mb-4 flex flex-wrap gap-1">
        {statuses.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setStatusFilter(s)}
            className={`rounded-md px-2 py-0.5 font-mono-label text-[10px] uppercase tracking-wide transition-colors ${
              statusFilter === s
                ? "bg-[var(--purple)]/20 text-[var(--purple)]"
                : "text-white/40 hover:text-white/70"
            }`}
          >
            {s === "all" ? "All" : s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>

      <div className="-mx-4 overflow-x-auto px-4">
        <table className="w-full min-w-[520px] text-left text-sm">
          <thead>
            <tr className="border-b border-white/10 font-mono-label text-[10px] uppercase tracking-wide text-white/40">
              <th className="pb-2 pr-4 font-medium">Date</th>
              <th className="pb-2 pr-4 font-medium">Platform</th>
              <th className="pb-2 pr-4 font-medium">Bucket</th>
              <th className="pb-2 pr-4 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((row) => (
              <tr key={row.id} className="border-b border-white/5 text-white/75">
                <td className="py-2.5 pr-4 font-mono-label text-xs text-white/50">{row.date}</td>
                <td className="py-2.5 pr-4">{row.platform}</td>
                <td className="py-2.5 pr-4">{row.bucket}</td>
                <td className="py-2.5 pr-4">
                  <span
                    className={`rounded px-2 py-0.5 font-mono-label text-[10px] uppercase tracking-wide ${DRAFT_STATUS_STYLES[row.status]}`}
                  >
                    {row.status}
                  </span>
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
  const { runAgents, agentsRunning } = useApp();

  return (
    <aside className="flex flex-col gap-4 lg:gap-6">
      <Panel title="Generation Stats">
        <dl className="space-y-3">
          {[
            { label: "Drafts this month", value: GENERATION_STATS.draftsThisMonth },
            { label: "Approved", value: GENERATION_STATS.approved, accent: "text-[var(--green)]" },
            { label: "Pending", value: GENERATION_STATS.pending, accent: "text-[var(--yellow)]" },
            { label: "Rejected", value: GENERATION_STATS.rejected, accent: "text-[var(--red)]" },
          ].map((item) => (
            <div key={item.label} className="flex items-center justify-between">
              <dt className="text-sm text-white/55">{item.label}</dt>
              <dd className={`font-mono-label text-lg font-semibold ${item.accent ?? "text-white"}`}>
                {item.value}
              </dd>
            </div>
          ))}
        </dl>
      </Panel>

      <Panel title="Bucket Health">
        <dl className="space-y-3 text-sm">
          <div className="flex justify-between">
            <dt className="text-white/55">Active buckets</dt>
            <dd className="font-mono-label font-semibold text-[var(--cyan)]">
              {BUCKET_HEALTH.activeBuckets}
            </dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-white/55">Paused</dt>
            <dd className="font-mono-label font-semibold text-white/45">
              {BUCKET_HEALTH.paused}
            </dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-white/55">Last run</dt>
            <dd className="font-mono-label text-xs text-white/60">{BUCKET_HEALTH.lastRun}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-white/55">Next scheduled</dt>
            <dd className="font-mono-label text-xs text-white/60">
              {BUCKET_HEALTH.nextScheduled}
            </dd>
          </div>
        </dl>
      </Panel>

      <Panel title="Quick Actions">
        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={runAgents}
            disabled={agentsRunning}
            className="w-full rounded-lg bg-gradient-to-r from-[var(--cyan)] to-[var(--green)] px-4 py-2.5 text-xs font-semibold text-[var(--bg)] transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {agentsRunning ? "Running agents…" : "Run agents now"}
          </button>
          <button
            type="button"
            className="w-full rounded-lg border border-white/15 px-4 py-2 text-xs text-white/70 transition-colors hover:bg-white/5"
          >
            View all approved
          </button>
          <button
            type="button"
            className="w-full rounded-lg border border-white/15 px-4 py-2 text-xs text-white/70 transition-colors hover:bg-white/5"
          >
            Export approved drafts
          </button>
        </div>
      </Panel>
    </aside>
  );
}

function DetailView() {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-6">
      <div className="space-y-4 lg:col-span-2 lg:space-y-6">
        <ContentAnglesSection />
        <ContentBucketsSection />
        <DraftCreativeSection />
        <DraftHistorySection />
      </div>
      <DetailSidebar />
    </div>
  );
}

export function ContentStudio({ variant }: ContentStudioProps) {
  return variant === "summary" ? <SummaryView /> : <DetailView />;
}
