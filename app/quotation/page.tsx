import { redirect } from "next/navigation";

/**
 * Batch 0: the former demo RFQ form looked functional but stored nothing.
 * Until the real proposal workflow ships, this route safely redirects to the
 * working contact / request-a-proposal form.
 */
export default function QuotationPage() {
  redirect("/contact");
}
