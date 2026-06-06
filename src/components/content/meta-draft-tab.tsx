"use client";

import { useState } from "react";
import { META_DRAFT } from "@/components/content/mock-data";
import {
  CopyBlock,
  CopyButton,
  DraftActions,
  SignalBadges,
  VariantSection,
} from "@/components/content/content-studio-shared";

export function MetaDraftTab() {
  const [approvedA, setApprovedA] = useState(false);
  const [approvedB, setApprovedB] = useState(false);
  const { variantA, variantB, abTest } = META_DRAFT;

  const variantBCopyAll = [
    variantB.primaryText,
    "",
    ...variantB.slides.map((s, i) => `Slide ${i + 1}: ${s}`),
    "",
    `Headline: ${variantB.headline}`,
    `CTA: ${variantB.cta}`,
  ].join("\n");

  return (
    <div className="space-y-5">
      <SignalBadges signalSource={META_DRAFT.signalSource} bucket={META_DRAFT.bucket} />

      <VariantSection title={variantA.label}>
        <CopyBlock label="Primary Text" text={variantA.primaryText} accent="text-[var(--cyan)]" multiline />

        <div>
          <div className="mb-2 flex items-center justify-between gap-2">
            <p className="font-mono-label text-[10px] uppercase tracking-widest text-[var(--green)]">
              Headlines (3 variants)
            </p>
          </div>
          <ul className="space-y-2">
            {variantA.headlines.map((h, i) => (
              <li
                key={h}
                className="flex items-center justify-between gap-2 rounded-lg bg-white/[0.03] px-3 py-2"
              >
                <span className="text-sm text-white/75">
                  {i + 1}. {h}
                </span>
                <CopyButton text={h} label="Copy" />
              </li>
            ))}
          </ul>
        </div>

        <CopyBlock label="Description" text={variantA.description} accent="text-[var(--purple)]" />

        <div className="grid gap-2 text-sm sm:grid-cols-2">
          <p className="text-white/60">
            <span className="font-mono-label text-[10px] uppercase text-white/40">CTA Button</span>
            <br />
            <span className="text-white/80">{variantA.cta}</span>
          </p>
          <p className="text-white/60">
            <span className="font-mono-label text-[10px] uppercase text-white/40">
              Recommended Format
            </span>
            <br />
            <span className="text-[var(--cyan)]">{variantA.format}</span>
          </p>
          <p className="text-white/60 sm:col-span-2">
            <span className="font-mono-label text-[10px] uppercase text-white/40">
              Estimated Audience
            </span>
            <br />
            <span className="text-white/80">{variantA.audience}</span>
          </p>
        </div>
      </VariantSection>

      <VariantSection title={variantB.label}>
        <CopyBlock label="Primary Text" text={variantB.primaryText} accent="text-[var(--cyan)]" />

        <div>
          <p className="font-mono-label text-[10px] uppercase tracking-widest text-[var(--green)]">
            Slide Copy (5 slides)
          </p>
          <ul className="mt-2 space-y-2">
            {variantB.slides.map((slide, i) => (
              <li
                key={slide}
                className="flex items-center justify-between gap-2 rounded-lg bg-white/[0.03] px-3 py-2 text-sm text-white/75"
              >
                <span>
                  Slide {i + 1}: {slide}
                </span>
                <CopyButton text={slide} />
              </li>
            ))}
          </ul>
        </div>

        <div className="grid gap-2 text-sm sm:grid-cols-2">
          <p className="text-white/75">
            <span className="font-mono-label text-[10px] uppercase text-white/40">Headline</span>
            <br />
            {variantB.headline}
          </p>
          <p className="text-white/75">
            <span className="font-mono-label text-[10px] uppercase text-white/40">CTA</span>
            <br />
            {variantB.cta}
          </p>
        </div>

        <CopyButton text={variantBCopyAll} label="Copy all" />
      </VariantSection>

      <div className="rounded-xl border border-[var(--yellow)]/25 bg-[var(--yellow)]/5 p-4">
        <p className="font-mono-label text-[10px] uppercase tracking-widest text-[var(--yellow)]">
          A/B Test Recommendation
        </p>
        <p className="mt-2 text-sm leading-relaxed text-white/75">{abTest}</p>
      </div>

      <DraftActions
        extraActions={
          <>
            <button
              type="button"
              onClick={() => setApprovedA(true)}
              disabled={approvedA}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${
                approvedA
                  ? "bg-[var(--green)] text-[var(--bg)]"
                  : "border border-[var(--green)]/40 text-[var(--green)] hover:bg-[var(--green)]/10"
              }`}
            >
              {approvedA ? "A Approved ✓" : "Approve A"}
            </button>
            <button
              type="button"
              onClick={() => setApprovedB(true)}
              disabled={approvedB}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${
                approvedB
                  ? "bg-[var(--green)] text-[var(--bg)]"
                  : "border border-[var(--green)]/40 text-[var(--green)] hover:bg-[var(--green)]/10"
              }`}
            >
              {approvedB ? "B Approved ✓" : "Approve B"}
            </button>
          </>
        }
        approveLabel="Approve"
        onApprove={() => {
          setApprovedA(true);
          setApprovedB(true);
        }}
        approved={approvedA && approvedB}
      />
    </div>
  );
}
