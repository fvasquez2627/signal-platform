export type DiffAction = "add" | "remove";

export type DiffItem = {
  id: string;
  field: string;
  action: DiffAction;
  value: string;
  accepted: boolean | null;
};

export type ConfigDiff = {
  items: DiffItem[];
  unchanged: string[];
};

function itemId(field: string, action: DiffAction, value: string) {
  return `${field}:${action}:${value}`;
}

export function diffStringArrays(
  field: string,
  current: string[],
  discovered: string[],
): { additions: DiffItem[]; removals: DiffItem[] } {
  const currentSet = new Set(current.map((v) => v.toLowerCase()));
  const discoveredSet = new Set(discovered.map((v) => v.toLowerCase()));

  const additions: DiffItem[] = discovered
    .filter((v) => !currentSet.has(v.toLowerCase()))
    .map((value) => ({
      id: itemId(field, "add", value),
      field,
      action: "add" as const,
      value,
      accepted: null,
    }));

  const removals: DiffItem[] = current
    .filter((v) => !discoveredSet.has(v.toLowerCase()))
    .map((value) => ({
      id: itemId(field, "remove", value),
      field,
      action: "remove" as const,
      value,
      accepted: null,
    }));

  return { additions, removals };
}

export function buildProductConfigDiff(
  current: {
    keywords: string[];
    competitors: string[];
    content_angles: string[];
    seasonal_peaks: string[];
    key_ingredients: string[];
    approved_claims: string[];
    restricted_claims: string[];
    target_demographic: string;
    primary_benefit: string;
  },
  discovered: {
    keywords?: string[];
    competitors?: string[];
    content_angles?: string[];
    seasonal_peaks?: string[];
    key_ingredients?: string[];
    approved_claims?: string[];
    restricted_claims?: string[];
    target_demographic?: string;
    primary_benefit?: string;
  },
): ConfigDiff {
  const items: DiffItem[] = [];
  const unchanged: string[] = [];

  const fields: Array<{
    key: keyof typeof current;
    label: string;
    discoveredKey: keyof typeof discovered;
  }> = [
    { key: "keywords", label: "Keywords", discoveredKey: "keywords" },
    { key: "competitors", label: "Competitors", discoveredKey: "competitors" },
    { key: "content_angles", label: "Content angles", discoveredKey: "content_angles" },
    { key: "seasonal_peaks", label: "Seasonal peaks", discoveredKey: "seasonal_peaks" },
    { key: "key_ingredients", label: "Ingredients", discoveredKey: "key_ingredients" },
    { key: "approved_claims", label: "Approved claims", discoveredKey: "approved_claims" },
    { key: "restricted_claims", label: "Restricted claims", discoveredKey: "restricted_claims" },
  ];

  for (const { key, label, discoveredKey } of fields) {
    const { additions, removals } = diffStringArrays(
      label,
      current[key] as string[],
      (discovered[discoveredKey] as string[] | undefined) ?? [],
    );
    if (additions.length === 0 && removals.length === 0) {
      unchanged.push(label);
    }
    items.push(...additions, ...removals);
  }

  if (
    discovered.target_demographic &&
    discovered.target_demographic !== current.target_demographic
  ) {
    items.push({
      id: "demographic:update",
      field: "Target demographic",
      action: "add",
      value: discovered.target_demographic,
      accepted: null,
    });
  } else {
    unchanged.push("Target demographic");
  }

  if (discovered.primary_benefit && discovered.primary_benefit !== current.primary_benefit) {
    items.push({
      id: "benefit:update",
      field: "Primary benefit",
      action: "add",
      value: discovered.primary_benefit,
      accepted: null,
    });
  } else {
    unchanged.push("Primary benefit");
  }

  return { items, unchanged };
}

export function applyAcceptedDiff(
  current: string[],
  items: DiffItem[],
  fieldLabel: string,
): string[] {
  let next = [...current];
  for (const item of items.filter((i) => i.field === fieldLabel && i.accepted === true)) {
    if (item.action === "add" && !next.some((v) => v.toLowerCase() === item.value.toLowerCase())) {
      next.push(item.value);
    }
    if (item.action === "remove") {
      next = next.filter((v) => v.toLowerCase() !== item.value.toLowerCase());
    }
  }
  return next;
}
