import { Link } from 'react-router-dom'
import { Paperclip, Pencil, Trash2 } from 'lucide-react'
import { CurrencyDisplay } from '@/components/common'
import { Badge, type BadgeVariant, TableCell, TableRow } from '@/components/ui'
import { formatCurrency, formatDate } from '@/lib/utils'
import type { Expense } from '@/types'

const categoryVariants: Record<string, BadgeVariant> = {
  Software: 'primary',
  Travel: 'success',
  'Office Supplies': 'warning',
  Hardware: 'warning',
  Marketing: 'primary',
}

interface ExpenseListItemProps {
  expense: Expense
  onDelete: (expense: Expense) => void
}

export function ExpenseListItem({ expense, onDelete }: ExpenseListItemProps) {
  const variant = categoryVariants[expense.category] ?? 'default'

  return (
    <TableRow>
      <TableCell className="text-slate-700 dark:text-slate-300">
        {formatDate(expense.date)}
      </TableCell>
      <TableCell>
        <Badge variant={variant} dot>
          {expense.category}
        </Badge>
      </TableCell>
      <TableCell className="font-medium text-slate-900 dark:text-slate-100">
        <div className="flex items-center gap-2">
          <span>{expense.vendor}</span>
          {(expense.receiptUrl || expense.receiptBase64) && (
            <a
              href={expense.receiptUrl ?? expense.receiptBase64 ?? '#'}
              target="_blank"
              rel="noreferrer"
              aria-label="View receipt"
              className="text-slate-400 hover:text-blue-600"
            >
              <Paperclip className="h-3.5 w-3.5" />
            </a>
          )}
        </div>
      </TableCell>
      <TableCell className="text-right font-medium text-slate-900 dark:text-slate-100">
        <CurrencyDisplay amount={formatCurrency(expense.amount, expense.currency, 0)} />
      </TableCell>
      <TableCell>
        <div className="flex items-center justify-end gap-1">
          <Link
            to={`/expenses/${expense.id}/edit`}
            aria-label={`Edit ${expense.vendor}`}
            className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
          >
            <Pencil className="h-4 w-4" />
          </Link>
          <button
            type="button"
            onClick={() => onDelete(expense)}
            aria-label={`Delete ${expense.vendor}`}
            className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-red-600 dark:hover:bg-slate-800 cursor-pointer"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </TableCell>
    </TableRow>
  )
}
