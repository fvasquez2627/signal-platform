"use client";

import { useState } from "react";
import { AddProductModal } from "@/components/settings/add-product-modal";
import { ClientConfigForm } from "@/components/settings/client-config-form";
import { NewClientWizard } from "@/components/settings/new-client-wizard";
import { ProductConfigForm } from "@/components/settings/product-config-form";
import { useApp } from "@/context/app-context";
import {
  ALWAYS_ON_KEYS,
  INTEGRATIONS,
  OAUTH_INTEGRATION_KEYS,
  PAID_INTEGRATION_KEYS,
  type IntegrationKey,
} from "@/lib/integrations/config";
import { useIntegrations } from "@/lib/integrations/context";
import type { UserRole } from "@/types/database";
import { SignOutButton } from "@/components/auth/sign-out-button";

type SettingsTab = "integrations" | "users" | "client" | "product";

const TABS: { id: SettingsTab; label: string }[] = [
  { id: "integrations", label: "Integrations" },
  { id: "users", label: "Users & Permissions" },
  { id: "client", label: "Client Config" },
  { id: "product", label: "Product Config" },
];

const ROLE_DESCRIPTIONS: Record<UserRole, string> = {
  admin: "Full access, all clients, all settings",
  manager: "Their client only, detail view",
  viewer: "Read-only, summary view only",
};

const MOCK_USERS = [
  { id: "1", email: "alex@brand.com", role: "admin" as UserRole, lastActive: "2m ago" },
  { id: "2", email: "sam@brand.com", role: "manager" as UserRole, lastActive: "1h ago" },
  { id: "3", email: "jordan@brand.com", role: "viewer" as UserRole, lastActive: "3d ago" },
];

