import { api } from '@/lib/api'
import type { Client } from '@/types'

export interface ClientPayload {
  name: string
  email: string
  phone: string
  address: string
  taxId: string
}

export async function getClients(params?: {
  search?: string
  sort?: 'name' | 'createdAt'
  dir?: 'asc' | 'desc'
}): Promise<Client[]> {
  const response = await api.get<{ data: Client[] }>('/clients', { params })
  return response.data.data
}

export async function getClient(id: string): Promise<Client> {
  const response = await api.get<{ data: Client }>(`/clients/${id}`)
  return response.data.data
}

export async function createClient(payload: ClientPayload): Promise<Client> {
  const response = await api.post<{ data: Client }>('/clients', payload)
  return response.data.data
}

export async function updateClient(id: string, payload: Partial<ClientPayload>): Promise<Client> {
  const response = await api.put<{ data: Client }>(`/clients/${id}`, payload)
  return response.data.data
}

export async function deleteClient(id: string): Promise<void> {
  await api.delete(`/clients/${id}`)
}
