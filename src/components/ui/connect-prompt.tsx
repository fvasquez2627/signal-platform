import Link from "next/link";
import { ROUTES } from "@/lib/navigation";

type ConnectPromptProps = {
  message: string;
  className?: string;
};

export function ConnectPrompt({ message, className = "" }: ConnectPromptProps) {
  return (
    <p className={`text-sm text-white/40 ${className}`}>
      {message}{" "}
      <Link href={ROUTES.settings} className="text-[var(--cyan)] hover:underline">
        Connect in Settings →
      </Link>
    </p>
  );
}
