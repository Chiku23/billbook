import { ReceiptText } from 'lucide-react'
import { Card } from '@/components/ui'
import { calculateDocumentTotals, calculateLineItemTotals, formatCurrency, formatDate } from '@/lib/utils'
import type { BusinessProfile, Document } from '@/types'

interface DocumentPreviewProps {
  document: Document
  businessProfile?: BusinessProfile
  heading: 'INVOICE' | 'QUOTE'
  clientLabel: 'Bill To:' | 'Prepared For:'
  numberLabel: 'Invoice #:' | 'Quote #:'
  targetDateLabel: 'Due Date:' | 'Valid Until:'
  targetDate: string | null
  termsLabel: string
}

export function DocumentPreview({
  document,
  businessProfile,
  heading,
  clientLabel,
  numberLabel,
  targetDateLabel,
  targetDate,
  termsLabel,
}: DocumentPreviewProps) {
  const computedTotals = calculateDocumentTotals(document.lineItems)
  const subtotal = document.subtotal ?? computedTotals.subtotal
  const discountTotal = document.discountTotal ?? computedTotals.discountTotal
  const taxTotal = document.taxTotal ?? computedTotals.taxTotal
  const grandTotal = document.grandTotal ?? computedTotals.grandTotal

  const logoSrc = businessProfile?.logoUrl ?? businessProfile?.logoBase64 ?? null
  const companyName = businessProfile?.companyName || 'Your Business'

  return (
    <Card className="mx-auto max-w-3xl bg-white p-8 text-slate-900 shadow-sm sm:p-10 dark:bg-slate-900 dark:text-slate-100 print:border-0 print:shadow-none">
      <div className="flex flex-col justify-between gap-6 border-b border-slate-200 pb-6 sm:flex-row sm:items-start dark:border-slate-800">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-slate-200 bg-slate-50 text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
            {logoSrc ? (
              <img src={logoSrc} alt={companyName} className="h-full w-full object-cover" />
            ) : (
              <ReceiptText className="h-5 w-5" />
            )}
          </div>
          <div className="text-sm">
            <p className="font-semibold text-slate-900 dark:text-slate-100">{companyName}</p>
            {businessProfile?.address && (
              <p className="text-slate-500 dark:text-slate-400">{businessProfile.address}</p>
            )}
            {businessProfile?.email && (
              <p className="text-slate-500 dark:text-slate-400">{businessProfile.email}</p>
            )}
            {businessProfile?.phone && (
              <p className="text-slate-500 dark:text-slate-400">{businessProfile.phone}</p>
            )}
            {businessProfile?.taxId && (
              <p className="text-xs text-slate-400">Tax ID: {businessProfile.taxId}</p>
            )}
          </div>
        </div>
        <div className="text-left sm:text-right">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            {heading}
          </h2>
        </div>
      </div>

      <div className="mt-6 flex flex-col justify-between gap-6 sm:flex-row">
        <div className="text-sm">
          <p className="font-semibold text-slate-900 dark:text-slate-100">{clientLabel}</p>
          <p className="mt-1 font-medium text-slate-900 dark:text-slate-100">
            {document.clientSnapshot.name || document.client?.name || 'Walk-in Client'}
          </p>
          {(document.clientSnapshot.email || document.client?.email) && (
            <p className="text-slate-500 dark:text-slate-400">
              {document.clientSnapshot.email || document.client?.email}
            </p>
          )}
          {(document.clientSnapshot.address || document.client?.address) && (
            <p className="text-slate-500 dark:text-slate-400">
              {document.clientSnapshot.address || document.client?.address}
            </p>
          )}
          {(document.clientSnapshot.taxId || document.client?.taxId) && (
            <p className="text-xs text-slate-400">
              Tax ID: {document.clientSnapshot.taxId || document.client?.taxId}
            </p>
          )}
        </div>
        <div className="space-y-1.5 text-sm sm:min-w-52">
          <div className="flex justify-between gap-6">
            <span className="text-slate-500 dark:text-slate-400">{numberLabel}</span>
            <span className="font-medium text-slate-900 dark:text-slate-100">
              {document.number}
            </span>
          </div>
          <div className="flex justify-between gap-6">
            <span className="text-slate-500 dark:text-slate-400">Issue Date:</span>
            <span className="font-medium text-slate-900 dark:text-slate-100">
              {formatDate(document.issueDate)}
            </span>
          </div>
          <div className="flex justify-between gap-6">
            <span className="text-slate-500 dark:text-slate-400">{targetDateLabel}</span>
            <span className="font-medium text-slate-900 dark:text-slate-100">
              {formatDate(targetDate)}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-8 overflow-x-auto">
        <table className="w-full border-collapse text-left text-sm">
          <thead>
            <tr className="bg-slate-100 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
              <th className="rounded-l-md px-3 py-2.5">Item</th>
              <th className="px-3 py-2.5">Description</th>
              <th className="px-3 py-2.5 text-right">Qty</th>
              <th className="px-3 py-2.5 text-right">Rate</th>
              <th className="px-3 py-2.5 text-right">Tax</th>
              <th className="rounded-r-md px-3 py-2.5 text-right">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {document.lineItems.map((item) => {
              const rowTotal = item.total ?? calculateLineItemTotals(item).total
              return (
                <tr key={item.id}>
                  <td className="px-3 py-3 font-medium text-slate-900 dark:text-slate-100">
                    {item.name}
                  </td>
                  <td className="px-3 py-3 text-slate-500 dark:text-slate-400">
                    {item.description || '—'}
                  </td>
                  <td className="px-3 py-3 text-right tabular-nums">{item.quantity}</td>
                  <td className="px-3 py-3 text-right tabular-nums">
                    {formatCurrency(item.unitPrice, document.currency)}
                  </td>
                  <td className="px-3 py-3 text-right tabular-nums">{item.taxPercent}%</td>
                  <td className="px-3 py-3 text-right font-medium tabular-nums text-slate-900 dark:text-slate-100">
                    {formatCurrency(rowTotal, document.currency)}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-6 flex justify-end">
        <div className="w-full max-w-xs space-y-2 text-sm">
          <div className="flex justify-between text-slate-600 dark:text-slate-400">
            <span>Subtotal</span>
            <span className="tabular-nums text-slate-900 dark:text-slate-100">
              {formatCurrency(subtotal, document.currency)}
            </span>
          </div>
          {discountTotal > 0 && (
            <div className="flex justify-between text-slate-600 dark:text-slate-400">
              <span>Discount</span>
              <span className="tabular-nums text-slate-900 dark:text-slate-100">
                -{formatCurrency(discountTotal, document.currency)}
              </span>
            </div>
          )}
          <div className="flex justify-between text-slate-600 dark:text-slate-400">
            <span>Tax</span>
            <span className="tabular-nums text-slate-900 dark:text-slate-100">
              {formatCurrency(taxTotal, document.currency)}
            </span>
          </div>
          <div className="flex justify-between border-t border-slate-200 pt-2 text-base font-bold text-slate-900 dark:border-slate-800 dark:text-slate-100">
            <span>Grand Total</span>
            <span className="tabular-nums">{formatCurrency(grandTotal, document.currency)}</span>
          </div>
        </div>
      </div>

      {(document.notes || document.terms) && (
        <div className="mt-10 space-y-6 border-t border-slate-100 pt-6 text-sm dark:border-slate-800">
          {document.notes && (
            <div>
              <p className="font-semibold text-slate-900 dark:text-slate-100">Notes</p>
              <p className="mt-1 text-slate-600 dark:text-slate-400">{document.notes}</p>
            </div>
          )}
          {document.terms && (
            <p className="text-xs text-slate-400">
              {termsLabel} — {document.terms}
            </p>
          )}
        </div>
      )}
    </Card>
  )
}
