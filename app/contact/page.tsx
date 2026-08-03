import type { Metadata } from "next";
import { Card, PageHero, Section } from "@/components/ui";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { LeadForm } from "@/components/lead-form";
import { getContent, type ContactContent, type SettingsContent } from "@/lib/content";
import { T } from "@/components/translated-text";

export const metadata: Metadata = {
  title: "Contact / Request a Proposal — Unikota",
  description: "Contact Unikota for OEM, export and retail enquiries by form or WhatsApp click-to-chat.",
};

export default async function ContactPage() {
  const c = await getContent<ContactContent>("contact");
  const s = await getContent<SettingsContent>("settings");
  return (
    <>
      <PageHero title={<T k="site.contact.heroTitle" fallback={c.hero.title} />} lead={<T k="site.contact.heroLead" fallback={c.hero.lead} />} />
      <Section>
        <div className="grid gap-6 lg:grid-cols-2">
          <Card id="enquiry">
            <h2 className="font-display text-2xl font-bold text-brand-900"><T k="site.contact.formTitle" fallback={c.form.title} /></h2>
            <div className="mt-4">
              <LeadForm
                types={c.form.types}
                consentLabel={c.form.consentLabel}
                successMessage={c.form.successMessage}
              />
            </div>
          </Card>
          <div className="space-y-4">
            <Card>
              <h2 className="font-display text-2xl font-bold text-brand-900"><T k="site.contact.whatsapp" /></h2>
              <p className="mt-2 text-sm text-stone-600"><T k="site.contact.whatsappBody" fallback={c.whatsapp.body} /></p>
              <div className="mt-3">
                <WhatsAppButton context={s.whatsappDefaultContext} number={s.whatsappNumber} />
              </div>
            </Card>
            <Card>
              <h2 className="font-display text-2xl font-bold text-brand-900"><T k="site.contact.office" /></h2>
              <address className="mt-2 text-sm not-italic text-stone-600">
                {s.legalName ? <p className="font-medium text-stone-800">{s.legalName}</p> : null}
                {s.companyRegistrationNumber ? <p><T k="site.contact.registration" /> {s.companyRegistrationNumber}</p> : null}
                {(s.addressLines ?? []).map((line) => (
                  <p key={line}>{line}</p>
                ))}
                {s.landline ? (
                  <p className="mt-2">
                    <T k="site.contact.telephone" />: <a className="text-brand-700 hover:underline" href={`tel:${s.landline.replace(/[^\d+]/g, "")}`}>{s.landline}</a>
                  </p>
                ) : null}
                {s.email ? (
                  <p>
                    <T k="site.contact.email" />: <a className="text-brand-700 hover:underline" href={`mailto:${s.email}`}>{s.email}</a>
                  </p>
                ) : null}
                {s.businessHours ? <p className="mt-2"><T k="site.contact.hours" />: {s.businessHours}</p> : null}
              </address>
            </Card>
          </div>
        </div>
      </Section>
    </>
  );
}
