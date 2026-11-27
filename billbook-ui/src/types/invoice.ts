import type { InvoiceStatus, QuoteStatus } from '@/lib/constants'

export interface LineItem {
  id: string
  itemTemplateId: string | null
  sortOrder?: number
  name: string
  description: string
  quantity: number
  unitPrice: number
  taxPercent: number
  discountPercent: number
  lineSubtotal?: number
  discountAmount?: number
  taxAmount?: number
  total?: number
}

export interface ClientSnapshot {
  name: string
  email: string
  phone?: string
  address: string
  taxId: string
}

export interface Document {
  id: string
  type: 'invoice' | 'quote'
  number: string
  status: InvoiceStatus | QuoteStatus
  rawStatus?: InvoiceStatus | QuoteStatus
  isOverdue?: boolean
  clientId: string | null
  clientSnapshot: ClientSnapshot
  lineItems: LineItem[]
  subtotal?: number
  discountTotal?: number
  taxTotal?: number
  grandTotal?: number
  currency: string
  notes: string
  terms: string
  issueDate: string
  dueDate: string | null
  validUntil: string | null
  sourceQuoteId?: string | null
  convertedInvoiceId?: string | null
  paidAt?: string | null
  createdAt: string
  updatedAt: string
}
