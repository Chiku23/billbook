import { CURRENCIES } from './constants'

export function cn(...inputs: Array<string | false | null | undefined>) {
  return inputs.filter(Boolean).join(' ')
}

export function getCurrencySymbol(code = 'INR'): string {
  const match = CURRENCIES.find((c) => c.code === code)
  return match?.symbol ?? `${code} `
}

export function formatCurrency(amount: number, currencyCode = 'INR', decimals = 2): string {
  const symbol = getCurrencySymbol(currencyCode)
  const locale = currencyCode === 'INR' ? 'en-IN' : 'en-US'
  const formatted = Number(amount || 0).toLocaleString(locale, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })
  return `${symbol}${formatted}`
}

export function formatDate(isoDate?: string | null): string {
  if (!isoDate) return '—'
  const parsed = new Date(`${isoDate.slice(0, 10)}T00:00:00`)
  if (Number.isNaN(parsed.getTime())) return isoDate
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(parsed)
}

export function addDaysToIsoDate(isoDate: string, days: number): string {
  const parsed = new Date(`${isoDate.slice(0, 10)}T00:00:00`)
  if (Number.isNaN(parsed.getTime())) return isoDate
  parsed.setDate(parsed.getDate() + days)
  return parsed.toISOString().slice(0, 10)
}

export function todayIsoDate(): string {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export interface LineItemAmounts {
  lineSubtotal: number
  discountAmount: number
  taxableAmount: number
  taxAmount: number
  total: number
}

export function calculateLineItemTotals(item: {
  quantity: number
  unitPrice: number
  taxPercent: number
  discountPercent: number
}): LineItemAmounts {
  const qty = Number(item.quantity) || 0
  const price = Number(item.unitPrice) || 0
  const tax = Number(item.taxPercent) || 0
  const discount = Number(item.discountPercent) || 0

  const lineSubtotal = Math.round(qty * price * 100) / 100
  const discountAmount = Math.round(lineSubtotal * (discount / 100) * 100) / 100
  const taxableAmount = Math.round((lineSubtotal - discountAmount) * 100) / 100
  const taxAmount = Math.round(taxableAmount * (tax / 100) * 100) / 100
  const total = Math.round((taxableAmount + taxAmount) * 100) / 100

  return { lineSubtotal, discountAmount, taxableAmount, taxAmount, total }
}

export function calculateDocumentTotals(
  items: Array<{
    quantity: number
    unitPrice: number
    taxPercent: number
    discountPercent: number
  }>,
) {
  let subtotal = 0
  let discountTotal = 0
  let taxTotal = 0
  let grandTotal = 0

  for (const item of items) {
    const computed = calculateLineItemTotals(item)
    subtotal += computed.lineSubtotal
    discountTotal += computed.discountAmount
    taxTotal += computed.taxAmount
    grandTotal += computed.total
  }

  return {
    subtotal: Math.round(subtotal * 100) / 100,
    discountTotal: Math.round(discountTotal * 100) / 100,
    taxTotal: Math.round(taxTotal * 100) / 100,
    grandTotal: Math.round(grandTotal * 100) / 100,
  }
}
