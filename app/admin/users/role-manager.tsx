"use client";

import { useState, useTransition } from "react";
import { Badge, Button } from "@/components/ui";
import { grantRole, revokeRole } from "./actions";
import type { StaffRoleName } from "@/lib/auth";

export type UserRowData = {
  id: string;
  email: string;
  display_name: string | null;
  roles: { rowId: string; role: StaffRoleName }[];
};

const ALL_ROLES: StaffRoleName[] = ["sales_employee", "content_editor", "administrator", "super_administrator"];

export function RoleManager({ user, actorIsSuper }: { user: UserRowData; actorIsSuper: boolean }) {
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const grantable = ALL_ROLES.filter(
    (r) => !user.roles.some((x) => x.role === r) && (actorIsSuper || r === "sales_employee" || r === "content_editor"),
  );
  const [selected, setSelected] = useState<StaffRoleName | "">("");

  function run(fn: () => Promise<{ ok: boolean; error?: string }>) {
    setError(null);
    start(async () => {
      const r = await fn();
      if (!r.ok) setError(r.error ?? "Blocked by policy.");
    });
  }

  return (
    <div className="rounded-lg border border-stone-200 bg-white p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="font-semibold">{user.display_name ?? user.email}</p>
          <p className="text-xs text-stone-500">{user.email}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {user.roles.length === 0 ? <Badge tone="stone">no roles</Badge> : null}
          {user.roles.map((r) => (
            <span key={r.rowId} className="inline-flex items-center gap-1">
              <Badge tone="brand">{r.role}</Badge>
              <button
                type="button"
                aria-label={`Revoke ${r.role} from ${user.email}`}
                className="focus-ring rounded px-1 text-xs text-red-700 hover:bg-red-50"
                onClick={() => run(() => revokeRole(r.rowId))}
              >
                ✕
              </button>
            </span>
          ))}
        </div>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <label className="sr-only" htmlFor={`grant-${user.id}`}>Grant role</label>
        <select
          id={`grant-${user.id}`}
          value={selected}
          onChange={(e) => setSelected(e.target.value as StaffRoleName | "")}
          className="focus-ring rounded-md border border-stone-300 px-2 py-1.5 text-sm"
        >
          <option value="">— grant role —</option>
          {grantable.map((r) => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>
        <Button
          variant="secondary"
          className={pending ? "opacity-50" : ""}
          onClick={() => {
            if (selected) {
              run(() => grantRole(user.id, selected));
              setSelected("");
            }
          }}
        >
          Grant
        </Button>
      </div>
      {error ? <p role="alert" className="mt-2 text-xs text-red-700">{error}</p> : null}
    </div>
  );
}
