import { Link } from 'react-router-dom'
import { Eye, Pencil, Trash2 } from 'lucide-react'
import { TableCell, TableRow } from '@/components/ui'
import { CurrencyDisplay, StatusBadge } from '@/components/common'
import type { QuoteStatus } from '@/lib/constants'

export interface QuoteListRow {
  id: string
  number: string
  clientName: string
  issueDate: string
  validUntil: string
  status: QuoteStatus
  amount: string
}

interface QuoteListItemProps {
  quote: QuoteListRow
}

export function QuoteListItem({ quote }: QuoteListItemProps) {
  return (
    <TableRow>
      <TableCell className="font-medium text-slate-900 dark:text-slate-100">
        <Link to={`/quotes/${quote.id}`} className="hover:text-blue-600 hover:underline">
          {quote.number}
        </Link>
      </TableCell>
      <TableCell>{quote.clientName}</TableCell>
      <TableCell className="text-slate-500 dark:text-slate-400">{quote.issueDate}</TableCell>
      <TableCell className="text-slate-500 dark:text-slate-400">{quote.validUntil}</TableCell>
      <TableCell>
        <StatusBadge status={quote.status} />
      </TableCell>
      <TableCell className="text-right font-medium text-slate-900 dark:text-slate-100">
        <CurrencyDisplay amount={quote.amount} />
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