function PaidIntegrationCard({
  integrationKey,
  initialApiKey = "",
}: {
  integrationKey: IntegrationKey;
  initialApiKey?: string | null;
}) {
  const config = INTEGRATIONS[integrationKey];
  const { getIntegration, saveIntegration } = useIntegrations();
  const state = getIntegration(integrationKey);

  const [apiKey, setApiKey] = useState(() => initialApiKey ?? "");
  const [showKey, setShowKey] = useState(false);
  const [saving, setSaving] = useState(false);

  if (!("price" in config)) return null;

  const connected = state.enabled;
  const canToggle = Boolean(apiKey.trim());

  const handleSave = async () => {
    setSaving(true);
    try {
      await saveIntegration(integrationKey, {
        apiKey: apiKey.trim(),
        connected: Boolean(apiKey.trim()),
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <article className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[var(--purple)]/20 font-heading text-sm font-bold text-[var(--purple)]">
          {config.label.slice(0, 2).toUpperCase()}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h3 className="font-heading text-sm font-semibold text-white">{config.label}</h3>
              <p className="font-mono-label text-xs text-[var(--yellow)]">{config.price}</p>
            </div>
            <span
              className={`rounded px-2 py-0.5 font-mono-label text-[10px] uppercase ${
                connected
                  ? "bg-[var(--green)]/15 text-[var(--green)]"
                  : "bg-white/10 text-white/45"
              }`}
            >
              {connected ? "Connected" : "Not Connected"}
            </span>
          </div>
          <ul className="mt-3 space-y-1">
            {config.unlocks.map((item) => (
              <li key={item} className="flex gap-2 text-xs text-white/55">
                <span className="text-[var(--cyan)]">+</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-4 space-y-3 border-t border-white/10 pt-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-white/60">Enable integration</span>
          <button
            type="button"
            disabled={!canToggle}
            onClick={() =>
              void saveIntegration(integrationKey, {
                apiKey: apiKey.trim(),
                connected: !connected,
              })
            }
            className={`relative h-6 w-11 rounded-full transition-colors ${
              connected ? "bg-[var(--green)]" : "bg-white/20"
            } ${!canToggle ? "cursor-not-allowed opacity-40" : ""}`}
            aria-label="Toggle integration"
          >
            <span
              className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
                connected ? "translate-x-5" : ""
              }`}
            />
          </button>
        </div>
        <div>
          <label className="font-mono-label text-[10px] uppercase tracking-widest text-white/40">
            API key
          </label>
          <div className="mt-1 flex gap-2">
            <input
              type={showKey ? "text" : "password"}
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter API key"
              className="flex-1 rounded-lg border border-white/10 bg-white/5 px-3 py-2 font-mono-label text-sm text-white outline-none focus:border-[var(--cyan)]/40"
            />
            <button
              type="button"
              onClick={() => setShowKey((v) => !v)}
              className="rounded-lg border border-white/15 px-3 text-xs text-white/60 hover:bg-white/5"
            >
              {showKey ? "Hide" : "Show"}
            </button>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => void handleSave()}
            disabled={saving || !apiKey.trim()}
            className="rounded-lg bg-[var(--cyan)] px-4 py-2 text-xs font-semibold text-[var(--bg)] hover:opacity-90 disabled:opacity-40"
          >
            {saving ? "Saving…" : "Save"}
          </button>
          <a
            href="#"
            className="rounded-lg border border-white/15 px-4 py-2 text-xs text-white/60 hover:bg-white/5"
            onClick={(e) => e.preventDefault()}
          >
            Learn More
          </a>
        </div>
      </div>
    </article>
  );
}

function PlatformConnectionCard({ integrationKey }: { integrationKey: IntegrationKey }) {
  const config = INTEGRATIONS[integrationKey];
  const { getIntegration, saveIntegration } = useIntegrations();
  const state = getIntegration(integrationKey);

  const connected = state.enabled;

  const icons: Record<string, string> = {
    meta_business: "M",
    tiktok_shop: "T",
    google_ads: "G",
    google_search_console: "SC",
    meta_ad_library_full: "MA",
    tiktok_commercial_api: "TT",
  };

  const approved =
    "approved" in config && config.approved === true;

  return (
    <article className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[var(--cyan)]/15 font-mono-label text-sm font-bold text-[var(--cyan)]">
            {icons[integrationKey] ?? "?"}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-heading text-sm font-semibold text-white">{config.label}</h3>
              {approved && (
                <span className="rounded bg-[var(--green)]/15 px-2 py-0.5 font-mono-label text-[9px] uppercase text-[var(--green)]">
                  Approved — Ready to Connect
                </span>
              )}
            </div>
            {"price" in config && (
              <p className="font-mono-label text-[10px] text-white/40">{config.price}</p>
            )}
            <ul className="mt-2 space-y-0.5">
              {"unlocks" in config &&
                config.unlocks.map((item) => (
                  <li key={item} className="text-xs text-white/50">
                    · {item}
                  </li>
                ))}
            </ul>
          </div>
        </div>
        <span
          className={`shrink-0 rounded px-2 py-0.5 font-mono-label text-[10px] uppercase tracking-wide ${
            connected
              ? "bg-[var(--green)]/15 text-[var(--green)]"
              : "bg-white/10 text-white/45"
          }`}
        >
          {connected ? "Connected" : "Not connected"}
        </span>
      </div>
      {connected ? (
        <button
          type="button"
          onClick={() => void saveIntegration(integrationKey, { connected: false })}
          className="mt-4 rounded-lg border border-white/15 px-4 py-2 text-xs font-semibold text-white/60 hover:bg-white/5"
        >
          Disconnect
        </button>
      ) : (
        <button
          type="button"
          onClick={() => void saveIntegration(integrationKey, { connected: true })}
          className="mt-4 rounded-lg border border-[var(--cyan)]/40 bg-[var(--cyan)]/10 px-4 py-2 text-xs font-semibold text-[var(--cyan)] hover:opacity-90"
        >
          Connect
        </button>
      )}
    </article>
  );
}

function AiAnalysisCard() {
  const integrationKey: IntegrationKey = "ai_analysis";
  const config = INTEGRATIONS[integrationKey];
  const { getIntegration, saveIntegration } = useIntegrations();
  const connected = getIntegration(integrationKey).enabled;

  return (
    <article className="rounded-xl border border-[var(--purple)]/30 bg-[var(--purple)]/5 p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-heading text-sm font-semibold text-white">{config.label}</h3>
          <p className="mt-1 text-xs text-white/50">
            Powered by your existing Anthropic API key
          </p>
          {"price" in config && (
            <p className="mt-1 font-mono-label text-[10px] text-[var(--yellow)]">
              Est. cost: {config.price}
            </p>
          )}
          <ul className="mt-3 space-y-1">
            {"unlocks" in config &&
              config.unlocks.map((item) => (
                <li key={item} className="text-xs text-white/55">
                  · {item}
                </li>
              ))}
          </ul>
        </div>
        <button
          type="button"
          onClick={() =>
            void saveIntegration(integrationKey, { connected: !connected })
          }
          className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
            connected ? "bg-[var(--green)]" : "bg-white/20"
          }`}
          aria-label="Toggle AI analysis"
        >
          <span
            className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
              connected ? "translate-x-5" : ""
            }`}
          />
        </button>
      </div>
    </article>
  );
}

function IntegrationsTab() {
  const { getIntegration } = useIntegrations();

  return (
    <div className="space-y-8">
      <section>
        <h2 className="font-heading text-sm font-semibold text-white">
          Section 1 — Always On (Free)
        </h2>
        <p className="mt-1 text-sm text-white/45">No configuration needed</p>
        <ul className="mt-4 space-y-3">
          {ALWAYS_ON_KEYS.map((key) => {
            const config = INTEGRATIONS[key];
            return (
              <li
                key={key}
                className="flex gap-3 rounded-lg border border-white/10 bg-white/[0.02] px-4 py-3"
              >
                <span className="text-[var(--green)]" aria-hidden>
                  ✓
                </span>
                <div>
                  <p className="text-sm font-medium text-white">
                    {config.label}
                    {"subtitle" in config && (
                      <span className="ml-1 text-xs text-white/40">
                        ({config.subtitle})
                      </span>
                    )}
                  </p>
                  {"provides" in config && (
                    <p className="mt-0.5 text-xs text-white/50">{config.provides}</p>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      <section>
        <h2 className="font-heading text-sm font-semibold text-white">
          Section 2 — Connect Free Accounts (OAuth)
        </h2>
        <p className="mt-1 text-sm text-white/45">Connect per client</p>
        <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
          {OAUTH_INTEGRATION_KEYS.map((key) => (
            <PlatformConnectionCard key={key} integrationKey={key} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="font-heading text-sm font-semibold text-white">
          Section 3 — Enhanced Data (Paid APIs)
        </h2>
        <p className="mt-1 text-sm text-white/45">Add API key to enable</p>
        <div className="mt-4 space-y-4">
          {PAID_INTEGRATION_KEYS.map((key) => {
            const { apiKey, enabled } = getIntegration(key);
            return (
              <PaidIntegrationCard
                key={`${key}-${enabled}-${apiKey ?? ""}`}
                integrationKey={key}
                initialApiKey={apiKey}
              />
            );
          })}
        </div>
      </section>

      <section>
        <h2 className="font-heading text-sm font-semibold text-white">
          Section 4 — AI Analysis Layer
        </h2>
        <p className="mt-1 text-sm text-white/45">Pattern extraction on every ingested ad</p>
        <div className="mt-4">
          <AiAnalysisCard />
        </div>
      </section>
    </div>
  );
}

function UsersTab() {
  const [users, setUsers] = useState(MOCK_USERS);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<UserRole>("viewer");

  const addUser = () => {
    if (!email.trim()) return;
    setUsers((prev) => [
      ...prev,
      {
        id: String(Date.now()),
        email: email.trim(),
        role,
        lastActive: "Just now",
      },
    ]);
    setEmail("");
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-3 rounded-xl border border-white/10 bg-white/[0.02] p-4 sm:grid-cols-[1fr_auto_auto]">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="user@company.com"
          className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-[var(--cyan)]/40"
        />
        <select
          value={role}
          onChange={(e) => setRole(e.target.value as UserRole)}
          className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white"
        >
          <option value="admin">Admin</option>
          <option value="manager">Manager</option>
          <option value="viewer">Viewer</option>
        </select>
        <button
          type="button"
          onClick={addUser}
          className="rounded-lg bg-[var(--cyan)] px-4 py-2 text-sm font-semibold text-[var(--bg)] hover:opacity-90"
        >
          Add user
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-white/10">
        <table className="w-full min-w-[520px] text-left text-sm">
          <thead>
            <tr className="border-b border-white/10 font-mono-label text-[10px] uppercase tracking-widest text-white/40">
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Last active</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b border-white/5">
                <td className="px-4 py-3 text-white/80">{user.email}</td>
                <td className="px-4 py-3 capitalize text-white/60">{user.role}</td>
                <td className="px-4 py-3 font-mono-label text-xs text-white/45">
                  {user.lastActive}
                </td>
                <td className="px-4 py-3">
                  <button
                    type="button"
                    onClick={() => setUsers((prev) => prev.filter((u) => u.id !== user.id))}
                    className="text-xs text-[var(--red)] hover:underline"
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        {(["admin", "manager", "viewer"] as const).map((r) => (
          <div key={r} className="rounded-lg border border-white/10 bg-white/[0.02] p-3">
            <p className="font-mono-label text-[10px] uppercase text-[var(--cyan)]">{r}</p>
            <p className="mt-1 text-xs text-white/55">{ROLE_DESCRIPTIONS[r]}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function ClientConfigTab() {
  const { currentClient } = useApp();

  if (!currentClient) {
    return <p className="text-sm text-white/45">Select a client in the top bar.</p>;
  }

  return <ClientConfigForm key={currentClient.id} client={currentClient} />;
}

function ProductConfigTab() {
  const { currentClient, currentProduct, products, setCurrentProductId } = useApp();
  const [showAddProduct, setShowAddProduct] = useState(false);

  const clientProducts = products.filter(
    (p) => p.client_id === currentProduct?.client_id,
  );

  if (!currentProduct || !currentClient) {
    return <p className="text-sm text-white/45">Select a product in the top bar.</p>;
  }

  return (
    <>
      <ProductConfigForm
        key={currentProduct.id}
        product={currentProduct}
        client={currentClient}
        clientProducts={clientProducts}
        onSelectProduct={setCurrentProductId}
        onAddProduct={() => setShowAddProduct(true)}
      />
      {showAddProduct && (
        <AddProductModal
          client={currentClient}
          onClose={() => setShowAddProduct(false)}
        />
      )}
    </>
  );
}

function SettingsSummary() {
  const { getIntegration } = useIntegrations();
  const connectedPlatforms = OAUTH_INTEGRATION_KEYS.filter(
    (k) => getIntegration(k).enabled,
  ).length;
  const connectedEnhanced = PAID_INTEGRATION_KEYS.filter((k) => getIntegration(k).enabled).length;

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
        <p className="font-mono-label text-[10px] uppercase text-white/40">Free sources</p>
        <p className="mt-1 font-heading text-2xl font-bold text-[var(--green)]">
          {ALWAYS_ON_KEYS.length}
        </p>
        <p className="text-xs text-white/45">Active</p>
      </div>
      <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
        <p className="font-mono-label text-[10px] uppercase text-white/40">Enhanced data</p>
        <p className="mt-1 font-heading text-2xl font-bold text-[var(--purple)]">
          {connectedEnhanced}/{PAID_INTEGRATION_KEYS.length}
        </p>
        <p className="text-xs text-white/45">Connected</p>
      </div>
      <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
        <p className="font-mono-label text-[10px] uppercase text-white/40">Platforms</p>
        <p className="mt-1 font-heading text-2xl font-bold text-[var(--cyan)]">
          {connectedPlatforms}/{OAUTH_INTEGRATION_KEYS.length}
        </p>
        <p className="text-xs text-white/45">Connected</p>
      </div>
    </div>
  );
}

type SettingsPanelProps = {
  variant: "summary" | "detail";
};

export function SettingsPanel({ variant }: SettingsPanelProps) {
  const { role } = useApp();
  const [tab, setTab] = useState<SettingsTab>("integrations");
  const [showNewClient, setShowNewClient] = useState(false);
  const isAdmin = role === "admin";

  const visibleTabs = isAdmin
    ? TABS
    : TABS.filter((t) => t.id !== "users");

  const activeTab =
    !isAdmin && tab === "users" ? "integrations" : tab;

  if (variant === "summary") {
    return (
      <div className="space-y-4">
        <SettingsSummary />
        <p className="text-sm text-white/45">
          Switch to Detail view for integrations, users, and configuration.
        </p>
        <SignOutButton />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {!isAdmin && (
        <p className="rounded-lg border border-white/10 bg-white/[0.02] px-3 py-2 text-xs text-white/45">
          Signed in as <span className="capitalize text-white/70">{role}</span>. User
          management requires admin access.
        </p>
      )}

      {isAdmin && (
        <button
          type="button"
          onClick={() => setShowNewClient(true)}
          className="w-full rounded-lg border border-dashed border-[var(--cyan)]/40 bg-[var(--cyan)]/5 px-4 py-3 text-sm font-medium text-[var(--cyan)] transition-colors hover:bg-[var(--cyan)]/10 sm:w-auto"
        >
          + Add New Client
        </button>
      )}

      <div className="-mx-1 overflow-x-auto px-1 pb-1">
        <div className="flex min-w-max gap-1">
          {visibleTabs.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                activeTab === t.id
                  ? "bg-[var(--cyan)]/20 text-[var(--cyan)]"
                  : "text-white/50 hover:bg-white/5 hover:text-white/80"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {activeTab === "integrations" && <IntegrationsTab />}
      {activeTab === "users" && isAdmin && <UsersTab />}
      {activeTab === "client" && <ClientConfigTab />}
      {activeTab === "product" && <ProductConfigTab />}

      <div className="border-t border-white/10 pt-4">
        <SignOutButton />
      </div>

      {showNewClient && <NewClientWizard onClose={() => setShowNewClient(false)} />}
    </div>
  );
}
