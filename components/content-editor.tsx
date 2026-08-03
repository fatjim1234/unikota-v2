"use client";

import { useEffect, useState } from "react";
import { Badge, Button, Card } from "@/components/ui";

const KEYS = ["settings", "home", "about", "manufacturing", "brands", "oem", "export", "contact"];

/**
 * Raw-JSON content editor (client). The page hosting this component is
 * guarded by requireStaff; the PUT API re-checks auth; RLS is the final
 * authority. Saves create a revision + audit entry via database triggers.
 */
export function ContentEditor({ backend }: { backend: "supabase" | "local" }) {
  const [key, setKey] = useState<string>("home");
  const [text, setText] = useState<string>("");
  const [status, setStatus] = useState<{ kind: "idle" | "ok" | "error"; msg: string }>({ kind: "idle", msg: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setStatus({ kind: "idle", msg: "" });
    fetch(`/api/content/${key}`)
      .then((r) => r.json())
      .then((d) => {
        if (!cancelled) setText(JSON.stringify(d.value, null, 2));
      })
      .catch(() => {
        if (!cancelled) setStatus({ kind: "error", msg: "Failed to load content." });
      })
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [key]);

  async function save() {
    let parsed: unknown;
    try {
      parsed = JSON.parse(text);
    } catch {
      setStatus({ kind: "error", msg: "Not valid JSON — fix the syntax before saving." });
      return;
    }
    const res = await fetch(`/api/content/${key}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(parsed),
    });
    if (res.ok) {
      setStatus({ kind: "ok", msg: `Saved "${key}" (revision + audit entry recorded).` });
    } else {
      const d = await res.json().catch(() => ({ error: "Save failed" }));
      setStatus({ kind: "error", msg: d.error ?? "Save failed." });
    }
  }

  return (
    <Card>
      <div className="mb-3 flex flex-wrap gap-2">
        <Badge tone={backend === "supabase" ? "green" : "amber"}>
          backend: {backend === "supabase" ? "Supabase (RLS enforced)" : "local JSON (dev fallback)"}
        </Badge>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <label htmlFor="content-key" className="text-sm font-medium">Page</label>
        <select
          id="content-key"
          value={key}
          onChange={(e) => setKey(e.target.value)}
          className="focus-ring rounded-md border border-stone-300 px-3 py-2 text-sm"
        >
          {KEYS.map((k) => (
            <option key={k} value={k}>{k}</option>
          ))}
        </select>
        <Button onClick={save}>Save</Button>
        {status.kind !== "idle" ? (
          <p role="status" className={`text-sm ${status.kind === "ok" ? "text-emerald-700" : "text-red-700"}`}>
            {status.msg}
          </p>
        ) : null}
      </div>
      <label htmlFor="content-json" className="sr-only">Content JSON</label>
      <textarea
        id="content-json"
        value={loading ? "Loading…" : text}
        onChange={(e) => setText(e.target.value)}
        rows={24}
        spellCheck={false}
        className="focus-ring mt-4 w-full rounded-md border border-stone-300 p-3 font-mono text-xs"
      />
      <p className="mt-2 text-xs text-stone-500">
        Keep placeholder markers ("[PLACEHOLDER: … — REQUIRED INPUT Qx]") until the real business data exists — the
        platform never invents facts. Never store credentials or personal data here: content is world-readable.
      </p>
    </Card>
  );
}
