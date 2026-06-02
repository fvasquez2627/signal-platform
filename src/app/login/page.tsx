import { Suspense } from "react";
import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[var(--bg)] px-4">
      <Suspense
        fallback={
          <div className="text-sm text-white/50">Loading…</div>
        }
      >
        <LoginForm />
      </Suspense>
    </div>
  );
}
