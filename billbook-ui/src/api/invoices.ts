import { api, downloadBlob } from '@/lib/api'
import type { InvoiceStatus } from '@/lib/constants'
import type { ClientSnapshot, Document } from '@/types'

export interface DocumentLineItemInput {
  id?: string
  itemTemplateId: string | null
  name: string
  description: string
  quantity: number
  unitPrice: number
  taxPercent: number
  discountPercent: number
}

export interface InvoicePayload {
  number?: string
  status?: InvoiceStatus
  clientId?: string | null
  clientSnapshot?: ClientSnapshot
  currency?: string
  notes?: string
  terms?: string
  issueDate?: string
  dueDate?: string | null
  lineItems?: DocumentLineItemInput[]
}

export interface InvoiceListResponse {
  data: Document[]
  meta: {
    total?: number
    counts: Record<'all' | InvoiceStatus, number>
  }
}

export async function getInvoices(params?: {
  status?: string
  search?: string
  clientId?: string
}): Promise<InvoiceListResponse> {
  const response = await api.get<InvoiceListResponse>('/invoices', { params })
  return response.data
}

export async function getNextInvoiceNumber(): Promise<string> {
  const response = await api.get<{ data: { number: string } }>('/invoices/next-number')
  return response.data.data.number
}

export async function getInvoice(id: string): Promise<Document> {
  const response = await api.get<{ data: Document }>(`/invoices/${id}`)
  return response.data.data
}

export async function createInvoice(payload: InvoicePayload): Promise<Document> {
  const response = await api.post<{ data: Document }>('/invoices', payload)
  return response.data.data
}

export async function updateInvoice(id: string, payload: InvoicePayload): Promise<Document> {
  const response = await api.put<{ data: Document }>(`/invoices/${id}`, payload)
  return response.data.data
}

export async function updateInvoiceStatus(id: string, status: InvoiceStatus): Promise<Document> {
  const response = await api.patch<{ data: Document }>(`/invoices/${id}/status`, { status })
  return response.data.data
}

export async function duplicateInvoice(id: string): Promise<Document> {
  const response = await api.post<{ data: Document }>(`/invoices/${id}/duplicate`)
  return response.data.data
}

export async function deleteInvoice(id: string): Promise<void> {
  await api.delete(`/invoices/${id}`)
}

export async function exportInvoicesCsv(params?: {
  status?: string
  search?: string
}): Promise<void> {
  const response = await api.get<Blob>('/invoices/export/csv', {
    params,
    responseType: 'blob',
  })
  const date = new Date().toISOString().slice(0, 10)
  downloadBlob(response.data, `billbook-invoices-${date}.csv`)
}
