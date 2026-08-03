"use client";

import { useState, useTransition } from "react";
import { Badge, Button } from "@/components/ui";
import { claimLead, updateLeadStatus, addLeadNote, assignLead } from "./actions";

export type LeadRowData = {
  id: string;
  created_at: string;
  name: string;
  email: string;
  company: string | null;
  enquiry_type: string;
  message: string;
  source_page: string | null;
  status: "new" | "in_progress" | "closed" | "spam";
  assigned_to: string | null;
  notes: { id: string; body: string; created_at: string; author: string }[];
};

const statusTone = { new: "amber", in_progress: "brand", closed: "green", spam: "stone" } as const;

export function LeadRow({
  lead,
  meId,
  isAdmin,
  staff,
}: {
  lead: LeadRowData;
  meId: string;
  isAdmin: boolean;
  staff: { id: string; label: string }[];
}) {
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const mine = lead.assigned_to === meId;

  function run(fn: () => Promise<{ ok: boolean; error?: string }>) {
    setError(null);
    start(async () => {
      const r = await fn();
      if (!r.ok) setError(r.error ?? "Action failed (blocked by policy).");
    });
  }

  return (
    <div className="rounded-lg border border-stone-200 bg-white p-4">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="font-semibold">
            {lead.name} <span className="font-normal text-stone-500">· {lead.email}{lead.company ? ` · ${lead.company}` : ""}</span>
          </p>
          <p className="mt-0.5 text-xs text-stone-500">
            {new Date(lead.created_at).toLocaleString()} · {lead.enquiry_type}
            {lead.source_page ? ` · from ${lead.source_page}` : ""}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge tone={statusTone[lead.status]}>{lead.status}</Badge>
          {lead.assigned_to ? (
            <Badge tone={mine ? "green" : "stone"}>{mine ? "assigned to me" : "assigned"}</Badge>
          ) : (
            <Badge tone="stone">unassigned</Badge>
          )}
        </div>
      </div>

      <p className="mt-3 whitespace-pre-wrap text-sm text-stone-700">{lead.message}</p>

      {lead.notes.length > 0 ? (
        <ul className="mt-3 space-y-1 border-l-2 border-brand-100 pl-3 text-xs text-stone-600">
          {lead.notes.map((n) => (
            <li key={n.id}>
              <span className="text-stone-400">{new Date(n.created_at).toLocaleString()} · {n.author}:</span> {n.body}
            </li>
          ))}
        </ul>
      ) : null}

      <div className="mt-4 flex flex-wrap items-center gap-2">
        {!lead.assigned_to ? (
          <Button onClick={() => run(() => claimLead(lead.id))} className={pending ? "opacity-50" : ""}>
            Claim
          </Button>
        ) : null}

        {(mine || isAdmin) ? (
          <>
            <label className="sr-only" htmlFor={`status-${lead.id}`}>Status</label>
            <select
              id={`status-${lead.id}`}
              defaultValue={lead.status}
              onChange={(e) => run(() => updateLeadStatus(lead.id, e.target.value as LeadRowData["status"]))}
              className="focus-ring rounded-md border border-stone-300 px-2 py-1.5 text-sm"
            >
              <option value="new">new</option>
              <option value="in_progress">in_progress</option>
              <option value="closed">closed</option>
              <option value="spam">spam</option>
            </select>
            <input
              aria-label={`Add note for ${lead.name}`}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Add note…"
              className="focus-ring min-w-40 flex-1 rounded-md border border-stone-300 px-2 py-1.5 text-sm"
            />
            <Button
              variant="secondary"
              onClick={() => {
                if (note.trim()) {
                  run(() => addLeadNote(lead.id, note));
                  setNote("");
                }
              }}
            >
              Note
            </Button>
          </>
        ) : null}

        {isAdmin ? (
          <>
            <label className="sr-only" htmlFor={`assign-${lead.id}`}>Assign</label>
            <select
              id={`assign-${lead.id}`}
              defaultValue={lead.assigned_to ?? ""}
              onChange={(e) => run(() => assignLead(lead.id, e.target.value === "" ? null : e.target.value))}
              className="focus-ring rounded-md border border-stone-300 px-2 py-1.5 text-sm"
            >
              <option value="">— unassigned —</option>
              {staff.map((s) => (
                <option key={s.id} value={s.id}>{s.label}</option>
              ))}
            </select>
          </>
        ) : null}
      </div>
      {error ? <p role="alert" className="mt-2 text-xs text-red-700">{error}</p> : null}
    </div>
  );
}
