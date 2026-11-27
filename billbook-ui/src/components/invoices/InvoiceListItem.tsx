import { Link } from 'react-router-dom'
import { Eye, Pencil, Trash2 } from 'lucide-react'
import { CurrencyDisplay, StatusBadge } from '@/components/common'
import { TableCell, TableRow } from '@/components/ui'
import type { InvoiceStatus } from '@/lib/constants'
import { formatCurrency, formatDate } from '@/lib/utils'
import type { Document } from '@/types'

interface InvoiceListItemProps {
  invoice: Document
  onDelete: (invoice: Document) => void
}

export function InvoiceListItem({ invoice, onDelete }: InvoiceListItemProps) {
  const clientName = invoice.client?.name || invoice.clientSnapshot.name || 'Walk-in Client'

  return (
    <TableRow>
      <TableCell className="font-medium text-slate-900 dark:text-slate-100">
        <Link to={`/invoices/${invoice.id}`} className="hover:text-blue-600 hover:underline">
          {invoice.number}
        </Link>
      </TableCell>
      <TableCell>{clientName}</TableCell>
      <TableCell className="text-slate-500 dark:text-slate-400">
        {formatDate(invoice.issueDate)}
      </TableCell>
      <TableCell className="text-slate-500 dark:text-slate-400">
        {formatDate(invoice.dueDate)}
      </TableCell>
      <TableCell>
        <StatusBadge status={invoice.status as InvoiceStatus} />
      </TableCell>
      <TableCell className="text-right font-medium text-slate-900 dark:text-slate-100">
        <CurrencyDisplay
          amount={formatCurrency(invoice.grandTotal ?? 0, invoice.currency, 0)}
        />
      </TableCell>
      <TableCell>
        <div className="flex items-center justify-end gap-1">
          <Link
            to={`/invoices/${invoice.id}`}
            aria-label={`View ${invoice.number}`}
            className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
          >
            <Eye className="h-4 w-4" />
          </Link>
          <Link
            to={`/invoices/${invoice.id}/edit`}
            aria-label={`Edit ${invoice.number}`}
            className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
          >
            <Pencil className="h-4 w-4" />
          </Link>
          <button
            type="button"
            onClick={() => onDelete(invoice)}
            aria-label={`Delete ${invoice.number}`}
            className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-red-600 dark:hover:bg-slate-800 cursor-pointer"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </TableCell>
    </TableRow>
  )
}
