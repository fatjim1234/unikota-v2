"use client";

import { useRouter } from "next/navigation";
import { createBrowserSupabaseClient } from "@/lib/supabase/browser";

export function SignOutButton() {
  const router = useRouter();
  return (
    <button
      type="button"
      className="focus-ring rounded-md border border-stone-300 px-3 py-1.5 text-sm hover:bg-stone-100"
      onClick={async () => {
        try {
          await createBrowserSupabaseClient().auth.signOut();
        } finally {
          router.push("/admin/sign-in");
          router.refresh();
        }
      }}
    >
      Sign out
    </button>
  );
}
