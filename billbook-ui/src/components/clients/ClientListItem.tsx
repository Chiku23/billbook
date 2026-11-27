import { Link } from 'react-router-dom'
import { Eye, Pencil, Trash2 } from 'lucide-react'
import { CurrencyDisplay } from '@/components/common'
import { TableCell, TableRow } from '@/components/ui'
import { formatCurrency, formatDate } from '@/lib/utils'
import type { Client } from '@/types'

interface ClientListItemProps {
  client: Client
  onDelete: (client: Client) => void
}

export function ClientListItem({ client, onDelete }: ClientListItemProps) {
  return (
    <TableRow>
      <TableCell>
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-200/80 text-xs font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300">
            {client.initials ?? 'CL'}
          </div>
          <Link
            to={`/clients/${client.id}`}
            className="font-medium text-slate-900 hover:text-blue-600 hover:underline dark:text-slate-100"
          >
            {client.name}
          </Link>
        </div>
      </TableCell>
      <TableCell className="text-slate-600 dark:text-slate-400">{client.email || '—'}</TableCell>
      <TableCell className="tabular-nums text-slate-600 dark:text-slate-400">
        {client.phone || '—'}
      </TableCell>
      <TableCell className="font-medium text-slate-900 dark:text-slate-100">
        <CurrencyDisplay amount={formatCurrency(client.totalInvoiced ?? 0, 'INR', 0)} />
      </TableCell>
      <TableCell className="text-slate-500 dark:text-slate-400">
        {formatDate(client.lastInvoiceDate)}
      </TableCell>
      <TableCell>
        <div className="flex items-center justify-end gap-1">
          <Link
            to={`/clients/${client.id}`}
            aria-label={`View ${client.name}`}
            className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
          >
            <Eye className="h-4 w-4" />
          </Link>
          <Link
            to={`/clients/${client.id}/edit`}
            aria-label={`Edit ${client.name}`}
            className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
          >
            <Pencil className="h-4 w-4" />
          </Link>
          <button
            type="button"
            onClick={() => onDelete(client)}
            aria-label={`Delete ${client.name}`}
            className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-red-600 dark:hover:bg-slate-800 cursor-pointer"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </TableCell>
    </TableRow>
  )
}
