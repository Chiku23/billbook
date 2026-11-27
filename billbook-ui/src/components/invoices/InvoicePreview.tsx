import { DocumentPreview } from '@/components/common/DocumentPreview'
import type { BusinessProfile, Document } from '@/types'

interface InvoicePreviewProps {
  invoice: Document
  businessProfile?: BusinessProfile
}

export function InvoicePreview({ invoice, businessProfile }: InvoicePreviewProps) {
  return (
    <DocumentPreview
      document={invoice}
      businessProfile={businessProfile}
      heading="INVOICE"
      clientLabel="Bill To:"
      numberLabel="Invoice #:"
      targetDateLabel="Due Date:"
      targetDate={invoice.dueDate}
      termsLabel="Payment Terms"
    />
  )
}
