"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { Button, Card, Section } from "@/components/ui";
import { createBrowserSupabaseClient } from "@/lib/supabase/browser";

function SignInForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    const fd = new FormData(e.currentTarget);
    try {
      const supabase = createBrowserSupabaseClient();
      const { error } = await supabase.auth.signInWithPassword({
        email: String(fd.get("email") ?? ""),
        password: String(fd.get("password") ?? ""),
      });
      if (error) {
        setError("Sign-in failed. Check your email and password.");
        setBusy(false);
        return;
      }
      const next = params.get("next");
      router.push(next && next.startsWith("/admin") ? next : "/admin");
      router.refresh();
    } catch {
      setError("Authentication backend is not configured.");
      setBusy(false);
    }
  }

  return (
    <Card className="mx-auto max-w-md">
      <h1 className="text-xl font-bold">Staff sign-in</h1>
      <p className="mt-1 text-sm text-stone-600">
        Staff accounts are created by administrators. There is no public registration.
      </p>
      <form onSubmit={onSubmit} className="mt-4 grid gap-4" aria-label="Staff sign-in">
        <div>
          <label htmlFor="email" className="mb-1 block text-sm font-medium">Email</label>
          <input id="email" name="email" type="email" required autoComplete="email"
            className="focus-ring w-full rounded-md border border-stone-300 px-3 py-2" />
        </div>
        <div>
          <label htmlFor="password" className="mb-1 block text-sm font-medium">Password</label>
          <input id="password" name="password" type="password" required autoComplete="current-password"
            className="focus-ring w-full rounded-md border border-stone-300 px-3 py-2" />
        </div>
        {error ? <p role="alert" className="text-sm text-red-700">{error}</p> : null}
        <Button type="submit">{busy ? "Signing in…" : "Sign in"}</Button>
      </form>
    </Card>
  );
}

export default function SignInPage() {
  return (
    <Section title="">
      <Suspense>
        <SignInForm />
      </Suspense>
    </Section>
  );
}
