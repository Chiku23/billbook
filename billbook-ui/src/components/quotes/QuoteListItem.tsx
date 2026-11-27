import { Link } from 'react-router-dom'
import { Eye, Pencil, Trash2 } from 'lucide-react'
import { CurrencyDisplay, StatusBadge } from '@/components/common'
import { TableCell, TableRow } from '@/components/ui'
import type { QuoteStatus } from '@/lib/constants'
import { formatCurrency, formatDate } from '@/lib/utils'
import type { Document } from '@/types'

interface QuoteListItemProps {
  quote: Document
  onDelete: (quote: Document) => void
}

export function QuoteListItem({ quote, onDelete }: QuoteListItemProps) {
  const clientName = quote.client?.name || quote.clientSnapshot.name || 'Walk-in Client'

  return (
    <TableRow>
      <TableCell className="font-medium text-slate-900 dark:text-slate-100">
        <Link to={`/quotes/${quote.id}`} className="hover:text-blue-600 hover:underline">
          {quote.number}
        </Link>
      </TableCell>
      <TableCell>{clientName}</TableCell>
      <TableCell className="text-slate-500 dark:text-slate-400">
        {formatDate(quote.issueDate)}
      </TableCell>
      <TableCell className="text-slate-500 dark:text-slate-400">
        {formatDate(quote.validUntil)}
      </TableCell>
      <TableCell>
        <StatusBadge status={quote.status as QuoteStatus} />
      </TableCell>
      <TableCell className="text-right font-medium text-slate-900 dark:text-slate-100">
        <CurrencyDisplay amount={formatCurrency(quote.grandTotal ?? 0, quote.currency, 0)} />
      </TableCell>
      <TableCell>
        <div className="flex items-center justify-end gap-1">
          <Link
            to={`/quotes/${quote.id}`}
            aria-label={`View ${quote.number}`}
            className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
          >
            <Eye className="h-4 w-4" />
          </Link>
          <Link
            to={`/quotes/${quote.id}/edit`}
            aria-label={`Edit ${quote.number}`}
            className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
          >
            <Pencil className="h-4 w-4" />
          </Link>
          <button
            type="button"
            onClick={() => onDelete(quote)}
            aria-label={`Delete ${quote.number}`}
            className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-red-600 dark:hover:bg-slate-800 cursor-pointer"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </TableCell>
    </TableRow>
  )
}
