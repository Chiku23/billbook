import type { Document } from '@/features/invoices/types'

export interface Client {
  id: string
  name: string
  email: string
  phone: string
  address: string
  taxId: string
  initials?: string
  totalInvoiced?: number
  totalPaid?: number
  totalOutstanding?: number
  lastInvoiceDate?: string | null
  invoicesCount?: number
  quotesCount?: number
  invoices?: Document[]
  quotes?: Document[]
  createdAt: string
  updatedAt: string
}
