import type { InvoiceStatus, QuoteStatus } from '@/lib/constants'

export interface LineItem {
  id: string
  itemTemplateId: string | null
  name: string
  description: string
  quantity: number
  unitPrice: number
  taxPercent: number
  discountPercent: number
}

export interface ClientSnapshot {
  name: string
  email: string
  address: string
  taxId: string
}

export interface Document {
  id: string
  type: 'invoice' | 'quote'
  number: string
  status: InvoiceStatus | QuoteStatus
  clientId: string | null
  clientSnapshot: ClientSnapshot
  lineItems: LineItem[]
  currency: string
  notes: string
  terms: string
  issueDate: string
  dueDate: string | null
  validUntil: string | null
  createdAt: string
  updatedAt: string
}
