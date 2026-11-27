import { api } from '@/lib/api'
import type { ItemTemplate } from '@/types'

export interface ItemPayload {
  name: string
  description: string
  defaultRate: number
  defaultTaxPercent: number
  unit: string
}

export async function getItems(params?: { search?: string }): Promise<ItemTemplate[]> {
  const response = await api.get<{ data: ItemTemplate[] }>('/items', { params })
  return response.data.data
}

export async function getItem(id: string): Promise<ItemTemplate> {
  const response = await api.get<{ data: ItemTemplate }>(`/items/${id}`)
  return response.data.data
}

export async function createItem(payload: ItemPayload): Promise<ItemTemplate> {
  const response = await api.post<{ data: ItemTemplate }>('/items', payload)
  return response.data.data
}

export async function updateItem(id: string, payload: Partial<ItemPayload>): Promise<ItemTemplate> {
  const response = await api.put<{ data: ItemTemplate }>(`/items/${id}`, payload)
  return response.data.data
}

export async function deleteItem(id: string): Promise<void> {
  await api.delete(`/items/${id}`)
}
