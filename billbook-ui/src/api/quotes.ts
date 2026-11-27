import { api } from '@/lib/api'
import type { QuoteStatus } from '@/lib/constants'
import type { ClientSnapshot, Document } from '@/types'
import type { DocumentLineItemInput } from './invoices'

export interface QuotePayload {
  number?: string
  status?: QuoteStatus
  clientId?: string | null
  clientSnapshot?: ClientSnapshot
  currency?: string
  notes?: string
  terms?: string
  issueDate?: string
  validUntil?: string | null
  lineItems?: DocumentLineItemInput[]
}

export interface QuoteListResponse {
  data: Document[]
  meta: {
    total?: number
    counts: Record<'all' | QuoteStatus, number>
  }
}

export async function getQuotes(params?: {
  status?: string
  search?: string
  clientId?: string
}): Promise<QuoteListResponse> {
  const response = await api.get<QuoteListResponse>('/quotes', { params })
  return response.data
}

export async function getNextQuoteNumber(): Promise<string> {
  const response = await api.get<{ data: { number: string } }>('/quotes/next-number')
  return response.data.data.number
}

export async function getQuote(id: string): Promise<Document> {
  const response = await api.get<{ data: Document }>(`/quotes/${id}`)
  return response.data.data
}

export async function createQuote(payload: QuotePayload): Promise<Document> {
  const response = await api.post<{ data: Document }>('/quotes', payload)
  return response.data.data
}

export async function updateQuote(id: string, payload: QuotePayload): Promise<Document> {
  const response = await api.put<{ data: Document }>(`/quotes/${id}`, payload)
  return response.data.data
}

export async function updateQuoteStatus(id: string, status: QuoteStatus): Promise<Document> {
  const response = await api.patch<{ data: Document }>(`/quotes/${id}/status`, { status })
  return response.data.data
}

export async function duplicateQuote(id: string): Promise<Document> {
  const response = await api.post<{ data: Document }>(`/quotes/${id}/duplicate`)
  return response.data.data
}

export async function convertQuoteToInvoice(id: string): Promise<Document> {
  const response = await api.post<{ data: Document }>(`/quotes/${id}/convert`)
  return response.data.data
}

export async function deleteQuote(id: string): Promise<void> {
  await api.delete(`/quotes/${id}`)
}
