type PlaceholderPanelProps = {
  title: string;
  items: string[];
  accent?: "cyan" | "green" | "purple" | "yellow" | "red";
};

const borderAccent = {
  cyan: "border-[var(--cyan)]/30",
  green: "border-[var(--green)]/30",
  purple: "border-[var(--purple)]/30",
  yellow: "border-[var(--yellow)]/30",
  red: "border-[var(--red)]/30",
};

const textAccent = {
  cyan: "text-[var(--cyan)]",
  green: "text-[var(--green)]",
  purple: "text-[var(--purple)]",
  yellow: "text-[var(--yellow)]",
  red: "text-[var(--red)]",
};

export function PlaceholderPanel({
  title,
  items,
  accent = "cyan",
}: PlaceholderPanelProps) {
  return (
    <div
      className={`rounded-xl border bg-white/[0.02] p-4 ${borderAccent[accent]}`}
    >
      <h3
        className={`mb-3 text-sm font-semibold uppercase tracking-wide ${textAccent[accent]}`}
      >
        {title}
      </h3>
      <ul className="space-y-2">
        {items.map((item) => (
          <li
            key={item}
            className="rounded-lg bg-white/5 px-3 py-2 text-sm text-white/70"
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
