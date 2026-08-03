import { Card, Section } from "@/components/ui";

export const metadata = { title: "Admin unavailable — Unikota", robots: { index: false } };

export default function NotConfiguredPage() {
  return (
    <Section title="Admin area unavailable">
      <Card className="mx-auto max-w-lg">
        <p className="text-sm text-stone-700">
          The authentication backend (Supabase) is not configured in this environment, so the entire admin area is
          disabled. Follow <code>docs/SUPABASE_SETUP.md</code> to create the project, set{" "}
          <code>web/.env.local</code>, apply migrations and bootstrap the first super administrator.
        </p>
      </Card>
    </Section>
  );
}
