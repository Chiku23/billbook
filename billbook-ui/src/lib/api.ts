import axios from 'axios'

export const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://127.0.0.1:8000/api'

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    Accept: 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const method = config.method?.toLowerCase()
  if (method === 'put' || method === 'patch' || method === 'delete') {
    const override = method.toUpperCase()
    config.method = 'post'
    config.params = {
      ...(config.params ?? {}),
      _method: override,
    }
    config.headers.set('X-HTTP-Method-Override', override)
  }
  return config
})

export function getApiErrorMessage(err: unknown, fallback = 'Something went wrong'): string {
  if (axios.isAxiosError(err)) {
    const data = err.response?.data as { message?: string } | undefined
    if (data?.message) {
      return data.message
    }
    if (err.message) {
      return err.message
    }
  }
  if (err instanceof Error && err.message) {
    return err.message
  }
  return fallback
}

export function getApiFieldErrors(err: unknown): Record<string, string[]> {
  if (axios.isAxiosError(err)) {
    const data = err.response?.data as { errors?: Record<string, string[]> } | undefined
    if (data?.errors && typeof data.errors === 'object') {
      return data.errors
    }
  }
  return {}
}

export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}