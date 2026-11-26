import { Badge, type BadgeVariant } from '@/components/ui'
import type { InvoiceStatus, QuoteStatus } from '@/lib/constants'

type DocumentStatus = InvoiceStatus | QuoteStatus

const statusConfig: Record<DocumentStatus, { label: string; variant: BadgeVariant }> = {
  draft: { label: 'Draft', variant: 'default' },
  sent: { label: 'Sent', variant: 'primary' },
  paid: { label: 'Paid', variant: 'success' },
  overdue: { label: 'Overdue', variant: 'danger' },
  accepted: { label: 'Accepted', variant: 'success' },
  declined: { label: 'Declined', variant: 'danger' },
}

interface StatusBadgeProps {
  status: DocumentStatus
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status]
  return <Badge variant={config.variant}>{config.label}</Badge>
}
