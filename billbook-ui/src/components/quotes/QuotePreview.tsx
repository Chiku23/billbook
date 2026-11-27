import { DocumentPreview } from '@/components/common/DocumentPreview'
import type { BusinessProfile, Document } from '@/types'

interface QuotePreviewProps {
  quote: Document
  businessProfile?: BusinessProfile
}

export function QuotePreview({ quote, businessProfile }: QuotePreviewProps) {
  return (
    <DocumentPreview
      document={quote}
      businessProfile={businessProfile}
      heading="QUOTE"
      clientLabel="Prepared For:"
      numberLabel="Quote #:"
      targetDateLabel="Valid Until:"
      targetDate={quote.validUntil}
      termsLabel="Terms"
    />
  )
}
