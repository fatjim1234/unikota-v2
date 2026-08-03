import "server-only";

/**
 * Internal lead email notification — SERVER-ONLY.
 *
 * Recipients and sender come exclusively from server env vars
 * (LEAD_NOTIFICATION_TO — comma-separated — and LEAD_NOTIFICATION_FROM);
 * they are never present in client code, HTML or public JSON. The database
 * remains the source of truth: a notification failure NEVER fails the lead
 * submission, and errors are logged concisely without personal data.
 *
 * Provider: no email dependency exists in this project, and none is chosen
 * automatically. This module supports the Resend HTTP API via fetch (zero
 * packages) but stays INERT until you configure it:
 *   LEAD_NOTIFY_PROVIDER=resend
 *   RESEND_API_KEY=...            (server-only)
 *   LEAD_NOTIFICATION_TO=a@x,b@y  (comma-separated)
 *   LEAD_NOTIFICATION_FROM=notifications@yourdomain
 * Until then it logs a single concise "skipped" line per submission.
 */

function escapeHtml(v: string): string {
  return v
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export type LeadNotification = {
  id: string;
  name: string;
  email: string; // already validated by the lead schema
  company: string | null;
  enquiryType: string;
  message: string;
  sourcePage: string | null;
};

export async function notifyNewLead(lead: LeadNotification): Promise<void> {
  const to = (process.env.LEAD_NOTIFICATION_TO ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const from = process.env.LEAD_NOTIFICATION_FROM;
  const provider = process.env.LEAD_NOTIFY_PROVIDER;

  if (to.length === 0 || !from || !provider) {
    console.warn("lead-notify: skipped (LEAD_NOTIFY_PROVIDER / LEAD_NOTIFICATION_TO / LEAD_NOTIFICATION_FROM not fully configured)");
    return;
  }

  const subject = `New enquiry (${lead.enquiryType}) — ${lead.name}`;
  const html = [
    "<h2>New website enquiry</h2>",
    `<p><strong>Lead ID:</strong> ${escapeHtml(lead.id)}</p>`,
    `<p><strong>Name:</strong> ${escapeHtml(lead.name)}</p>`,
    `<p><strong>Email:</strong> ${escapeHtml(lead.email)}</p>`,
    lead.company ? `<p><strong>Company:</strong> ${escapeHtml(lead.company)}</p>` : "",
    `<p><strong>Type:</strong> ${escapeHtml(lead.enquiryType)}</p>`,
    lead.sourcePage ? `<p><strong>Source page:</strong> ${escapeHtml(lead.sourcePage)}</p>` : "",
    `<p><strong>Message:</strong></p><p style="white-space:pre-wrap">${escapeHtml(lead.message)}</p>`,
    "<p>View and claim this lead in the admin: /admin/leads</p>",
  ].join("\n");

  try {
    if (provider === "resend") {
      const apiKey = process.env.RESEND_API_KEY;
      if (!apiKey) {
        console.warn("lead-notify: skipped (RESEND_API_KEY not set)");
        return;
      }
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          from,
          to, // internal recipients only — the prospective client is never CC'd/BCC'd
          reply_to: lead.email,
          subject,
          html,
        }),
      });
      if (!res.ok) {
        console.error(`lead-notify: provider responded ${res.status} for lead ${lead.id}`);
      }
      return;
    }
    console.warn(`lead-notify: skipped (unknown LEAD_NOTIFY_PROVIDER "${provider}")`);
  } catch {
    // Concise, no PII, no secrets; the lead is already safely stored.
    console.error(`lead-notify: send failed for lead ${lead.id}`);
  }
}
